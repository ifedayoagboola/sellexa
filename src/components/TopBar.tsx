'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Mobile and Tablet Layout (up to and including 1024px) */}
        <div className="block xl:hidden">
          {/* First Row: Logo + Icons */}
          <div className="flex items-center justify-between">
            {/* EthniqRootz Logo */}
            <Link href="/feed" className="flex items-center">
              <div className="w-40 h-24 relative">
                <Image
                  src="/ethniqrootz.png"
                  alt="EthniqRootz"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            
            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              {/* Feeds Button */}
              <Link 
                href="/feed"
                className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
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

        {/* Desktop Layout (1280px and above) */}
        <div className="hidden xl:block">
          <div className="flex items-center justify-between">
            {/* Left Side: Logo */}
            <div className="flex items-center">
              {/* EthniqRootz Logo */}
              <Link href="/feed" className="flex items-center">
                <div className="w-48 h-32 relative">
                  <Image
                    src="/ethniqrootz.png"
                    alt="EthniqRootz"
                    fill
                    className="object-contain"
                  />
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
                className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
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
