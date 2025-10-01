-- Add KYC fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_description TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_logo_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_country TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_instagram TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_twitter TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_facebook TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_submitted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_rejected_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_rejection_reason TEXT;

-- Create seller_verification_documents table for additional verification
CREATE TABLE IF NOT EXISTS seller_verification_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('business_license', 'tax_certificate', 'id_document', 'address_proof', 'other')),
  document_url TEXT NOT NULL,
  document_name TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seller_verification_notes table for admin notes
CREATE TABLE IF NOT EXISTS seller_verification_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for seller_verification_documents
ALTER TABLE seller_verification_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view their own verification documents" ON seller_verification_documents
  FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Sellers can insert their own verification documents" ON seller_verification_documents
  FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update their own verification documents" ON seller_verification_documents
  FOR UPDATE USING (seller_id = auth.uid());

-- Add RLS policies for seller_verification_notes
ALTER TABLE seller_verification_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view notes about their verification" ON seller_verification_notes
  FOR SELECT USING (seller_id = auth.uid());

-- Create function to check if user can create posts
CREATE OR REPLACE FUNCTION can_user_create_posts(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_uuid 
    AND kyc_status = 'verified'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get seller KYC status
CREATE OR REPLACE FUNCTION get_seller_kyc_status(seller_uuid UUID)
RETURNS TABLE (
  kyc_status TEXT,
  business_name TEXT,
  business_description TEXT,
  business_logo_url TEXT,
  business_address TEXT,
  business_city TEXT,
  business_country TEXT,
  business_phone TEXT,
  business_website TEXT,
  business_instagram TEXT,
  business_twitter TEXT,
  business_facebook TEXT,
  kyc_submitted_at TIMESTAMP WITH TIME ZONE,
  kyc_verified_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.kyc_status,
    p.business_name,
    p.business_description,
    p.business_logo_url,
    p.business_address,
    p.business_city,
    p.business_country,
    p.business_phone,
    p.business_website,
    p.business_instagram,
    p.business_twitter,
    p.business_facebook,
    p.kyc_submitted_at,
    p.kyc_verified_at
  FROM profiles p
  WHERE p.id = seller_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_status ON profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_seller_verification_documents_seller_id ON seller_verification_documents(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_verification_documents_type ON seller_verification_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_seller_verification_notes_seller_id ON seller_verification_notes(seller_id);
