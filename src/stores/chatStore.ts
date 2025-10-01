import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types for chat functionality
export interface Message {
    id: string;
    thread_id: string;
    sender_id: string;
    body: string;
    attachments: any;
    created_at: string;
    status: string;
    profiles: {
        handle: string;
        name: string | null;
        avatar_url: string | null;
    };
    reactions?: MessageReaction[];
}

export interface Conversation {
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
}

export interface TypingIndicator {
    user_id: string;
    user_name: string;
    user_handle: string;
    is_typing: boolean;
    updated_at: string;
}

export interface MessageReaction {
    emoji: string;
    count: number;
    user_reacted: boolean;
}

interface ChatState {
    // State
    conversations: Conversation[];
    currentThread: string | null;
    messages: Record<string, Message[]>; // threadId -> messages
    typingIndicators: Record<string, TypingIndicator[]>; // threadId -> typing users
    messageReactions: Record<string, MessageReaction[]>; // messageId -> reactions
    isLoading: boolean;
    isSending: boolean;
    error: string | null;

    // Actions
    setConversations: (conversations: Conversation[]) => void;
    addConversation: (conversation: Conversation) => void;
    updateConversation: (threadId: string, updates: Partial<Conversation>) => void;
    removeConversation: (threadId: string) => void;

    setCurrentThread: (threadId: string | null) => void;
    setMessages: (threadId: string, messages: Message[]) => void;
    addMessage: (threadId: string, message: Message) => void;
    updateMessage: (threadId: string, messageId: string, updates: Partial<Message>) => void;
    removeMessage: (threadId: string, messageId: string) => void;

    setTypingIndicators: (threadId: string, indicators: TypingIndicator[]) => void;
    addTypingIndicator: (threadId: string, indicator: TypingIndicator) => void;
    removeTypingIndicator: (threadId: string, userId: string) => void;

    setMessageReactions: (messageId: string, reactions: MessageReaction[]) => void;
    addMessageReaction: (messageId: string, reaction: MessageReaction) => void;
    removeMessageReaction: (messageId: string, emoji: string) => void;

    setLoading: (loading: boolean) => void;
    setSending: (sending: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Getters
    getConversation: (threadId: string) => Conversation | undefined;
    getMessages: (threadId: string) => Message[];
    getUnreadCount: (threadId: string) => number;
    getTotalUnreadCount: () => number;
    isTyping: (threadId: string, userId: string) => boolean;

    // Utility actions
    markMessagesAsRead: (threadId: string) => void;
    archiveConversation: (threadId: string) => void;
    unarchiveConversation: (threadId: string) => void;
    muteConversation: (threadId: string) => void;
    unmuteConversation: (threadId: string) => void;
    reset: () => void;
    cleanup: () => void;
}

export const useChatStore = create<ChatState>()(
    devtools(
        (set, get) => ({
            // Initial state
            conversations: [],
            currentThread: null,
            messages: {},
            typingIndicators: {},
            messageReactions: {},
            isLoading: false,
            isSending: false,
            error: null,

            // Conversation actions
            setConversations: (conversations: Conversation[]) => {
                set({ conversations });
            },

            addConversation: (conversation: Conversation) => {
                const { conversations } = get();
                const existingIndex = conversations.findIndex(c => c.thread_id === conversation.thread_id);

                if (existingIndex >= 0) {
                    // Update existing conversation
                    const updated = [...conversations];
                    updated[existingIndex] = conversation;
                    set({ conversations: updated });
                } else {
                    // Add new conversation at the top
                    set({ conversations: [conversation, ...conversations] });
                }
            },

            updateConversation: (threadId: string, updates: Partial<Conversation>) => {
                const { conversations } = get();
                const updated = conversations.map(conv =>
                    conv.thread_id === threadId ? { ...conv, ...updates } : conv
                );
                set({ conversations: updated });
            },

            removeConversation: (threadId: string) => {
                const { conversations, messages } = get();
                const updated = conversations.filter(conv => conv.thread_id !== threadId);
                const updatedMessages = { ...messages };
                delete updatedMessages[threadId];
                set({
                    conversations: updated,
                    messages: updatedMessages
                });
            },

            // Thread and message actions
            setCurrentThread: (threadId: string | null) => {
                set({ currentThread: threadId });
            },

            setMessages: (threadId: string, messages: Message[]) => {
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [threadId]: messages,
                    },
                }));
            },

            addMessage: (threadId: string, message: Message) => {
                const { messages } = get();
                const threadMessages = messages[threadId] || [];
                const updated = [...threadMessages, message];

                set((state) => ({
                    messages: {
                        ...state.messages,
                        [threadId]: updated,
                    },
                }));

                // Update conversation's last message
                get().updateConversation(threadId, {
                    last_message_body: message.body,
                    last_message_created_at: message.created_at,
                    unread_count: message.sender_id !== get().currentThread ?
                        (get().getUnreadCount(threadId) + 1) : 0
                });
            },

            updateMessage: (threadId: string, messageId: string, updates: Partial<Message>) => {
                const { messages } = get();
                const threadMessages = messages[threadId] || [];
                const updated = threadMessages.map(msg =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                );

                set((state) => ({
                    messages: {
                        ...state.messages,
                        [threadId]: updated,
                    },
                }));
            },

            removeMessage: (threadId: string, messageId: string) => {
                const { messages } = get();
                const threadMessages = messages[threadId] || [];
                const updated = threadMessages.filter(msg => msg.id !== messageId);

                set((state) => ({
                    messages: {
                        ...state.messages,
                        [threadId]: updated,
                    },
                }));
            },

            // Typing indicators
            setTypingIndicators: (threadId: string, indicators: TypingIndicator[]) => {
                set((state) => ({
                    typingIndicators: {
                        ...state.typingIndicators,
                        [threadId]: indicators,
                    },
                }));
            },

            addTypingIndicator: (threadId: string, indicator: TypingIndicator) => {
                const { typingIndicators } = get();
                const threadIndicators = typingIndicators[threadId] || [];
                const existingIndex = threadIndicators.findIndex(i => i.user_id === indicator.user_id);

                let updated;
                if (existingIndex >= 0) {
                    updated = [...threadIndicators];
                    updated[existingIndex] = indicator;
                } else {
                    updated = [...threadIndicators, indicator];
                }

                set((state) => ({
                    typingIndicators: {
                        ...state.typingIndicators,
                        [threadId]: updated,
                    },
                }));
            },

            removeTypingIndicator: (threadId: string, userId: string) => {
                const { typingIndicators } = get();
                const threadIndicators = typingIndicators[threadId] || [];
                const updated = threadIndicators.filter(i => i.user_id !== userId);

                set((state) => ({
                    typingIndicators: {
                        ...state.typingIndicators,
                        [threadId]: updated,
                    },
                }));
            },

            // Message reactions
            setMessageReactions: (messageId: string, reactions: MessageReaction[]) => {
                set((state) => ({
                    messageReactions: {
                        ...state.messageReactions,
                        [messageId]: reactions,
                    },
                }));
            },

            addMessageReaction: (messageId: string, reaction: MessageReaction) => {
                const { messageReactions } = get();
                const existing = messageReactions[messageId] || [];
                const updated = [...existing, reaction];

                set((state) => ({
                    messageReactions: {
                        ...state.messageReactions,
                        [messageId]: updated,
                    },
                }));
            },

            removeMessageReaction: (messageId: string, emoji: string) => {
                const { messageReactions } = get();
                const existing = messageReactions[messageId] || [];
                const updated = existing.filter(r => r.emoji !== emoji);

                set((state) => ({
                    messageReactions: {
                        ...state.messageReactions,
                        [messageId]: updated,
                    },
                }));
            },

            // Loading and error states
            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            setSending: (sending: boolean) => {
                set({ isSending: sending });
            },

            setError: (error: string | null) => {
                set({ error });
            },

            clearError: () => {
                set({ error: null });
            },

            // Getters
            getConversation: (threadId: string) => {
                return get().conversations.find(c => c.thread_id === threadId);
            },

            getMessages: (threadId: string) => {
                return get().messages[threadId] || [];
            },

            getUnreadCount: (threadId: string) => {
                const conversation = get().getConversation(threadId);
                return conversation?.unread_count || 0;
            },

            getTotalUnreadCount: () => {
                return get().conversations.reduce((total, conv) => total + conv.unread_count, 0);
            },

            isTyping: (threadId: string, userId: string) => {
                const indicators = get().typingIndicators[threadId] || [];
                return indicators.some(i => i.user_id === userId && i.is_typing);
            },

            // Utility actions
            markMessagesAsRead: (threadId: string) => {
                get().updateConversation(threadId, {
                    unread_count: 0,
                    last_read_at: new Date().toISOString()
                });
            },

            archiveConversation: (threadId: string) => {
                get().updateConversation(threadId, { is_archived: true });
            },

            unarchiveConversation: (threadId: string) => {
                get().updateConversation(threadId, { is_archived: false });
            },

            muteConversation: (threadId: string) => {
                get().updateConversation(threadId, { is_muted: true });
            },

            unmuteConversation: (threadId: string) => {
                get().updateConversation(threadId, { is_muted: false });
            },

            reset: () => {
                set({
                    conversations: [],
                    currentThread: null,
                    messages: {},
                    typingIndicators: {},
                    messageReactions: {},
                    isLoading: false,
                    isSending: false,
                    error: null,
                });
            },

            // Cleanup function to prevent memory leaks
            cleanup: () => {
                // Clear all data
                set({
                    conversations: [],
                    currentThread: null,
                    messages: {},
                    typingIndicators: {},
                    messageReactions: {},
                    isLoading: false,
                    isSending: false,
                    error: null,
                });
            },
        }),
        {
            name: 'chat-store',
        }
    )
);
