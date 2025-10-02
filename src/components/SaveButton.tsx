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
  variant?: 'default' | 'compact' | 'icon-only' | 'minimal';
  showToast?: boolean;
  showCount?: boolean;
  disabled?: boolean;
  onSaveChange?: (isSaved: boolean, saveCount: number) => void;
}

export default function SaveButton({ 
  productId, 
  productTitle,
  className = '',
  variant = 'default',
  showToast = true,
  showCount = false,
  disabled = false,
  onSaveChange
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { toggleSave, getSaveCount, isProductSaved } = useSaves();
  const { setLoading } = useLoadingStore();

  // Load initial state
  useEffect(() => {
    const loadSaveState = async () => {
      try {
        // Check if product is saved using store function
        const saved = isProductSaved(productId);
        setIsSaved(saved);
        const count = await getSaveCount(productId);
        setSaveCount(count);
      } catch (error) {
        console.error('Error loading save state:', error);
      }
    };

    loadSaveState();
  }, [productId, isProductSaved, getSaveCount]);

  const handleSave = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setLoading(true);

    try {
      const result = await toggleSave(productId);
      if (result.success) {
        // Toggle the saved state
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        
        const newCount = await getSaveCount(productId);
        setSaveCount(newCount);

        // Callback for parent component
        if (onSaveChange) {
          onSaveChange(newSavedState, newCount);
        }

        // Show toast
        if (showToast) {
          setToastMessage(newSavedState ? 'Saved!' : 'Removed from saved');
          setShowSuccessToast(true);
        }
      } else {
        console.error('Error toggling save:', result.error);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    const icon = isSaved ? (
      <BookmarkIconSolid className="h-4 w-4" />
    ) : (
      <BookmarkIcon className="h-4 w-4" />
    );

    switch (variant) {
      case 'icon-only':
        return icon;
      case 'compact':
        return (
          <>
            {icon}
            <span className="text-xs">{isSaved ? 'Saved' : 'Save'}</span>
          </>
        );
      case 'minimal':
        return (
          <>
            {icon}
            {showCount && saveCount > 0 && (
              <span className="text-xs text-muted-foreground">({saveCount})</span>
            )}
          </>
        );
      default:
        return (
          <>
            {icon}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
            {showCount && saveCount > 0 && (
              <span className="text-xs text-muted-foreground">({saveCount})</span>
            )}
          </>
        );
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'flex items-center gap-2 transition-colors duration-200';
    
    switch (variant) {
      case 'icon-only':
        return `${baseClasses} p-2 rounded-full hover:bg-gray-100 ${
          isSaved ? 'text-[#1aa1aa]' : 'text-slate-600'
        } ${className}`;
      case 'compact':
        return `${baseClasses} px-3 py-1.5 text-sm rounded-md border ${
          isSaved 
            ? 'bg-[#1aa1aa]/10 text-[#1aa1aa] border-[#1aa1aa]/20' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        } ${className}`;
      case 'minimal':
        return `${baseClasses} text-sm ${
          isSaved ? 'text-[#1aa1aa]' : 'text-slate-600'
        } ${className}`;
      default:
        return `${baseClasses} px-4 py-2 rounded-md border ${
          isSaved 
            ? 'bg-[#1aa1aa]/10 text-[#1aa1aa] border-[#1aa1aa]/20' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        } ${className}`;
    }
  };

  return (
    <>
      <button
        onClick={handleSave}
        disabled={disabled || isLoading}
        className={getButtonClasses()}
      >
        {getButtonContent()}
      </button>

      {showSuccessToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </>
  );
}