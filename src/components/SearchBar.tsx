'use client';

import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  // Optional props to override hook usage
  query?: string;
  suggestions?: string[];
  showSuggestionsState?: boolean;
  handleInputChange?: (value: string) => void;
  handleSearch?: (query: string) => void;
  selectSuggestion?: (suggestion: string) => void;
  setShowSuggestions?: (show: boolean) => void;
}

export default function SearchBar({ 
  placeholder = "Search products...",
  className = "",
  showSuggestions = true,
  onFocus,
  onBlur,
  // Optional props to override hook usage
  query: propQuery,
  suggestions: propSuggestions,
  showSuggestionsState: propShowSuggestions,
  handleInputChange: propHandleInputChange,
  handleSearch: propHandleSearch,
  selectSuggestion: propSelectSuggestion,
  setShowSuggestions: propSetShowSuggestions,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Use hook as fallback if props not provided
  const hookSearch = useSearch();
  
  const query = propQuery ?? hookSearch.query;
  const suggestions = propSuggestions ?? hookSearch.suggestions;
  const showSuggestionsState = propShowSuggestions ?? hookSearch.showSuggestions;
  const handleInputChange = propHandleInputChange ?? hookSearch.handleInputChange;
  const handleSearch = propHandleSearch ?? hookSearch.handleSearch;
  const selectSuggestion = propSelectSuggestion ?? hookSearch.selectSuggestion;
  const setShowSuggestions = propSetShowSuggestions ?? hookSearch.setShowSuggestions;

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
      onBlur?.();
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        handleSearch(query.trim());
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    handleInputChange('');
    handleSearch('');
    inputRef.current?.focus();
  };

  const showSuggestionsDropdown = showSuggestions && showSuggestionsState && suggestions.length > 0 && isFocused;

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-2 bg-muted rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            enterKeyHint="search"
          />
          
          {/* Search Button for Mobile */}
          {query && (
            <button
              type="submit"
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
              title="Search"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
            </button>
          )}
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestionsDropdown && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none"
            >
              <div className="flex items-center">
                <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-foreground">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
