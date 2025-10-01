'use client';

import Link from 'next/link';
import { MagnifyingGlassIcon, BellIcon, UserIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

interface TopBarProps {
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  user?: any;
}

export default function TopBar({ 
  showSearch = true, 
  showNotifications = true, 
  showUserMenu = true,
  user
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* First Row: Logo + Icons */}
          <div className="flex items-center justify-between mb-3">
            {/* ER Logo */}
            <Link href="/feed" className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ER</span>
              </div>
            </Link>
            
            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              {/* Feeds Button */}
              <Link 
                href="/feed"
                className="px-2 py-1 border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Feeds
              </Link>
              
              {showNotifications && (
                <Link 
                  href="/notifications"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BellIcon className="h-5 w-5" />
                </Link>
              )}
              
              {showUserMenu && user ? (
                <UserMenu user={user} />
              ) : (
                <Link 
                  href="/auth/login"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
          
          {/* Second Row: Search Bar */}
          {showSearch && (
            <div className="w-full">
              <SearchBar 
                placeholder="Search products..."
                className="w-full"
                showSuggestions={false}
              />
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {/* Left Side: Logo */}
            <div className="flex items-center">
              {/* ER Logo */}
              <Link href="/feed" className="flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ER</span>
                </div>
              </Link>
            </div>
            
            {/* Center: Search Bar */}
            {showSearch && (
              <div className="flex-1 max-w-md mx-4">
                <SearchBar 
                  placeholder="Search products..."
                  className="w-full"
                  showSuggestions={false}
                />
              </div>
            )}
            
            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Feeds Button */}
              <Link 
                href="/feed"
                className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Feeds
              </Link>
              
              {showNotifications && (
                <Link 
                  href="/notifications"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BellIcon className="h-6 w-6" />
                </Link>
              )}
              
              {showUserMenu && user ? (
                <UserMenu user={user} />
              ) : (
                <Link 
                  href="/auth/login"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <UserIcon className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
