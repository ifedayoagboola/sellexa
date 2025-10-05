import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface User {
    id: string;
    email?: string;
    phone?: string;
    created_at: string;
    updated_at?: string;
    last_sign_in_at?: string;
    app_metadata: any;
    user_metadata: any;
    aud: string;
    role?: string;
}

interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    initializeUser: () => Promise<void>;
    signOut: () => Promise<void>;
    clearUser: () => void;

    // Getters
    isAuthenticated: () => boolean;
    getUserId: () => string | null;
    getUserEmail: () => string | null;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            error: null,
            isInitialized: false,

            setUser: (user: User | null) => {
                set({ user, error: null });
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            setError: (error: string | null) => {
                set({ error });
            },

            initializeUser: async () => {
                const { isInitialized, user } = get();

                // Don't re-initialize if already done and user exists
                if (isInitialized && user) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const { data: { user: authUser }, error } = await supabase.auth.getUser();

                    if (error) {
                        console.error('Error fetching user:', error);
                        set({ user: null, error: error.message, isLoading: false, isInitialized: true });
                        return;
                    }

                    set({
                        user: authUser,
                        error: null,
                        isLoading: false,
                        isInitialized: true
                    });

                    // Listen for auth state changes
                    supabase.auth.onAuthStateChange((event, session) => {
                        if (event === 'SIGNED_OUT' || !session) {
                            set({ user: null, isInitialized: true });
                        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                            set({ user: session.user, isInitialized: true });
                        }
                    });

                } catch (error: any) {
                    console.error('Error initializing user:', error);
                    set({
                        user: null,
                        error: error.message || 'Failed to initialize user',
                        isLoading: false,
                        isInitialized: true
                    });
                }
            },

            signOut: async () => {
                set({ isLoading: true });

                try {
                    const { error } = await supabase.auth.signOut();

                    if (error) {
                        set({ error: error.message, isLoading: false });
                        return;
                    }

                    set({ user: null, error: null, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.message || 'Failed to sign out',
                        isLoading: false
                    });
                }
            },

            clearUser: () => {
                set({ user: null, error: null, isLoading: false });
            },

            isAuthenticated: () => {
                return !!get().user;
            },

            getUserId: () => {
                return get().user?.id || null;
            },

            getUserEmail: () => {
                return get().user?.email || null;
            },
        }),
        {
            name: 'user-store',
            partialize: (state) => ({
                user: state.user,
                isInitialized: state.isInitialized
            }),
        }
    )
);
