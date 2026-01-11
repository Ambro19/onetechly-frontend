// ========================================
// TERMS OF SERVICE PAGE - PIXELPERFECT
// ========================================
// Professional terms of service for PixelPerfect Screenshot API
// Production-ready, legally compliant

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const Terms = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 9, 2026";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate('/docs')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Documentation
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign in
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and PixelPerfect Screenshot API ("PixelPerfect," "we," "us," or "our"), operated by OneTechly, regarding your access to and use of our screenshot API service at pixelperfectapi.net.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By accessing or using PixelPerfect, you agree to be bound by these Terms. If you do not agree with these Terms, you may not access or use our service. We reserve the right to modify these Terms at any time, and your continued use constitutes acceptance of those changes.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              PixelPerfect provides a programmatic screenshot API service that allows developers to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Capture screenshots of web pages via RESTful API</li>
              <li>Customize screenshot parameters (dimensions, format, viewport)</li>
              <li>Process screenshots in multiple formats (PNG, JPEG, WebP, PDF)</li>
              <li>Access batch screenshot processing (Pro and Premium tiers)</li>
              <li>Utilize advanced features based on subscription tier</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration and Security</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Account Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              To use PixelPerfect, you must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Not share your account credentials with others</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Account Responsibility</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for all activities that occur under your account. We are not liable for any loss or damage arising from your failure to maintain account security.
            </p>
          </section>

          {/* Subscription and Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription Plans and Payment</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Subscription Tiers</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              PixelPerfect offers multiple subscription tiers:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Free Tier:</strong> 100 screenshots per month with standard features</li>
              <li><strong>Pro Tier:</strong> Increased limits, batch processing, priority support</li>
              <li><strong>Premium Tier:</strong> Highest limits, advanced features, dedicated support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Billing and Payments</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Subscription fees are billed monthly or annually in advance</li>
              <li>Payments are processed securely through Stripe</li>
              <li>All fees are non-refundable unless required by law</li>
              <li>You authorize us to charge your payment method on recurring basis</li>
              <li>Price changes will be communicated 30 days in advance</li>
              <li>Failure to pay may result in service suspension or termination</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Cancellation and Refunds</h3>
            <p className="text-gray-700 leading-relaxed">
              You may cancel your subscription at any time. Your service will remain active until the end of your current billing period. We do not provide refunds for partial months or unused services, except as required by applicable law.
            </p>
          </section>

          {/* API Usage and Limits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. API Usage and Limitations</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.1 Usage Limits</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Your API usage is subject to the limits of your subscription tier:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Monthly screenshot quotas based on your plan</li>
              <li>Rate limits to prevent service abuse</li>
              <li>Concurrent request limitations</li>
              <li>Storage limits for retained screenshots</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.2 Fair Use Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              You agree to use our service reasonably and not in a manner that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
              <li>Exceeds reasonable usage patterns</li>
              <li>Attempts to circumvent usage limits</li>
              <li>Impacts service availability for other users</li>
              <li>Uses automated scripts without proper rate limiting</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.1 Permitted Uses</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              You may use PixelPerfect for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Taking screenshots of publicly accessible websites</li>
              <li>Website monitoring and testing</li>
              <li>Content archiving and documentation</li>
              <li>Creating visual reports and analytics</li>
              <li>Other lawful purposes that comply with these Terms</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.2 Prohibited Uses</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              You may NOT use PixelPerfect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violate any laws, regulations, or third-party rights</li>
              <li>Capture content that infringes intellectual property rights</li>
              <li>Scrape or harvest personal data without authorization</li>
              <li>Circumvent website access controls or paywalls</li>
              <li>Capture illegal, harmful, or offensive content</li>
              <li>Engage in competitive intelligence gathering without permission</li>
              <li>Overload or attack our infrastructure</li>
              <li>Resell our service without authorization</li>
              <li>Reverse engineer or attempt to access source code</li>
              <li>Use the service for any fraudulent purpose</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.1 Our Property</h3>
            <p className="text-gray-700 leading-relaxed">
              PixelPerfect and its original content, features, and functionality are owned by OneTechly and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.2 Your Content</h3>
            <p className="text-gray-700 leading-relaxed">
              You retain all rights to the screenshots you generate using our service. However, you grant us a limited license to store and process these screenshots solely to provide our service to you.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.3 Third-Party Content</h3>
            <p className="text-gray-700 leading-relaxed">
              You are solely responsible for ensuring you have the right to capture and use screenshots of third-party websites. We are not liable for any copyright or intellectual property violations resulting from your use of our service.
            </p>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data and Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of PixelPerfect is also governed by our <button onClick={() => navigate('/privacy')} className="text-blue-600 hover:underline">Privacy Policy</button>. By using our service, you consent to our collection, use, and disclosure of your data as described in the Privacy Policy.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>The service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</li>
              <li>We disclaim all warranties, express or implied, including merchantability, fitness for purpose, and non-infringement</li>
              <li>We do not warrant that the service will be uninterrupted, secure, or error-free</li>
              <li>We do not warrant the accuracy, completeness, or reliability of any content</li>
              <li>Your use of the service is at your sole risk</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>PixelPerfect and OneTechly shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</li>
              <li>We are not liable for any loss of profits, revenue, data, or business opportunities</li>
              <li>We are not liable for third-party content accessed through our service</li>
              <li>We are not liable for service interruptions, data loss, or security breaches beyond our reasonable control</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Some jurisdictions do not allow limitations on implied warranties or liability, so these limitations may not apply to you.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless PixelPerfect, OneTechly, and our officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>Your use or misuse of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you capture using our service</li>
              <li>Any breach of your representations and warranties</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">12.1 Termination by You</h3>
            <p className="text-gray-700 leading-relaxed">
              You may terminate your account at any time through your account settings or by contacting support. Upon termination, your access to the service will cease at the end of your current billing period.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">12.2 Termination by Us</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may suspend or terminate your account immediately without prior notice if:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You violate these Terms</li>
              <li>Your payment fails or your account is past due</li>
              <li>Your use threatens the security or availability of our service</li>
              <li>We are required to do so by law</li>
              <li>We decide to discontinue the service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">12.3 Effect of Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your right to use the service immediately ceases. We may delete your account data, including screenshots, after a reasonable retention period. Provisions that by their nature should survive termination shall survive, including ownership, disclaimers, and limitations of liability.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">13.1 Governing Law</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">13.2 Informal Resolution</h3>
            <p className="text-gray-700 leading-relaxed">
              Before filing a legal claim, you agree to contact us at <a href="mailto:legal@pixelperfectapi.net" className="text-blue-600 hover:underline">legal@pixelperfectapi.net</a> to attempt to resolve the dispute informally.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">13.3 Arbitration</h3>
            <p className="text-gray-700 leading-relaxed">
              Any disputes not resolved informally shall be resolved through binding arbitration in accordance with the American Arbitration Association's rules, except as provided by applicable law. The arbitration shall take place in New York, NY.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">13.4 Class Action Waiver</h3>
            <p className="text-gray-700 leading-relaxed">
              You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
            </p>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. General Provisions</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.1 Entire Agreement</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms, together with our Privacy Policy and any other legal notices we publish, constitute the entire agreement between you and PixelPerfect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.2 Severability</h3>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.3 Waiver</h3>
            <p className="text-gray-700 leading-relaxed">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.4 Assignment</h3>
            <p className="text-gray-700 leading-relaxed">
              You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.5 Force Majeure</h3>
            <p className="text-gray-700 leading-relaxed">
              We shall not be liable for any failure to perform due to causes beyond our reasonable control, including acts of God, war, terrorism, riots, natural disasters, or failure of telecommunications or internet infrastructure.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of the service after such changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700"><strong>PixelPerfect Screenshot API</strong></p>
              <p className="text-gray-700">OneTechly</p>
              <p className="text-gray-700">New York, NY, United States</p>
              <p className="text-gray-700 mt-3">
                Legal: <a href="mailto:legal@pixelperfectapi.net" className="text-blue-600 hover:underline">legal@pixelperfectapi.net</a>
              </p>
              <p className="text-gray-700">
                Support: <a href="mailto:support@pixelperfectapi.net" className="text-blue-600 hover:underline">support@pixelperfectapi.net</a>
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t pt-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              BY CREATING AN ACCOUNT OR USING PIXELPERFECT SCREENSHOT API, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
            </p>
          </section>

        </div>

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
              <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button>
              <button onClick={() => navigate('/cookies')} className="hover:text-white">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;