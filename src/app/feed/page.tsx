import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import { PageHeader, SellerSection, EmptyState } from '@/components/feed';

export default async function FeedPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Fetch products with seller KYC data
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

  // Group products by seller
  const productsBySeller = products?.reduce((acc, product) => {
    const sellerId = product.user_id;
    const sellerProfile = product.profiles as any; // Cast to handle type issues
    
    if (!acc[sellerId]) {
      acc[sellerId] = {
        seller: sellerProfile,
        products: []
      };
    }
    acc[sellerId].products.push(product);
    return acc;
  }, {} as Record<string, { seller: any; products: any[] }>) || {};

  // Convert to array and sort by product count
  const sellerSections = Object.values(productsBySeller)
    .filter(section => section.products.length > 0)
    .sort((a, b) => b.products.length - a.products.length);

  return (
    <div className="min-h-screen bg-white pb-20">
        <TopBar user={user} />
        
        <div className="max-w-7xl mx-auto px-4 py-8 pt-48 lg:pt-56">
          {/* Responsive Layout */}
          <PageHeader variant="mobile" />
          {sellerSections.length > 0 ? (
            <div className="space-y-8 lg:space-y-16">
              {sellerSections.map((section, index) => (
                <SellerSection 
                  key={section.seller?.user_id || index}
                  section={section}
                  index={index}
                  variant="mobile"
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
        
        <Navigation />
      </div>
  );
}
