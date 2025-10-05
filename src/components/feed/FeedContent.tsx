'use client';

import { useEffect, useMemo } from 'react';
import { useProductsStore } from '@/stores/productsStore';
import { SellerSection, EmptyState } from './index';

interface FeedContentProps {
  initialProducts?: any[];
}

export default function FeedContent({ initialProducts }: FeedContentProps) {
  const { 
    feedProducts, 
    isLoadingFeed, 
    feedError, 
    fetchFeedProducts,
    isFeedStale 
  } = useProductsStore();

  // Process products into seller sections
  const sellerSections = useMemo(() => {
    if (initialProducts && Object.keys(feedProducts).length === 0) {
      // Use initial products for server-side rendering
      const productsBySeller = initialProducts?.reduce((acc, product) => {
        const sellerId = product.user_id;
        const sellerProfile = product.profiles as any;
        
        if (!acc[sellerId]) {
          acc[sellerId] = {
            seller: sellerProfile,
            products: []
          };
        }
        acc[sellerId].products.push(product);
        return acc;
      }, {} as Record<string, { seller: any; products: any[] }>) || {};

      return Object.values(productsBySeller)
        .filter((section: any) => section.products.length > 0)
        .sort((a: any, b: any) => b.products.length - a.products.length);
    }

    // Use store data
    return Object.values(feedProducts)
      .filter((section: any) => section.products.length > 0)
      .sort((a: any, b: any) => b.products.length - a.products.length);
  }, [feedProducts, initialProducts]);

  // Fetch products if stale
  useEffect(() => {
    if (isFeedStale()) {
      fetchFeedProducts();
    }
  }, [isFeedStale, fetchFeedProducts]);

  if (isLoadingFeed && sellerSections.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1aa1aa]"></div>
      </div>
    );
  }

  if (feedError && sellerSections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading products: {feedError}</p>
        <button 
          onClick={() => fetchFeedProducts()}
          className="px-4 py-2 bg-[#1aa1aa] text-white rounded-md hover:bg-[#158a8f]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (sellerSections.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8 lg:space-y-16">
      {sellerSections.map((section: any, index: number) => (
        <SellerSection 
          key={section.seller?.id || section.seller?.user_id || index}
          section={section}
          index={index}
          variant="mobile"
        />
      ))}
    </div>
  );
}
