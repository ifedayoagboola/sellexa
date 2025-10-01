'use client';

import { useState, useEffect } from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { useSaves } from '@/hooks/useSaves';
import { useLoadingStore } from '@/stores/loadingStore';
import Toast from './Toast';

interface SaveButtonEnhancedProps {
  productId: string;
  productTitle: string;
  className?: string;
  variant?: 'default' | 'compact' | 'icon-only' | 'minimal';
  showToast?: boolean;
  showCount?: boolean;
  disabled?: boolean;
  onSaveChange?: (isSaved: boolean, saveCount: number) => void;
}

export default function SaveButtonEnhanced({ 
  productId, 
  productTitle, 
  className = '',
  variant = 'default',
  showToast = true,
  showCount = true,
  disabled = false,
  onSaveChange
}: SaveButtonEnhancedProps) {
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
  const [isOptimistic, setIsOptimistic] = useState(false);

  const isSaved = isProductSaved(productId);
  const saveCount = getSaveCount(productId);

  // DISABLED: Auto-loading save count to prevent API overload
  // Load save count manually when needed
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (saveCount === 0) {
  //       loadProductSaveCount(productId);
  //     }
  //   }, 200);
  //   return () => clearTimeout(timeoutId);
  // }, [productId]);

  // Notify parent of changes
  useEffect(() => {
    if (onSaveChange) {
      onSaveChange(isSaved, saveCount);
    }
  }, [isSaved, saveCount, onSaveChange]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading || globalLoading || disabled) return;
    
    setIsLoading(true);
    setIsOptimistic(true);
    
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
      setIsOptimistic(false);
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

  const baseClasses = "flex items-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  
  const variantClasses = {
    default: `space-x-2 px-4 py-2 rounded-lg ${
      isSaved 
        ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 shadow-sm' 
        : 'bg-muted text-foreground hover:bg-muted/80 border border-transparent'
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
    }`,
    minimal: `space-x-1 text-sm ${
      isSaved 
        ? 'text-blue-700' 
        : 'text-muted-foreground hover:text-foreground'
    }`
  };

  const iconClasses = variant === 'icon-only' && className ? 
    (isSaved ? 'text-blue-700' : 'text-gray-700') : '';

  return (
    <>
      <button
        onClick={handleSave}
        disabled={isLoadingState || disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${className} ${
          isOptimistic ? 'opacity-75' : ''
        }`}
        title={isSaved ? 'Remove from saved' : 'Save product'}
        aria-label={isSaved ? 'Remove from saved' : 'Save product'}
      >
        {isLoadingState ? (
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isSaved ? (
          <BookmarkIconSolid className={`h-4 w-4 ${iconClasses}`} />
        ) : (
          <BookmarkIcon className={`h-4 w-4 ${iconClasses}`} />
        )}
        
        {variant !== 'icon-only' && (
          <span className="text-sm">
            {isSaved ? 'Saved' : 'Save'}
            {showCount && saveCount > 0 && ` (${saveCount})`}
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

