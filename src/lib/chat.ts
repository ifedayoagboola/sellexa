import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { cachedRequest, createApiResult, createApiError, clearCache } from './api-utils';

// Types
export type Thread = Database['public']['Tables']['threads']['Row'];

export type Conversation = {
    thread_id: string;
    product_id: string;
    product_title: string;
    product_price_pence: number;
    product_image: string;
    other_user_id: string;
    other_user_name: string;
    other_user_handle: string;
    other_user_avatar_url: string;
    last_message_body: string;
    last_message_created_at: string;
    unread_count: number;
    is_archived: boolean;
    is_muted: boolean;
    last_read_at: string | null;
};
export type Message = Database['public']['Tables']['messages']['Row'] & {
    profiles: {
        handle: string;
        name: string | null;
        avatar_url: string | null;
    };
    reactions?: MessageReaction[];
};
// Message status is now a column in messages table
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageReaction = {
    emoji: string;
    count: number;
    user_reacted: boolean;
};
export type TypingIndicator = {
    user_id: string;
    user_name: string;
    user_handle: string;
    is_typing: boolean;
    updated_at: string;
};

export interface ChatResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Get user conversations
export async function getConversations(userId: string): Promise<ChatResult<Conversation[]>> {
    try {
        const result = await cachedRequest(
            `conversations-${userId}`,
            async () => {
                const { data, error } = await supabase.rpc('get_user_conversations', {
                    user_uuid: userId
                });

                if (error) throw error;
                return data as Conversation[];
            }
        );

        return createApiResult(result);
    } catch (error: any) {
        console.error('Error fetching conversations:', error);
        return createApiError(error.message || 'Failed to fetch conversations');
    }
}

// Get messages for a thread
export async function getMessages(threadId: string): Promise<ChatResult<Message[]>> {
    try {
        const result = await cachedRequest(
            `messages-${threadId}`,
            async () => {
                const { data, error } = await supabase
                    .from('messages')
                    .select(`
            *,
            profiles:sender_id (
              handle,
              name,
              avatar_url
            )
          `)
                    .eq('thread_id', threadId)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                return data as Message[];
            }
        );

        return createApiResult(result);
    } catch (error: any) {
        console.error('Error fetching messages:', error);
        return createApiError(error.message || 'Failed to fetch messages');
    }
}

// Send a message
export async function sendMessage(
    threadId: string,
    body: string,
    senderId: string
): Promise<ChatResult<Message>> {
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                thread_id: threadId,
                sender_id: senderId,
                body,
                status: 'sent'
            })
            .select(`
        *,
        profiles:sender_id (
          handle,
          name,
          avatar_url
        )
      `)
            .single();

        if (error) throw error;

        // Clear messages cache for this thread
        clearCache(`messages-${threadId}`);

        return createApiResult(data as Message);
    } catch (error: any) {
        console.error('Error sending message:', error);
        return createApiError(error.message || 'Failed to send message');
    }
}

// Mark messages as read
export async function markMessagesAsRead(
    threadId: string,
    userId: string
): Promise<ChatResult<void>> {
    try {
        const { error } = await supabase.rpc('mark_messages_as_read', {
            thread_uuid: threadId,
            user_uuid: userId
        });

        if (error) throw error;

        // Clear conversations cache
        clearCache(`conversations-${userId}`);

        return createApiResult(undefined);
    } catch (error: any) {
        console.error('Error marking messages as read:', error);
        return createApiError(error.message || 'Failed to mark messages as read');
    }
}

// Get typing indicators
export async function getTypingIndicators(
    threadId: string,
    userId: string
): Promise<ChatResult<TypingIndicator[]>> {
    try {
        const result = await cachedRequest(
            `typing-${threadId}`,
            async () => {
                const { data, error } = await supabase.rpc('get_typing_indicators', {
                    thread_uuid: threadId,
                    user_uuid: userId
                });

                if (error) throw error;
                return data;
            },
            false // Don't cache typing indicators
        );

        return createApiResult(result);
    } catch (error: any) {
        console.error('Error fetching typing indicators:', error);
        return createApiError(error.message || 'Failed to fetch typing indicators');
    }
}

// Set typing indicator
export async function setTypingIndicator(
    threadId: string,
    userId: string,
    isTyping: boolean
): Promise<ChatResult<void>> {
    try {
        const { error } = await supabase.rpc('set_typing_indicator', {
            thread_uuid: threadId,
            user_uuid: userId,
            typing: isTyping
        });

        if (error) throw error;

        return createApiResult(undefined);
    } catch (error: any) {
        console.error('Error setting typing indicator:', error);
        return createApiError(error.message || 'Failed to set typing indicator');
    }
}

// Add message reaction
export async function addMessageReaction(
    messageId: string,
    userId: string,
    emoji: string
): Promise<ChatResult<void>> {
    try {
        const { error } = await supabase
            .from('message_reactions')
            .insert({
                message_id: messageId,
                user_id: userId,
                emoji
            });

        if (error) throw error;

        return createApiResult(undefined);
    } catch (error: any) {
        console.error('Error adding message reaction:', error);
        return createApiError(error.message || 'Failed to add reaction');
    }
}

// Remove message reaction
export async function removeMessageReaction(
    messageId: string,
    userId: string,
    emoji: string
): Promise<ChatResult<void>> {
    try {
        const { error } = await supabase
            .from('message_reactions')
            .delete()
            .eq('message_id', messageId)
            .eq('user_id', userId)
            .eq('emoji', emoji);

        if (error) throw error;

        return createApiResult(undefined);
    } catch (error: any) {
        console.error('Error removing message reaction:', error);
        return createApiError(error.message || 'Failed to remove reaction');
    }
}

// Get message reactions
export async function getMessageReactions(
    messageId: string
): Promise<ChatResult<MessageReaction[]>> {
    try {
        const result = await cachedRequest(
            `reactions-${messageId}`,
            async () => {
                const { data, error } = await supabase.rpc('get_message_reactions', {
                    message_uuid: messageId
                });

                if (error) throw error;
                return data;
            }
        );

        return createApiResult(result);
    } catch (error: any) {
        console.error('Error fetching message reactions:', error);
        return createApiError(error.message || 'Failed to fetch reactions');
    }
}

// Create a new thread
export async function createThread(
    productId: string,
    buyerId: string,
    sellerId: string
): Promise<ChatResult<Thread>> {
    try {
        const { data, error } = await supabase
            .from('threads')
            .insert({
                product_id: productId,
                buyer_id: buyerId,
                seller_id: sellerId
            })
            .select()
            .single();

        if (error) throw error;

        return createApiResult(data);
    } catch (error: any) {
        console.error('Error creating thread:', error);
        return createApiError(error.message || 'Failed to create thread');
    }
}

// Re-export for backward compatibility
export { clearCache, clearAllCache } from './api-utils';