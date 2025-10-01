'use client';

import React from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useSaves } from '@/hooks/useSaves';

interface SaveCountProps {
  productId: string;
  showIcon?: boolean;
  className?: string;
}

export default function SaveCount({ 
  productId, 
  showIcon = true, 
  className = '' 
}: SaveCountProps) {
  const { 
    isProductSaved, 
    getSaveCount
  } = useSaves();

  const isSaved = isProductSaved(productId);
  const saveCount = getSaveCount(productId);

  // DISABLED: Auto-loading save count to prevent API overload
  // useEffect(() => {
  //   if (saveCount === 0) {
  //     loadProductSaveCount(productId);
  //   }
  // }, [productId, saveCount, loadProductSaveCount]);

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {showIcon && (
        <div className="flex items-center space-x-1">
          <BookmarkIcon className={`h-4 w-4 ${isSaved ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`font-medium ${isSaved ? 'text-blue-600' : 'text-muted-foreground'}`}>
            {saveCount}
          </span>
        </div>
      )}
      <span className="text-muted-foreground">
        {`${saveCount} ${saveCount === 1 ? 'save' : 'saves'}`}
      </span>
    </div>
  );
}
