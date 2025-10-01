import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Image as ImageIcon, Smile, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: any[]) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = "Type a message...",
  className = '',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle typing indicators
  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      onTypingStart?.();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTypingStop?.();
      }
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, onTypingStart, onTypingStop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim(), attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
    
    // Stop typing
    if (isTyping) {
      setIsTyping(false);
      onTypingStop?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // TODO: Implement file upload logic
      console.log('Files selected:', files);
      setAttachments(files);
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        {/* File Upload Input (Hidden) */}
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-12"
          />
          
          {/* Attachment Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-muted px-2 py-1 rounded text-xs"
            >
              <span>{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
