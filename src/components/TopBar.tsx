'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, BellIcon, UserIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

interface TopBarProps {
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  showSupport?: boolean;
  user?: any;
}

export default function TopBar({ 
  showSearch = true, 
  showNotifications = true, 
  showUserMenu = true,
  showSupport = true,
  user
}: TopBarProps) {
  const handleSupportContact = () => {
    // Open email client with support email
    window.location.href = 'mailto:support@ethniqrootz.com?subject=Support Request&body=Hi, I need help with...';
  };

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile and Tablet Layout (up to and including 1024px) */}
        <div className="block lg:hidden">
          {/* First Row: Logo + Icons */}
          <div className="flex items-center justify-between py-3">
            {/* EthniqRootz Logo */}
            <Link href="/feed" className="flex items-center">
              <div className="w-32 h-20 sm:w-40 sm:h-24 relative">
                <Image
                  src="/ethniqrootz.png"
                  alt="EthniqRootz"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            
            {/* Right Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {showSupport && (
                <button
                  onClick={handleSupportContact}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Contact Support"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              
              {showNotifications && (
                <Link 
                  href="/notifications"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              )}
              
              {showUserMenu && user ? (
                <UserMenu user={user} />
              ) : (
                <Link 
                  href="/auth/login"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              )}
            </div>
          </div>
          
          {/* Second Row: Search Bar */}
          {showSearch && (
            <div className="w-full pb-3">
              <SearchBar 
                placeholder="Search products..."
                className="w-full"
                showSuggestions={false}
              />
            </div>
          )}
        </div>

        {/* Desktop Layout (1025px and above) */}
        <div className="hidden lg:block">
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
              {showSupport && (
                <button
                  onClick={handleSupportContact}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Contact Support"
                >
                  <QuestionMarkCircleIcon className="h-6 w-6" />
                </button>
              )}
              
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
