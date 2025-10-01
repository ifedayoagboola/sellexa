import React from 'react';
import { Card } from '@/components/ui/card';
import { TypingIndicator as TypingIndicatorType } from '@/stores/chatStore';

interface TypingIndicatorProps {
  indicators: TypingIndicatorType[];
  className?: string;
}

export function TypingIndicator({ indicators, className = '' }: TypingIndicatorProps) {
  if (indicators.length === 0) return null;

  const getTypingText = () => {
    if (indicators.length === 1) {
      return `${indicators[0].user_name || indicators[0].user_handle} is typing...`;
    } else if (indicators.length === 2) {
      return `${indicators[0].user_name || indicators[0].user_handle} and ${indicators[1].user_name || indicators[1].user_handle} are typing...`;
    } else {
      return `${indicators.length} people are typing...`;
    }
  };

  return (
    <div className={`px-4 py-2 ${className}`}>
      <Card className="px-4 py-2 bg-muted/50 border-dashed">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-muted-foreground">
            {getTypingText()}
          </span>
        </div>
      </Card>
    </div>
  );
}
