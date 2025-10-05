-- Fix KYC trigger to handle both INSERT and UPDATE operations
-- This ensures the auto-verification trigger works with upsert operations

-- Update the function to handle both INSERT and UPDATE cases
CREATE OR REPLACE FUNCTION auto_verify_kyc_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a KYC submission (business_name is being set and kyc_status is pending)
  IF NEW.business_name IS NOT NULL 
     AND NEW.business_name != '' 
     AND NEW.kyc_status = 'pending' 
     AND (TG_OP = 'INSERT' OR OLD.kyc_status IS NULL OR OLD.kyc_status = 'pending') THEN
    
    -- Auto-verify the submission
    NEW.kyc_status := 'verified';
    NEW.kyc_verified_at := NOW();
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger
DROP TRIGGER IF EXISTS trigger_auto_verify_kyc ON profiles;

-- Create trigger for both INSERT and UPDATE operations
CREATE TRIGGER trigger_auto_verify_kyc
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_verify_kyc_submission();
