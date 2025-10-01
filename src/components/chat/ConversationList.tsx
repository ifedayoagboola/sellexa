import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/stores/chatStore';
import { MoreVertical, Archive, Volume2, VolumeX } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedThreadId?: string | null;
  onSelectConversation: (threadId: string) => void;
  onArchiveConversation?: (threadId: string) => void;
  onMuteConversation?: (threadId: string) => void;
  onUnmuteConversation?: (threadId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ConversationList({
  conversations,
  selectedThreadId,
  onSelectConversation,
  onArchiveConversation,
  onMuteConversation,
  onUnmuteConversation,
  isLoading = false,
  className = '',
}: ConversationListProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffMinutes < 1440) return `${Math.ceil(diffMinutes / 60)}h`;
    if (diffMinutes < 10080) return `${Math.ceil(diffMinutes / 1440)}d`;
    return date.toLocaleDateString();
  };

  const formatPrice = (pricePence: number) => {
    return `£${(pricePence / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No conversations yet</h3>
        <p className="text-muted-foreground">
          Start chatting with sellers about products you're interested in
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {conversations.map((conversation) => (
        <Card
          key={conversation.thread_id}
          className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
            selectedThreadId === conversation.thread_id
              ? 'bg-primary/10 border-primary'
              : ''
          }`}
          onClick={() => onSelectConversation(conversation.thread_id)}
        >
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage 
                src={conversation.other_user_avatar_url || '/placeholder.svg'} 
                alt={conversation.other_user_name || conversation.other_user_handle}
              />
              <AvatarFallback>
                {conversation.other_user_name?.charAt(0) || conversation.other_user_handle?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-foreground truncate">
                  {conversation.other_user_name || conversation.other_user_handle}
                </h3>
                <div className="flex items-center space-x-2">
                  {conversation.is_muted && (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTime(conversation.last_message_created_at)}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.product_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(conversation.product_price_pence)}
                  </p>
                </div>
              </div>

              {/* Last Message */}
              <div className="flex items-center justify-between">
                <p className={`text-sm truncate ${
                  conversation.unread_count > 0 
                    ? 'font-medium text-foreground' 
                    : 'text-muted-foreground'
                }`}>
                  {conversation.last_message_body}
                </p>
                <div className="flex items-center space-x-2">
                  {conversation.unread_count > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unread_count}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Show conversation menu
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
