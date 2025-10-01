import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Navigation from '@/components/Navigation';
import SaveProvider from '@/components/SaveProvider';
import { getServerSideSaveData } from '@/lib/saves-server';

export default async function ProfilePage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Fetch user's products
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
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

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
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <button className="text-primary font-medium">Edit</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Info */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
            {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {user.user_metadata?.full_name || 'User'}
          </h2>
          <p className="text-muted-foreground mb-2">@{user.email?.split('@')[0] || 'user'}</p>
          <p className="text-sm text-muted-foreground mb-4">London, UK</p>
          
          {/* Badges */}
          <div className="flex justify-center space-x-2 mb-6">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              ✓ Verified
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Early Seller
            </span>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-6 text-center">
            <div>
              <p className="text-xl font-bold text-foreground">{products?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">24</p>
              <p className="text-sm text-muted-foreground">Sold</p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">4.8</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button className="flex-1 py-2 text-center text-primary border-b-2 border-primary font-medium">
            Posts
          </button>
          <button className="flex-1 py-2 text-center text-muted-foreground hover:text-foreground">
            Saved
          </button>
          <button className="flex-1 py-2 text-center text-muted-foreground hover:text-foreground">
            About
          </button>
        </div>

        {/* Posts Grid */}
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
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No posts yet</h2>
            <p className="text-muted-foreground mb-6">
              Start selling by creating your first product listing
            </p>
            <a
              href="/post"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Create Post
            </a>
          </div>
        )}
      </div>
      
      <Navigation />
      </div>
    </SaveProvider>
  );
}