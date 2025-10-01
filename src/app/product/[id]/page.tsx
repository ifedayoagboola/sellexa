import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import SaveButton from '@/components/SaveButton';
import SaveProvider from '@/components/SaveProvider';
import { StartChatButton } from '@/components/StartChatButton';
import { getServerSideSaveData } from '@/lib/saves-server';
import { Star, Heart, ShoppingCart } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const supabase = await createClient();
  
  // Get current user (optional for public viewing)
  const { data: { user } } = await supabase.auth.getUser();

  // Await params for Next.js 15
  const { id } = await params;

  // Fetch product details
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      price_pence,
      status,
      images,
      city,
      postcode,
      category,
      tags,
      user_id,
      created_at,
      profiles:profiles!products_user_id_fkey(
        handle,
        name,
        avatar_url,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  // Fetch seller's KYC data separately (with error handling)
  let kycData: { business_name?: string; business_logo_url?: string } | null = null;
  if (product?.user_id) {
    try {
      const { data: kyc, error: kycError } = await supabase
        .from('profiles')
        .select('business_name, business_logo_url')
        .eq('id', product.user_id)
        .single();
      
      if (!kycError && kyc && typeof kyc === 'object') {
        kycData = kyc as { business_name?: string; business_logo_url?: string };
      }
    } catch (error) {
      // KYC fields might not exist yet, continue without them
      console.log('KYC fields not available yet:', error);
    }
  }

  if (error || !product) {
    notFound();
  }

  // Get save data server-side (only if user is logged in)
  const saveData = user ? await getServerSideSaveData(product.id, user.id) : { saveCount: 0, isSaved: false };

  // Helper function to construct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/product-images/${imagePath}` : null;
  };

  // Mock data for Fashion Nova style
  const originalPrice = Math.round(product.price_pence * 1.5);
  const discount = Math.floor(Math.random() * 50) + 20;
  const rating = 4.3;
  const reviewCount = Math.floor(Math.random() * 1000) + 100;
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '1X', '2X', '3X'];
  const selectedSize = 'S';

  return (
    <SaveProvider 
      productId={product.id}
      initialSaveCount={saveData.saveCount}
      initialIsSaved={saveData.isSaved}
    >
      <div className="min-h-screen bg-white">
        {/* TopBar */}
        <TopBar user={user} showSearch={false} showUserMenu={!!user} />
        
        {/* Brand Header - Fashion Nova Style */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Brand Logo & Name */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  {kycData?.business_logo_url ? (
                    <img 
                      src={kycData.business_logo_url} 
                      alt="Business logo" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {(kycData?.business_name || product.profiles?.name || product.profiles?.handle || 'ER').substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-black">
                    {kycData?.business_name || product.profiles?.name || product.profiles?.handle || 'EthniqRootz'}
                  </h1>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-black">{rating}</span>
                    <Star className="h-3 w-3 text-black fill-current" />
                    <span className="text-sm text-gray-600">({reviewCount.toLocaleString()})</span>
                  </div>
                </div>
              </div>
              
              {/* Visit Store Button */}
              <Link
                href={`/seller/${product.profiles?.handle}`}
                className="px-3 py-1.5 border border-gray-300 text-black text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Visit store
              </Link>
            </div>
          </div>
        </div>

        {/* Product Images - Fashion Nova Style */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Product Images */}
              {product.images && product.images.length > 0 ? (
                product.images.slice(0, 2).map((image, index) => (
                  <div key={index} className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
                    <ProductImage
                      imageUrl={getImageUrl(image)}
                      title={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="aspect-[4/5] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information - Fashion Nova Style */}
        <div className="bg-white px-4 py-6 pb-32">
          <div className="max-w-7xl mx-auto">
            {/* Product Title */}
            <h2 className="text-xl font-semibold text-black mb-2">{product.title}</h2>
            
            {/* Rating */}
            <div className="flex items-center space-x-1 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <Link href="#" className="text-sm text-black hover:underline">
                {Math.floor(Math.random() * 50) + 10} ratings
              </Link>
            </div>
            
            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-xl font-semibold text-black">£{(product.price_pence / 100).toFixed(2)}</span>
              <span className="text-base text-gray-500 line-through">£{(originalPrice / 100).toFixed(2)}</span>
            </div>
            
            {/* Wishlist Button */}
            <div className="flex justify-end mb-6">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5 text-black" />
              </button>
            </div>
            
            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="text-base font-medium text-black mb-3">Size {selectedSize}</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-1.5 rounded-full text-sm font-normal transition-colors ${
                      size === selectedSize
                        ? 'border border-black text-black'
                        : size === 'XS'
                        ? 'bg-gray-100 text-gray-400 line-through'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-base font-medium text-black mb-3">Description</h3>
                <p className="text-gray-900 leading-relaxed text-sm">{product.description}</p>
              </div>
            )}
            
            {/* Category & Location */}
            <div className="flex items-center justify-between text-sm text-gray-800 mb-8">
              <span className="capitalize">{product.category.toLowerCase()}</span>
              <span>{product.city}{product.postcode && `, ${product.postcode}`}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Overlay - Chat and Buy only */}
        <div className="fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-3">
              <StartChatButton
                productId={product.id}
                sellerId={product.user_id}
                sellerName={product.profiles?.name || undefined}
                className="flex-1 px-4 py-2 border border-gray-300 text-black text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              />
              <button className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Buy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Standard Bottom Navigation */}
        <Navigation />
      </div>
    </SaveProvider>
  );
}