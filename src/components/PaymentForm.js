import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

const PaymentForm = ({ 
  amount, 
  planName, 
  priceId,
  onSuccess, 
  onError, 
  onCancel, 
  isProcessing: externalProcessing 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  // Card element styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  // 🔧 HELPER: Extract meaningful error messages from Pydantic validation errors
  const extractErrorMessage = (errorData) => {
    if (typeof errorData === 'string') {
      return errorData;
    }
    
    if (errorData?.detail) {
      // Handle Pydantic validation errors (array of error objects)
      if (Array.isArray(errorData.detail)) {
        const messages = errorData.detail.map(err => {
          if (err.msg && err.loc) {
            const field = err.loc[err.loc.length - 1]; // Get the field name
            return `${field}: ${err.msg}`;
          }
          return err.msg || 'Validation error';
        });
        return messages.join(', ');
      }
      return errorData.detail;
    }
    
    if (errorData?.message) {
      return errorData.message;
    }
    
    return 'An unknown error occurred';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      const errorMsg = 'Stripe is not loaded yet. Please wait and try again.';
      toast.error(errorMsg);
      return;
    }

    if (!priceId) {
      const errorMsg = 'Price ID is missing. Please try again.';
      toast.error(errorMsg);
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    const card = elements.getElement(CardElement);
    if (!card) {
      const errorMsg = 'Card element not found';
      toast.error(errorMsg);
      setIsProcessing(false);
      return;
    }

    try {
      console.log('🔧 Creating payment intent with priceId:', priceId);

      // STEP 1: Create payment intent
      const response = await fetch('http://localhost:8000/create_payment_intent/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          price_id: priceId
        }),
      });

      const paymentData = await response.json();
      console.log('Backend response:', paymentData);

      if (!response.ok) {
        const errorMsg = extractErrorMessage(paymentData);
        console.error('Backend error:', errorMsg);
        setCardError(errorMsg);
        throw new Error(errorMsg);
      }

      if (!paymentData.client_secret) {
        throw new Error('Missing client secret from payment intent');
      }

      console.log('✅ Payment intent created successfully');

      // STEP 2: Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.client_secret,
        {
          payment_method: {
            card: card,
            billing_details: {
              email: 'customer@example.com',
            },
          }
        }
      );

      if (confirmError) {
        const errorMsg = confirmError.message || 'Payment confirmation failed';
        console.error('Stripe confirmation error:', errorMsg);
        setCardError(errorMsg);
        onError(new Error(errorMsg));
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded with Stripe');
        
        // STEP 3: Confirm payment with backend
        try {
          const confirmResponse = await fetch('http://localhost:8000/confirm_payment/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              payment_intent_id: paymentIntent.id
            }),
          });

          const confirmData = await confirmResponse.json();
          console.log('Backend confirmation response:', confirmData);

          if (!confirmResponse.ok) {
            const errorMsg = extractErrorMessage(confirmData);
            throw new Error(errorMsg);
          }

          console.log('✅ Payment confirmed with backend successfully');
          
          onSuccess({
            paymentIntent,
            subscription: confirmData,
            payment_intent_id: paymentIntent.id,
          });

        } catch (confirmError) {
          const errorMsg = confirmError.message || 'Backend confirmation failed';
          console.error('Backend confirmation error:', errorMsg);
          
          // Payment succeeded but backend failed - still call onSuccess with error info
          onSuccess({
            paymentIntent,
            backendError: errorMsg,
            payment_intent_id: paymentIntent.id,
          });
        }

      } else {
        throw new Error(`Payment failed with status: ${paymentIntent.status}`);
      }

    } catch (error) {
      const errorMsg = error.message || 'Payment processing failed';
      console.error('💥 Payment processing error:', errorMsg);
      setCardError(errorMsg);
      onError(new Error(errorMsg));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const processing = isProcessing || externalProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Plan Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900">{planName} Plan</h4>
        <p className="text-2xl font-bold text-gray-900">${amount}/month</p>
        <p className="text-sm text-gray-600">
          You will be charged ${amount} monthly until you cancel.
        </p>
      </div>

      {/* Card Element */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement 
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
        {cardError && (
          <div className="text-sm text-red-600 p-3 bg-red-50 rounded border border-red-200">
            <strong>Error:</strong> {cardError}
          </div>
        )}
      </div>

      {/* Development Mode Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          <strong>Development Mode:</strong> Use test card number 4242 4242 4242 4242 
          with any future expiry date and any 3-digit CVC.
        </p>
      </div>

      {/* Debug Info - Only in development */}
      {priceId && process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Debug:</strong> Price ID: {priceId}
          </p>
        </div>
      )}

      {/* Terms */}
      <div className="text-xs text-gray-600">
        <p>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          You can cancel your subscription at any time from your account settings.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Subscribe Now'
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;


