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

  const isMobile = variant === 'mobile';

  return (
    <div className="bg-white p-2">
      <div className="flex items-center justify-between">
        <div className={`flex items-center ${isMobile ? 'space-x-3' : 'space-x-2'}`}>
          <Avatar className={isMobile ? 'w-12 h-12' : 'w-11 h-11'}>
            <AvatarImage src={sellerLogo || ''} alt={sellerName} />
            <AvatarFallback className="bg-gray-100 text-gray-700">
              {sellerName.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className={`font-bold text-black ${isMobile ? 'text-base' : 'text-lg font-semibold'}`}>
              {sellerName}
            </h2>
            <div className={`flex items-center ${isMobile ? 'space-x-1' : ''}`}>
              <span className={`text-black ${isMobile ? 'text-sm' : 'text-xs text-gray-600'}`}>
                {rating}
              </span>
              <Star className={`text-black fill-current ${isMobile ? 'h-3 w-3' : 'h-2 w-2 ml-1 mr-1'}`} />
              <span className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                ({reviewCount > 1000 ? `${(reviewCount/1000).toFixed(1)}K` : reviewCount.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <SellerDropdown 
            sellerHandle={sellerHandle} 
            sellerName={sellerName} 
          />
        </div>
      </div>
    </div>
  );
}
