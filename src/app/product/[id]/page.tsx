import { createClient } from '@/integrations/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import SaveProvider from '@/components/SaveProvider';
import { getServerSideSaveData } from '@/lib/saves-server';
import { Heart, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import ProductActions from '@/components/ProductActions';
import BrandHeader from '@/components/feed/BrandHeader';

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

  // Real data from database
  const sellerName = kycData?.business_name || product.profiles?.name || product.profiles?.handle || 'EthniqRootz';
  const sellerHandle = product.profiles?.handle || 'unknown';
  
  // Seller phone number (would come from seller profile in real app)
  const sellerPhone = '+2349012345678'; // This would be fetched from seller profile
  
  // WhatsApp chat URL
  const whatsappMessage = `Hi! I'm interested in this product: ${product.title} - £${(product.price_pence / 100).toFixed(2)}. Can you tell me more about it?`;
  const whatsappUrl = `https://wa.me/${sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
  
  // Premium features (would come from seller subscription in real app)
  const isPremiumSeller = false; // Default to false, would be fetched from seller profile
  const hasPaymentIntegration = isPremiumSeller;

  // Real data - no mock data needed

  // Common seller data object
  const sellerData = {
    user_id: product.user_id,
    handle: product.profiles?.handle,
    name: product.profiles?.name,
    avatar_url: product.profiles?.avatar_url,
    business_name: kycData?.business_name,
    business_logo_url: kycData?.business_logo_url
  };

  // Common product status component
  const ProductStatus = () => (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        product.status === 'AVAILABLE' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {product.status === 'AVAILABLE' ? 'Available' : 'Unavailable'}
      </span>
      {product.category && (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {product.category}
        </span>
      )}
    </div>
  );

  // Common product images component
  const ProductImages = ({ isMobile = false, isTablet = false }) => {
    if (isMobile || isTablet) {
      return (
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div key={index} className={`flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden ${
                  isMobile ? 'w-80 aspect-[5/5]' : 'w-96 aspect-[4/5]'
                }`}>
                  <ProductImage
                    imageUrl={getImageUrl(image)}
                    title={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${
                isMobile ? 'w-80 aspect-[5/5]' : 'w-96 aspect-[4/5]'
              }`}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">No images available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Desktop layout
    return (
      <div className="space-y-4">
        {/* Main Product Image */}
        <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <ProductImage
              imageUrl={getImageUrl(product.images[0])}
              title={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">No images available</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Image Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-2">
            {product.images.slice(0, 4).map((image, index) => (
              <div key={index} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <ProductImage
                  imageUrl={getImageUrl(image)}
                  title={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        <div className="flex justify-center space-x-2">
          <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <SaveProvider 
      productId={product.id}
      initialSaveCount={saveData.saveCount}
      initialIsSaved={saveData.isSaved}
    >
      <div className="min-h-screen bg-white">
        {/* TopBar */}
        <TopBar user={user} showSearch={false} showUserMenu={!!user} />
        
        {/* Mobile & Tablet Layout */}
        <div className="block lg:hidden pt-28">
          {/* Brand Header */}
          <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <BrandHeader
                seller={sellerData}
                rating={4.0}
                reviewCount={0}
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <ProductImages isMobile={true} />
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white px-4 py-6 pb-32">
            <div className="max-w-7xl mx-auto">
              {/* Product Title */}
              <h2 className="text-sm font-medium text-slate-900 mb-2">{product.title}</h2>
              
              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-sm font-semibold text-slate-900">£{(product.price_pence / 100).toFixed(2)}</span>
              </div>
              
              {/* Product Status */}
              <div className="mb-6">
                <ProductStatus />
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h3 className="text-xs font-medium text-slate-900 mb-3">Description</h3>
                  <p className="text-slate-600 leading-relaxed text-xs">{product.description}</p>
                </div>
              )}

              {/* Location */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-8">
                <span>{product.city}{product.postcode && `, ${product.postcode}`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Ecommerce Style */}
        <div className="hidden lg:block pt-28">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Product Images */}
              <ProductImages />

              {/* Right Column - Product Information */}
              <div className="space-y-6">
                {/* Brand & Product Title */}
                <div className="space-y-2">
                  <BrandHeader
                    seller={sellerData}
                    rating={4.0}
                    reviewCount={0}
                  />
                  <h1 className="text-2xl font-semibold text-slate-900">{product.title}</h1>
                </div>
                
                {/* Wishlist Icon */}
                <div className="flex justify-end">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                
                {/* Pricing */}
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-slate-900">£{(product.price_pence / 100).toFixed(2)}</span>
                </div>
                
                {/* Product Status */}
                <ProductStatus />
                
                {/* Product Location */}
                {product.city && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>📍</span>
                    <span>{product.city}</span>
                    {product.postcode && <span>({product.postcode})</span>}
                  </div>
                )}
                
                {/* Action Buttons */}
                <ProductActions 
                  whatsappUrl={whatsappUrl}
                  hasPaymentIntegration={hasPaymentIntegration}
                />
                
                {/* Description */}
                {product.description && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-900">Description</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {product.description}
                    </p>
                    <button className="text-sm text-[#1aa1aa] hover:underline">
                      View more
                    </button>
                  </div>
                )}
                
                {/* Premium Features Info */}
                {!isPremiumSeller && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-900">Upgrade to Premium</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            This seller can upgrade to enable secure payments, customer reviews, and trusted badge.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Links */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <Link href={`/seller/${product.profiles?.handle}`} className="text-sm text-slate-500 hover:underline block">
                    More details at {sellerName}
                  </Link>
                  <Link href="#" className="text-sm text-slate-500 hover:underline block">
                    Shipping Policy
                  </Link>
                  <Link href="#" className="text-sm text-slate-500 hover:underline block">
                    Refund Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Buy Button - Mobile & Tablet */}
        <div className="fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-40 lg:hidden">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <ProductActions 
              whatsappUrl={whatsappUrl}
              hasPaymentIntegration={hasPaymentIntegration}
              isMobile={true}
            />
          </div>
        </div>
        
        {/* Standard Bottom Navigation */}
        <Navigation />
      </div>
    </SaveProvider>
  );
}