-- Seed data for EthniqRootz development environment
-- This file contains sample data for testing and development

-- Insert sample categories (if not exists)
INSERT INTO categories (name, description) VALUES
('Food', 'Traditional African foods and ingredients'),
('Fashion', 'African clothing, accessories, and textiles'),
('Hair', 'Hair care products and accessories'),
('Home', 'Home decor and household items'),
('Culture', 'Cultural artifacts and traditional items'),
('Other', 'Miscellaneous items')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products (if not exists)
INSERT INTO products (id, title, description, price_pence, status, images, city, category, user_id, created_at) VALUES
(
  gen_random_uuid(),
  'Authentic Jollof Rice Seasoning',
  'Premium blend of spices for the perfect Jollof rice. Imported directly from Nigeria.',
  1299,
  'AVAILABLE',
  ARRAY['jollof-seasoning-1.jpg', 'jollof-seasoning-2.jpg'],
  'London',
  'Food',
  (SELECT id FROM profiles LIMIT 1),
  NOW()
),
(
  gen_random_uuid(),
  'Handwoven Kente Cloth Scarf',
  'Beautiful handwoven Kente cloth scarf in traditional Ghanaian patterns.',
  2499,
  'AVAILABLE',
  ARRAY['kente-scarf-1.jpg', 'kente-scarf-2.jpg'],
  'Manchester',
  'Fashion',
  (SELECT id FROM profiles LIMIT 1),
  NOW()
),
(
  gen_random_uuid(),
  'Shea Butter Hair Mask',
  '100% natural shea butter hair mask for deep conditioning and hair growth.',
  1899,
  'AVAILABLE',
  ARRAY['shea-butter-1.jpg'],
  'Birmingham',
  'Hair',
  (SELECT id FROM profiles LIMIT 1),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Update profiles with sample KYC data (for testing)
UPDATE profiles SET
  business_name = 'African Heritage Store',
  business_description = 'Your one-stop shop for authentic African products',
  business_city = 'London',
  business_country = 'United Kingdom',
  business_phone = '+44 20 1234 5678',
  business_website = 'https://africanheritage.example.com',
  business_instagram = '@africanheritage',
  business_twitter = '@africanheritage',
  business_facebook = 'African Heritage Store',
  kyc_status = 'verified',
  kyc_submitted_at = NOW(),
  kyc_verified_at = NOW()
WHERE id = (SELECT id FROM profiles LIMIT 1);

-- Insert sample conversation (if profiles exist)
INSERT INTO threads (id, product_id, buyer_id, seller_id, created_at) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM products LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Insert sample messages
INSERT INTO messages (id, thread_id, sender_id, body, created_at) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM threads LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  'Hi! I''m interested in this product. Is it still available?',
  NOW() - INTERVAL '1 hour'
),
(
  gen_random_uuid(),
  (SELECT id FROM threads LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  'Yes, it''s still available! Would you like to know more about it?',
  NOW() - INTERVAL '30 minutes'
)
ON CONFLICT DO NOTHING;
