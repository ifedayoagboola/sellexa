'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Building2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface KYCStatusData {
  kyc_status: string;
  business_name: string;
  business_description: string;
  business_logo_url: string;
  business_address: string;
  business_city: string;
  business_country: string;
  business_phone: string;
  business_website: string;
  business_instagram: string;
  business_twitter: string;
  business_facebook: string;
  kyc_submitted_at: string;
  kyc_verified_at: string;
}

interface KYCStatusProps {
  onEdit: () => void;
  onComplete: () => void;
}

export default function KYCStatus({ onEdit, onComplete }: KYCStatusProps) {
  const [kycData, setKycData] = useState<KYCStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          kyc_status,
          business_name,
          business_description,
          business_logo_url,
          business_address,
          business_city,
          business_country,
          business_phone,
          business_website,
          business_instagram,
          business_twitter,
          business_facebook,
          kyc_submitted_at,
          kyc_verified_at
        `)
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        return;
      }

      if (!data) {
        setKycData(null);
        return;
      }

      setKycData(data as any);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Submitted</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </Card>
    );
  }

  if (!kycData) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No KYC Information</h3>
          <p className="text-gray-600 mb-4">
            Complete your seller verification to join our exclusive network of authentic merchants.
          </p>
          <Button onClick={onEdit} className="bg-purple-600 hover:bg-purple-700">
            Start Verification
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(kycData.kyc_status)}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Seller Verification</h3>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusBadge(kycData.kyc_status)}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </div>

      {kycData.kyc_status === 'verified' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="text-sm font-medium text-green-900">Verification Complete</h4>
              <p className="text-sm text-green-700">
                You can now create product listings and connect with a global network of discerning customers.
              </p>
            </div>
          </div>
        </div>
      )}

      {kycData.kyc_status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Under Review</h4>
              <p className="text-sm text-yellow-700">
                Your verification is being reviewed.
              </p>
            </div>
          </div>
        </div>
      )}

      {kycData.kyc_status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <h4 className="text-sm font-medium text-red-900">Verification Rejected</h4>
              <p className="text-sm text-red-700">
                Please review your information and resubmit for verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Business Information Display */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Business Name</label>
            <p className="text-sm text-gray-900">{kycData.business_name || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">City, Country</label>
            <p className="text-sm text-gray-900">
              {kycData.business_city && kycData.business_country 
                ? `${kycData.business_city}, ${kycData.business_country}`
                : 'Not provided'
              }
            </p>
          </div>
        </div>

        {kycData.business_description && (
          <div>
            <label className="text-sm font-medium text-gray-500">Business Description</label>
            <p className="text-sm text-gray-900">{kycData.business_description}</p>
          </div>
        )}

        {/* Social Media Links */}
        {(kycData.business_website || kycData.business_instagram || kycData.business_twitter || kycData.business_facebook) && (
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Online Presence</label>
            <div className="flex flex-wrap gap-2">
              {kycData.business_website && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs"
                >
                  <a href={kycData.business_website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Website
                  </a>
                </Button>
              )}
              {kycData.business_instagram && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs"
                >
                  <a href={`https://instagram.com/${kycData.business_instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Instagram
                  </a>
                </Button>
              )}
              {kycData.business_twitter && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs"
                >
                  <a href={`https://twitter.com/${kycData.business_twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Twitter
                  </a>
                </Button>
              )}
              {kycData.business_facebook && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs"
                >
                  <a href={kycData.business_facebook} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Facebook
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-500 space-y-1">
          {kycData.kyc_submitted_at && (
            <p>Submitted: {formatDate(kycData.kyc_submitted_at)}</p>
          )}
          {kycData.kyc_verified_at && (
            <p>Verified: {formatDate(kycData.kyc_verified_at)}</p>
          )}
        </div>
      </div>

      {kycData.kyc_status === 'verified' && (
        <div className="mt-6 pt-4 border-t">
          <Button
            onClick={onComplete}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Continue to Create Post
          </Button>
        </div>
      )}
    </Card>
  );
}
