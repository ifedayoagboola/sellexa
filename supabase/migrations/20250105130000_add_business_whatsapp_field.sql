-- Add business_whatsapp field to profiles table
-- This field will store the WhatsApp business number for customer communication

ALTER TABLE profiles 
ADD COLUMN business_whatsapp TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.business_whatsapp IS 'WhatsApp business number for customer communication and order processing';

-- Create index for faster queries if needed
CREATE INDEX IF NOT EXISTS idx_profiles_business_whatsapp ON profiles(business_whatsapp) WHERE business_whatsapp IS NOT NULL;
