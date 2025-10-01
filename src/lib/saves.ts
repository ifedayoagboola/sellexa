import { supabase } from '@/integrations/supabase/client';

// Request throttling and caching
const requestCache = new Map<string, { data: any; timestamp: number }>();
const pendingRequests = new Map<string, Promise<any>>();
const REQUEST_CACHE_DURATION = 30000; // 30 seconds
const REQUEST_THROTTLE_DELAY = 1000; // 1 second between requests

// Throttled request helper with retry logic
async function throttledRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    useCache: boolean = true,
    maxRetries: number = 2
): Promise<T> {
    // Check cache first
    if (useCache) {
        const cached = requestCache.get(key);
        if (cached && Date.now() - cached.timestamp < REQUEST_CACHE_DURATION) {
            return cached.data;
        }
    }

    // Check if request is already pending
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key)!;
    }

    // Create new request with retry logic
    const requestPromise = new Promise<T>(async (resolve, reject) => {
        let attempts = 0;

        const attemptRequest = async () => {
            try {
                attempts++;
                const result = await requestFn();
                if (useCache) {
                    requestCache.set(key, { data: result, timestamp: Date.now() });
                }
                resolve(result);
            } catch (error) {
                if (attempts < maxRetries && shouldRetry(error)) {
                    // Exponential backoff: 500ms, 1000ms, 2000ms
                    const delay = 500 * Math.pow(2, attempts - 1);
                    setTimeout(attemptRequest, delay);
                } else {
                    reject(error);
                }
            } finally {
                if (attempts >= maxRetries) {
                    pendingRequests.delete(key);
                }
            }
        };

        // Initial delay for throttling
        setTimeout(attemptRequest, REQUEST_THROTTLE_DELAY);
    });

    pendingRequests.set(key, requestPromise);
    return requestPromise;
}

// Helper to determine if an error should trigger a retry
function shouldRetry(error: any): boolean {
    if (!error) return false;

    // Retry on network errors or connection issues
    const message = error.message?.toLowerCase() || '';
    return message.includes('network') ||
        message.includes('connection') ||
        message.includes('timeout') ||
        message.includes('err_connection_closed') ||
        message.includes('err_failed');
}

// Cache invalidation helper
function invalidateCache(pattern: string) {
    const keysToDelete: string[] = [];
    requestCache.forEach((_, key) => {
        if (key.includes(pattern)) {
            keysToDelete.push(key);
        }
    });
    keysToDelete.forEach(key => requestCache.delete(key));
}

// Clear all cache (useful for logout or major state changes)
export function clearSaveCache() {
    requestCache.clear();
    pendingRequests.clear();
}

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

export interface BatchSaveResult {
    success: boolean;
    error?: string;
    results?: Array<{
        productId: string;
        isSaved: boolean;
        saveCount: number;
    }>;
}

// Enhanced client-side save operations with better error handling and performance

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
            // Handle unique constraint violation gracefully
            if (error.code === '23505') {
                return { success: true, saveCount: 0 }; // Already saved
            }
            return { success: false, error: error.message };
        }

        // Invalidate cache for this product
        invalidateCache(productId);

        // Get updated save count
        const { data: countData, error: countError } = await supabase
            .rpc('get_product_save_count', { product_uuid: productId });

        if (countError) {
            console.error('Error getting save count:', countError);
        }

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

        // Invalidate cache for this product
        invalidateCache(productId);

        // Get updated save count
        const { data: countData, error: countError } = await supabase
            .rpc('get_product_save_count', { product_uuid: productId });

        if (countError) {
            console.error('Error getting save count:', countError);
        }

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
    const cacheKey = `save_count_${productId}`;

    return throttledRequest(cacheKey, async () => {
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

    const cacheKey = `is_saved_${productId}_${user.id}`;

    return throttledRequest(cacheKey, async () => {
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

// NEW: Batch operations for better performance

export async function batchGetProductsSaveData(productIds: string[]): Promise<{ success: boolean; data?: SaveData[]; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const { data, error } = await supabase
            .rpc('get_products_save_data' as any, {
                product_uuids: productIds,
                user_uuid: user.id
            });

        if (error) {
            return { success: false, error: error.message };
        }

        const saveData: SaveData[] = (data as any[])?.map((item: any) => ({
            productId: item.product_id,
            isSaved: item.is_saved,
            saveCount: item.save_count
        })) || [];

        return { success: true, data: saveData };
    } catch (error) {
        console.error('Error getting batch save data:', error);
        return {
            success: false,
            error: 'Failed to get batch save data'
        };
    }
}

export async function batchToggleSaves(
    productIds: string[],
    action: 'save' | 'unsave'
): Promise<BatchSaveResult> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const { data, error } = await supabase
            .rpc('batch_toggle_saves' as any, {
                product_uuids: productIds,
                user_uuid: user.id,
                action: action
            });

        if (error) {
            return { success: false, error: error.message };
        }

        const results = (data as any[])?.map((item: any) => ({
            productId: item.product_id,
            isSaved: action === 'save',
            saveCount: item.new_save_count
        })) || [];

        return { success: true, results };
    } catch (error) {
        console.error('Error batch toggling saves:', error);
        return {
            success: false,
            error: 'Failed to batch toggle saves'
        };
    }
}

// NEW: Get saved products with metadata for a dedicated saved page
export async function getUserSavedProductsWithMetadata(): Promise<{
    success: boolean;
    products?: Array<{
        productId: string;
        savedAt: string;
        productTitle: string;
        productPricePence: number;
        productImages: string[];
    }>;
    error?: string
}> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const { data, error } = await supabase
            .rpc('get_user_saved_products_with_metadata' as any, {
                user_uuid: user.id
            });

        if (error) {
            return { success: false, error: error.message };
        }

        const products = (data as any[])?.map((item: any) => ({
            productId: item.product_id,
            savedAt: item.saved_at,
            productTitle: item.product_title,
            productPricePence: item.product_price_pence,
            productImages: item.product_images || []
        })) || [];

        return { success: true, products };
    } catch (error) {
        console.error('Error getting saved products with metadata:', error);
        return {
            success: false,
            error: 'Failed to get saved products with metadata'
        };
    }
}

