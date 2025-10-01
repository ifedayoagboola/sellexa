import { supabase } from '@/integrations/supabase/client';
import { ChatResult, Conversation } from './chat';
import { cachedRequest, createApiResult, createApiError, clearCache } from './api-utils';

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

// Get conversation by ID
export async function getConversationById(
    threadId: string,
    userId: string
): Promise<ChatResult<Conversation | null>> {
    try {
        const result = await cachedRequest(
            `conversation-${threadId}-${userId}`,
            async () => {
                const { data, error } = await supabase.rpc('get_user_conversations', {
                    user_uuid: userId
                });

                if (error) throw error;
                return data.find((conv: Conversation) => conv.thread_id === threadId) || null;
            }
        );

        return createApiResult(result);
    } catch (error: any) {
        console.error('Error fetching conversation:', error);
        return createApiError(error.message || 'Failed to fetch conversation');
    }
}

// Archive conversation
export async function archiveConversation(
    threadId: string,
    userId: string
): Promise<ChatResult<void>> {
    try {
        const { error } = await supabase
            .from('conversation_metadata')
            .upsert({
                thread_id: threadId,
                user_id: userId,
                is_archived: true,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        // Clear cache
        clearCache(`conversations-${userId}`);
        clearCache(`conversation-${threadId}-${userId}`);

        return createApiResult(undefined);
    } catch (error: any) {
        console.error('Error archiving conversation:', error);
        return createApiError(error.message || 'Failed to archive conversation');
    }
}

// Unarchive conversation
export async function unarchiveConversation(
    threadId: string,
    userId: string
): Promise<ChatResult<void>> {
    try {
        const { error } = await supabase
            .from('conversation_metadata')
            .upsert({
                thread_id: threadId,
                user_id: userId,
                is_archived: false,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        // Clear cache
        clearCache(`conversations-${userId}`);
        clearCache(`conversation-${threadId}-${userId}`);

        return createApiResult(undefined);
    } catch (error: any) {
        console.error('Error unarchiving conversation:', error);
        return createApiError(error.message || 'Failed to unarchive conversation');
    }
}

// Mute conversation
export async function muteConversation(
    threadId: string,
    userId: string
): Promise<ChatResult<void>> {
    try {
        const { error } = await supabase
            .from('conversation_metadata')
            .upsert({
                thread_id: threadId,
                user_id: userId,
                is_muted: true,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        // Clear cache
        clearCache(`conversations-${userId}`);
        clearCache(`conversation-${threadId}-${userId}`);

        return createApiResult(undefined);
    } catch (error: any) {
        console.error('Error muting conversation:', error);
        return createApiError(error.message || 'Failed to mute conversation');
    }
}

// Unmute conversation
export async function unmuteConversation(
    threadId: string,
    userId: string
): Promise<ChatResult<void>> {
    try {
        const { error } = await supabase
            .from('conversation_metadata')
            .upsert({
                thread_id: threadId,
                user_id: userId,
                is_muted: false,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        // Clear cache
        clearCache(`conversations-${userId}`);
        clearCache(`conversation-${threadId}-${userId}`);

        return createApiResult(undefined);
    } catch (error: any) {
        console.error('Error unmuting conversation:', error);
        return createApiError(error.message || 'Failed to unmute conversation');
    }
}

// Search conversations
export async function searchConversations(
    userId: string,
    query: string
): Promise<ChatResult<Conversation[]>> {
    try {
        const result = await cachedRequest(
            `search-conversations-${userId}-${query}`,
            async () => {
                const { data, error } = await supabase.rpc('get_user_conversations', {
                    user_uuid: userId
                });

                if (error) throw error;

                const conversations = data as Conversation[];
                const searchTerm = query.toLowerCase();

                return conversations.filter(conv =>
                    conv.other_user_name?.toLowerCase().includes(searchTerm) ||
                    conv.other_user_handle?.toLowerCase().includes(searchTerm) ||
                    conv.product_title?.toLowerCase().includes(searchTerm) ||
                    conv.last_message_body?.toLowerCase().includes(searchTerm)
                );
            }
        );

        return createApiResult(result);
    } catch (error: any) {
        console.error('Error searching conversations:', error);
        return createApiError(error.message || 'Failed to search conversations');
    }
}

// Get conversation stats
export async function getConversationStats(userId: string): Promise<ChatResult<{
    total: number;
    unread: number;
    archived: number;
    muted: number;
}>> {
    try {
        const result = await cachedRequest(
            `conversation-stats-${userId}`,
            async () => {
                const { data, error } = await supabase.rpc('get_user_conversations', {
                    user_uuid: userId
                });

                if (error) throw error;

                const conversations = data as Conversation[];

                return {
                    total: conversations.length,
                    unread: conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0),
                    archived: conversations.filter(conv => conv.is_archived).length,
                    muted: conversations.filter(conv => conv.is_muted).length
                };
            }
        );

        return createApiResult(result);
    } catch (error: any) {
        console.error('Error fetching conversation stats:', error);
        return createApiError(error.message || 'Failed to fetch conversation stats');
    }
}