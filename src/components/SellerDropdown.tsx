'use client';

import { ExternalLink } from 'lucide-react';

interface SellerDropdownProps {
  sellerHandle: string;
  sellerName: string;
}

export default function SellerDropdown({ sellerHandle, sellerName }: SellerDropdownProps) {
  const handleVisitStore = () => {
    if (!sellerHandle) {
      console.warn('Seller handle is undefined or empty');
      return;
    }
    window.open(`/seller/${sellerHandle}`, '_blank');
  };

  // Don't render if we don't have a valid seller handle
  if (!sellerHandle) {
    return null;
  }

  return (
    <button
      onClick={handleVisitStore}
      className="inline-flex items-center justify-center gap-1 sm:gap-2 hover:underline text-[#13a0a9] text-xs sm:text-sm whitespace-nowrap"
      title={`Visit ${sellerName}'s Store`}
    >
      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
      <span className="hidden sm:inline">Visit {sellerName}'s Store</span>
      <span className="sm:hidden">Store</span>
    </button>
  );
}
