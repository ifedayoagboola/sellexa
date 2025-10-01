-- Optimize saves implementation
-- Add better functions and indexes for improved performance

-- Create a comprehensive function to get save data for multiple products
CREATE OR REPLACE FUNCTION get_products_save_data(
  product_uuids UUID[],
  user_uuid UUID DEFAULT NULL
)
RETURNS TABLE (
  product_id UUID,
  save_count INTEGER,
  is_saved BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as product_id,
    COALESCE(save_counts.count, 0)::INTEGER as save_count,
    CASE 
      WHEN user_uuid IS NULL THEN FALSE
      ELSE EXISTS (
        SELECT 1 FROM saves s 
        WHERE s.product_id = p.id AND s.user_id = user_uuid
      )
    END as is_saved
  FROM unnest(product_uuids) as p(id)
  LEFT JOIN (
    SELECT 
      product_id,
      COUNT(*) as count
    FROM saves 
    WHERE product_id = ANY(product_uuids)
    GROUP BY product_id
  ) save_counts ON save_counts.product_id = p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's saved products with metadata
CREATE OR REPLACE FUNCTION get_user_saved_products_with_metadata(user_uuid UUID)
RETURNS TABLE (
  product_id UUID,
  saved_at TIMESTAMP WITH TIME ZONE,
  product_title TEXT,
  product_price_pence INTEGER,
  product_images TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.product_id,
    s.created_at as saved_at,
    p.title as product_title,
    p.price_pence,
    p.images
  FROM saves s
  JOIN products p ON p.id = s.product_id
  WHERE s.user_id = user_uuid
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add composite index for better performance
CREATE INDEX IF NOT EXISTS idx_saves_user_product ON saves(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_saves_product_created ON saves(product_id, created_at DESC);

-- Create function to batch toggle saves
CREATE OR REPLACE FUNCTION batch_toggle_saves(
  product_uuids UUID[],
  user_uuid UUID,
  action TEXT -- 'save' or 'unsave'
)
RETURNS TABLE (
  product_id UUID,
  success BOOLEAN,
  new_save_count INTEGER
) AS $$
DECLARE
  product_uuid UUID;
  result_record RECORD;
BEGIN
  FOREACH product_uuid IN ARRAY product_uuids
  LOOP
    IF action = 'save' THEN
      -- Try to insert, ignore if already exists
      INSERT INTO saves (user_id, product_id) 
      VALUES (user_uuid, product_uuid)
      ON CONFLICT (user_id, product_id) DO NOTHING;
    ELSIF action = 'unsave' THEN
      -- Delete if exists
      DELETE FROM saves 
      WHERE user_id = user_uuid AND product_id = product_uuid;
    END IF;
    
    -- Get updated save count
    SELECT COUNT(*)::INTEGER INTO result_record.new_save_count
    FROM saves 
    WHERE product_id = product_uuid;
    
    -- Return result
    product_id := product_uuid;
    success := TRUE;
    new_save_count := result_record.new_save_count;
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

