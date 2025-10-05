import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from './userStore';

export interface Notification {
    id: string;
    user_id: string;
    type: 'product_like' | 'product_save' | 'message_received' | 'kyc_status' | 'product_update';
    title: string;
    message: string;
    data?: any;
    read: boolean;
    created_at: string;
    updated_at?: string;
}

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    lastFetch: number | null;

    // Actions
    fetchNotifications: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<boolean>;
    markAllAsRead: () => Promise<boolean>;
    deleteNotification: (notificationId: string) => Promise<boolean>;
    addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
    clearNotifications: () => void;

    // Getters
    getNotifications: () => Notification[];
    getUnreadNotifications: () => Notification[];
    getReadNotifications: () => Notification[];
    getUnreadCount: () => number;
    isStale: () => boolean;
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for notifications

export const useNotificationsStore = create<NotificationsState>()(
    persist(
        (set, get) => ({
            // Initial state
            notifications: [],
            unreadCount: 0,
            isLoading: false,
            error: null,
            lastFetch: null,

            // Actions
            fetchNotifications: async () => {
                const user = useUserStore.getState().user;
                if (!user) {
                    return;
                }

                const { isLoading, lastFetch } = get();

                // Don't fetch if already loading or recently fetched
                if (isLoading || (lastFetch && Date.now() - lastFetch < CACHE_DURATION)) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const { data: notifications, error } = await supabase
                        .from('notifications')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(50);

                    if (error) {
                        throw error;
                    }

                    const unreadCount = notifications?.filter(n => !n.read).length || 0;

                    set({
                        notifications: notifications || [],
                        unreadCount,
                        isLoading: false,
                        lastFetch: Date.now(),
                        error: null
                    });

                } catch (error: any) {
                    console.error('Error fetching notifications:', error);
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to fetch notifications'
                    });
                }
            },

            markAsRead: async (notificationId: string) => {
                const user = useUserStore.getState().user;
                if (!user) {
                    return false;
                }

                try {
                    const { error } = await supabase
                        .from('notifications')
                        .update({ read: true })
                        .eq('id', notificationId)
                        .eq('user_id', user.id);

                    if (error) {
                        throw error;
                    }

                    // Update local state
                    const { notifications } = get();
                    const updatedNotifications = notifications.map(notification =>
                        notification.id === notificationId
                            ? { ...notification, read: true }
                            : notification
                    );

                    const unreadCount = updatedNotifications.filter(n => !n.read).length;

                    set({
                        notifications: updatedNotifications,
                        unreadCount
                    });

                    return true;

                } catch (error: any) {
                    console.error(`Error marking notification ${notificationId} as read:`, error);
                    return false;
                }
            },

            markAllAsRead: async () => {
                const user = useUserStore.getState().user;
                if (!user) {
                    return false;
                }

                try {
                    const { error } = await supabase
                        .from('notifications')
                        .update({ read: true })
                        .eq('user_id', user.id)
                        .eq('read', false);

                    if (error) {
                        throw error;
                    }

                    // Update local state
                    const { notifications } = get();
                    const updatedNotifications = notifications.map(notification =>
                        ({ ...notification, read: true })
                    );

                    set({
                        notifications: updatedNotifications,
                        unreadCount: 0
                    });

                    return true;

                } catch (error: any) {
                    console.error('Error marking all notifications as read:', error);
                    return false;
                }
            },

            deleteNotification: async (notificationId: string) => {
                const user = useUserStore.getState().user;
                if (!user) {
                    return false;
                }

                try {
                    const { error } = await supabase
                        .from('notifications')
                        .delete()
                        .eq('id', notificationId)
                        .eq('user_id', user.id);

                    if (error) {
                        throw error;
                    }

                    // Update local state
                    const { notifications } = get();
                    const updatedNotifications = notifications.filter(
                        notification => notification.id !== notificationId
                    );

                    const unreadCount = updatedNotifications.filter(n => !n.read).length;

                    set({
                        notifications: updatedNotifications,
                        unreadCount
                    });

                    return true;

                } catch (error: any) {
                    console.error(`Error deleting notification ${notificationId}:`, error);
                    return false;
                }
            },

            addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => {
                const newNotification: Notification = {
                    ...notification,
                    id: `temp-${Date.now()}`,
                    created_at: new Date().toISOString()
                };

                const { notifications, unreadCount } = get();

                const updatedNotifications = [newNotification, ...notifications];
                const newUnreadCount = newNotification.read ? unreadCount : unreadCount + 1;

                set({
                    notifications: updatedNotifications,
                    unreadCount: newUnreadCount
                });
            },

            clearNotifications: () => {
                set({
                    notifications: [],
                    unreadCount: 0,
                    lastFetch: null
                });
            },

            // Getters
            getNotifications: () => {
                return get().notifications;
            },

            getUnreadNotifications: () => {
                return get().notifications.filter(n => !n.read);
            },

            getReadNotifications: () => {
                return get().notifications.filter(n => n.read);
            },

            getUnreadCount: () => {
                return get().unreadCount;
            },

            isStale: () => {
                const { lastFetch } = get();
                return !lastFetch || Date.now() - lastFetch > CACHE_DURATION;
            },
        }),
        {
            name: 'notifications-store',
            partialize: (state) => ({
                notifications: state.notifications,
                unreadCount: state.unreadCount,
                lastFetch: state.lastFetch
            })
        }
    )
);
