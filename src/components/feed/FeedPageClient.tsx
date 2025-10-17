'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import StoresProvider from '@/components/StoresProvider';
import { PageHeader } from '@/components/feed';
import FeedContent from '@/components/feed/FeedContent';

interface FeedPageClientProps {
  initialProducts: any[];
}

export default function FeedPageClient({ initialProducts }: FeedPageClientProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait a moment for session to be established (especially after OAuth)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          setError('Authentication failed');
          router.push('/auth/login');
        } else if (user) {
          setUser(user);
        } else {
          router.push('/auth/login');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        router.push('/auth/login');
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading feed...</h2>
          <p className="text-gray-600">Please wait while we load your feed.</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading feed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-[#1aa1aa] text-white rounded-md hover:bg-[#158a8f] transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <StoresProvider initialUser={user} initialProducts={initialProducts}>
      <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
        <TopBar />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8 pt-40 lg:pt-44">
          {/* Responsive Layout */}
          <PageHeader variant="mobile" />
          <FeedContent initialProducts={initialProducts} />
        </div>
        
        <Navigation />
      </div>
    </StoresProvider>
  );
}
