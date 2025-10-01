'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface StartChatButtonProps {
  productId: string;
  sellerId: string;
  sellerName?: string;
  className?: string;
}

export function StartChatButton({ 
  productId, 
  sellerId, 
  sellerName,
  className = '' 
}: StartChatButtonProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { createNewThread } = useChat();

  const handleStartChat = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const thread = await createNewThread(productId, sellerId);
      
      if (thread) {
        // Navigate to inbox with the new thread
        router.push(`/inbox?thread=${thread.id}`);
      } else {
        console.error('Failed to create thread');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      onClick={handleStartChat}
      disabled={isCreating}
      className={`w-full ${className}`}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      {isCreating ? 'Starting chat...' : `Chat with ${sellerName || 'seller'}`}
    </Button>
  );
}
