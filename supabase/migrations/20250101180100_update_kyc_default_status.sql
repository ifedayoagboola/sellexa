-- Update the default KYC status to be more appropriate for instant verification
-- This migration updates the default status and adds a comment explaining the instant verification approach

-- Add comment to explain the instant verification approach
COMMENT ON COLUMN profiles.kyc_status IS 'KYC verification status: pending (legacy), verified (auto-verified on submission), rejected (manual rejection)';

-- Update any existing 'pending' statuses to 'verified' to reflect the new instant verification approach
-- This is safe because we're moving to instant verification
UPDATE profiles 
SET kyc_status = 'verified', 
    kyc_verified_at = COALESCE(kyc_submitted_at, NOW())
WHERE kyc_status = 'pending' 
AND (business_name IS NOT NULL AND business_name != '');

-- Add a function to auto-verify KYC submissions
CREATE OR REPLACE FUNCTION auto_verify_kyc_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a KYC submission (business_name is being set and kyc_status is pending)
  IF NEW.business_name IS NOT NULL 
     AND NEW.business_name != '' 
     AND NEW.kyc_status = 'pending' 
     AND (OLD.kyc_status IS NULL OR OLD.kyc_status = 'pending') THEN
    
    -- Auto-verify the submission
    NEW.kyc_status := 'verified';
    NEW.kyc_verified_at := NOW();
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-verify KYC submissions
DROP TRIGGER IF EXISTS trigger_auto_verify_kyc ON profiles;
CREATE TRIGGER trigger_auto_verify_kyc
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_verify_kyc_submission();
