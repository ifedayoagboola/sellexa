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
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, Minus, Plus, ThumbsUp, ExternalLink, ArrowRight } from 'lucide-react';

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
  const rating = 4.7;
  const reviewCount = Math.floor(Math.random() * 2000) + 100;
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '1X', '2X', '3X'];
  const selectedSize = 'S';
  const quantity = 1;

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: 'David',
      date: 'September 24, 2025',
      rating: 5,
      title: 'Little Yellows',
      body: 'Great product, works as expected. Would definitely recommend to others.',
      helpful: 12
    },
    {
      id: 2,
      name: 'Sarah',
      date: 'September 20, 2025',
      rating: 4,
      title: 'Good product',
      body: 'Good quality and fast shipping. The product arrived in perfect condition...',
      helpful: 8
    },
    {
      id: 3,
      name: 'Mike',
      date: 'September 18, 2025',
      rating: 2,
      title: 'Not for me',
      body: 'Didn\'t work as expected for my needs. Quality seems okay but...',
      helpful: 3
    }
  ];

  // Mock seller products for recommendations
  const sellerProducts = [
    { id: '1', title: 'Lion\'s Mane Focus+', price: 11.99, discount: 20, image: '/api/placeholder/150/200' },
    { id: '2', title: 'Mg Glycinate 3-in-1', price: 9.99, discount: 29, image: '/api/placeholder/150/200' },
    { id: '3', title: 'Vitamin D3 + K2', price: 6.99, discount: 22, image: '/api/placeholder/150/200' },
    { id: '4', title: 'Collagen Glow Up', price: 16.99, discount: 12, image: '/api/placeholder/150/200' },
    { id: '5', title: 'Vegan Immunity Bundle', price: 24.99, discount: 33, image: '/api/placeholder/150/200' },
    { id: '6', title: 'The Glow Up Bundle', price: 19.99, discount: 15, image: '/api/placeholder/150/200' }
  ];

  return (
    <SaveProvider 
      productId={product.id}
      initialSaveCount={saveData.saveCount}
      initialIsSaved={saveData.isSaved}
    >
      <div className="min-h-screen bg-white">
        {/* TopBar */}
        <TopBar user={user} showSearch={false} showUserMenu={!!user} />
        
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Brand Header - Mobile */}
          <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
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
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Visit store
                </Link>
              </div>
            </div>
          </div>

          {/* Product Images - Mobile */}
          <div className="bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Main Product Images */}
                {product.images && product.images.length > 0 ? (
                  product.images.slice(0, 2).map((image, index) => (
                    <div key={index} className="aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden">
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

          {/* Product Information - Mobile */}
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
                  {reviewCount} ratings
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
        </div>

        {/* Tablet and Desktop Layout - Two Column */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Product Images */}
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

              {/* Right Column - Product Information */}
              <div className="space-y-6">
                {/* Brand & Product Title */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      {kycData?.business_logo_url ? (
                        <img 
                          src={kycData.business_logo_url} 
                          alt="Business logo" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-gray-600">
                          {(kycData?.business_name || product.profiles?.name || 'ER').substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {kycData?.business_name || product.profiles?.name || 'EthniqRootz'}
            </span>
                  </div>
                  <h1 className="text-2xl font-bold text-black">{product.title}</h1>
                </div>
                
                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{reviewCount} ratings</span>
                </div>
                
                {/* Wishlist Icon */}
                <div className="flex justify-end">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                
                {/* Pricing */}
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-black">£{(product.price_pence / 100).toFixed(2)}</span>
                  <span className="text-lg text-gray-500 line-through">£{(originalPrice / 100).toFixed(2)}</span>
                </div>
                
                {/* Pack Options */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">Pack</h3>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 border-2 border-black text-black text-sm font-medium rounded-lg">
                      2 Months (1 pack)
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                      6 Months (3 packs)
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                      12 Months (6 packs)
                    </button>
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                      <Minus className="h-4 w-4" />
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      className="w-16 h-8 border border-gray-300 rounded-lg text-center text-sm"
                      readOnly
                    />
                    <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full py-3 bg-[#1aa1aa] text-white text-sm font-medium rounded-lg hover:bg-[#158a8f] transition-colors">
                    Add to cart
                  </button>
                  <button className="w-full py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    Buy now
                  </button>
                </div>
                
                {/* Description */}
                {product.description && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Description</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                    <button className="text-sm text-[#1aa1aa] hover:underline">
                      View more
                    </button>
                  </div>
                )}
                
                {/* Additional Links */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <Link href={`/seller/${product.profiles?.handle}`} className="text-sm text-gray-600 hover:underline block">
                    More details at {kycData?.business_name || product.profiles?.name || 'EthniqRootz'}
                  </Link>
                  <Link href="#" className="text-sm text-gray-600 hover:underline block">
                    Shipping Policy
                  </Link>
                  <Link href="#" className="text-sm text-gray-600 hover:underline block">
                    Refund Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews and Recommendations Section - Tablet and Desktop */}
        <div className="hidden md:block bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reviews Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-black">Ratings and reviews</h2>
                </div>
                
                {/* Overall Rating */}
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-black">{rating}</div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </div>
                    <div className="text-sm text-gray-600">{reviewCount.toLocaleString()} ratings</div>
                  </div>
                  
                  {/* Rating Distribution */}
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = stars === 5 ? Math.floor(reviewCount * 0.8) : 
                                   stars === 4 ? Math.floor(reviewCount * 0.1) : 
                                   stars === 3 ? Math.floor(reviewCount * 0.05) : 
                                   stars === 2 ? Math.floor(reviewCount * 0.03) : 
                                   Math.floor(reviewCount * 0.02);
                      const percentage = (count / reviewCount) * 100;
                      
                      return (
                        <div key={stars} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 w-8">{stars}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Individual Reviews */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-black">{review.title}</span>
                        </div>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                          <ThumbsUp className="h-3 w-3" />
                          <span className="text-xs">Helpful</span>
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {review.name} · {review.date}
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{review.body}</p>
                    </div>
                  ))}
                  
                  <div className="text-center">
                    <button className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Read more reviews
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Seller Information and More Products */}
              <div className="space-y-6">
                {/* Seller Info */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="space-y-4">
                    <Link 
                      href={`/seller/${product.profiles?.handle}`} 
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm">More details at {kycData?.business_name || product.profiles?.name || 'EthniqRootz'}</span>
                    </Link>
                    
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                        Shipping Policy
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                        Refund Policy
                      </button>
                    </div>
                    
                    {/* Seller Products Preview */}
                    <div className="flex -space-x-2">
                      {sellerProducts.slice(0, 4).map((item, index) => (
                        <div key={item.id} className="w-12 h-16 bg-gray-200 rounded-lg border-2 border-white overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-[#1aa1aa]/20 to-[#1aa1aa]/40 flex items-center justify-center">
                            <span className="text-white text-xs font-bold text-center px-1">
                              {item.title.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">{kycData?.business_name || product.profiles?.name || 'EthniqRootz'}</div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">4.8 (17.4K)</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        Follow
            </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* More from this seller */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black">More from {kycData?.business_name || product.profiles?.name || 'EthniqRootz'}</h2>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors">
                  <span className="text-sm">View all</span>
                  <ArrowRight className="h-4 w-4" />
            </button>
              </div>
              
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                  {sellerProducts.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-48 bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="relative">
                        <div className="aspect-[3/4] bg-gradient-to-br from-[#1aa1aa]/20 to-[#1aa1aa]/40 flex items-center justify-center">
                          <span className="text-white text-sm font-bold text-center px-2">
                            {item.title}
                          </span>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
                            {item.discount}% off
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-black text-sm mb-1 line-clamp-2">{item.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-black">£{item.price.toFixed(2)}</span>
                          <span className="text-xs text-gray-500 line-through">£{(item.price * 1.3).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Overlay - Mobile only */}
        <div className="fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-40 md:hidden">
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