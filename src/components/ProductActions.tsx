'use client';

import { ShoppingCart } from 'lucide-react';

interface ProductActionsProps {
  whatsappUrl: string;
  hasPaymentIntegration: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

export default function ProductActions({ 
  whatsappUrl, 
  hasPaymentIntegration, 
  isMobile = false,
  isTablet = false
}: ProductActionsProps) {
  const handleBuyViaWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  if (isMobile || isTablet) {
    return (
      <div className="flex items-center space-x-3">
        {/* Buy Button - Always opens WhatsApp */}
        <button 
          onClick={handleBuyViaWhatsApp}
          className="flex-1 px-4 py-2 bg-[#1aa1aa] text-white text-sm font-medium rounded-lg hover:bg-[#158a8f] transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Buy</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Buy Button - Always opens WhatsApp */}
      <button 
        onClick={handleBuyViaWhatsApp}
        className="w-full py-3 bg-[#1aa1aa] text-white text-sm font-medium rounded-lg hover:bg-[#158a8f] transition-colors flex items-center justify-center space-x-2"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>Buy via WhatsApp</span>
      </button>
    </div>
  );
}
