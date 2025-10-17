'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';

export default function OAuthSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          setError('Authentication failed. Please try again.');
          setTimeout(() => router.push('/auth/login'), 3000);
        } else if (user) {
          // Redirect to feed page
          window.location.href = '/feed';
        } else {
          setError('No user found. Please try again.');
          setTimeout(() => router.push('/auth/login'), 3000);
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        setTimeout(() => router.push('/auth/login'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1aa1aa] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
          <p className="text-gray-600">Please wait while we finish setting up your account.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-[#1aa1aa] text-white rounded-md hover:bg-[#158a8f] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
