'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Star,
  Instagram,
  Twitter,
  Facebook,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  MessageSquare,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSaves } from '@/hooks/useSaves';
import { useChat } from '@/hooks/useChat';
import { supabase } from '@/integrations/supabase/client';
import ProductImage from '@/components/ProductImage';

// Helper function to construct image URL
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Construct the full Supabase storage URL with correct bucket name
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/product-images/${imagePath}` : null;
};

interface Product {
  id: string;
  title: string;
  price_pence: number;
  status: string;
  images: string[];
  city: string;
  category: string;
  created_at: string;
  description?: string;
}

interface Seller {
  id: string;
  handle: string;
  name: string | null;
  avatar_url: string | null;
  city: string | null;
  postcode: string | null;
  created_at: string;
}

interface KYCData {
  kyc_status: string;
  business_name: string;
  business_description: string;
  business_logo_url: string;
  business_address: string;
  business_city: string;
  business_country: string;
  business_phone: string;
  business_website: string;
  business_instagram: string;
  business_twitter: string;
  business_facebook: string;
}

interface SellerCatalogueClientProps {
  seller: Seller;
  products: Product[];
  productCount: number;
  kycData?: KYCData | null;
}

export default function SellerCatalogueClient({ 
  seller, 
  products, 
  productCount,
  kycData 
}: SellerCatalogueClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { toggleSave, isProductSaved, getSaveCount } = useSaves();
  const { createNewThread } = useChat(user?.id);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      setIsLoadingUser(true);
      // Use the imported supabase client
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoadingUser(false);
    };
    getUser();
  }, []);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => filterCategory === 'all' || product.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price_pence - b.price_pence;
        case 'price_high':
          return b.price_pence - a.price_pence;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  // Format price
  const formatPrice = (pence: number) => {
    return `£${(pence / 100).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle save product
  const handleSave = async (productId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    await toggleSave(productId);
  };

  // Handle start chat
  const handleStartChat = async (productId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    const thread = await createNewThread(productId, seller.id);
    if (thread) {
      router.push(`/inbox?thread=${thread.id}`);
    }
  };

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${seller.name || seller.handle}'s Shop`,
          text: `Check out ${seller.name || seller.handle}'s amazing products!`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Social sharing
  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${seller.name || seller.handle}'s amazing products!`);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900">
                {seller.name || seller.handle}'s Shop
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="text-gray-600 hover:text-gray-900"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-gray-600 hover:text-gray-900"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Seller Avatar */}
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl">
                {seller.avatar_url ? (
                  <img
                    src={seller.avatar_url}
                    alt={seller.name || seller.handle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {(seller.name || seller.handle).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>

            {/* Seller Info */}
            <div className="mt-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                {kycData?.business_name || seller.name || seller.handle}
              </h1>
              <p className="text-xl text-purple-100 mb-4">@{seller.handle}</p>
              
              {(kycData?.business_city || seller.city) && (
                <div className="flex items-center justify-center text-purple-100 mb-6">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{kycData?.business_city || seller.city}</span>
                  {kycData?.business_country && (
                    <span>, {kycData.business_country}</span>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{productCount}</div>
                  <div className="text-purple-100 text-sm">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(Math.random() * 100) + 50}
                  </div>
                  <div className="text-purple-100 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(Math.random() * 50) + 20}
                  </div>
                  <div className="text-purple-100 text-sm">Sales</div>
                </div>
              </div>

              {/* Social Media Links */}
              {(kycData?.business_website || kycData?.business_instagram || kycData?.business_twitter || kycData?.business_facebook) && (
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {kycData.business_website && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <a href={kycData.business_website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    </Button>
                  )}
                  {kycData.business_instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <a href={`https://instagram.com/${kycData.business_instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4 mr-1" />
                        Instagram
                      </a>
                    </Button>
                  )}
                  {kycData.business_twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <a href={`https://twitter.com/${kycData.business_twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4 mr-1" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {kycData.business_facebook && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <a href={kycData.business_facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4 mr-1" />
                        Facebook
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Follow
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(category)}
                  className={filterCategory === category 
                    ? "bg-purple-600 text-white" 
                    : "text-gray-600 hover:text-gray-900"
                  }
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {filterCategory === 'all' 
                ? 'This seller hasn\'t added any products yet.' 
                : `No products found in the ${filterCategory} category.`
              }
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                isSaved={isProductSaved(product.id)}
                onSave={() => handleSave(product.id)}
                onStartChat={() => handleStartChat(product.id)}
                formatPrice={formatPrice}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share this shop</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => shareToSocial('twitter')}
              >
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => shareToSocial('facebook')}
              >
                <Facebook className="h-4 w-4 mr-2" />
                Share on Facebook
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleShare}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowShareModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  viewMode, 
  isSaved, 
  onSave, 
  onStartChat, 
  formatPrice, 
  formatDate 
}: {
  product: Product;
  viewMode: 'grid' | 'list';
  isSaved: boolean;
  onSave: () => void;
  onStartChat: () => void;
  formatPrice: (pence: number) => string;
  formatDate: (date: string) => string;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (viewMode === 'list') {
    return (
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex space-x-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <ProductImage
                imageUrl={getImageUrl(product.images[0])}
                title={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
            <p className="text-lg font-bold text-purple-600">{formatPrice(product.price_pence)}</p>
            <p className="text-sm text-gray-500">{product.city} • {formatDate(product.created_at)}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className={isSaved ? "text-red-600 border-red-600" : ""}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onStartChat}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {product.images && product.images.length > 0 ? (
            <ProductImage
              imageUrl={getImageUrl(product.images[currentImageIndex])}
              title={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Image Navigation */}
          {product.images && product.images.length > 1 && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-between px-2">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => 
                    prev === 0 ? product.images.length - 1 : prev - 1
                  );
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => 
                    prev === product.images.length - 1 ? 0 : prev + 1
                  );
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current text-red-600" : ""}`} />
          </Button>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {product.title}
            </h3>
            <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
              {product.category}
            </Badge>
          </div>
          
          <p className="text-lg font-bold text-purple-600 mb-2">
            {formatPrice(product.price_pence)}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{product.city}</span>
            <span className="mx-1">•</span>
            <span>{formatDate(product.created_at)}</span>
          </div>
          
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={onStartChat}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Seller
          </Button>
        </div>
      </div>
    </Card>
  );
}
