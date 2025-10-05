'use client';

import { useState, useEffect, useMemo } from 'react';

// Force dynamic rendering to prevent build-time prerendering
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { 
  ConversationList, 
  ChatHeader, 
  ChatBubble, 
  MessageInput, 
  TypingIndicator 
} from '@/components/chat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Search, RefreshCw, Archive, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import UserMenu from '@/components/UserMenu';
import Navigation from '@/components/Navigation';

export default function InboxPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(true);
  
  const {
    conversations,
    messages,
    currentThread,
    isLoading,
    isSending,
    error,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsRead,
    setCurrentThread,
    clearError,
    searchConversations,
    getConversationStats,
  } = useChat(user?.id);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      setIsLoadingUser(true);
  const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingUser(false);
        return;
      }
      setUser(user);
      setIsLoadingUser(false);
    };
    getUser();
  }, [router]);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Handle conversation selection
  const handleSelectConversation = async (threadId: string) => {
    setCurrentThread(threadId);
    await loadMessages(threadId);
    await markAsRead(threadId);
  };

  // Handle sending messages
  const handleSendMessage = async (message: string, attachments?: any[]) => {
    if (!currentThread) return;
    
    // For now, we'll ignore attachments as they're not implemented yet
    await sendMessage(message);
  };

  // Handle typing indicators
  const handleTypingStart = async () => {
    if (!currentThread) return;
    // TODO: Implement typing start
  };

  const handleTypingStop = async () => {
    if (!currentThread) return;
    // TODO: Implement typing stop
  };

  // Memoized filtered conversations to prevent excessive re-computations
  const filteredConversations = useMemo(() => {
    let filtered = showArchived 
      ? conversations.filter(conv => conv.is_archived)
      : conversations.filter(conv => !conv.is_archived);
    
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.other_user_name?.toLowerCase().includes(searchTerm) ||
        conv.other_user_handle?.toLowerCase().includes(searchTerm) ||
        conv.product_title?.toLowerCase().includes(searchTerm) ||
        conv.last_message_body?.toLowerCase().includes(searchTerm)
      );
    }
    
    return filtered;
  }, [conversations, showArchived, searchQuery]);

  const unreadConversations = useMemo(() => 
    conversations.filter(conv => conv.unread_count > 0), 
    [conversations]
  );
  
  const totalUnread = useMemo(() => 
    conversations.reduce((sum, conv) => sum + conv.unread_count, 0), 
    [conversations]
  );
  
  const selectedConversation = useMemo(() => 
    conversations.find(c => c.thread_id === currentThread), 
    [conversations, currentThread]
  );

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your inbox</h1>
          <Button onClick={() => router.push('/auth/login?redirectTo=/inbox')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <UserMenu user={user} />
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