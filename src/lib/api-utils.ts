// Shared API utilities for consistent request handling

export interface ApiResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Simple request cache with size limit
const requestCache = new Map<string, { data: any; timestamp: number }>();
const REQUEST_CACHE_DURATION = 30000; // 30 seconds
const MAX_CACHE_SIZE = 100; // Limit cache size to prevent memory leaks

// Cached request helper
export async function cachedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    useCache: boolean = true
): Promise<T> {
    // Check cache first
    if (useCache) {
        const cached = requestCache.get(key);
        if (cached && Date.now() - cached.timestamp < REQUEST_CACHE_DURATION) {
            return cached.data;
        }
    }

    // Execute request
    const result = await requestFn();

    // Cache result
    if (useCache) {
        // Clean up old entries if cache is getting too large
        if (requestCache.size >= MAX_CACHE_SIZE) {
            const now = Date.now();
            const entries = Array.from(requestCache.entries());
            for (const [cacheKey, value] of entries) {
                if (now - value.timestamp > REQUEST_CACHE_DURATION) {
                    requestCache.delete(cacheKey);
                }
            }
        }

        requestCache.set(key, { data: result, timestamp: Date.now() });
    }

    return result;
}

// Clear cache for a specific key
export function clearCache(key: string) {
    requestCache.delete(key);
}

// Clear all cache
export function clearAllCache() {
    requestCache.clear();
}

// Helper to create consistent API results
export function createApiResult<T>(data: T): ApiResult<T> {
    return { success: true, data };
}

export function createApiError(error: string): ApiResult<never> {
    return { success: false, error };
}
