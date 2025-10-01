import { useEffect, useCallback } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useLoadingStore } from '@/stores/loadingStore';
import {
    getConversations,
    getMessages,
    sendMessage,
    markMessagesAsRead,
    setTypingIndicator,
    getTypingIndicators,
    addMessageReaction,
    removeMessageReaction,
    getMessageReactions,
    createThread,
} from '@/lib/chat';
import {
    archiveConversation,
    unarchiveConversation,
    muteConversation,
    unmuteConversation,
    searchConversations,
    getConversationStats,
} from '@/lib/conversations';

export function useChat(userId?: string) {
    const {
        conversations,
        currentThread,
        messages,
        typingIndicators,
        messageReactions,
        isLoading,
        isSending,
        error,
        setConversations,
        addConversation,
        updateConversation,
        setCurrentThread,
        setMessages,
        addMessage,
        updateMessage,
        setTypingIndicators,
        addTypingIndicator,
        removeTypingIndicator,
        setMessageReactions,
        setLoading,
        setSending,
        setError,
        clearError,
        getConversation,
        getMessages: getMessagesFromStore,
        getUnreadCount,
        getTotalUnreadCount,
        isTyping,
        markMessagesAsRead: markMessagesAsReadInStore,
        archiveConversation: archiveConversationInStore,
        unarchiveConversation: unarchiveConversationInStore,
        muteConversation: muteConversationInStore,
        unmuteConversation: unmuteConversationInStore,
    } = useChatStore();

    const { setLoading: setGlobalLoading } = useLoadingStore();

    // Load conversations
    const loadConversations = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await getConversations(userId);
            if (result.success && result.data) {
                setConversations(result.data);
            } else {
                setError(result.error || 'Failed to load conversations');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load conversations');
        } finally {
            setLoading(false);
        }
    }, [userId, setConversations, setLoading, setError]);

    // Load messages for current thread
    const loadMessages = useCallback(async (threadId: string) => {
        if (!threadId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await getMessages(threadId);
            if (result.success && result.data) {
                setMessages(threadId, result.data);
            } else {
                setError(result.error || 'Failed to load messages');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load messages');
        } finally {
            setLoading(false);
        }
    }, [setMessages, setLoading, setError]);

    // Send message
    const sendMessageHandler = useCallback(async (body: string) => {
        if (!currentThread || !body.trim() || !userId) return;

        setSending(true);
        setError(null);

        try {
            const result = await sendMessage(currentThread, body, userId);
            if (result.success && result.data) {
                addMessage(currentThread, result.data);
                updateConversation(currentThread, { last_message_body: body });
            } else {
                setError(result.error || 'Failed to send message');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    }, [currentThread, userId, addMessage, updateConversation, setSending, setError]);

    // Mark messages as read
    const markAsRead = useCallback(async (threadId: string) => {
        if (!threadId || !userId) return;

        try {
            const result = await markMessagesAsRead(threadId, userId);
            if (result.success) {
                markMessagesAsReadInStore(threadId);
            }
        } catch (err: any) {
            console.error('Error marking messages as read:', err);
        }
    }, [userId, markMessagesAsReadInStore]);

    // Handle typing indicator
    const handleTyping = useCallback(async (isTyping: boolean) => {
        if (!currentThread || !userId) return;

        try {
            await setTypingIndicator(currentThread, userId, isTyping);
            if (isTyping) {
                addTypingIndicator(currentThread, {
                    user_id: userId,
                    user_name: '',
                    user_handle: '',
                    is_typing: true,
                    updated_at: new Date().toISOString()
                });
            } else {
                removeTypingIndicator(currentThread, userId);
            }
        } catch (err: any) {
            console.error('Error setting typing indicator:', err);
        }
    }, [currentThread, userId, addTypingIndicator, removeTypingIndicator]);

    // Add reaction
    const addReaction = useCallback(async (messageId: string, emoji: string) => {
        if (!userId) return;

        try {
            const result = await addMessageReaction(messageId, userId, emoji);
            if (result.success && result.data) {
                // Reload message reactions
                const reactionsResult = await getMessageReactions(messageId);
                if (reactionsResult.success && reactionsResult.data) {
                    setMessageReactions(messageId, reactionsResult.data);
                }
            }
        } catch (err: any) {
            console.error('Error adding reaction:', err);
        }
    }, [userId, setMessageReactions]);

    // Remove reaction
    const removeReaction = useCallback(async (messageId: string, emoji: string) => {
        if (!userId) return;

        try {
            const result = await removeMessageReaction(messageId, userId, emoji);
            if (result.success) {
                // Reload message reactions
                const reactionsResult = await getMessageReactions(messageId);
                if (reactionsResult.success && reactionsResult.data) {
                    setMessageReactions(messageId, reactionsResult.data);
                }
            }
        } catch (err: any) {
            console.error('Error removing reaction:', err);
        }
    }, [userId, setMessageReactions]);

    // Archive conversation
    const archiveConversationHandler = useCallback(async (threadId: string) => {
        if (!userId) return;

        try {
            const result = await archiveConversation(threadId, userId);
            if (result.success) {
                archiveConversationInStore(threadId);
            }
        } catch (err: any) {
            console.error('Error archiving conversation:', err);
        }
    }, [userId, archiveConversationInStore]);

    // Unarchive conversation
    const unarchiveConversationHandler = useCallback(async (threadId: string) => {
        if (!userId) return;

        try {
            const result = await unarchiveConversation(threadId, userId);
            if (result.success) {
                unarchiveConversationInStore(threadId);
            }
        } catch (err: any) {
            console.error('Error unarchiving conversation:', err);
        }
    }, [userId, unarchiveConversationInStore]);

    // Mute conversation
    const muteConversationHandler = useCallback(async (threadId: string) => {
        if (!userId) return;

        try {
            const result = await muteConversation(threadId, userId);
            if (result.success) {
                muteConversationInStore(threadId);
            }
        } catch (err: any) {
            console.error('Error muting conversation:', err);
        }
    }, [userId, muteConversationInStore]);

    // Unmute conversation
    const unmuteConversationHandler = useCallback(async (threadId: string) => {
        if (!userId) return;

        try {
            const result = await unmuteConversation(threadId, userId);
            if (result.success) {
                unmuteConversationInStore(threadId);
            }
        } catch (err: any) {
            console.error('Error unmuting conversation:', err);
        }
    }, [userId, unmuteConversationInStore]);

    // Search conversations
    const searchConversationsHandler = useCallback(async (query: string) => {
        if (!userId) return [];

        try {
            const result = await searchConversations(userId, query);
            if (result.success && result.data) {
                return result.data;
            }
            return [];
        } catch (err: any) {
            console.error('Error searching conversations:', err);
            return [];
        }
    }, [userId]);

    // Get conversation stats
    const getConversationStatsHandler = useCallback(async () => {
        if (!userId) return { total: 0, unread: 0, archived: 0, muted: 0 };

        try {
            const result = await getConversationStats(userId);
            if (result.success && result.data) {
                return result.data;
            }
            return { total: 0, unread: 0, archived: 0, muted: 0 };
        } catch (err: any) {
            console.error('Error getting conversation stats:', err);
            return { total: 0, unread: 0, archived: 0, muted: 0 };
        }
    }, [userId]);

    // Create new thread
    const createNewThread = useCallback(async (productId: string, sellerId: string) => {
        if (!userId) return null;

        try {
            const result = await createThread(productId, userId, sellerId);
            if (result.success && result.data) {
                // Reload conversations to include the new thread
                await loadConversations();
                return result.data;
            }
            return null;
        } catch (err: any) {
            console.error('Error creating thread:', err);
            return null;
        }
    }, [userId]); // Remove loadConversations dependency to prevent infinite loop

    // Load conversations on mount
    useEffect(() => {
        if (userId) {
            loadConversations();
        }
    }, [userId]); // Only depend on userId, not loadConversations

    // Load messages when thread changes
    useEffect(() => {
        if (currentThread) {
            loadMessages(currentThread);
        }
    }, [currentThread]); // Only depend on currentThread, not loadMessages

    return {
        // State
        conversations,
        currentThread,
        messages: currentThread ? getMessagesFromStore(currentThread) || [] : [],
        typingIndicators,
        messageReactions,
        isLoading,
        isSending,
        error,

        // Actions
        loadConversations,
        loadMessages,
        sendMessage: sendMessageHandler,
        markAsRead,
        handleTyping,
        addReaction,
        removeReaction,
        archiveConversation: archiveConversationHandler,
        unarchiveConversation: unarchiveConversationHandler,
        muteConversation: muteConversationHandler,
        unmuteConversation: unmuteConversationHandler,
        searchConversations: searchConversationsHandler,
        getConversationStats: getConversationStatsHandler,
        createNewThread,

        // Store actions
        setCurrentThread,
        clearError,

        // Computed values
        getConversation,
        getUnreadCount,
        getTotalUnreadCount,
        isTyping,
    };
}