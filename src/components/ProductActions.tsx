'use client';

import { useState } from 'react';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

interface ProductActionsProps {
  whatsappUrl: string | null;
  hasPaymentIntegration: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  productTitle?: string;
  productPrice?: string;
}

export default function ProductActions({ 
  whatsappUrl, 
  hasPaymentIntegration, 
  isMobile = false,
  isTablet = false,
  productTitle = '',
  productPrice = ''
}: ProductActionsProps) {
  const [showBuyModal, setShowBuyModal] = useState(false);

  const handleChatViaWhatsApp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleBuyClick = () => {
    setShowBuyModal(true);
  };

  // If no WhatsApp URL, show only Buy button (which will show the modal)
  if (!whatsappUrl) {
    return (
      <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
        <div className="space-y-3">
          <Button
            onClick={handleBuyClick}
            className="w-full py-3 bg-[#1aa1aa] hover:bg-[#158a8f] text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span>Buy Now</span>
          </Button>
        </div>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle>Coming Soon!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-[#1aa1aa]/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-[#1aa1aa]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">In-App Payment Coming Soon!</h3>
                <DialogDescription className="text-sm text-gray-600 leading-relaxed">
                  We're working our butts off to bring you seamless in-app payments and other amazing features! 
                  In the meantime, use the <strong>Chat</strong> button to connect directly with the seller via WhatsApp.
                </DialogDescription>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Stay tuned for updates on our payment system and enhanced shopping experience! 🚀
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowBuyModal(false)}
                className="flex-1"
              >
                Got it!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isMobile || isTablet) {
    return (
      <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
        <div className="flex items-center space-x-3">
          {/* Chat Button - Opens WhatsApp */}
          <Button
            onClick={handleChatViaWhatsApp}
            variant="outline"
            className="flex-1 border-[#1aa1aa] text-[#1aa1aa] hover:bg-[#1aa1aa] hover:text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            <span>Chat</span>
          </Button>
          
          {/* Buy Button - Opens Modal */}
          <Button
            onClick={handleBuyClick}
            className="flex-1 bg-[#1aa1aa] hover:bg-[#158a8f] text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span>Buy</span>
          </Button>
        </div>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle>Coming Soon!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-[#1aa1aa]/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-[#1aa1aa]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">In-App Payment Coming Soon!</h3>
                <DialogDescription className="text-sm text-gray-600 leading-relaxed">
                  We're working our butts off to bring you seamless in-app payments and other amazing features! 
                  In the meantime, use the <strong>Chat</strong> button to connect directly with the seller via WhatsApp.
                </DialogDescription>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Stay tuned for updates on our payment system and enhanced shopping experience! 🚀
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowBuyModal(false)}
                className="flex-1"
              >
                Got it!
              </Button>
              <Button
                onClick={handleChatViaWhatsApp}
                className="flex-1 bg-[#1aa1aa] hover:bg-[#158a8f]"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
      <div className="space-y-3">
        {/* Chat Button - Opens WhatsApp */}
        <Button
          onClick={handleChatViaWhatsApp}
          variant="outline"
          className="w-full border-[#1aa1aa] text-[#1aa1aa] hover:bg-[#1aa1aa] hover:text-white"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          <span>Chat with Seller</span>
        </Button>
        
        {/* Buy Button - Opens Modal */}
        <Button
          onClick={handleBuyClick}
          className="w-full py-3 bg-[#1aa1aa] hover:bg-[#158a8f] text-white"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          <span>Buy Now</span>
        </Button>
      </div>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle>Coming Soon!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-[#1aa1aa]/10 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-[#1aa1aa]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">In-App Payment Coming Soon!</h3>
              <DialogDescription className="text-sm text-gray-600 leading-relaxed">
                We're working our butts off to bring you seamless in-app payments and other amazing features! 
                In the meantime, use the <strong>Chat</strong> button to connect directly with the seller via WhatsApp.
              </DialogDescription>
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-500">
                Stay tuned for updates on our payment system and enhanced shopping experience! 🚀
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowBuyModal(false)}
              className="flex-1"
            >
              Got it!
            </Button>
            <Button
              onClick={handleChatViaWhatsApp}
              className="flex-1 bg-[#1aa1aa] hover:bg-[#158a8f]"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
