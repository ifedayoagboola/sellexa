import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
    query?: string;
    category?: string;
    status?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface SearchResult {
    id: string;
    title: string;
    price_pence: number;
    status: string;
    images: string[];
    city: string;
    category: string;
    user_id: string;
    profiles: {
        handle: string;
        name: string;
        avatar_url: string;
    };
}

export interface SearchResponse {
    success: boolean;
    products?: SearchResult[];
    error?: string;
    total?: number;
}

// Client-side search function
export async function searchProducts(filters: SearchFilters): Promise<SearchResponse> {
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
        profiles:profiles!products_user_id_fkey(
          handle,
          name,
          avatar_url
        )
      `);

        // Apply text search
        if (filters.query) {
            query = query.or(`title.ilike.%${filters.query}%,city.ilike.%${filters.query}%`);
        }

        // Apply category filter
        if (filters.category) {
            query = query.eq('category', filters.category.toUpperCase());
        }

        // Apply status filter
        if (filters.status) {
            query = query.eq('status', filters.status.toUpperCase());
        }

        // Apply city filter
        if (filters.city) {
            query = query.ilike('city', `%${filters.city}%`);
        }

        // Apply price filters
        if (filters.minPrice !== undefined) {
            query = query.gte('price_pence', filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            query = query.lte('price_pence', filters.maxPrice);
        }

        // Order by relevance and date
        query = query.order('created_at', { ascending: false });

        // Limit results
        query = query.limit(50);

        const { data, error, count } = await query;

        if (error) {
            return { success: false, error: error.message };
        }

        return {
            success: true,
            products: data || [],
            total: count || 0
        };
    } catch (error) {
        console.error('Search error:', error);
        return {
            success: false,
            error: 'Failed to search products'
        };
    }
}

// Get trending search terms (mock data for now)
export function getTrendingSearches(): string[] {
    return ['jollof rice', 'ankara fabric', 'shea butter', 'garri', 'african wigs', 'spices'];
}

// Get search suggestions based on partial input
export async function getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    try {
        // Search product titles for suggestions
        const { data, error } = await supabase
            .from('products')
            .select('title')
            .ilike('title', `%${query}%`)
            .limit(5);

        if (error) {
            console.error('Suggestion error:', error);
            return [];
        }

        return data?.map(item => item.title) || [];
    } catch (error) {
        console.error('Suggestion error:', error);
        return [];
    }
}
