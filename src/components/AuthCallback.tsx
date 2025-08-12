import React, { useEffect } from 'react';
import { useAppStore } from '../store/app-store';
import { authService } from '../services/auth';

export function AuthCallback() {
  const { setUser } = useAppStore();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        window.location.href = '/';
        return;
      }

      if (code && state) {
        try {
          // Exchange code for token
          const tokenData = await authService.exchangeCodeForToken(code, state);
          
          // Get user profile
          const userProfile = await authService.getUserProfile(tokenData.access_token);
          
          // Update app state
          setUser(userProfile);
          
          // Redirect to dashboard
          window.location.href = '/';
        } catch (error) {
          console.error('OAuth callback error:', error);
          window.location.href = '/';
        }
      }
    };

    handleCallback();
  }, [setUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing LinkedIn authentication...</p>
      </div>
    </div>
  );
}