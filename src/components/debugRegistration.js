// src/components/DebugRegistration.js - Temporary debug component

import React, { useState } from 'react';
import axios from 'axios';

const DebugRegistration = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setResult("Testing...");
    
    try {
      // Test 1: Health check
      console.log("Testing health check...");
      const healthResponse = await axios.get('http://localhost:8000/healthcheck');
      console.log("Health check response:", healthResponse.data);
      
      // Test 2: Root endpoint
      console.log("Testing root endpoint...");
      const rootResponse = await axios.get('http://localhost:8000/');
      console.log("Root response:", rootResponse.data);
      
      // Test 3: Registration attempt
      console.log("Testing registration...");
      const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: "testpassword123"
      };
      
      const registerResponse = await axios.post('http://localhost:8000/register', testUser, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      console.log("Registration response:", registerResponse.data);
      
      setResult({
        success: true,
        health: healthResponse.data,
        root: rootResponse.data,
        registration: registerResponse.data,
        testUser: testUser
      });
      
    } catch (error) {
      console.error("Debug test failed:", error);
      
      setResult({
        success: false,
        error: {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          timeout: error.code === 'ECONNABORTED' ? 'Request timeout' : null,
          network: !error.response ? 'Network error - server not responding' : null
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    setResult("Testing database...");
    
    try {
      // Try to get users/me endpoint (should fail with 401 but show server is running)
      const response = await axios.get('http://localhost:8000/users/me');
    } catch (error) {
      if (error.response?.status === 401) {
        setResult({
          success: true,
          message: "Server is running! (Got expected 401 unauthorized)",
          error: error.response.data
        });
      } else {
        setResult({
          success: false,
          error: {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Registration Debug Tool</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testBackendConnection}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Full Registration Flow'}
        </button>
        
        <button
          onClick={testDatabaseConnection}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2"
        >
          {isLoading ? 'Testing...' : 'Test Server Connection'}
        </button>
      </div>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Results:</h3>
          <pre className="bg-black text-green-400 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.success === false && result.error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
              <h4 className="font-bold text-red-800">Error Analysis:</h4>
              <ul className="list-disc list-inside text-red-700 mt-2">
                {result.error.network && <li>Network Error: {result.error.network}</li>}
                {result.error.timeout && <li>Timeout: {result.error.timeout}</li>}
                {result.error.status && <li>HTTP Status: {result.error.status} - {result.error.statusText}</li>}
                {result.error.message && <li>Error Message: {result.error.message}</li>}
                {result.error.data && <li>Server Response: {JSON.stringify(result.error.data)}</li>}
              </ul>
              
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
                <h5 className="font-bold text-yellow-800">Troubleshooting Steps:</h5>
                <ol className="list-decimal list-inside text-yellow-700 mt-2">
                  <li>Make sure your FastAPI server is running: <code>uvicorn main:app --reload</code></li>
                  <li>Check if server is accessible at: <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer" className="underline">http://localhost:8000</a></li>
                  <li>Verify your database migration completed successfully</li>
                  <li>Check server logs for detailed error messages</li>
                  <li>Ensure CORS is properly configured in main.py</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugRegistration;