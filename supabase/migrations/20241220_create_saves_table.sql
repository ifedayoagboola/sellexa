-- Create saves table
CREATE TABLE IF NOT EXISTS saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_saves_user_id ON saves(user_id);
CREATE INDEX IF NOT EXISTS idx_saves_product_id ON saves(product_id);
CREATE INDEX IF NOT EXISTS idx_saves_created_at ON saves(created_at);

-- Enable RLS
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all saves" ON saves
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own saves" ON saves
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves" ON saves
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to get save count for a product
CREATE OR REPLACE FUNCTION get_product_save_count(product_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM saves
    WHERE product_id = product_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has saved a product
CREATE OR REPLACE FUNCTION is_product_saved_by_user(product_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM saves
    WHERE product_id = product_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
