'use client';

import { useEffect, useCallback } from 'react';
import { useUserStore, type User } from '@/stores/userStore';
import { useProfileStore } from '@/stores/profileStore';
import { useProductsStore } from '@/stores/productsStore';
import { useSavesStore } from '@/stores/savesStore';

/**
 * Props for the StoresProvider component
 */
interface StoresProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
  initialProducts?: any[] | null;
  initialProfile?: any;
}

/**
 * Provider component that initializes and manages all Zustand stores
 * This component ensures proper hydration of stores with server-side data
 * and sets up auth listeners for real-time state synchronization
 */
export default function StoresProvider({ 
  children, 
  initialUser,
  initialProducts,
  initialProfile 
}: StoresProviderProps) {
  const { user, initializeUser } = useUserStore();
  const { fetchCurrentProfile } = useProfileStore();
  const { fetchFeedProducts } = useProductsStore();
  const { fetchSavedProducts } = useSavesStore();

  /**
   * Initialize user store with server-side data and set up auth listeners
   */
  useEffect(() => {
    // Set initial user if provided from server-side rendering
    if (initialUser && !user) {
      useUserStore.getState().setUser(initialUser);
    }
    
    // Initialize user store to set up auth listeners
    initializeUser();
  }, [initializeUser, initialUser, user]);

  /**
   * Initialize dependent stores when user becomes available
   * This ensures all user-dependent data is fetched after authentication
   */
  const initializeUserDependentStores = useCallback(async () => {
    if (!user) return;

    try {
      // Initialize stores in parallel for better performance
      await Promise.allSettled([
        fetchCurrentProfile(),
        fetchSavedProducts(),
        fetchFeedProducts(),
      ]);
    } catch (error) {
      console.error('Error initializing user-dependent stores:', error);
    }
  }, [user, fetchCurrentProfile, fetchSavedProducts, fetchFeedProducts]);

  useEffect(() => {
    initializeUserDependentStores();
  }, [initializeUserDependentStores]);

  return <>{children}</>;
}
