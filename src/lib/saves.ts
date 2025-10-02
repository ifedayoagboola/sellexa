import { supabase } from '@/integrations/supabase/client';

export interface SaveResult {
    success: boolean;
    error?: string;
    saveCount?: number;
}

export interface SaveData {
    productId: string;
    isSaved: boolean;
    saveCount: number;
}

// Simple cache for request deduplication
const requestCache = new Map<string, Promise<any>>();

// Helper to get cached request or create new one
async function getCachedRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (requestCache.has(key)) {
        return requestCache.get(key)!;
    }

    const promise = requestFn();
    requestCache.set(key, promise);

    // Clean up after 30 seconds
    setTimeout(() => {
        requestCache.delete(key);
    }, 30000);

    return promise;
}

export async function saveProduct(productId: string): Promise<SaveResult> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const { error } = await supabase
            .from('saves')
            .insert({ user_id: user.id, product_id: productId });

        if (error) {
            if (error.code === '23505') {
                return { success: true, saveCount: 0 }; // Already saved
            }
            return { success: false, error: error.message };
        }

        // Get updated save count
        const { data: countData } = await supabase
            .rpc('get_product_save_count', { product_uuid: productId });

        return {
            success: true,
            saveCount: countData || 0
        };
    } catch (error) {
        console.error('Error saving product:', error);
        return {
            success: false,
            error: 'Failed to save product'
        };
    }
}

export async function unsaveProduct(productId: string): Promise<SaveResult> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const { error } = await supabase
            .from('saves')
            .delete()
            .eq('product_id', productId)
            .eq('user_id', user.id);

        if (error) {
            return { success: false, error: error.message };
        }

        // Get updated save count
        const { data: countData } = await supabase
            .rpc('get_product_save_count', { product_uuid: productId });

        return {
            success: true,
            saveCount: countData || 0
        };
    } catch (error) {
        console.error('Error unsaving product:', error);
        return {
            success: false,
            error: 'Failed to unsave product'
        };
    }
}

export async function getUserSavedProducts(): Promise<{ success: boolean; productIds?: string[]; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const { data, error } = await supabase
            .from('saves')
            .select('product_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        const productIds = data?.map((item: { product_id: string }) => item.product_id) || [];
        return { success: true, productIds };
    } catch (error) {
        console.error('Error getting saved products:', error);
        return {
            success: false,
            error: 'Failed to get saved products'
        };
    }
}

export async function getProductSaveCount(productId: string): Promise<{ success: boolean; count?: number; error?: string }> {
    return getCachedRequest(`save_count_${productId}`, async () => {
        try {
            const { data, error } = await supabase
                .rpc('get_product_save_count', { product_uuid: productId });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, count: data || 0 };
        } catch (error) {
            console.error('Error getting save count:', error);
            return {
                success: false,
                error: 'Failed to get save count'
            };
        }
    });
}

export async function isProductSaved(productId: string): Promise<{ success: boolean; isSaved?: boolean; error?: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'User not authenticated' };
    }

    return getCachedRequest(`is_saved_${productId}_${user.id}`, async () => {
        try {
            const { data, error } = await supabase
                .rpc('is_product_saved_by_user', {
                    product_uuid: productId,
                    user_uuid: user.id
                });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, isSaved: data || false };
        } catch (error) {
            console.error('Error checking if product is saved:', error);
            return {
                success: false,
                error: 'Failed to check save status'
            };
        }
    });
}

// Clear cache helper
export function clearSaveCache() {
    requestCache.clear();
}