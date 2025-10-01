'use client';

import { useState } from 'react';
import { BookmarkIcon, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/outline';
import { useSaves } from '@/hooks/useSaves';
import { useLoadingStore } from '@/stores/loadingStore';
import Toast from './Toast';

interface BatchSaveActionsProps {
  productIds: string[];
  selectedProducts: string[];
  onSelectionChange: (selected: string[]) => void;
  className?: string;
}

export default function BatchSaveActions({ 
  productIds, 
  selectedProducts, 
  onSelectionChange,
  className = '' 
}: BatchSaveActionsProps) {
  const {
    batchToggleSaves,
    isProductSaved,
    getSaveCount,
    error 
  } = useSaves();
  
  const { isLoading } = useLoadingStore();
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const allSelected = selectedProducts.length === productIds.length;
  const someSelected = selectedProducts.length > 0;
  const savedCount = selectedProducts.filter(id => isProductSaved(id)).length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...productIds]);
    }
  };

  const handleBatchSave = async () => {
    if (selectedProducts.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const result = await batchToggleSaves(selectedProducts, 'save');
      
      if (result.success) {
        setToast({
          message: `Saved ${selectedProducts.length} products`,
          type: 'success'
        });
        onSelectionChange([]); // Clear selection
      } else {
        setToast({
          message: result.error || 'Failed to save products',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        message: 'Failed to save products',
        type: 'error'
      });
      console.error('Error batch saving:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchUnsave = async () => {
    if (selectedProducts.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const result = await batchToggleSaves(selectedProducts, 'unsave');
      
      if (result.success) {
        setToast({
          message: `Removed ${selectedProducts.length} products from saved`,
          type: 'success'
        });
        onSelectionChange([]); // Clear selection
      } else {
        setToast({
          message: result.error || 'Failed to unsave products',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        message: 'Failed to unsave products',
        type: 'error'
      });
      console.error('Error batch unsaving:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoadingState = isLoading || isProcessing;

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Select All Button */}
        <button
          onClick={handleSelectAll}
          disabled={isLoadingState}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>

        {/* Batch Actions */}
        {someSelected && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedProducts.length} selected
            </span>
            
            <button
              onClick={handleBatchSave}
              disabled={isLoadingState}
              className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50"
            >
              <BookmarkIcon className="h-4 w-4" />
              <span>Save All</span>
            </button>

            {savedCount > 0 && (
              <button
                onClick={handleBatchUnsave}
                disabled={isLoadingState}
                className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
              >
                <BookmarkIconSolid className="h-4 w-4" />
                <span>Unsave All</span>
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

