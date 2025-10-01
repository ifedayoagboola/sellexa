'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchProducts, getSearchSuggestions, SearchFilters } from '@/lib/search';
import { useLoadingStore } from '@/stores/loadingStore';

export function useSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setLoading, isLoading } = useLoadingStore();

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState<SearchFilters>({
        query: searchParams.get('q') || undefined,
        category: searchParams.get('category') || undefined,
        status: searchParams.get('status') || undefined,
        city: searchParams.get('city') || undefined,
    });
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (searchFilters: SearchFilters) => {
            setLoading(true, 'Searching...');
            setError(null);

            try {
                const response = await searchProducts(searchFilters);

                if (response.success && response.products) {
                    setResults(response.products);
                } else {
                    setError(response.error || 'Search failed');
                    setResults([]);
                }
            } catch (err) {
                setError('Search failed');
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300),
        [setLoading]
    );

    // Update URL with search parameters
    const updateURL = useCallback((newFilters: SearchFilters) => {
        const params = new URLSearchParams();

        if (newFilters.query) params.set('q', newFilters.query);
        if (newFilters.category) params.set('category', newFilters.category);
        if (newFilters.status) params.set('status', newFilters.status);
        if (newFilters.city) params.set('city', newFilters.city);

        const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
        router.push(newURL);
    }, [router]);

    // Handle search input
    const handleSearch = useCallback((searchQuery: string) => {
        setQuery(searchQuery);
        const newFilters = { ...filters, query: searchQuery };
        setFilters(newFilters);

        // Only update URL if we're not already on the search page
        const isOnSearchPage = window.location.pathname === '/search';
        if (!isOnSearchPage) {
            updateURL(newFilters);
        } else {
            // Update URL without navigation on search page
            const params = new URLSearchParams();
            if (newFilters.query) params.set('q', newFilters.query);
            if (newFilters.category) params.set('category', newFilters.category);
            if (newFilters.status) params.set('status', newFilters.status);
            if (newFilters.city) params.set('city', newFilters.city);

            const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
            window.history.replaceState({}, '', newURL);
        }

        debouncedSearch(newFilters);
    }, [filters, updateURL, debouncedSearch]);

    // Handle filter changes
    const handleFilterChange = useCallback((key: keyof SearchFilters, value: string | undefined) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Update URL without navigation on search page
        const params = new URLSearchParams();
        if (newFilters.query) params.set('q', newFilters.query);
        if (newFilters.category) params.set('category', newFilters.category);
        if (newFilters.status) params.set('status', newFilters.status);
        if (newFilters.city) params.set('city', newFilters.city);

        const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
        window.history.replaceState({}, '', newURL);

        debouncedSearch(newFilters);
    }, [filters, debouncedSearch]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        const newFilters: SearchFilters = { query: '' };
        setFilters(newFilters);
        setQuery('');

        // Update URL without navigation
        window.history.replaceState({}, '', '/search');

        debouncedSearch(newFilters);
    }, [debouncedSearch]);

    // Get suggestions for current query
    const updateSuggestions = useCallback(async (searchQuery: string) => {
        if (searchQuery.length >= 2) {
            const newSuggestions = await getSearchSuggestions(searchQuery);
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, []);

    // Debounced suggestion update
    const debouncedSuggestions = useCallback(
        debounce(updateSuggestions, 200),
        [updateSuggestions]
    );

    // Handle input change with suggestions
    const handleInputChange = useCallback((value: string) => {
        setQuery(value);
        debouncedSuggestions(value);
    }, [debouncedSuggestions]);

    // Select suggestion
    const selectSuggestion = useCallback((suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        handleSearch(suggestion);
    }, [handleSearch]);

    // Initial search on mount
    useEffect(() => {
        if (filters.query || filters.category || filters.status || filters.city) {
            debouncedSearch(filters);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Memoized filter counts
    const activeFiltersCount = useMemo(() => {
        return Object.values(filters).filter(value => value && value !== '').length;
    }, [filters]);

    return {
        // State
        query,
        filters,
        results,
        isLoading,
        error,
        suggestions,
        showSuggestions,
        activeFiltersCount,

        // Actions
        handleSearch,
        handleInputChange,
        handleFilterChange,
        clearFilters,
        selectSuggestion,
        setShowSuggestions,

        // Helpers
        hasResults: results.length > 0,
        hasFilters: activeFiltersCount > 0,
    };
}

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
