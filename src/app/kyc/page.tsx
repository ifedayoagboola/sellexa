'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { KYCStatus, SellerKYCForm } from '@/components/kyc';
import { useKYC } from '@/hooks/useKYC';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

function KYCPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/feed';
  
  const [showKYCForm, setShowKYCForm] = useState(false);
  const { user, isLoading, initializeUser } = useUserStore();
  
  const { 
    kycData, 
    loading: kycLoading, 
    canCreatePosts, 
    isKYCSubmitted, 
    isKYCVerified, 
    isKYCPending, 
    isKYCRejected,
    refreshKYCData 
  } = useKYC();

  // Initialize user store
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // Auto-redirect if already verified
  useEffect(() => {
    if (!kycLoading && !isLoading && isKYCVerified && redirectTo === '/post') {
      router.push('/post');
    }
  }, [isKYCVerified, kycLoading, isLoading, redirectTo, router]);

  const handleKYCComplete = (success: boolean) => {
    if (success) {
      refreshKYCData();
      
      setTimeout(() => {
        router.push(redirectTo);
      }, 2000);
    }
  };

  const handleEditKYC = () => {
    setShowKYCForm(true);
  };

  const handleContinue = () => {
    if (canCreatePosts) {
      router.push(redirectTo);
    }
  };

  if (isLoading || kycLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#1aa1aa]/10 rounded-lg">
              <Building2 className="h-8 w-8 text-[#1aa1aa]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Verification</h1>
              <p className="text-gray-600 mt-1">
                Complete your business profile to join our exclusive network of authentic merchants
              </p>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {isKYCVerified ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : isKYCPending ? (
                  <Clock className="h-8 w-8 text-yellow-600" />
                ) : isKYCRejected ? (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                ) : (
                  <Building2 className="h-8 w-8 text-gray-600" />
                )}
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isKYCVerified ? 'Verification Complete' : 
                     isKYCPending ? 'Under Review' : 
                     isKYCRejected ? 'Verification Rejected' : 
                     'Verification Required'}
                  </h2>
                  <p className="text-gray-600">
                    {isKYCVerified ? 'You can now create product listings and access all seller features.' :
                     isKYCPending ? 'Your information is being processed. Verification should complete automatically.' :
                     isKYCRejected ? 'Please review your information and resubmit for verification.' :
                     'Complete your business profile to join our exclusive network of authentic merchants.'}
                  </p>
                </div>
              </div>

              {isKYCVerified && (
                <Button
                  onClick={handleContinue}
                  className="bg-[#1aa1aa] hover:bg-[#158a8f]"
                >
                  Continue to Create Post
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* KYC Status Component */}
        {isKYCSubmitted && (
          <KYCStatus
            onEdit={handleEditKYC}
            onComplete={handleContinue}
          />
        )}

        {/* Start KYC Button for new users */}
        {!isKYCSubmitted && (
          <Card className="p-8 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Seller Journey
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Complete your business verification to instantly unlock the ability to create product listings 
              and connect with a global network of discerning customers.
            </p>
            <Button
              onClick={() => setShowKYCForm(true)}
              className="bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              Begin Verification
            </Button>
          </Card>
        )}

        {/* Benefits Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Why Verify Your Business?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-[#1aa1aa]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-[#1aa1aa]" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Build Trust</h4>
              <p className="text-sm text-gray-600">
                Verified sellers appear more trustworthy to customers, leading to higher sales.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Access Features</h4>
              <p className="text-sm text-gray-600">
                Create product listings and manage your seller profile.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-[#1aa1aa]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-[#1aa1aa]" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Priority Support</h4>
              <p className="text-sm text-gray-600">
                Get priority customer support for any issues.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* KYC Form Modal */}
      {showKYCForm && (
        <SellerKYCForm
          onComplete={handleKYCComplete}
          onCancel={() => setShowKYCForm(false)}
          initialData={kycData || undefined}
        />
      )}
    </div>
  );
}

export default function KYCPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KYCPageContent />
    </Suspense>
  );
}
