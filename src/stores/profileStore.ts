import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from './userStore';

export interface Profile {
    id: string;
    handle?: string | null;
    name?: string | null;
    avatar_url?: string | null;
    city?: string | null;
    postcode?: string | null;
    created_at: string;
    updated_at?: string;
    kyc_status?: string | null;
    business_name?: string | null;
    business_description?: string | null;
    business_logo_url?: string | null;
    business_address?: string | null;
    business_city?: string | null;
    business_country?: string | null;
    business_phone?: string | null;
    business_whatsapp?: string | null;
    business_website?: string | null;
    business_instagram?: string | null;
    business_twitter?: string | null;
    business_facebook?: string | null;
    kyc_submitted_at?: string | null;
    kyc_verified_at?: string | null;
    kyc_rejection_reason?: string | null;
}

interface ProfileState {
    // Current user profile
    currentProfile: Profile | null;
    isLoadingProfile: boolean;
    profileError: string | null;
    lastProfileFetch: number | null;

    // Other user profiles cache
    profilesCache: Record<string, Profile | null>;
    isLoadingProfileById: Record<string, boolean>;
    profileErrorById: Record<string, string | null>;

    // Actions
    fetchCurrentProfile: () => Promise<void>;
    fetchProfileById: (userId: string) => Promise<Profile | null>;
    updateProfile: (updates: any) => Promise<boolean>;
    clearProfileCache: () => void;

    // Getters
    getCurrentProfile: () => Profile | null;
    getProfileById: (userId: string) => Profile | null;
    isProfileStale: () => boolean;
    isAuthenticated: () => boolean;
    isKYCVerified: () => boolean;
    isKYCPending: () => boolean;
    isKYCRejected: () => boolean;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for profiles

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            // Initial state
            currentProfile: null,
            isLoadingProfile: false,
            profileError: null,
            lastProfileFetch: null,

            profilesCache: {},
            isLoadingProfileById: {},
            profileErrorById: {},

            // Actions
            fetchCurrentProfile: async () => {
                const { isLoadingProfile, lastProfileFetch } = get();

                // Don't fetch if already loading or recently fetched
                if (isLoadingProfile || (lastProfileFetch && Date.now() - lastProfileFetch < CACHE_DURATION)) {
                    return;
                }

                const user = useUserStore.getState().user;
                if (!user) {
                    return;
                }

                set({ isLoadingProfile: true, profileError: null });

                try {
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .maybeSingle();

                    if (error) {
                        throw error;
                    }

                    set({
                        currentProfile: profile,
                        isLoadingProfile: false,
                        lastProfileFetch: Date.now(),
                        profileError: null
                    });

                } catch (error: any) {
                    console.error('Error fetching current profile:', error);
                    set({
                        isLoadingProfile: false,
                        profileError: error.message || 'Failed to fetch profile'
                    });
                }
            },

            fetchProfileById: async (userId: string) => {
                const { profilesCache, isLoadingProfileById } = get();

                // Return cached profile if exists
                if (profilesCache[userId]) {
                    return profilesCache[userId];
                }

                if (isLoadingProfileById[userId]) {
                    return null;
                }

                set({
                    isLoadingProfileById: { ...isLoadingProfileById, [userId]: true },
                    profileErrorById: { ...get().profileErrorById, [userId]: null }
                });

                try {
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select(`
              id,
              handle,
              name,
              avatar_url,
              city,
              postcode,
              created_at,
              kyc_status,
              business_name,
              business_logo_url
            `)
                        .eq('id', userId)
                        .maybeSingle();

                    if (error) {
                        throw error;
                    }

                    set({
                        profilesCache: { ...profilesCache, [userId]: profile },
                        isLoadingProfileById: { ...isLoadingProfileById, [userId]: false },
                        profileErrorById: { ...get().profileErrorById, [userId]: null }
                    });

                    return profile;

                } catch (error: any) {
                    console.error(`Error fetching profile for ${userId}:`, error);
                    set({
                        isLoadingProfileById: { ...isLoadingProfileById, [userId]: false },
                        profileErrorById: { ...get().profileErrorById, [userId]: error.message || 'Failed to fetch profile' }
                    });
                    return null;
                }
            },

            updateProfile: async (updates: any) => {
                const user = useUserStore.getState().user;
                if (!user) {
                    return false;
                }

                try {
                    const { error } = await supabase
                        .from('profiles')
                        .update(updates)
                        .eq('id', user.id);

                    if (error) {
                        throw error;
                    }

                    // Update local state
                    const { currentProfile } = get();
                    set({
                        currentProfile: currentProfile ? { ...currentProfile, ...updates } : null
                    });

                    return true;

                } catch (error: any) {
                    console.error('Error updating profile:', error);
                    return false;
                }
            },

            clearProfileCache: () => {
                set({
                    currentProfile: null,
                    lastProfileFetch: null,
                    profilesCache: {}
                });
            },

            // Getters
            getCurrentProfile: () => {
                return get().currentProfile;
            },

            getProfileById: (userId: string) => {
                return get().profilesCache[userId] || null;
            },

            isProfileStale: () => {
                const { lastProfileFetch } = get();
                return !lastProfileFetch || Date.now() - lastProfileFetch > CACHE_DURATION;
            },

            isAuthenticated: () => {
                return useUserStore.getState().isAuthenticated();
            },

            isKYCVerified: () => {
                const { currentProfile } = get();
                return currentProfile?.kyc_status === 'verified';
            },

            isKYCPending: () => {
                const { currentProfile } = get();
                return currentProfile?.kyc_status === 'pending';
            },

            isKYCRejected: () => {
                const { currentProfile } = get();
                return currentProfile?.kyc_status === 'rejected';
            },
        }),
        {
            name: 'profile-store',
            partialize: (state) => ({
                currentProfile: state.currentProfile,
                lastProfileFetch: state.lastProfileFetch,
                profilesCache: state.profilesCache
            })
        }
    )
);
