import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { getAuthToken, isAuthenticated } from '../../lib/utils/authUtils';
import { authService } from '../../lib/services/authService';
import { apiClient } from '../../lib/utils/apiClient';

export function AuthDebug() {
  const { user, loading, checkAuth } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [cookieString, setCookieString] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [corsTestResult, setCorsTestResult] = useState<any>(null);
  const [corsTestLoading, setCorsTestLoading] = useState(false);
  
  useEffect(() => {
    // Update token and cookie information every second
    const interval = setInterval(() => {
      setToken(getAuthToken());
      setCookieString(document.cookie);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleTestAuth = async () => {
    setTestLoading(true);
    try {
      const result = await authService.testAuth();
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: String(error) });
    } finally {
      setTestLoading(false);
    }
  };
  
  const handleCorsTest = async () => {
    setCorsTestLoading(true);
    try {
      const result = await apiClient.get('/cors-test');
      setCorsTestResult(result);
    } catch (error) {
      setCorsTestResult({ error: String(error) });
    } finally {
      setCorsTestLoading(false);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md overflow-auto z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <p><strong>Is Authenticated:</strong> {isAuthenticated() ? 'Yes' : 'No'}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        </div>
        
        <div>
          <p><strong>User:</strong></p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-20">
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </pre>
        </div>
        
        <div>
          <p><strong>Auth Token:</strong></p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-20">
            {token || 'null'}
          </pre>
        </div>
        
        <div>
          <p><strong>Cookies:</strong></p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-20">
            {cookieString || '(none)'}
          </pre>
        </div>
        
        <div className="flex space-x-2 flex-wrap">
          <button 
            onClick={() => checkAuth()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs mb-1"
          >
            Refresh Auth
          </button>
          
          <button 
            onClick={handleTestAuth} 
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs mb-1"
            disabled={testLoading}
          >
            {testLoading ? 'Testing...' : 'Test Auth API'}
          </button>
          
          <button 
            onClick={handleCorsTest} 
            className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs mb-1"
            disabled={corsTestLoading}
          >
            {corsTestLoading ? 'Testing...' : 'Test CORS'}
          </button>
        </div>
        
        {testResult && (
          <div>
            <p><strong>Auth Test Result:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-20">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
        
        {corsTestResult && (
          <div>
            <p><strong>CORS Test Result:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-20">
              {JSON.stringify(corsTestResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 