import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
    id: string;
    title: string;
    description?: string | null;
    price_pence: number;
    status: 'AVAILABLE' | 'RESTOCKING' | 'SOLD';
    images: string[];
    city?: string | null;
    postcode?: string | null;
    category: 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER';
    tags?: string[];
    user_id: string;
    created_at: string;
    updated_at?: string;
    profiles?: {
        handle: string;
        name: string | null;
        avatar_url?: string | null;
        business_name?: string | null;
        business_logo_url?: string | null;
    };
}

export interface ProductFilters {
    category?: string;
    status?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

interface ProductsState {
    // Feed products (grouped by seller)
    feedProducts: Record<string, { seller: any; products: Product[] }>;
    feedProductsList: Product[];
    isLoadingFeed: boolean;
    feedError: string | null;
    lastFeedFetch: number | null;

    // Category products
    categoryProducts: Record<string, Product[]>;
    isLoadingCategory: Record<string, boolean>;
    categoryError: Record<string, string | null>;
    lastCategoryFetch: Record<string, number | null>;

    // Individual product cache
    productCache: Record<string, Product>;
    isLoadingProduct: Record<string, boolean>;
    productError: Record<string, string | null>;

    // Seller products
    sellerProducts: Record<string, Product[]>;
    isLoadingSeller: Record<string, boolean>;
    sellerError: Record<string, string | null>;
    lastSellerFetch: Record<string, number | null>;

    // Actions
    fetchFeedProducts: () => Promise<void>;
    fetchCategoryProducts: (category: string) => Promise<void>;
    fetchProduct: (id: string) => Promise<Product | null>;
    fetchSellerProducts: (sellerId: string) => Promise<void>;
    searchProducts: (filters: ProductFilters) => Promise<Product[]>;
    clearCache: () => void;
    clearCategoryCache: (category: string) => void;
    clearSellerCache: (sellerId: string) => void;

