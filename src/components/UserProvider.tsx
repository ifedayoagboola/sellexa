'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

interface UserProviderProps {
  children: React.ReactNode;
  initialUser?: any;
}

export default function UserProvider({ children, initialUser }: UserProviderProps) {
  const { initializeUser, setUser, isInitialized } = useUserStore();

  useEffect(() => {
    // If we have an initial user from server-side rendering, set it immediately
    if (initialUser && !isInitialized) {
      setUser(initialUser);
    }
    
    // Always initialize to set up auth listeners and handle client-side auth changes
    initializeUser();
  }, [initialUser, setUser, initializeUser, isInitialized]);

  return <>{children}</>;
}
