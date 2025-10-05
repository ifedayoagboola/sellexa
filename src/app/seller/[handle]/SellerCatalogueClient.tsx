'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Share2, 
  MapPin, 
  ShoppingBag, 
  Star,
  Instagram,
  Twitter,
  Facebook,
  Copy,
  ExternalLink,
  MessageSquare,
  MessageCircle,
  Globe,
  Phone,
  Mail,
  Shield,
  Truck,
  RefreshCw,
  Award,
  Users,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSaves } from '@/hooks/useSaves';
import { useChat } from '@/hooks/useChat';
import { supabase } from '@/integrations/supabase/client';
import ProductImage from '@/components/ProductImage';
import TopBar from '@/components/TopBar';
import ProductCard from '@/components/ProductCard';

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
  status: "AVAILABLE" | "RESTOCKING" | "SOLD";
  images: string[];
  city: string | null;
  category: string;
  created_at: string;
  description?: string | null;
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
  business_whatsapp: string;
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
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const { toggleSave, isProductSaved } = useSaves();
  const { createNewThread } = useChat(user?.id);

  // Get unique categories and availability statuses
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const availabilityOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'SOLD_OUT', label: 'Sold Out' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'INACTIVE', label: 'Inactive' }
  ];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const categoryMatch = filterCategory === 'all' || product.category === filterCategory;
      const availabilityMatch = filterAvailability === 'all' || product.status === filterAvailability;
      return categoryMatch && availabilityMatch;
    })
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
      instagram: `https://www.instagram.com/`,
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  // Seller data for TopBar
  const sellerData = {
    business_name: kycData?.business_name,
    business_logo_url: kycData?.business_logo_url,
    name: seller.name || undefined,
    handle: seller.handle
  };

  return (
    <div className="min-h-screen bg-white">
      {/* TopBar */}
      <TopBar 
        showSearch={false} 
        showUserMenu={!!user} 
        sellerInfo={sellerData}
      />
      
      {/* Mobile & Tablet Layout */}
      <div className="block lg:hidden pt-28 md:pt-40">

        {/* Contact Section - Mobile */}
        <div className="bg-slate-50 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-medium text-slate-900 mb-4">Contact & Info</h2>
            <div className="space-y-3">
              {kycData?.business_phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-[#1aa1aa]" />
                  <span className="text-xs text-slate-600">{kycData.business_phone}</span>
                </div>
              )}
              {kycData?.business_whatsapp && (
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-[#1aa1aa]" />
                  <a 
                    href={`https://wa.me/${kycData.business_whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#1aa1aa] hover:underline"
                  >
                    WhatsApp: {kycData.business_whatsapp}
                  </a>
                </div>
              )}
              {kycData?.business_website && (
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-[#1aa1aa]" />
                  <a href={kycData.business_website} className="text-xs text-[#1aa1aa] hover:underline">
                    Visit Website
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[#1aa1aa]" />
                <span className="text-xs text-slate-600">{seller.city || 'Location not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Shop With Us - Mobile */}
        <div className="bg-white px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-medium text-slate-900 mb-4">Why Shop With Us</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Shield className="h-6 w-6 text-[#1aa1aa] mx-auto mb-2" />
                <p className="text-xs text-slate-600">Verified Seller</p>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-[#1aa1aa] mx-auto mb-2" />
                <p className="text-xs text-slate-600">Fast Delivery</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 text-[#1aa1aa] mx-auto mb-2" />
                <p className="text-xs text-slate-600">Easy Returns</p>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 text-[#1aa1aa] mx-auto mb-2" />
                <p className="text-xs text-slate-600">Quality Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section - Mobile */}
        <div className="bg-white px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-slate-900">Products</h2>
              <span className="text-xs text-slate-500">{filteredProducts.length} items</span>
            </div>
            
            {/* Filter Row */}
            <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-slate-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1aa1aa] whitespace-nowrap"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-slate-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1aa1aa] whitespace-nowrap"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="border border-slate-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1aa1aa] whitespace-nowrap"
              >
                {availabilityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-slate-900 mb-2">No products found</h3>
                <p className="text-xs text-slate-500">
                  {filterCategory === 'all' && filterAvailability === 'all'
                    ? 'This seller hasn\'t added any products yet.' 
                    : `No products found matching the current filters.`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Strategic Advert Section - Mobile */}
        <div className="bg-gradient-to-r from-[#1aa1aa] to-[#158a8f] px-4 py-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-sm font-bold text-white mb-2">Join Thousands of Happy Customers</h2>
            <p className="text-xs text-white/90 mb-4">
              Discover unique products from verified African sellers. Shop with confidence!
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-white/80">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>10K+ Buyers</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Verified Sellers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block pt-40 xl:pt-48">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Contact & Info */}
            <div className="lg:col-span-1 space-y-6">

              {/* Contact Section */}
              <Card className="p-6">
                <h3 className="text-sm font-medium text-slate-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {kycData?.business_phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-[#1aa1aa]" />
                      <span className="text-sm text-slate-600">{kycData.business_phone}</span>
                    </div>
                  )}
                  {kycData?.business_whatsapp && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-[#1aa1aa]" />
                      <a 
                        href={`https://wa.me/${kycData.business_whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#1aa1aa] hover:underline"
                      >
                        WhatsApp: {kycData.business_whatsapp}
                      </a>
                    </div>
                  )}
                  {kycData?.business_website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-[#1aa1aa]" />
                      <a href={kycData.business_website} className="text-sm text-[#1aa1aa] hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-[#1aa1aa]" />
                    <span className="text-sm text-slate-600">{seller.city || 'Location not specified'}</span>
                  </div>
                </div>
              </Card>

              {/* Why Shop With Us */}
              <Card className="p-6">
                <h3 className="text-sm font-medium text-slate-900 mb-4">Why Shop With Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-[#1aa1aa] mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Verified Seller</h4>
                      <p className="text-xs text-slate-600">Authentic products from verified sellers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="h-5 w-5 text-[#1aa1aa] mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Fast Delivery</h4>
                      <p className="text-xs text-slate-600">Quick and reliable shipping</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RefreshCw className="h-5 w-5 text-[#1aa1aa] mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Easy Returns</h4>
                      <p className="text-xs text-slate-600">Hassle-free return policy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="h-5 w-5 text-[#1aa1aa] mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Quality Products</h4>
                      <p className="text-xs text-slate-600">Curated selection of quality items</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Strategic Advert */}
              <Card className="p-6 bg-gradient-to-br from-[#1aa1aa] to-[#158a8f] text-white">
                <h3 className="text-sm font-bold text-white mb-2">Join Our Community</h3>
                <p className="text-xs text-white/90 mb-4">
                  Discover unique products from verified African sellers. Shop with confidence and support local businesses.
                </p>
                <div className="space-y-2 text-xs text-white/80">
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3" />
                    <span>10,000+ Active Buyers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3" />
                    <span>100% Verified Sellers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-white text-[#1aa1aa] hover:bg-white/90"
                  onClick={() => router.push('/feed')}
                >
                  Explore More Sellers
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Card>
            </div>

            {/* Right Column - Products */}
            <div className="lg:col-span-3">
              {/* Products Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-slate-900">Products</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1aa1aa]"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1aa1aa]"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={filterAvailability}
                    onChange={(e) => setFilterAvailability(e.target.value)}
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1aa1aa]"
                  >
                    {availabilityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  <span className="text-sm text-slate-500">{filteredProducts.length} products</span>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
                  <p className="text-sm text-slate-500">
                    {filterCategory === 'all' && filterAvailability === 'all'
                      ? 'This seller hasn\'t added any products yet.' 
                      : `No products found matching the current filters.`
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
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