    // Getters
    getFeedProducts: () => Product[];
    getCategoryProducts: (category: string) => Product[];
    getProduct: (id: string) => Product | null;
    getSellerProducts: (sellerId: string) => Product[];
    isFeedStale: () => boolean;
    isCategoryStale: (category: string) => boolean;
    isSellerStale: (sellerId: string) => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProductsStore = create<ProductsState>()(
    persist(
        (set, get) => ({
            // Initial state
            feedProducts: {},
            feedProductsList: [],
            isLoadingFeed: false,
            feedError: null,
            lastFeedFetch: null,

            categoryProducts: {},
            isLoadingCategory: {},
            categoryError: {},
            lastCategoryFetch: {},

            productCache: {},
            isLoadingProduct: {},
            productError: {},

            sellerProducts: {},
            isLoadingSeller: {},
            sellerError: {},
            lastSellerFetch: {},

            // Actions
            fetchFeedProducts: async () => {
                const { isLoadingFeed, lastFeedFetch } = get();

                // Don't fetch if already loading or recently fetched
                if (isLoadingFeed || (lastFeedFetch && Date.now() - lastFeedFetch < CACHE_DURATION)) {
                    return;
                }

                set({ isLoadingFeed: true, feedError: null });

                try {
                    const { data: products, error } = await supabase
                        .from('products')
                        .select(`
              id,
              title,
              price_pence,
              status,
              images,
              city,
              category,
              user_id,
              created_at,
              profiles:profiles!products_user_id_fkey(
                handle,
                name,
                avatar_url,
                business_name,
                business_logo_url
              )
            `)
                        .order('created_at', { ascending: false })
                        .limit(50);

                    if (error) {
                        throw error;
                    }

                    // Group products by seller
                    const productsBySeller = products?.reduce((acc, product) => {
                        const sellerId = product.user_id;
                        const sellerProfile = product.profiles as any;

                        if (!acc[sellerId]) {
                            acc[sellerId] = {
                                seller: sellerProfile,
                                products: []
                            };
                        }
                        acc[sellerId].products.push(product);
                        return acc;
                    }, {} as Record<string, { seller: any; products: Product[] }>) || {};

                    // Convert to array and sort by product count
                    const sellerSections = Object.values(productsBySeller)
                        .filter(section => section.products.length > 0)
                        .sort((a, b) => b.products.length - a.products.length);

                    const feedProducts = sellerSections.reduce((acc, section) => {
                        const sellerId = section.seller?.id || section.products[0]?.user_id;
                        acc[sellerId] = section;
                        return acc;
                    }, {} as Record<string, { seller: any; products: Product[] }>);

                    set({
                        feedProducts,
                        feedProductsList: products || [],
                        isLoadingFeed: false,
                        lastFeedFetch: Date.now(),
                        feedError: null
                    });

                } catch (error: any) {
                    console.error('Error fetching feed products:', error);
                    set({
                        isLoadingFeed: false,
                        feedError: error.message || 'Failed to fetch products'
                    });
                }
            },

            fetchCategoryProducts: async (category: string) => {
                const { isLoadingCategory, lastCategoryFetch } = get();

                if (isLoadingCategory[category] ||
                    (lastCategoryFetch[category] && Date.now() - lastCategoryFetch[category] < CACHE_DURATION)) {
                    return;
                }

                set({
                    isLoadingCategory: { ...isLoadingCategory, [category]: true },
                    categoryError: { ...get().categoryError, [category]: null }
                });

                try {
                    const { data: products, error } = await supabase
                        .from('products')
                        .select(`
              id,
              title,
              price_pence,
              status,
              images,
              city,
              category,
              user_id,
              created_at,
              profiles:profiles!products_user_id_fkey(
                handle,
                name,
                avatar_url
              )
            `)
                        .eq('category', category.toUpperCase() as 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER')
                        .order('created_at', { ascending: false })
                        .limit(40);

                    if (error) {
                        throw error;
                    }

                    set({
                        categoryProducts: { ...get().categoryProducts, [category]: products || [] },
                        isLoadingCategory: { ...isLoadingCategory, [category]: false },
                        categoryError: { ...get().categoryError, [category]: null },
                        lastCategoryFetch: { ...lastCategoryFetch, [category]: Date.now() }
                    });

                } catch (error: any) {
                    console.error(`Error fetching ${category} products:`, error);
                    set({
                        isLoadingCategory: { ...isLoadingCategory, [category]: false },
                        categoryError: { ...get().categoryError, [category]: error.message || 'Failed to fetch products' }
                    });
                }
            },

            fetchProduct: async (id: string) => {
                const { productCache, isLoadingProduct } = get();

                // Return cached product if exists
                if (productCache[id]) {
                    return productCache[id];
                }

                if (isLoadingProduct[id]) {
                    return null;
                }

                set({
                    isLoadingProduct: { ...isLoadingProduct, [id]: true },
                    productError: { ...get().productError, [id]: null }
                });

                try {
                    const { data: product, error } = await supabase
                        .from('products')
                        .select(`
              id,
              title,
              description,
              price_pence,
              status,
              images,
              city,
              postcode,
              category,
              tags,
              user_id,
              created_at,
              profiles:profiles!products_user_id_fkey(
                handle,
                name,
                avatar_url,
                created_at
              )
            `)
                        .eq('id', id)
                        .single();

                    if (error) {
                        throw error;
                    }

                    set({
                        productCache: { ...productCache, [id]: product },
                        isLoadingProduct: { ...isLoadingProduct, [id]: false },
                        productError: { ...get().productError, [id]: null }
                    });

                    return product;

                } catch (error: any) {
                    console.error(`Error fetching product ${id}:`, error);
                    set({
                        isLoadingProduct: { ...isLoadingProduct, [id]: false },
                        productError: { ...get().productError, [id]: error.message || 'Failed to fetch product' }
                    });
                    return null;
                }
            },

            fetchSellerProducts: async (sellerId: string) => {
                const { isLoadingSeller, lastSellerFetch } = get();

                if (isLoadingSeller[sellerId] ||
                    (lastSellerFetch[sellerId] && Date.now() - lastSellerFetch[sellerId] < CACHE_DURATION)) {
                    return;
                }

                set({
                    isLoadingSeller: { ...isLoadingSeller, [sellerId]: true },
                    sellerError: { ...get().sellerError, [sellerId]: null }
                });

                try {
                    const { data: products, error } = await supabase
                        .from('products')
                        .select(`
              id,
              title,
              price_pence,
              status,
              images,
              city,
              category,
              created_at,
              description,
              user_id
            `)
                        .eq('user_id', sellerId)
                        .eq('status', 'AVAILABLE')
                        .order('created_at', { ascending: false });

                    if (error) {
                        throw error;
                    }

                    set({
                        sellerProducts: { ...get().sellerProducts, [sellerId]: products || [] },
                        isLoadingSeller: { ...isLoadingSeller, [sellerId]: false },
                        sellerError: { ...get().sellerError, [sellerId]: null },
                        lastSellerFetch: { ...lastSellerFetch, [sellerId]: Date.now() }
                    });

                } catch (error: any) {
                    console.error(`Error fetching seller products for ${sellerId}:`, error);
                    set({
                        isLoadingSeller: { ...isLoadingSeller, [sellerId]: false },
                        sellerError: { ...get().sellerError, [sellerId]: error.message || 'Failed to fetch products' }
                    });
                }
            },

            searchProducts: async (filters: ProductFilters) => {
                try {
                    let query = supabase
                        .from('products')
                        .select(`
              id,
              title,
              price_pence,
              status,
              images,
              city,
              category,
              user_id,
              created_at,
              profiles:profiles!products_user_id_fkey(
                handle,
                name,
                avatar_url
              )
            `);

                    // Apply filters
                    if (filters.search) {
                        query = query.or(`title.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
                    }
                    if (filters.category) {
                        query = query.eq('category', filters.category.toUpperCase() as 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER');
                    }
                    if (filters.status) {
                        query = query.eq('status', filters.status.toUpperCase() as 'AVAILABLE' | 'RESTOCKING' | 'SOLD');
                    }
                    if (filters.city) {
                        query = query.ilike('city', `%${filters.city}%`);
                    }
                    if (filters.minPrice !== undefined) {
                        query = query.gte('price_pence', filters.minPrice);
                    }
                    if (filters.maxPrice !== undefined) {
                        query = query.lte('price_pence', filters.maxPrice);
                    }

                    const { data, error } = await query
                        .order('created_at', { ascending: false })
                        .limit(50);

                    if (error) {
                        throw error;
                    }

                    return data || [];

                } catch (error: any) {
                    console.error('Error searching products:', error);
                    return [];
                }
            },

            clearCache: () => {
                set({
                    feedProducts: {},
                    feedProductsList: [],
                    lastFeedFetch: null,
                    categoryProducts: {},
                    lastCategoryFetch: {},
                    productCache: {},
                    sellerProducts: {},
                    lastSellerFetch: {}
                });
            },

            clearCategoryCache: (category: string) => {
                const { categoryProducts, lastCategoryFetch } = get();
                const newCategoryProducts = { ...categoryProducts };
                const newLastCategoryFetch = { ...lastCategoryFetch };

                delete newCategoryProducts[category];
                delete newLastCategoryFetch[category];

                set({
                    categoryProducts: newCategoryProducts,
                    lastCategoryFetch: newLastCategoryFetch
                });
            },

            clearSellerCache: (sellerId: string) => {
                const { sellerProducts, lastSellerFetch } = get();
                const newSellerProducts = { ...sellerProducts };
                const newLastSellerFetch = { ...lastSellerFetch };

                delete newSellerProducts[sellerId];
                delete newLastSellerFetch[sellerId];

                set({
                    sellerProducts: newSellerProducts,
                    lastSellerFetch: newLastSellerFetch
                });
            },

            // Getters
            getFeedProducts: () => {
                return get().feedProductsList;
            },

            getCategoryProducts: (category: string) => {
                return get().categoryProducts[category] || [];
            },

            getProduct: (id: string) => {
                return get().productCache[id] || null;
            },

            getSellerProducts: (sellerId: string) => {
                return get().sellerProducts[sellerId] || [];
            },

            isFeedStale: () => {
                const { lastFeedFetch } = get();
                return !lastFeedFetch || Date.now() - lastFeedFetch > CACHE_DURATION;
            },

            isCategoryStale: (category: string) => {
                const { lastCategoryFetch } = get();
                return !lastCategoryFetch[category] || Date.now() - lastCategoryFetch[category] > CACHE_DURATION;
            },

            isSellerStale: (sellerId: string) => {
                const { lastSellerFetch } = get();
                return !lastSellerFetch[sellerId] || Date.now() - lastSellerFetch[sellerId] > CACHE_DURATION;
            },
        }),
        {
            name: 'products-store',
            partialize: (state) => ({
                feedProducts: state.feedProducts,
                feedProductsList: state.feedProductsList,
                lastFeedFetch: state.lastFeedFetch,
                categoryProducts: state.categoryProducts,
                lastCategoryFetch: state.lastCategoryFetch,
                productCache: state.productCache,
                sellerProducts: state.sellerProducts,
                lastSellerFetch: state.lastSellerFetch
            })
        }
    )
);
