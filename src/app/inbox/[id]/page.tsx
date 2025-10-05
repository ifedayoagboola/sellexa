'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Image as ImageIcon, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useUserStore } from '@/stores/userStore';

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  attachments: any;
  created_at: string;
  profiles: {
    handle: string;
    name: string | null;
    avatar_url: string | null;
  };
}

interface Thread {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  created_at: string;
  last_message_at: string | null;
  product: {
    id: string;
    title: string;
    price_pence: number;
    images: string[];
  };
  buyer: {
    handle: string;
    name: string | null;
    avatar_url: string | null;
  };
  seller: {
    handle: string;
    name: string | null;
    avatar_url: string | null;
  };
}

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

const ThreadPage = ({ params }: ThreadPageProps) => {
  const { id: threadId } = useParams() as { id: string };
  const router = useRouter();

  // UUID validation helper
  const isValidUUID = (uuid: string | undefined): boolean => {
    if (!uuid) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };
  
  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch thread details
  useEffect(() => {
    const fetchThread = async () => {
      if (!threadId || !isValidUUID(threadId)) {
        if (threadId === 'new') {
          // Redirect to inbox if trying to access /inbox/new
          router.push('/inbox');
          return;
        }
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('threads')
          .select(`
            *,
            product:products!threads_product_id_fkey(
              id,
              title,
              price_pence,
              images
            ),
            buyer:profiles!threads_buyer_id_fkey(
              handle,
              name,
              avatar_url
            ),
            seller:profiles!threads_seller_id_fkey(
              handle,
              name,
              avatar_url
            )
          `)
          .eq('id', threadId)
          .single();

        if (error) throw error;
        setThread(data);
      } catch (error) {
        console.error('Error fetching thread:', error);
        toast({
          title: "Error",
          description: "Failed to load conversation",
          variant: "destructive",
        });
        router.push('/inbox');
      }
    };

    fetchThread();
  }, [threadId, router, supabase]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!threadId || !isValidUUID(threadId)) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            profiles:profiles!messages_sender_id_fkey(
              handle,
              name,
              avatar_url
            )
          `)
          .eq('thread_id', threadId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [threadId, supabase]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!threadId || !isValidUUID(threadId)) return;

    const channel = supabase
      .channel(`messages-${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`,
        },
        async (payload) => {
          // Fetch the full message with profile data
          const { data: messageData, error } = await supabase
            .from('messages')
            .select(`
              *,
              profiles:profiles!messages_sender_id_fkey(
                handle,
                name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error('Error fetching new message:', error);
            return;
          }

          setMessages((prev) => [...prev, messageData]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, supabase]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !threadId || !isValidUUID(threadId) || !user || sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          body: newMessage.trim(),
        });

      if (error) throw error;

      // Update thread's last_message_at
      await supabase
        .from('threads')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', threadId);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.ceil(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Handle invalid threadId
  if (threadId && !isValidUUID(threadId)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Thread not found</p>
          <Button onClick={() => router.push('/inbox')}>
            Back to Inbox
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Conversation not found</p>
          <Button onClick={() => router.push('/inbox')} className="mt-4">
            Back to Inbox
          </Button>
        </div>
      </div>
    );
  }

  const isOwnMessage = (message: Message) => message.sender_id === user?.id;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/inbox')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {/* Product Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <img
              src={thread.product.images[0] ? 
                (thread.product.images[0].startsWith('placeholder-') ? 
                  '/placeholder.svg' : 
                  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${thread.product.images[0]}`
                ) : 
                '/placeholder.svg'
              }
              alt={thread.product.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-foreground truncate">{thread.product.title}</h1>
              <p className="text-sm text-muted-foreground">£{(thread.product.price_pence / 100).toFixed(2)}</p>
            </div>
          </div>

          {/* Other participant */}
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={
                isOwnMessage({ sender_id: thread.buyer_id } as Message) 
                  ? thread.seller.avatar_url || '/placeholder.svg'
                  : thread.buyer.avatar_url || '/placeholder.svg'
              } />
              <AvatarFallback>
                {isOwnMessage({ sender_id: thread.buyer_id } as Message) 
                  ? thread.seller.name?.charAt(0) || thread.seller.handle?.charAt(0) || 'U'
                  : thread.buyer.name?.charAt(0) || thread.buyer.handle?.charAt(0) || 'U'
                }
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-[80%] ${isOwnMessage(message) ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!isOwnMessage(message) && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.profiles.avatar_url || '/placeholder.svg'} />
                    <AvatarFallback>
                      {message.profiles.name?.charAt(0) || message.profiles.handle?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`space-y-1 ${isOwnMessage(message) ? 'text-right' : ''}`}>
                  <Card className={`px-4 py-2 ${
                    isOwnMessage(message) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm">{message.body}</p>
                  </Card>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-12"
              disabled={sending}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ThreadPage;
