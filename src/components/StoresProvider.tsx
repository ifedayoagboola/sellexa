'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useProfileStore } from '@/stores/profileStore';
import { useProductsStore } from '@/stores/productsStore';
import { useSavesStore } from '@/stores/savesStore';
// import { useNotificationsStore } from '@/stores/notificationsStore';

interface StoresProviderProps {
  children: React.ReactNode;
  initialUser?: any;
  initialProducts?: any[] | null;
  initialProfile?: any;
}

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
  // const { fetchNotifications } = useNotificationsStore();

  useEffect(() => {
    // Initialize user store first
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    // Initialize other stores when user is available
    if (user) {
      // Fetch profile data
      fetchCurrentProfile();
      
      // Fetch saved products
      fetchSavedProducts();
      
      // Fetch notifications (disabled until notifications table is created)
      // fetchNotifications();
      
      // Fetch feed products
      fetchFeedProducts();
    }
  }, [user, fetchCurrentProfile, fetchSavedProducts, fetchFeedProducts]);

  return <>{children}</>;
}
