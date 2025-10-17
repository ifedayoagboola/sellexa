'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  ShoppingBag, 
  Star,
  Instagram,
  Twitter,
  Facebook,
  Copy,
  MessageCircle,
  Globe,
  Phone,
  Shield,
  Truck,
  RefreshCw,
  Award,
  Share
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSaves } from '@/hooks/useSaves';
import { useChat } from '@/hooks/useChat';
import TopBar from '@/components/TopBar';
import ProductCard from '@/components/ProductCard';

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

interface CulturalStorefrontClientProps {
  seller: Seller;
  products: Product[];
  productCount: number;
  kycData?: KYCData | null;
  user?: any;
}

// Cultural pattern backgrounds
const culturalPatterns = [
  'bg-gradient-to-br from-red-500 via-yellow-500 to-green-500', // Nigerian flag colors
  'bg-gradient-to-br from-red-500 via-yellow-500 to-black', // Ghana flag colors
  'bg-gradient-to-br from-green-500 to-yellow-500', // Kenya flag colors
  'bg-gradient-to-br from-orange-500 via-white to-green-500', // India flag colors
  'bg-gradient-to-br from-blue-500 via-white to-red-500', // French flag colors
  'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500', // Creative blend
  'bg-gradient-to-br from-teal-500 via-blue-500 to-purple-500', // Ocean blend
  'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500', // Sunset blend
];

// Cultural patterns with geometric designs
const culturalPatternStyles = [
  'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]',
  'bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)]',
  'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]',
  'bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)]',
];

