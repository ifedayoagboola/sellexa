import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MoreVertical, Phone, Video, Info } from 'lucide-react';

interface ChatHeaderProps {
  productTitle: string;
  productPrice: number;
  productImage: string;
  otherUserName: string;
  otherUserHandle: string;
  otherUserAvatar: string;
  onBack?: () => void;
  onMoreOptions?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onInfo?: () => void;
  className?: string;
}

export function ChatHeader({
  productTitle,
  productPrice,
  productImage,
  otherUserName,
  otherUserHandle,
  otherUserAvatar,
  onBack,
  onMoreOptions,
  onCall,
  onVideoCall,
  onInfo,
  className = '',
}: ChatHeaderProps) {
  const formatPrice = (pricePence: number) => {
    return `£${(pricePence / 100).toFixed(2)}`;
  };

  return (
    <Card className={`p-4 border-b ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Product Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img
            src={productImage || '/placeholder.svg'}
            alt={productTitle}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-foreground truncate">{productTitle}</h1>
            <p className="text-sm text-muted-foreground">{formatPrice(productPrice)}</p>
          </div>
        </div>

        {/* Other User Info */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={otherUserAvatar || '/placeholder.svg'} />
            <AvatarFallback>
              {otherUserName?.charAt(0) || otherUserHandle?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {otherUserName || otherUserHandle}
            </p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          {onCall && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCall}
              className="text-muted-foreground hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
          
          {onVideoCall && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onVideoCall}
              className="text-muted-foreground hover:text-foreground"
            >
              <Video className="h-4 w-4" />
            </Button>
          )}
          
          {onInfo && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onInfo}
              className="text-muted-foreground hover:text-foreground"
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
          
          {onMoreOptions && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoreOptions}
              className="text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
