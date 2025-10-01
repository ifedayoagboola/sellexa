import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageReaction } from '@/stores/chatStore';
import { Smile, Heart, ThumbsUp, Laugh, Angry, Frown } from 'lucide-react';

interface MessageReactionsProps {
  reactions: MessageReaction[];
  onAddReaction?: (emoji: string) => void;
  onRemoveReaction?: (emoji: string) => void;
  className?: string;
}

const EMOJI_ICONS: Record<string, React.ReactNode> = {
  '😀': <Smile className="h-4 w-4" />,
  '❤️': <Heart className="h-4 w-4" />,
  '👍': <ThumbsUp className="h-4 w-4" />,
  '😂': <Laugh className="h-4 w-4" />,
  '😠': <Angry className="h-4 w-4" />,
  '😢': <Frown className="h-4 w-4" />,
};

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😢', '😠'];

export function MessageReactions({
  reactions,
  onAddReaction,
  onRemoveReaction,
  className = '',
}: MessageReactionsProps) {
  const handleReactionClick = (emoji: string) => {
    const existingReaction = reactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      if (existingReaction.user_reacted) {
        onRemoveReaction?.(emoji);
      } else {
        onAddReaction?.(emoji);
      }
    } else {
      onAddReaction?.(emoji);
    }
  };

  if (reactions.length === 0 && !onAddReaction) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Existing Reactions */}
      {reactions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {reactions.map((reaction, index) => (
            <Button
              key={`${reaction.emoji}-${index}`}
              variant={reaction.user_reacted ? "default" : "outline"}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => handleReactionClick(reaction.emoji)}
            >
              <span className="mr-1">
                {EMOJI_ICONS[reaction.emoji] || reaction.emoji}
              </span>
              {reaction.count}
            </Button>
          ))}
        </div>
      )}

      {/* Quick Reaction Buttons */}
      {onAddReaction && (
        <Card className="p-2">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground mr-2">Quick reactions:</span>
            {QUICK_REACTIONS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleReactionClick(emoji)}
              >
                {EMOJI_ICONS[emoji] || emoji}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
