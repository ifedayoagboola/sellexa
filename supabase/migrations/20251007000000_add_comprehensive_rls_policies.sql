-- Comprehensive RLS Policies for Core Tables
-- This migration adds Row Level Security to all core tables that were missing it
-- Created: 2025-10-07

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public profile information
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users cannot delete their own profile (must be done through auth)
-- No DELETE policy - prevents accidental profile deletion

-- ============================================================================
-- 2. PRODUCTS TABLE
-- ============================================================================

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view available products
DROP POLICY IF EXISTS "Anyone can view available products" ON products;
CREATE POLICY "Anyone can view available products" ON products
  FOR SELECT USING (
    status = 'AVAILABLE' OR 
    status = 'SOLD' OR
    user_id = auth.uid()  -- Users can see their own products regardless of status
  );

-- Policy: Verified sellers can create products
DROP POLICY IF EXISTS "Verified sellers can create products" ON products;
CREATE POLICY "Verified sellers can create products" ON products
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND kyc_status = 'verified'
    )
  );

-- Policy: Users can update their own products
DROP POLICY IF EXISTS "Users can update their own products" ON products;
CREATE POLICY "Users can update their own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own products
DROP POLICY IF EXISTS "Users can delete their own products" ON products;
CREATE POLICY "Users can delete their own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 3. THREADS TABLE (Chat Conversations)
-- ============================================================================

-- Enable RLS on threads table
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view threads they're part of
DROP POLICY IF EXISTS "Users can view their own threads" ON threads;
CREATE POLICY "Users can view their own threads" ON threads
  FOR SELECT USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id
  );

-- Policy: Users can create threads where they're the buyer
DROP POLICY IF EXISTS "Users can create threads as buyer" ON threads;
CREATE POLICY "Users can create threads as buyer" ON threads
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Policy: Users can update threads they're part of
DROP POLICY IF EXISTS "Users can update their own threads" ON threads;
CREATE POLICY "Users can update their own threads" ON threads
  FOR UPDATE USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id
  );

-- Policy: No deletion of threads (preserve conversation history)
-- No DELETE policy - conversations should be archived, not deleted

-- ============================================================================
-- 4. MESSAGES TABLE
-- ============================================================================

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages in their threads
DROP POLICY IF EXISTS "Users can view messages in their threads" ON messages;
CREATE POLICY "Users can view messages in their threads" ON messages
  FOR SELECT USING (
    thread_id IN (
      SELECT id FROM threads 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

-- Policy: Users can send messages to their threads
DROP POLICY IF EXISTS "Users can send messages to their threads" ON messages;
CREATE POLICY "Users can send messages to their threads" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    thread_id IN (
      SELECT id FROM threads 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

-- Policy: Users can update their own messages (edit functionality)
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Policy: Users can delete their own messages
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;
CREATE POLICY "Users can delete their own messages" ON messages
  FOR DELETE USING (auth.uid() = sender_id);

-- ============================================================================
-- 5. CATEGORIES TABLE (Optional - Public Data)
-- ============================================================================

-- Enable RLS on categories table (if it exists)
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view categories
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Note: Only admins should be able to create/update/delete categories
-- This would typically be handled through service role key in admin functions

-- ============================================================================
-- 6. CREATE HELPER FUNCTIONS FOR RLS CHECKS
-- ============================================================================

-- Function to check if user is seller of a product
CREATE OR REPLACE FUNCTION is_product_seller(product_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM products 
    WHERE id = product_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is part of a thread
CREATE OR REPLACE FUNCTION is_thread_participant(thread_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM threads 
    WHERE id = thread_uuid 
    AND (buyer_id = user_uuid OR seller_id = user_uuid)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is verified seller
CREATE OR REPLACE FUNCTION is_verified_seller(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_uuid 
    AND kyc_status = 'verified'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. ADD INDEXES FOR RLS PERFORMANCE
-- ============================================================================

-- Indexes to optimize RLS policy checks
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_threads_buyer_id ON threads(buyer_id);
CREATE INDEX IF NOT EXISTS idx_threads_seller_id ON threads(seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'RLS policies successfully applied to all core tables';
  RAISE NOTICE 'Tables secured: profiles, products, threads, messages, categories';
END $$;

