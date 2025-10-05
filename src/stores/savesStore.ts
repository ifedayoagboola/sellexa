import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from './userStore';

export interface SaveData {
    productId: string;
    saveCount: number;
    isSaved: boolean;
    lastUpdated: number;
}

export interface SavedProduct {
    product_id: string;
    created_at: string;
    product: {
        id: string;
        title: string;
        price_pence: number;
        images: string[];
        status: string;
        profiles: {
            handle: string;
            name: string | null;
        };
    };
}

interface SavesState {
    // Save data cache
    saveData: Record<string, SaveData>;
    isLoadingSave: Record<string, boolean>;
    saveError: Record<string, string | null>;

    // Saved products list
    savedProducts: SavedProduct[];
    isLoadingSavedProducts: boolean;
    savedProductsError: string | null;
    lastSavedProductsFetch: number | null;

    // Actions
    toggleSave: (productId: string) => Promise<boolean>;
    fetchSaveData: (productId: string) => Promise<void>;
    fetchSavedProducts: () => Promise<void>;
    clearSaveData: (productId: string) => void;
    clearAllSaveData: () => void;

    // Getters
    getSaveData: (productId: string) => SaveData | null;
    isSaved: (productId: string) => boolean;
    getSaveCount: (productId: string) => number;
    getSavedProducts: () => SavedProduct[];
    isSavedProductsStale: () => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useSavesStore = create<SavesState>()(
    persist(
        (set, get) => ({
            // Initial state
            saveData: {},
            isLoadingSave: {},
            saveError: {},

            savedProducts: [],
            isLoadingSavedProducts: false,
            savedProductsError: null,
            lastSavedProductsFetch: null,

            // Actions
            toggleSave: async (productId: string) => {
                const user = useUserStore.getState().user;
                if (!user) {
                    return false;
                }

                const { saveData, isLoadingSave } = get();

                if (isLoadingSave[productId]) {
                    return false;
                }

                set({
                    isLoadingSave: { ...isLoadingSave, [productId]: true },
                    saveError: { ...get().saveError, [productId]: null }
                });

                try {
                    const currentSaveData = saveData[productId];
                    const isCurrentlySaved = currentSaveData?.isSaved || false;

                    if (isCurrentlySaved) {
                        // Remove save
                        const { error } = await supabase
                            .from('saves')
                            .delete()
                            .eq('product_id', productId)
                            .eq('user_id', user.id);

                        if (error) {
                            throw error;
                        }

                        // Update local state
                        const newSaveCount = Math.max(0, (currentSaveData?.saveCount || 1) - 1);
                        set({
                            saveData: {
                                ...saveData,
                                [productId]: {
                                    productId,
                                    saveCount: newSaveCount,
                                    isSaved: false,
                                    lastUpdated: Date.now()
                                }
                            },
                            isLoadingSave: { ...isLoadingSave, [productId]: false }
                        });

                        // Remove from saved products if exists
                        const { savedProducts } = get();
                        set({
                            savedProducts: savedProducts.filter(item => item.product_id !== productId)
                        });

                    } else {
                        // Add save
                        const { error } = await supabase
                            .from('saves')
                            .insert({
                                product_id: productId,
                                user_id: user.id
                            });

                        if (error) {
                            throw error;
                        }

                        // Update local state
                        const newSaveCount = (currentSaveData?.saveCount || 0) + 1;
                        set({
                            saveData: {
                                ...saveData,
                                [productId]: {
                                    productId,
                                    saveCount: newSaveCount,
                                    isSaved: true,
                                    lastUpdated: Date.now()
                                }
                            },
                            isLoadingSave: { ...isLoadingSave, [productId]: false }
                        });
                    }

                    return true;

                } catch (error: any) {
                    console.error(`Error toggling save for product ${productId}:`, error);
                    set({
                        isLoadingSave: { ...isLoadingSave, [productId]: false },
                        saveError: { ...get().saveError, [productId]: error.message || 'Failed to save product' }
                    });
                    return false;
                }
            },

            fetchSaveData: async (productId: string) => {
                const user = useUserStore.getState().user;
                if (!user) {
                    return;
                }

                const { saveData, isLoadingSave } = get();

                // Return cached data if exists and recent
                const existingData = saveData[productId];
                if (existingData && Date.now() - existingData.lastUpdated < CACHE_DURATION) {
                    return;
                }

                if (isLoadingSave[productId]) {
                    return;
                }

                set({
                    isLoadingSave: { ...isLoadingSave, [productId]: true },
                    saveError: { ...get().saveError, [productId]: null }
                });

                try {
                    // Get save count and user's save status
                    const [saveCountResult, userSaveResult] = await Promise.all([
                        supabase
                            .from('saves')
                            .select('id', { count: 'exact' })
                            .eq('product_id', productId),
                        supabase
                            .from('saves')
                            .select('id')
                            .eq('product_id', productId)
                            .eq('user_id', user.id)
                            .maybeSingle()
                    ]);

                    if (saveCountResult.error) {
                        throw saveCountResult.error;
                    }

                    if (userSaveResult.error) {
                        throw userSaveResult.error;
                    }

                    const saveCount = saveCountResult.count || 0;
                    const isSaved = !!userSaveResult.data;

                    set({
                        saveData: {
                            ...saveData,
                            [productId]: {
                                productId,
                                saveCount,
                                isSaved,
                                lastUpdated: Date.now()
                            }
                        },
                        isLoadingSave: { ...isLoadingSave, [productId]: false }
                    });

                } catch (error: any) {
                    console.error(`Error fetching save data for ${productId}:`, error);
                    set({
                        isLoadingSave: { ...isLoadingSave, [productId]: false },
                        saveError: { ...get().saveError, [productId]: error.message || 'Failed to fetch save data' }
                    });
                }
            },

            fetchSavedProducts: async () => {
                const user = useUserStore.getState().user;
                if (!user) {
                    return;
                }

                const { isLoadingSavedProducts, lastSavedProductsFetch } = get();

                // Don't fetch if already loading or recently fetched
                if (isLoadingSavedProducts ||
                    (lastSavedProductsFetch && Date.now() - lastSavedProductsFetch < CACHE_DURATION)) {
                    return;
                }

                set({ isLoadingSavedProducts: true, savedProductsError: null });

                try {
                    const { data: savedProducts, error } = await supabase
                        .from('saves')
                        .select(`
              product_id,
              created_at,
              product:products!inner(
                id,
                title,
                price_pence,
                images,
                status,
                profiles:profiles!products_user_id_fkey(
                  handle,
                  name
                )
              )
            `)
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (error) {
                        throw error;
                    }

                    set({
                        savedProducts: savedProducts || [],
                        isLoadingSavedProducts: false,
                        lastSavedProductsFetch: Date.now(),
                        savedProductsError: null
                    });

                } catch (error: any) {
                    console.error('Error fetching saved products:', error);
                    set({
                        isLoadingSavedProducts: false,
                        savedProductsError: error.message || 'Failed to fetch saved products'
                    });
                }
            },

            clearSaveData: (productId: string) => {
                const { saveData, isLoadingSave, saveError } = get();
                const newSaveData = { ...saveData };
                const newIsLoadingSave = { ...isLoadingSave };
                const newSaveError = { ...saveError };

                delete newSaveData[productId];
                delete newIsLoadingSave[productId];
                delete newSaveError[productId];

                set({
                    saveData: newSaveData,
                    isLoadingSave: newIsLoadingSave,
                    saveError: newSaveError
                });
            },

            clearAllSaveData: () => {
                set({
                    saveData: {},
                    isLoadingSave: {},
                    saveError: {},
                    savedProducts: [],
                    lastSavedProductsFetch: null
                });
            },

            // Getters
            getSaveData: (productId: string) => {
                return get().saveData[productId] || null;
            },

            isSaved: (productId: string) => {
                const saveData = get().saveData[productId];
                return saveData?.isSaved || false;
            },

            getSaveCount: (productId: string) => {
                const saveData = get().saveData[productId];
                return saveData?.saveCount || 0;
            },

            getSavedProducts: () => {
                return get().savedProducts;
            },

            isSavedProductsStale: () => {
                const { lastSavedProductsFetch } = get();
                return !lastSavedProductsFetch || Date.now() - lastSavedProductsFetch > CACHE_DURATION;
            },
        }),
        {
            name: 'saves-store',
            partialize: (state) => ({
                saveData: state.saveData,
                savedProducts: state.savedProducts,
                lastSavedProductsFetch: state.lastSavedProductsFetch
            })
        }
    )
);
