'use client';

import { useState } from 'react';
import TopBar from '@/components/TopBar';
import ProductCard from '@/components/ProductCard';
import Navigation from '@/components/Navigation';
import SaveProvider from '@/components/SaveProvider';
import SearchBar from '@/components/SearchBar';
import { useSearch } from '@/hooks/useSearch';
import { getTrendingSearches } from '@/lib/search';

interface SearchPageClientProps {
  user: any;
}

export default function SearchPageClient({ user }: SearchPageClientProps) {
  const {
    query,
    filters,
    results,
    isLoading: searchLoading,
    error,
    activeFiltersCount,
    handleFilterChange,
    clearFilters,
    hasResults,
    hasFilters,
    handleInputChange,
    handleSearch,
    selectSuggestion,
  } = useSearch();

  const trendingTags = getTrendingSearches();
  const categories = ['Food', 'Fashion', 'Hair', 'Home', 'Culture', 'Other'];
  const statusOptions = ['Available', 'Restocking', 'Sold'];

  return (
    <SaveProvider 
      productId={results?.[0]?.id || ''}
      initialSaveCount={0}
      initialIsSaved={false}
    >
      <div className="min-h-screen bg-background pb-20">
      <TopBar showSearch={false} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            placeholder="Search products, cities, sellers..." 
            className="max-w-2xl mx-auto"
            query={query}
            suggestions={[]}
            showSuggestionsState={false}
            handleInputChange={handleInputChange}
            handleSearch={handleSearch}
            selectSuggestion={selectSuggestion}
            setShowSuggestions={() => {}}
          />
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                Filters ({activeFiltersCount})
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {filters.category}
                  <button
                    onClick={() => handleFilterChange('category', undefined)}
                    className="ml-2 hover:text-primary/80"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {filters.status}
                  <button
                    onClick={() => handleFilterChange('status', undefined)}
                    className="ml-2 hover:text-primary/80"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.city && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {filters.city}
                  <button
                    onClick={() => handleFilterChange('city', undefined)}
                    className="ml-2 hover:text-primary/80"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Filter Chips */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-foreground mr-2">Category:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange('category', 
                  filters.category === category ? undefined : category
                )}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filters.category === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-foreground mr-2">Status:</span>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange('status', 
                  filters.status === status ? undefined : status
                )}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filters.status === status
                    ? 'bg-primary text-primary-foreground'
                    : status === 'Available'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : status === 'Restocking'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Tags */}
        {!hasFilters && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Trending Searches</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange('query', tag)}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm whitespace-nowrap hover:bg-primary/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {searchLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Searching...</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!searchLoading && (
          <>
            {hasResults ? (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground">
                    {query ? `Results for "${query}"` : 'Search Results'} ({results.length})
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {results.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              </>
            ) : hasFilters ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  No results found
                </h2>
                <p className="text-muted-foreground mb-8">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Start searching
                </h2>
                <p className="text-muted-foreground mb-8">
                  Search for products, categories, or locations to get started
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      <Navigation />
      </div>
    </SaveProvider>
  );
}
