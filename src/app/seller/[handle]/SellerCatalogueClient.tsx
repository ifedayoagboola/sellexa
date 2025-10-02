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
import TopBar from '@/components/TopBar';

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
  user?: any;
}

export default function SellerCatalogueClient({ 
  seller, 
  products, 
  productCount,
  kycData,
  user
}: SellerCatalogueClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { toggleSave, isProductSaved, getSaveCount } = useSaves();
  const { createNewThread } = useChat(user?.id);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* TopBar */}
      <TopBar user={user} showSearch={false} showUserMenu={!!user} />
      {/* Header - Fashion Nova Style */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            {/* Brand Section - Mobile */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* Logo */}
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {(kycData?.business_name || seller.name || seller.handle).substring(0, 2).toUpperCase()}
                  </span>
                </div>
                
                {/* Brand Info */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-bold text-slate-900 truncate">
                    {kycData?.business_name || seller.name || seller.handle}
                  </h1>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-slate-600 ml-1">4.8</span>
                    </div>
                    <span className="text-xs text-slate-500">({Math.floor(Math.random() * 1000) + 100})</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons - Mobile */}
              <div className="flex items-center space-x-2">
                <Button size="sm" className="bg-slate-700 text-white hover:bg-slate-800 px-3 py-1.5 text-xs">
                  Follow
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Search Bar - Mobile */}
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`Search ${(kycData?.business_name || seller.name || seller.handle).substring(0, 15)}...`}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1aa1aa] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            {/* Brand Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {(kycData?.business_name || seller.name || seller.handle).substring(0, 2).toUpperCase()}
                  </span>
                </div>
                
                {/* Brand Info */}
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {kycData?.business_name || seller.name || seller.handle}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                    <span className="text-sm text-gray-500">({Math.floor(Math.random() * 1000) + 100} reviews)</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2">
                  Follow
                </Button>
                <Button variant="outline" className="px-6 py-2">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit online store
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`Search ${kycData?.business_name || seller.name || seller.handle}...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section - Fashion Nova Style */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            {/* Products Header - Mobile */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Products</h2>
              <span className="text-sm text-gray-500">{productCount} items</span>
            </div>
            
            {/* Filter Row - Mobile */}
            <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
              {/* Filter Button */}
              <Button variant="outline" size="sm" className="flex items-center whitespace-nowrap">
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filter
              </Button>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-nowrap"
              >
                <option value="newest">Sort by</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
              
              {/* On Sale Button */}
              <Button 
                variant={filterCategory === 'sale' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterCategory(filterCategory === 'sale' ? 'all' : 'sale')}
                className={`whitespace-nowrap ${filterCategory === 'sale' ? 'bg-purple-600 text-white' : ''}`}
              >
                On sale
              </Button>
              
              {/* Price Filter */}
              <select className="border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-nowrap">
                <option>Price</option>
                <option>Under £20</option>
                <option>£20 - £50</option>
                <option>£50 - £100</option>
                <option>Over £100</option>
              </select>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            {/* Products Header with Filters */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              
              {/* Filter and Sort Options */}
              <div className="flex items-center space-x-4">
                {/* Filter Button */}
                <Button variant="outline" size="sm" className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  Filter
                </Button>
                
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="newest">Sort by</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
                
                {/* On Sale Button */}
                <Button 
                  variant={filterCategory === 'sale' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterCategory(filterCategory === 'sale' ? 'all' : 'sale')}
                  className={filterCategory === 'sale' ? 'bg-purple-600 text-white' : ''}
                >
                  On sale
                </Button>
                
                {/* Price Filter */}
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Price</option>
                  <option>Under £20</option>
                  <option>£20 - £50</option>
                  <option>£50 - £100</option>
                  <option>Over £100</option>
                </select>
                
                {/* In Stock Button */}
                <Button variant="outline" size="sm">
                  In-stock
                </Button>
                
                {/* Product Count */}
                <span className="text-sm text-gray-500">{productCount} products</span>
              </div>
            </div>
          </div>

          {/* Products Grid - Fashion Nova Style */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-sm sm:text-base text-gray-500">
                {filterCategory === 'all' 
                  ? 'This seller hasn\'t added any products yet.' 
                  : `No products found in the ${filterCategory} category.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  {/* Product Image */}
                  <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg mb-2 sm:mb-3">
                    {product.images && product.images.length > 0 ? (
                      <ProductImage
                        imageUrl={getImageUrl(product.images[0])}
                        title={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {Math.random() > 0.7 && (
                      <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-pink-600 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                        {Math.floor(Math.random() * 50) + 20}% off
                      </div>
                    )}
                    
                    {/* Heart Icon */}
                    <button
                      onClick={() => handleSave(product.id)}
                      className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${user && isProductSaved(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {product.title}
                    </h3>
                    
                    {/* Rating - Hidden on mobile to save space */}
                    {Math.random() > 0.5 && (
                      <div className="hidden sm:flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({Math.floor(Math.random() * 500) + 50})</span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        {formatPrice(product.price_pence)}
                      </span>
                      {Math.random() > 0.7 && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.price_pence * 1.5)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
