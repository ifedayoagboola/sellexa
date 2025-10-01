'use client';

import { useEffect } from 'react';
import { useSaveStore } from '@/stores/saveStore';

interface SaveProviderProps {
  children: React.ReactNode;
  initialSaveCount?: number;
  initialIsSaved?: boolean;
  productId: string;
}

export default function SaveProvider({ 
  children, 
  initialSaveCount = 0, 
  initialIsSaved = false,
  productId 
}: SaveProviderProps) {
  const { setSaveCount, setSavedProducts } = useSaveStore();

  useEffect(() => {
    // Initialize with server-side data
    if (initialSaveCount > 0) {
      setSaveCount(productId, initialSaveCount);
    }
    
    if (initialIsSaved) {
      setSavedProducts([productId]);
    }
  }, [productId, initialSaveCount, initialIsSaved]); // Remove store functions from dependencies

  return <>{children}</>;
}
