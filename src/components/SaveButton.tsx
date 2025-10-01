'use client';

import { useState, useEffect } from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { useSaves } from '@/hooks/useSaves';
import { useLoadingStore } from '@/stores/loadingStore';
import Toast from './Toast';

interface SaveButtonProps {
  productId: string;
  productTitle: string;
  className?: string;
  variant?: 'default' | 'compact' | 'icon-only';
  showToast?: boolean;
}

export default function SaveButton({ 
  productId, 
  productTitle, 
  className = '',
  variant = 'default',
  showToast = true
}: SaveButtonProps) {
  const { 
    isProductSaved, 
    getSaveCount, 
    toggleSave, 
    loadProductSaveCount,
    error: globalError 
  } = useSaves();
  
  const { isLoading: globalLoading } = useLoadingStore();
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isSaved = isProductSaved(productId);
  const saveCount = getSaveCount(productId);

  // DISABLED: Auto-loading save count to prevent API overload
  // useEffect(() => {
  //   if (saveCount === 0) {
  //     loadProductSaveCount(productId);
  //   }
  // }, [productId, saveCount, loadProductSaveCount]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading || globalLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await toggleSave(productId);
      
      if (result.success) {
        if (showToast) {
          setToast({
            message: isSaved ? 'Product removed from saved' : 'Product saved!',
            type: 'success'
          });
        }
      } else {
        if (showToast) {
          setToast({
            message: result.error || 'Failed to save product',
            type: 'error'
          });
        }
      }
    } catch (error) {
      if (showToast) {
        setToast({
          message: 'Failed to save product',
          type: 'error'
        });
      }
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoadingState = isLoading || globalLoading;

  // Show global error if it exists
  useEffect(() => {
    if (globalError && showToast) {
      setToast({
        message: globalError,
        type: 'error'
      });
    }
  }, [globalError, showToast]);

  const baseClasses = "flex items-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    default: `space-x-2 px-4 py-2 rounded-lg ${
      isSaved 
        ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' 
        : 'bg-muted text-foreground hover:bg-muted/80'
    }`,
    compact: `space-x-1 px-2 py-1 rounded-md text-sm ${
      isSaved 
        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
        : 'bg-muted text-foreground hover:bg-muted/80'
    }`,
    'icon-only': className ? '' : `p-2 rounded-full ${
      isSaved 
        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
        : 'bg-muted text-foreground hover:bg-muted/80'
    }`
  };

  return (
    <>
      <button
        onClick={handleSave}
        disabled={isLoadingState}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        title={isSaved ? 'Remove from saved' : 'Save product'}
      >
        {isLoadingState ? (
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isSaved ? (
          <BookmarkIconSolid className={`h-4 w-4 ${variant === 'icon-only' && className ? 'text-blue-700' : ''}`} />
        ) : (
          <BookmarkIcon className={`h-4 w-4 ${variant === 'icon-only' && className ? 'text-gray-700' : ''}`} />
        )}
        
        {variant !== 'icon-only' && (
          <span className="text-sm">
            {isSaved ? 'Saved' : 'Save'}
            {variant === 'default' && saveCount > 0 && ` (${saveCount})`}
          </span>
        )}
      </button>
      
      {/* Toast Notification */}
      {toast && showToast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
