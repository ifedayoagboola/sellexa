'use client';

import { useState, useEffect, useMemo } from 'react';
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">Inbox</h1>
            {totalUnread > 0 && (
              <Badge variant="destructive" className="text-xs">
                {totalUnread}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className="hidden sm:flex"
            >
              <Archive className="h-4 w-4 mr-2" />
              {showArchived ? 'Active' : 'Archived'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className="sm:hidden"
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadConversations}
              disabled={isLoading}
              className="hidden sm:flex"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadConversations}
              disabled={isLoading}
              className="sm:hidden"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <UserMenu user={user} />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        {/* Conversations Sidebar */}
        <div className={`w-full md:w-96 border-b md:border-b-0 md:border-r border-border flex flex-col ${currentThread ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-3 md:p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm md:text-base"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="p-3 md:p-4 border-b border-border">
            <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
              <div>
                <p className="text-lg md:text-2xl font-bold">{conversations.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-blue-600">{unreadConversations.length}</p>
                <p className="text-xs text-muted-foreground">Unread</p>
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-green-600">{filteredConversations.length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={filteredConversations}
              selectedThreadId={currentThread}
              onSelectConversation={handleSelectConversation}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!currentThread ? 'hidden md:flex' : 'flex'}`}>
          {currentThread && selectedConversation ? (
            <>
              {/* Mobile Back Button */}
              <div className="md:hidden flex items-center p-3 border-b border-border bg-background">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentThread(null)}
                  className="mr-3"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{selectedConversation.other_user_name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{selectedConversation.product_title}</p>
                </div>
              </div>

              {/* Chat Header */}
              <div className="hidden md:block">
                <ChatHeader
                  productTitle={selectedConversation.product_title}
                  productPrice={selectedConversation.product_price_pence}
                  productImage={selectedConversation.product_image}
                  otherUserName={selectedConversation.other_user_name}
                  otherUserHandle={selectedConversation.other_user_handle}
                  otherUserAvatar={selectedConversation.other_user_avatar_url}
                  onBack={() => setCurrentThread(null)}
                />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      message={message}
                      isOwnMessage={message.sender_id === user.id}
                      showAvatar={true}
                      showTimestamp={true}
                      showStatus={true}
                    />
                  ))
                )}
                
                {/* Typing Indicators */}
                <TypingIndicator indicators={[]} />
              </div>

              {/* Message Input */}
              <div className="p-3 md:p-4 border-t border-border">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onTypingStart={handleTypingStart}
                  onTypingStop={handleTypingStop}
                  disabled={isSending}
                  placeholder="Type a message..."
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Select a conversation
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose a conversation from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <Button variant="outline" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Navigation />
    </div>
  );
}