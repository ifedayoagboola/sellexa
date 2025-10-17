import { createClient } from '@/integrations/supabase/server';
import FeedPageClient from '@/components/feed/FeedPageClient';

export default async function FeedPage() {
  const supabase = await createClient();
  
  // Fetch initial products data for server-side rendering
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      price_pence,
      status,
      images,
      city,
      category,
      user_id,
      profiles:profiles!products_user_id_fkey(
        handle,
        name,
        avatar_url,
        business_name,
        business_logo_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching products:', error);
  }

  return <FeedPageClient initialProducts={products || []} />;
}
