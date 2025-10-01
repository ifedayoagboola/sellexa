import { useEffect, useCallback } from 'react';
import { useSaveStore } from '@/stores/saveStoreEnhanced';
import { useLoadingStore } from '@/stores/loadingStore';
import {
    saveProduct,
    unsaveProduct,
    getUserSavedProducts,
    getProductSaveCount,
    isProductSaved,
    batchGetProductsSaveData,
    batchToggleSaves
} from '@/lib/savesEnhanced';

export function useSavesEnhanced() {
    const {
        savedProducts,
        saveCounts,
        error,
        setSavedProducts,
        addSavedProduct,
        removeSavedProduct,
        setSaveCount,
        setError,
        isProductSaved: isProductSavedInStore,
        getSaveCount: getSaveCountFromStore,
        clearError,
        batchUpdateSaveData,
    } = useSaveStore();

    const { setLoading } = useLoadingStore();

    // Load user's saved products on mount
    useEffect(() => {
        loadUserSavedProducts();
    }, []);

    const loadUserSavedProducts = async () => {
        setLoading(true, 'Loading saved products...');
        setError(null);

        try {
            const result = await getUserSavedProducts();
            if (result.success && result.productIds) {
                setSavedProducts(result.productIds);
            } else if (result.error) {
                setError(result.error);
            }
        } catch (error) {
            setError('Failed to load saved products');
        } finally {
            setLoading(false);
        }
    };

    // Batch load save data for multiple products
    const loadProductsSaveData = useCallback(async (productIds: string[]) => {
        try {
            const result = await batchGetProductsSaveData(productIds);
            if (result.success && result.data) {
                batchUpdateSaveData(result.data);
            }
        } catch (error) {
            console.error('Error loading products save data:', error);
        }
    }, [batchUpdateSaveData]);

    const loadProductSaveCount = async (productId: string) => {
        try {
            const result = await getProductSaveCount(productId);
            if (result.success && result.count !== undefined) {
                setSaveCount(productId, result.count);
            }
        } catch (error) {
            console.error('Error loading save count:', error);
        }
    };

    const toggleSave = async (productId: string): Promise<{ success: boolean; error?: string }> => {
        setLoading(true, 'Saving...');
        setError(null);

        try {
            const isCurrentlySaved = isProductSavedInStore(productId);

            const result = isCurrentlySaved
                ? await unsaveProduct(productId)
                : await saveProduct(productId);

            if (result.success) {
                if (isCurrentlySaved) {
                    removeSavedProduct(productId);
                } else {
                    addSavedProduct(productId);
                }

                if (result.saveCount !== undefined) {
                    setSaveCount(productId, result.saveCount);
                }

                return { success: true };
            } else {
                setError(result.error || 'Failed to save product');
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to save product';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Batch toggle multiple saves
    const batchToggleSavesAction = async (
        productIds: string[],
        action: 'save' | 'unsave'
    ): Promise<{ success: boolean; error?: string; results?: any[] }> => {
        setLoading(true, `${action === 'save' ? 'Saving' : 'Removing'} products...`);
        setError(null);

        try {
            const result = await batchToggleSaves(productIds, action);
            if (result.success && result.results) {
                // Update store with batch results
                result.results.forEach(({ productId, isSaved, saveCount }) => {
                    if (isSaved) {
                        addSavedProduct(productId);
                    } else {
                        removeSavedProduct(productId);
                    }
                    setSaveCount(productId, saveCount);
                });
                return { success: true, results: result.results };
            } else {
                setError(result.error || 'Failed to batch toggle saves');
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to batch toggle saves';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const checkProductSaveStatus = async (productId: string) => {
        try {
            const result = await isProductSaved(productId);
            if (result.success && result.isSaved !== undefined) {
                if (result.isSaved) {
                    addSavedProduct(productId);
                } else {
                    removeSavedProduct(productId);
                }
            }
        } catch (error) {
            console.error('Error checking save status:', error);
        }
    };

    return {
        // State
        savedProducts: Array.from(savedProducts),
        saveCounts,
        error,

        // Actions
        toggleSave,
        batchToggleSaves: batchToggleSavesAction,
        loadProductSaveCount,
        loadProductsSaveData,
        checkProductSaveStatus,
        loadUserSavedProducts,
        clearError,

        // Helpers
        isProductSaved: isProductSavedInStore,
        getSaveCount: getSaveCountFromStore,
    };
}

