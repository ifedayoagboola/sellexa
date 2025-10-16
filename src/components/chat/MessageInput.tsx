import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Image as ImageIcon, Smile, Paperclip } from 'lucide-react';

// Validation schema
const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message is too long'),
});

type MessageFormData = z.infer<typeof messageSchema>;

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
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: ''
    }
  });

  const message = watch('message');

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

  const onSubmit = (data: MessageFormData) => {
    if (disabled) return;

    onSendMessage(data.message.trim(), attachments.length > 0 ? attachments : undefined);
    reset();
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
      handleSubmit(onSubmit)(e);
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
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
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={`pr-12 ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
            {...register('message')}
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
