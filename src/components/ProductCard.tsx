'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShareIcon, MapPinIcon } from '@heroicons/react/24/outline';
import ProductImage from './ProductImage';
import SaveButton from './SaveButton';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price_pence: number;
    status: 'AVAILABLE' | 'RESTOCKING' | 'SOLD';
    images: string[];
    city: string | null;
    category: string;
    profiles?: {
      handle: string;
      name: string | null;
      avatar_url: string | null;
    } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isSharing, setIsSharing] = useState(false);

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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSharing) return;
    
    setIsSharing(true);
    
    try {
      const productUrl = `${window.location.origin}/product/${product.id}`;
      const shareData = {
        title: product.title,
        text: `Check out this ${product.category} on EthniqRootz: ${product.title}`,
        url: productUrl,
      };

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(productUrl);
      }
    } catch (error) {
      console.error('Error sharing product:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500 text-white';
      case 'RESTOCKING':
        return 'bg-amber-500 text-white';
      case 'SOLD':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Available';
      case 'RESTOCKING':
        return 'Restocking';
      case 'SOLD':
        return 'Sold';
      default:
        return status;
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 active:scale-[0.98]">
        {/* Product Image */}
        <div className="aspect-[4/5] relative overflow-hidden">
          <ProductImage
            imageUrl={getImageUrl(product.images[0])}
            title={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 sm:from-black/20 via-transparent to-transparent" />
          
          {/* Status Badge - Top Left */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)} shadow-lg`}>
              {getStatusText(product.status)}
            </span>
          </div>
          
          {/* Action Icons - Top Right */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col space-y-1.5 sm:space-y-2">
            <SaveButton
              productId={product.id}
              productTitle={product.title}
              variant="icon-only"
              showToast={false}
              className="flex items-center justify-center p-1.5 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 active:scale-95"
            />
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center justify-center p-1.5 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Share product"
            >
              {isSharing ? (
                <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShareIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-700" />
              )}
            </button>
          </div>
          
          {/* Price - Bottom Left */}
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
            <div className="bg-white/95 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl shadow-lg">
              <span className="text-sm sm:text-lg font-bold text-gray-900">
                £{(product.price_pence / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2 min-h-[1rem] sm:min-h-[1rem]">
            {product.title}
          </h3>
          
          {/* Location and Category */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-3 w-3" />
              <span className="truncate text-xs">{product.city || 'Location'}</span>
            </div>
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 text-gray-600 rounded-full font-medium capitalize text-xs">
              {product.category.toLowerCase()}
            </span>
          </div>
          
          {/* Seller Info (if available) */}
          {product.profiles && (
            <div className="flex items-center space-x-1.5 sm:space-x-2 pt-0.5 sm:pt-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {product.profiles.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-xs text-gray-500 truncate">
                @{product.profiles.handle}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
