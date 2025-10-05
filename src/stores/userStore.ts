import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Re-export Supabase User type for consistency
export type User = SupabaseUser;

/**
 * User store state interface
 */
interface UserState {
    // State
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
    isAuthListenerSetup: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    initializeUser: () => Promise<void>;
    signOut: () => Promise<void>;
    clearUser: () => void;

    // Computed properties (getters)
    isAuthenticated: () => boolean;
    getUserId: () => string | null;
    getUserEmail: () => string | null;
    getDisplayName: () => string | null;
}

/**
 * Auth events that should update the user state
 */
const AUTH_EVENTS_WITH_SESSION = ['SIGNED_IN', 'TOKEN_REFRESHED', 'INITIAL_SESSION'] as const;
const AUTH_EVENTS_WITHOUT_SESSION = ['SIGNED_OUT'] as const;

/**
 * Error messages for better user experience
 */
const ERROR_MESSAGES = {
    USER_FETCH_FAILED: 'Failed to fetch user information',
    SIGN_OUT_FAILED: 'Failed to sign out',
    USER_INITIALIZATION_FAILED: 'Failed to initialize user session',
} as const;

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => {
            /**
             * Set up auth state listener (idempotent)
             * This should only be called once to avoid multiple listeners
             */
            const setupAuthListener = () => {
                const { isAuthListenerSetup } = get();

                if (isAuthListenerSetup) {
                    return;
                }

                supabase.auth.onAuthStateChange((event, session) => {
                    const currentState = get();

                    // Handle events with session (user signed in)
                    if (AUTH_EVENTS_WITH_SESSION.includes(event as any) && session?.user) {
                        set({
                            user: session.user,
                            isInitialized: true,
                            error: null
                        });
                        return;
                    }

                    // Handle events without session (user signed out)
                    if (AUTH_EVENTS_WITHOUT_SESSION.includes(event as any) || !session) {
                        set({
                            user: null,
                            isInitialized: true,
                            error: null
                        });
                        return;
                    }
                });

                set({ isAuthListenerSetup: true });
            };

            return {
                // Initial state
                user: null,
                isLoading: false,
                error: null,
                isInitialized: false,
                isAuthListenerSetup: false,

                // Actions
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

                    // Set up auth listener first (idempotent)
                    setupAuthListener();

                    // Don't re-initialize if already done and user exists
                    if (isInitialized && user) {
                        return;
                    }

                    set({ isLoading: true, error: null });

                    try {
                        const { data: { user: authUser }, error } = await supabase.auth.getUser();

                        // Handle specific auth errors gracefully
                        if (error) {
                            // Don't log session missing errors as they're expected during sign out
                            if (!error.message.includes('Auth session missing')) {
                                console.error('Error fetching user:', error);
                            }

                            set({
                                user: null,
                                error: null, // Don't show session missing errors to user
                                isLoading: false,
                                isInitialized: true
                            });
                            return;
                        }

                        set({
                            user: authUser,
                            error: null,
                            isLoading: false,
                            isInitialized: true
                        });

                    } catch (error: any) {
                        // Handle session missing errors gracefully
                        if (error.message?.includes('Auth session missing')) {
                            set({
                                user: null,
                                error: null,
                                isLoading: false,
                                isInitialized: true
                            });
                            return;
                        }

                        console.error('Error initializing user:', error);
                        set({
                            user: null,
                            error: ERROR_MESSAGES.USER_INITIALIZATION_FAILED,
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

                        // Clear all user data and reset state
                        // Note: Don't reset isInitialized to prevent re-initialization during sign out
                        set({
                            user: null,
                            error: null,
                            isLoading: false,
                            isInitialized: true, // Keep as true to prevent re-initialization
                            isAuthListenerSetup: true // Keep listener setup
                        });
                    } catch (error) {
                        set({
                            error: ERROR_MESSAGES.SIGN_OUT_FAILED,
                            isLoading: false
                        });
                    }
                },

                clearUser: () => {
                    set({
                        user: null,
                        error: null,
                        isLoading: false,
                        isInitialized: false,
                        isAuthListenerSetup: false
                    });
                },

                // Computed properties (getters)
                isAuthenticated: () => {
                    return !!get().user;
                },

                getUserId: () => {
                    return get().user?.id || null;
                },

                getUserEmail: () => {
                    return get().user?.email || null;
                },

                getDisplayName: () => {
                    const user = get().user;
                    return user?.user_metadata?.full_name || user?.email || null;
                },
            };
        },
        {
            name: 'user-store',
            partialize: (state) => ({
                // Only persist initialization state, not user data
                // User data should be fetched fresh on each load for security
                isInitialized: state.isInitialized
            }),
        }
    )
);

/**
 * Hook for accessing user store with better type safety
 */
export const useUser = () => {
    const store = useUserStore();
    return {
        user: store.user,
        isLoading: store.isLoading,
        error: store.error,
        isInitialized: store.isInitialized,
        isAuthenticated: store.isAuthenticated(),
        userId: store.getUserId(),
        userEmail: store.getUserEmail(),
        displayName: store.getDisplayName(),
        actions: {
            initializeUser: store.initializeUser,
            signOut: store.signOut,
            clearUser: store.clearUser,
        }
    };
};