export default function CulturalStorefrontClient({ 
  seller, 
  products, 
  productCount,
  kycData,
  user
}: CulturalStorefrontClientProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const { toggleSave } = useSaves();
  const { createNewThread } = useChat(user?.id);

  // Helper function to create contact item
  const createContactItem = (icon: React.ReactNode, label: string, content: React.ReactNode, bgColor: string, textColor: string) => (
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {content}
      </div>
    </div>
  );

  // Helper function to create social media link
  const createSocialLink = (href: string, icon: React.ReactNode, bgColor: string, hoverColor: string) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center hover:${hoverColor} transition-colors`}
    >
      {icon}
    </a>
  );

  // Helper function to create benefit item
  const createBenefitItem = (icon: React.ReactNode, title: string, description: string, bgColor: string, iconColor: string) => (
    <div className="flex items-start space-x-4">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );

  // Get cultural pattern based on seller's location or deterministic hash
  const getCulturalPattern = () => {
    if (seller.city?.toLowerCase().includes('nigeria')) return culturalPatterns[0];
    if (seller.city?.toLowerCase().includes('ghana')) return culturalPatterns[1];
    if (seller.city?.toLowerCase().includes('kenya')) return culturalPatterns[2];
    // Use seller ID to create deterministic pattern selection
    const hash = seller.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return culturalPatterns[Math.abs(hash) % culturalPatterns.length];
  };

  const getPatternStyle = () => {
    // Use seller ID to create deterministic pattern style selection
    const hash = seller.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return culturalPatternStyles[Math.abs(hash) % culturalPatternStyles.length];
  };

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
      const searchMatch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && availabilityMatch && searchMatch;
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
          title: `${seller.name || seller.handle}'s Cultural Storefront`,
          text: `Discover authentic cultural products from ${seller.name || seller.handle}'s store!`,
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
    const text = encodeURIComponent(`Check out ${seller.name || seller.handle}'s amazing cultural storefront!`);
    
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* TopBar */}
      <TopBar 
        showSearch={false} 
        showUserMenu={!!user} 
        sellerInfo={sellerData}
      />
      
      {/* Banner */}
      <div className="relative h-96 overflow-hidden bg-gradient-to-br from-[#1aa1aa] via-[#158a8f] to-[#0f6b6f]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundAttachment: 'fixed'
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1aa1aa]/80 via-[#158a8f]/70 to-[#0f6b6f]/80"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Business Info */}
              <div className="flex-1 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {kycData?.business_name || seller.name || seller.handle}
                </h1>
                <div className="flex items-center space-x-4 text-white/90 mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm md:text-base">{kycData?.business_city || kycData?.business_country || seller.city || 'Global'}</span>
                  </div>
                </div>
                {kycData?.business_description && (
                  <p className="text-white/80 text-sm md:text-base max-w-2xl leading-relaxed line-clamp-2">
                    {kycData.business_description.length > 120 
                      ? `${kycData.business_description.substring(0, 120)}...` 
                      : kycData.business_description
                    }
                  </p>
                )}
              </div>

              {/* Share Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-all"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0 w-full">
            {/* Search */}
            <div className="flex-1 max-w-md mb-2 sm:mb-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${kycData?.business_name || seller.name || seller.handle}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-10 pr-4 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1aa1aa] focus:bg-white transition-all placeholder-gray-500 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-y-2">
              {/* Category Filter */}
              <div className="flex space-x-1 sm:space-x-2 flex-wrap">
                {categories.slice(0, 4).map(category => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      filterCategory === category
                        ? 'bg-[#1aa1aa] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
                {categories.length > 4 && (
                  <button className="px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                    +{categories.length - 4}
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 sm:px-3 py-1.5 bg-gray-100 border-0 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#1aa1aa]"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <span className="text-sm text-gray-500">{filteredProducts.length} items</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {filterCategory === 'all' && filterAvailability === 'all'
                  ? 'This seller hasn\'t added any products yet.' 
                  : 'No products found matching the current filters.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
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

      {/* Contact Information & Why Shop With Us */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                {kycData?.business_phone && createContactItem(
                  <Phone className="h-5 w-5 text-[#1aa1aa]" />,
                  'Phone',
                  <a href={`tel:${kycData.business_phone}`} className="text-sm text-[#1aa1aa] hover:underline">
                    {kycData.business_phone}
                  </a>,
                  'bg-[#1aa1aa]/10',
                  'text-[#1aa1aa]'
                )}
                
                {kycData?.business_whatsapp && createContactItem(
                  <MessageCircle className="h-5 w-5 text-green-600" />,
                  'WhatsApp',
                  <a 
                    href={`https://wa.me/${kycData.business_whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:underline"
                  >
                    {kycData.business_whatsapp}
                  </a>,
                  'bg-green-100',
                  'text-green-600'
                )}
                
                {kycData?.business_website && createContactItem(
                  <Globe className="h-5 w-5 text-blue-600" />,
                  'Website',
                  <a 
                    href={kycData.business_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>,
                  'bg-blue-100',
                  'text-blue-600'
                )}
                
                {createContactItem(
                  <MapPin className="h-5 w-5 text-gray-600" />,
                  'Location',
                  <p className="text-sm text-gray-600">
                    {kycData?.business_city || kycData?.business_country || seller.city || 'Global'}
                  </p>,
                  'bg-gray-100',
                  'text-gray-600'
                )}
              </div>
              
              {/* Social Media Links */}
              {(kycData?.business_instagram || kycData?.business_twitter || kycData?.business_facebook) && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {kycData?.business_instagram && createSocialLink(
                      `https://instagram.com/${kycData.business_instagram.replace('@', '')}`,
                      <Instagram className="h-5 w-5 text-pink-600" />,
                      'bg-pink-100',
                      'bg-pink-200'
                    )}
                    {kycData?.business_twitter && createSocialLink(
                      `https://twitter.com/${kycData.business_twitter.replace('@', '')}`,
                      <Twitter className="h-5 w-5 text-blue-600" />,
                      'bg-blue-100',
                      'bg-blue-200'
                    )}
                    {kycData?.business_facebook && createSocialLink(
                      kycData.business_facebook,
                      <Facebook className="h-5 w-5 text-blue-600" />,
                      'bg-blue-100',
                      'bg-blue-200'
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Why Shop With Us */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Shop With Us</h2>
              
              <div className="space-y-6">
                {createBenefitItem(
                  <Shield className="h-6 w-6 text-[#1aa1aa]" />,
                  'Verified Seller',
                  'We are a verified business with authentic products and reliable service. Shop with confidence knowing you\'re dealing with a trusted seller.',
                  'bg-[#1aa1aa]/10',
                  'text-[#1aa1aa]'
                )}
                
                {createBenefitItem(
                  <Truck className="h-6 w-6 text-green-600" />,
                  'Fast & Secure Delivery',
                  'We ensure your orders are packaged carefully and delivered quickly. Track your shipment every step of the way.',
                  'bg-green-100',
                  'text-green-600'
                )}
                
                {createBenefitItem(
                  <RefreshCw className="h-6 w-6 text-purple-600" />,
                  'Easy Returns',
                  'Not satisfied? We offer hassle-free returns within 30 days. Your satisfaction is our priority.',
                  'bg-purple-100',
                  'text-purple-600'
                )}
                
                {createBenefitItem(
                  <Award className="h-6 w-6 text-yellow-600" />,
                  'Quality Guarantee',
                  'Every product is carefully selected and quality-checked. We stand behind the authenticity and quality of our cultural items.',
                  'bg-yellow-100',
                  'text-yellow-600'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What Customers Say */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Real feedback from customers who love our products and service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Aisha Johnson",
                location: "London, UK",
                rating: 5,
                comment: "Amazing quality products! The cultural authenticity really shows in every piece. Highly recommend!",
                avatar: "AJ",
                verified: true
              },
              {
                name: "Kwame Asante", 
                location: "Birmingham, UK",
                rating: 5,
                comment: "Fast delivery and excellent customer service. The products exceeded my expectations.",
                avatar: "KA",
                verified: true
              },
              {
                name: "Fatima Hassan",
                location: "Manchester, UK", 
                rating: 4,
                comment: "Beautiful designs and great value for money. Will definitely order again!",
                avatar: "FH",
                verified: false
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1aa1aa] to-[#158a8f] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      {testimonial.verified && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i + testimonial.rating} className="w-5 h-5 text-gray-300" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 leading-relaxed">
                  "{testimonial.comment}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share this cultural storefront</h3>
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
