'use client';

import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SellerDropdown from '@/components/SellerDropdown';

interface BrandHeaderProps {
  seller: {
    user_id: string;
    handle?: string;
    name?: string | null;
    avatar_url?: string | null;
    business_name?: string | null;
    business_logo_url?: string | null;
  };
  rating: number;
  reviewCount: number;
  variant?: 'mobile' | 'desktop';
}

export default function BrandHeader({ 
  seller, 
  rating, 
  reviewCount, 
  variant = 'mobile' 
}: BrandHeaderProps) {
  // Add defensive checks for seller data
  if (!seller) {
    return null;
  }

  const sellerName = seller?.business_name || seller?.name || 'Unknown Seller';
  const sellerLogo = seller?.business_logo_url || seller?.avatar_url;
  const sellerHandle = seller?.handle || '';

  // Additional check to ensure we have valid data
  if (!sellerName || sellerName === 'Unknown Seller') {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <AvatarImage src={sellerLogo || ''} alt={sellerName} />
            <AvatarFallback className="bg-gray-100 text-gray-700 text-xs sm:text-sm">
              {sellerName.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-black text-sm sm:text-base lg:text-lg truncate">
              {sellerName}
            </h2>
            <div className="flex items-center space-x-1">
              <span className="text-black text-xs sm:text-sm">
                {rating}
              </span>
              <Star className="text-black fill-current h-3 w-3 sm:h-3 sm:w-3" />
              <span className="text-gray-600 text-xs sm:text-sm">
                ({reviewCount > 1000 ? `${(reviewCount/1000).toFixed(1)}K` : reviewCount.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center flex-shrink-0 ml-2">
          <SellerDropdown 
            sellerHandle={sellerHandle} 
            sellerName={sellerName} 
          />
        </div>
      </div>
    </div>
  );
}
