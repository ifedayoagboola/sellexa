import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import TopBar from '@/components/TopBar';
import ProductCard from '@/components/ProductCard';
import UserMenu from '@/components/UserMenu';
import Navigation from '@/components/Navigation';
import SaveProvider from '@/components/SaveProvider';
import { getServerSideSaveData } from '@/lib/saves-server';

export default async function FeedPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Fetch products
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
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching products:', error);
  }

  // Get save data for the first few products to initialize the store
  const saveDataPromises = products?.slice(0, 5).map(product => 
    getServerSideSaveData(product.id, user.id)
  ) || [];
  
  const saveDataResults = await Promise.all(saveDataPromises);

  return (
    <SaveProvider 
      productId={products?.[0]?.id || ''}
      initialSaveCount={saveDataResults[0]?.saveCount || 0}
      initialIsSaved={saveDataResults[0]?.isSaved || false}
    >
      <div className="min-h-screen bg-background pb-20">
      <TopBar />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Discover African Products
          </h1>
          <UserMenu user={user} />
        </div>
        
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              No products found
            </h2>
            <p className="text-muted-foreground mb-8">
              Be the first to list a product on EthniqRootz!
            </p>
            <a
              href="/post"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              List a Product
            </a>
          </div>
        )}
      </div>
      
      <Navigation />
      </div>
    </SaveProvider>
  );
}
