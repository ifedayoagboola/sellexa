import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Message } from '@/stores/chatStore';

interface ChatBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showStatus?: boolean;
  className?: string;
}

export function ChatBubble({
  message,
  isOwnMessage,
  showAvatar = true,
  showTimestamp = true,
  showStatus = true,
  className = '',
}: ChatBubbleProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sending':
        return 'text-muted-foreground';
      case 'sent':
        return 'text-muted-foreground';
      case 'delivered':
        return 'text-[#1aa1aa]';
      case 'read':
        return 'text-slate-600';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      case 'failed':
        return '❌';
      default:
        return '';
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${className}`}>
      <div className={`flex space-x-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        {showAvatar && !isOwnMessage && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage 
              src={message.profiles.avatar_url || '/placeholder.svg'} 
              alt={message.profiles.name || message.profiles.handle}
            />
            <AvatarFallback>
              {message.profiles.name?.charAt(0) || message.profiles.handle?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Message Content */}
        <div className={`space-y-1 ${isOwnMessage ? 'text-right' : ''}`}>
          {/* Message Bubble */}
          <Card className={`px-4 py-2 ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-foreground'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.body}</p>
            
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment: any, index: number) => (
                  <div key={index} className="text-xs opacity-75">
                    📎 {attachment.name || 'Attachment'}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Message Info */}
          <div className={`flex items-center space-x-2 text-xs ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {/* Sender Name (only for other messages) */}
            {!isOwnMessage && (
              <span className="text-muted-foreground">
                {message.profiles.name || message.profiles.handle}
              </span>
            )}

            {/* Timestamp */}
            {showTimestamp && (
              <span className="text-muted-foreground">
                {formatTime(message.created_at)}
              </span>
            )}

            {/* Status */}
            {showStatus && isOwnMessage && (
              <span className={`${getStatusColor(message.status)}`}>
                {getStatusIcon(message.status)}
              </span>
            )}
          </div>

          {/* Reactions */}
          {/* TODO: Add message reactions component */}
        </div>
      </div>
    </div>
  );
}
