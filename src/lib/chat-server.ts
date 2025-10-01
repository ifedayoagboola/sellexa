import { createClient } from '@/integrations/supabase/server';
import { Conversation, Message } from './chat';

// Server-side functions for initial data loading

// Get server-side conversation data
export async function getServerSideConversations(userId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_user_conversations', {
            user_uuid: userId
        });

        if (error) {
            console.error('Error fetching conversations:', error);
            return {
                conversations: [],
                error: error.message,
            };
        }

        return {
            conversations: data || [],
            error: null,
        };
    } catch (error: any) {
        console.error('Error in getServerSideConversations:', error);
        return {
            conversations: [],
            error: error.message || 'Failed to fetch conversations',
        };
    }
}

// Get server-side messages for a thread
export async function getServerSideMessages(threadId: string, userId: string) {
    try {
        const supabase = await createClient();

        // First verify the user has access to this thread
        const { data: threadData, error: threadError } = await supabase
            .from('threads')
            .select('buyer_id, seller_id')
            .eq('id', threadId)
            .single();

        if (threadError || !threadData) {
            return {
                messages: [],
                error: 'Thread not found',
            };
        }

        if (threadData.buyer_id !== userId && threadData.seller_id !== userId) {
            return {
                messages: [],
                error: 'Access denied',
            };
        }

        // Get messages
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

        if (error) {
            console.error('Error fetching messages:', error);
            return {
                messages: [],
                error: error.message,
            };
        }

        return {
            messages: data || [],
            error: null,
        };
    } catch (error: any) {
        console.error('Error in getServerSideMessages:', error);
        return {
            messages: [],
            error: error.message || 'Failed to fetch messages',
        };
    }
}

// Get server-side thread data
export async function getServerSideThreadData(threadId: string, userId: string) {
    try {
        const supabase = await createClient();

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

        if (error || !data) {
            return {
                thread: null,
                error: 'Thread not found',
            };
        }

        // Verify user has access to this thread
        if (data.buyer_id !== userId && data.seller_id !== userId) {
            return {
                thread: null,
                error: 'Access denied',
            };
        }

        return {
            thread: data,
            error: null,
        };
    } catch (error: any) {
        console.error('Error in getServerSideThreadData:', error);
        return {
            thread: null,
            error: error.message || 'Failed to fetch thread data',
        };
    }
}

// Get server-side conversation metadata
export async function getServerSideConversationMetadata(threadId: string, userId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('conversation_metadata')
            .select('*')
            .eq('thread_id', threadId)
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error fetching conversation metadata:', error);
            return {
                metadata: null,
                error: error.message,
            };
        }

        return {
            metadata: data || {
                is_archived: false,
                is_muted: false,
                last_read_at: null,
            },
            error: null,
        };
    } catch (error: any) {
        console.error('Error in getServerSideConversationMetadata:', error);
        return {
            metadata: {
                is_archived: false,
                is_muted: false,
                last_read_at: null,
            },
            error: error.message || 'Failed to fetch conversation metadata',
        };
    }
}

// Get server-side typing indicators
export async function getServerSideTypingIndicators(threadId: string, userId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_typing_indicators', {
            thread_uuid: threadId,
            user_uuid: userId
        });

        if (error) {
            console.error('Error fetching typing indicators:', error);
            return {
                indicators: [],
                error: error.message,
            };
        }

        return {
            indicators: data || [],
            error: null,
        };
    } catch (error: any) {
        console.error('Error in getServerSideTypingIndicators:', error);
        return {
            indicators: [],
            error: error.message || 'Failed to fetch typing indicators',
        };
    }
}

// Get server-side message reactions
export async function getServerSideMessageReactions(messageId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_message_reactions', {
            message_uuid: messageId
        });

        if (error) {
            console.error('Error fetching message reactions:', error);
            return {
                reactions: [],
                error: error.message,
            };
        }

        return {
            reactions: data || [],
            error: null,
        };
    } catch (error: any) {
        console.error('Error in getServerSideMessageReactions:', error);
        return {
            reactions: [],
            error: error.message || 'Failed to fetch message reactions',
        };
    }
}

// Get server-side conversation stats
export async function getServerSideConversationStats(userId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_user_conversations', {
            user_uuid: userId
        });

        if (error) {
            console.error('Error fetching conversation stats:', error);
            return {
                stats: {
                    total: 0,
                    unread: 0,
                    archived: 0,
                    muted: 0,
                },
                error: error.message,
            };
        }

        const conversations = data || [];
        const stats = {
            total: conversations.length,
            unread: conversations.filter((conv: Conversation) => conv.unread_count > 0).length,
            archived: conversations.filter((conv: Conversation) => conv.is_archived).length,
            muted: conversations.filter((conv: Conversation) => conv.is_muted).length,
        };

        return {
            stats,
            error: null,
        };
    } catch (error: any) {
        console.error('Error in getServerSideConversationStats:', error);
        return {
            stats: {
                total: 0,
                unread: 0,
                archived: 0,
                muted: 0,
            },
            error: error.message || 'Failed to fetch conversation stats',
        };
    }
}
