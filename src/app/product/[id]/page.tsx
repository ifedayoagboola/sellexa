import { createClient } from '@/integrations/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import SaveProvider from '@/components/SaveProvider';
import { getServerSideSaveData } from '@/lib/saves-server';
import { Shield } from 'lucide-react';
import ProductActions from '@/components/ProductActions';
import BrandHeader from '@/components/feed/BrandHeader';
import DesktopProductGallery from '@/components/DesktopProductGallery';
import ExpandableDescription from '@/components/ExpandableDescription';

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
  let kycData: { business_name?: string; business_logo_url?: string; business_whatsapp?: string } | null = null;
  if (product?.user_id) {
    try {
      const { data: kyc, error: kycError } = await supabase
        .from('profiles')
        .select('business_name, business_logo_url, business_whatsapp')
        .eq('id', product.user_id)
        .single();
      
      if (!kycError && kyc && typeof kyc === 'object') {
        kycData = kyc as { business_name?: string; business_logo_url?: string; business_whatsapp?: string };
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
  const sellerName = kycData?.business_name || product.profiles?.name || product.profiles?.handle || 'Sellexa';
  const sellerHandle = product.profiles?.handle || 'unknown';
  
  // Seller WhatsApp number from business profile
  const sellerPhone = kycData?.business_whatsapp;
  
  // WhatsApp chat URL - only create if we have a valid WhatsApp number
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sellexa.app'}/product/${product.id}`;
  const whatsappMessage = `🏪 *Sellexa Customer Inquiry*

Hi! I found your product on Sellexa and I'm interested in purchasing:

📦 *Product:* ${product.title}
💰 *Price:* £${(product.price_pence / 100).toFixed(2)}
🔗 *Link:* ${productUrl}

I'd like to know more about:
• Availability & shipping
• Product details & condition  
• Payment & delivery options
• Any additional information

Looking forward to hearing from you!

*Sent via Sellexa* 🛍️`;
  
  const whatsappUrl = sellerPhone ? `https://wa.me/${sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}` : null;
  
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

  // Mobile/Tablet product images component
  const MobileProductImages = () => (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
        {product.images && product.images.length > 0 ? (
          product.images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-80 aspect-[5/5] bg-slate-100 rounded-lg overflow-hidden">
              <ProductImage
                imageUrl={getImageUrl(image)}
                title={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="w-80 aspect-[5/5] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">No images available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <SaveProvider 
      productId={product.id}
      initialSaveCount={saveData.saveCount}
      initialIsSaved={saveData.isSaved}
    >
      <div className="min-h-screen bg-white">
        {/* TopBar */}
        <TopBar showSearch={false} showUserMenu={!!user} />
        
        {/* Mobile & Tablet Layout */}
        <div className="block lg:hidden pt-28 md:pt-40">
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
              <MobileProductImages />
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
        <div className="hidden lg:block pt-32 pb-8">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Product Images */}
              <DesktopProductGallery 
                images={product.images || []}
                title={product.title}
              />

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
                  productTitle={product.title}
                  productPrice={`£${(product.price_pence / 100).toFixed(2)}`}
                />
                
                {/* Description */}
                {product.description && (
                  <ExpandableDescription 
                    description={product.description}
                    characterLimit={150}
                  />
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
              productTitle={product.title}
              productPrice={`£${(product.price_pence / 100).toFixed(2)}`}
            />
          </div>
        </div>
        
        {/* Standard Bottom Navigation */}
        <div className="lg:hidden">
          <Navigation />
        </div>
      </div>
    </SaveProvider>
  );
}