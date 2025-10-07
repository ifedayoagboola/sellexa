'use client';

import { useState } from 'react';

// Force dynamic rendering to prevent build-time prerendering
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { MessageSquare } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function InboxPage() {
  const router = useRouter();
  const [showComingSoonModal, setShowComingSoonModal] = useState(true);


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto bg-[#1aa1aa]/10 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="h-8 w-8 text-[#1aa1aa]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">In-App Chat Coming Soon!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We're working hard to bring you seamless in-app messaging and chat features! 
            In the meantime, use the <strong>Chat</strong> button on product pages to connect directly with sellers via WhatsApp.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowComingSoonModal(false)}
              className="flex-1"
            >
              Got it!
            </Button>
            <Button
              onClick={() => router.push('/feed')}
              className="flex-1 bg-[#1aa1aa] hover:bg-[#158a8f]"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={showComingSoonModal} onOpenChange={setShowComingSoonModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle>Coming Soon!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-[#1aa1aa]/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-[#1aa1aa]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">In-App Chat Coming Soon!</h3>
                <DialogDescription className="text-sm text-gray-600 leading-relaxed">
                  We're working our butts off to bring you seamless in-app messaging and chat features! 
                  In the meantime, use the <strong>Chat</strong> button on product pages to connect directly with sellers via WhatsApp.
                </DialogDescription>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Stay tuned for updates on our messaging system and enhanced communication features! 💬
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowComingSoonModal(false)}
                className="flex-1"
              >
                Got it!
              </Button>
              <Button
                onClick={() => router.push('/feed')}
                className="flex-1 bg-[#1aa1aa] hover:bg-[#158a8f]"
              >
                Browse Products
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Navigation />
    </div>
  );
}