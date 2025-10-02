import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import TopBar from '@/components/TopBar';
import ProductCard from '@/components/ProductCard';
import Navigation from '@/components/Navigation';
import SaveProvider from '@/components/SaveProvider';
import { getServerSideSaveData } from '@/lib/saves-server';
import { Star, MoreHorizontal } from 'lucide-react';

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
      <div className="min-h-screen bg-white pb-20">
        <TopBar user={user} />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Mobile: Brand sections with horizontal scroll */}
          <div className="block xl:hidden">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Discover African Products
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Curated collections from authentic African sellers
              </p>
              <div className="w-16 h-[1.5px] bg-[#1aa1aa] mx-auto mt-4 rounded-full"></div>
            </div>
            
            {sellerSections.length > 0 ? (
              <div className="space-y-8">
                {sellerSections.map((section, index) => {
                  const seller = section.seller;
                  const sellerName = seller?.business_name || seller?.name || 'Unknown Seller';
                  const sellerLogo = seller?.business_logo_url || seller?.avatar_url;
                  
                  // Mock rating data
                  const rating = 4.0 + (index % 2) * 0.3;
                  const reviewCount = Math.floor(Math.random() * 1000) + 100;
                  
                  return (
                    <div key={seller?.user_id || index} className="space-y-4">
                      {/* Brand Header - Mobile */}
                      <div className="bg-white p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Brand Logo - Circular with text */}
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                              {sellerLogo ? (
                                <img 
                                  src={sellerLogo} 
                                  alt={sellerName}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-xs font-bold text-gray-700">
                                  {sellerName.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase()}
                                </span>
                              )}
                            </div>
                            
                            {/* Brand Info */}
                            <div>
                              <h2 className="text-base font-bold text-black">
                                {sellerName}
                              </h2>
                              <div className="flex items-center space-x-1">
                                <span className="text-sm text-black">{rating}</span>
                                <Star className="h-3 w-3 text-black fill-current" />
                                <span className="text-sm text-gray-600">
                                  ({reviewCount > 1000 ? `${(reviewCount/1000).toFixed(1)}K` : reviewCount})
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                              Follow
                            </button>
                            <button className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Grid - Mobile */}
                      <div className="grid grid-cols-2 gap-3">
                        {section.products.slice(0, 6).map((product) => (
                          <ProductCard key={product.id} product={product as any} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-slate-300">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No products found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Be the first to list a product on EthniqRootz and showcase your authentic African products!
                </p>
                <a
                  href="/post"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1aa1aa] to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-[#158a8f] hover:to-teal-700 transition-all duration-200 shadow-lg"
                >
                  List a Product
                </a>
              </div>
            )}
          </div>
          
          {/* Desktop: Brand sections with horizontal scroll */}
          <div className="hidden xl:block">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                Discover African Products
              </h1>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                Explore authentic African products from verified sellers across the continent
              </p>
              <div className="w-20 h-[1.5px] bg-[#1aa1aa] mx-auto mt-6 rounded-full"></div>
            </div>
            
            {sellerSections.length > 0 ? (
              <div className="space-y-16">
                {sellerSections.map((section, index) => {
                  const seller = section.seller;
                  const sellerName = seller?.business_name || seller?.name || 'Unknown Seller';
                  const sellerLogo = seller?.business_logo_url || seller?.avatar_url;
                  const sellerHandle = seller?.handle;
                  
                  // Mock rating data (in real app, this would come from database)
                  const rating = 4.0 + (index % 2) * 0.3; // 4.0 or 4.3
                  const reviewCount = Math.floor(Math.random() * 1000) + 100;
                  
                  return (
                    <div key={seller?.user_id || index} className="space-y-8">
                      {/* Brand Header - Desktop */}
                      <div className="bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Brand Logo - Circular with text */}
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                              {sellerLogo ? (
                                <img 
                                  src={sellerLogo} 
                                  alt={sellerName}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-sm font-semibold text-gray-700">
                                  {sellerName.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase()}
                                </span>
                              )}
                            </div>
                            
                            {/* Brand Info */}
                            <div>
                              <h2 className="text-lg font-semibold text-black">
                                {sellerName}
                              </h2>
                              <div className="flex items-center space-x-1">
                                <span className="text-sm text-gray-600">{rating}</span>
                                <Star className="h-3 w-3 text-black fill-current" />
                                <span className="text-sm text-gray-600">
                                  ({reviewCount.toLocaleString()})
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-3">
                            <button className="px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                              Follow
                            </button>
                            <button className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Grid - Desktop */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {section.products.slice(0, 6).map((product) => (
                          <ProductCard key={product.id} product={product as any} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-slate-300">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No products found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Be the first to list a product on EthniqRootz and showcase your authentic African products!
                </p>
                <a
                  href="/post"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1aa1aa] to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-[#158a8f] hover:to-teal-700 transition-all duration-200 shadow-lg"
                >
                  List a Product
                </a>
              </div>
            )}
          </div>
        </div>
        
        <Navigation />
      </div>
    </SaveProvider>
  );
}
