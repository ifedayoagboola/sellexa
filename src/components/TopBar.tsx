'use client';

import Link from 'next/link';
import { MagnifyingGlassIcon, BellIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';

interface TopBarProps {
  showSearch?: boolean;
  showNotifications?: boolean;
  showInbox?: boolean;
}

export default function TopBar({ 
  showSearch = true, 
  showNotifications = true, 
  showInbox = true 
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-md">
              <SearchBar 
                placeholder="Search products..."
                className="w-full"
                showSuggestions={false}
              />
            </div>
          )}
          
          {/* Right Actions */}
          <div className="flex items-center space-x-3 ml-4">
            {showNotifications && (
              <Link 
                href="/notifications"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <BellIcon className="h-6 w-6" />
              </Link>
            )}
            
            {showInbox && (
              <Link 
                href="/inbox"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
