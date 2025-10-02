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
      className="inline-flex items-center justify-center gap-2 hover:underline text-[#13a0a9] text-sm"
    >
      <ExternalLink className="h-4 w-4" />
      Visit {sellerName}'s Store
    </button>
  );
}
