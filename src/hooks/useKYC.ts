'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface KYCData {
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

export function useKYC() {
    const [kycData, setKycData] = useState<KYCData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchKYCData = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setKycData(null);
                return;
            }

            const { data, error: fetchError } = await supabase
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
                .single();

            if (fetchError) {
                console.error('Error fetching KYC data:', fetchError);
                setError(fetchError.message);
                return;
            }

            setKycData(data);
        } catch (err: any) {
            console.error('Error fetching KYC data:', err);
            setError(err.message || 'Failed to fetch KYC data');
        } finally {
            setLoading(false);
        }
    };

    const canCreatePosts = () => {
        return kycData?.kyc_status === 'verified';
    };

    const isKYCSubmitted = () => {
        return kycData?.kyc_status === 'pending' || kycData?.kyc_status === 'verified';
    };

    const isKYCVerified = () => {
        return kycData?.kyc_status === 'verified';
    };

    const isKYCPending = () => {
        return kycData?.kyc_status === 'pending';
    };

    const isKYCRejected = () => {
        return kycData?.kyc_status === 'rejected';
    };

    const refreshKYCData = () => {
        fetchKYCData();
    };

    useEffect(() => {
        fetchKYCData();
    }, []);

    return {
        kycData,
        loading,
        error,
        canCreatePosts: canCreatePosts(),
        isKYCSubmitted: isKYCSubmitted(),
        isKYCVerified: isKYCVerified(),
        isKYCPending: isKYCPending(),
        isKYCRejected: isKYCRejected(),
        refreshKYCData,
    };
}
