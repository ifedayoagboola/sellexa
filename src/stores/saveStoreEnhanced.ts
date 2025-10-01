import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SaveData {
    productId: string;
    isSaved: boolean;
    saveCount: number;
}

interface SaveState {
    // State
    savedProducts: Set<string>;
    saveCounts: Record<string, number>;
    error: string | null;

    // Actions
    setSavedProducts: (productIds: string[]) => void;
    addSavedProduct: (productId: string) => void;
    removeSavedProduct: (productId: string) => void;
    setSaveCount: (productId: string, count: number) => void;
    batchUpdateSaveData: (data: SaveData[]) => void;
    setError: (error: string | null) => void;
    isProductSaved: (productId: string) => boolean;
    getSaveCount: (productId: string) => number;
    clearError: () => void;
    reset: () => void;
}

export const useSaveStore = create<SaveState>()(
    devtools(
        (set, get) => ({
            // Initial state
            savedProducts: new Set(),
            saveCounts: {},
            error: null,

            // Actions
            setSavedProducts: (productIds: string[]) => {
                set({ savedProducts: new Set(productIds) });
            },

            addSavedProduct: (productId: string) => {
                const { savedProducts, saveCounts } = get();
                const newSavedProducts = new Set(savedProducts);
                newSavedProducts.add(productId);

                set({
                    savedProducts: newSavedProducts,
                    saveCounts: {
                        ...saveCounts,
                        [productId]: (saveCounts[productId] || 0) + 1,
                    },
                });
            },

            removeSavedProduct: (productId: string) => {
                const { savedProducts, saveCounts } = get();
                const newSavedProducts = new Set(savedProducts);
                newSavedProducts.delete(productId);

                set({
                    savedProducts: newSavedProducts,
                    saveCounts: {
                        ...saveCounts,
                        [productId]: Math.max((saveCounts[productId] || 1) - 1, 0),
                    },
                });
            },

            setSaveCount: (productId: string, count: number) => {
                set((state) => ({
                    saveCounts: {
                        ...state.saveCounts,
                        [productId]: count,
                    },
                }));
            },

            // Batch update multiple products' save data
            batchUpdateSaveData: (data: SaveData[]) => {
                const { savedProducts, saveCounts } = get();
                const newSavedProducts = new Set(savedProducts);
                const newSaveCounts = { ...saveCounts };

                data.forEach(({ productId, isSaved, saveCount }) => {
                    if (isSaved) {
                        newSavedProducts.add(productId);
                    } else {
                        newSavedProducts.delete(productId);
                    }
                    newSaveCounts[productId] = saveCount;
                });

                set({
                    savedProducts: newSavedProducts,
                    saveCounts: newSaveCounts,
                });
            },

            setError: (error: string | null) => {
                set({ error });
            },

            isProductSaved: (productId: string) => {
                return get().savedProducts.has(productId);
            },

            getSaveCount: (productId: string) => {
                return get().saveCounts[productId] || 0;
            },

            clearError: () => {
                set({ error: null });
            },

            reset: () => {
                set({
                    savedProducts: new Set(),
                    saveCounts: {},
                    error: null,
                });
            },
        }),
        {
            name: 'save-store-enhanced',
        }
    )
);

