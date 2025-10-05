import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import StoresProvider from '@/components/StoresProvider';
import { PageHeader } from '@/components/feed';
import FeedContent from '@/components/feed/FeedContent';

export default async function FeedPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

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

  return (
    <StoresProvider initialUser={user} initialProducts={products || []}>
      <div className="min-h-screen bg-white pb-20">
        <TopBar />
        
        <div className="max-w-7xl mx-auto px-4 py-8 pt-48 lg:pt-56">
          {/* Responsive Layout */}
          <PageHeader variant="mobile" />
          <FeedContent initialProducts={products || []} />
        </div>
        
        <Navigation />
      </div>
    </StoresProvider>
  );
}
