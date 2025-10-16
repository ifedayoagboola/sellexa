'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, BellIcon, UserIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import { useUser } from '@/stores/userStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface TopBarProps {
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  showSupport?: boolean;
  sellerInfo?: {
    business_name?: string;
    business_logo_url?: string;
    name?: string;
    handle?: string;
  };
}

export default function TopBar({ 
  showSearch = true, 
  showNotifications = true, 
  showUserMenu = true,
  showSupport = true,
  sellerInfo
}: TopBarProps) {
  const { user, isAuthenticated } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show TopBar when scrolling down, hide when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      } else {
        // Scrolling up or at the top
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleSupportContact = () => {
    // Open email client with support email
    window.location.href = 'mailto:support@sellexa.app?subject=Support Request&body=Hi, I need help with...';
  };

  const handleNotificationsClick = () => {
    setShowComingSoonModal(true);
  };

  // Get seller display info
  const getSellerDisplayInfo = () => {
    if (!sellerInfo) return null;
    
    const sellerName = sellerInfo.business_name || sellerInfo.name || sellerInfo.handle || 'Unknown Seller';
    const sellerLogo = sellerInfo.business_logo_url;
    
    return { sellerName, sellerLogo };
  };

  const sellerDisplay = getSellerDisplayInfo();

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile and Tablet Layout (up to and including 1024px) */}
        <div className="block lg:hidden">
          {/* First Row: Logo + Icons */}
          <div className="flex items-center justify-between py-4">
            {/* Seller Logo or Sellexa Logo */}
            {sellerDisplay ? (
              <div className="flex items-center">
                {sellerDisplay.sellerLogo ? (
                  <div className="w-32 h-20 sm:w-40 sm:h-24 relative">
                    <Image
                      src={sellerDisplay.sellerLogo}
                      alt={sellerDisplay.sellerName}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-[#1aa1aa] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {sellerDisplay.sellerName.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 truncate max-w-32">
                      {sellerDisplay.sellerName}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/feed" className="flex items-center">
                <div className="w-32 h-20 sm:w-40 sm:h-24 relative">
                  <Image
                    src="/sellexa.png"
                    alt="Sellexa"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            )}
            
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
                <button
                  onClick={handleNotificationsClick}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Notifications"
                >
                  <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              
              {showUserMenu && isAuthenticated && user ? (
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
            <div className="w-full pb-4">
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
          {/* First Row: Logo + Icons */}
          <div className="flex items-center justify-between py-4">
            {/* Seller Logo or Sellexa Logo */}
            {sellerDisplay ? (
              <div className="flex items-center">
                {sellerDisplay.sellerLogo ? (
                  <div className="w-40 h-24 xl:w-48 xl:h-32 relative">
                    <Image
                      src={sellerDisplay.sellerLogo}
                      alt={sellerDisplay.sellerName}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-[#1aa1aa] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {sellerDisplay.sellerName.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 truncate max-w-32">
                      {sellerDisplay.sellerName}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/feed" className="flex items-center">
                <div className="w-40 h-24 xl:w-48 xl:h-32 relative">
                  <Image
                    src="/sellexa.png"
                    alt="Sellexa"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            )}
            
            {/* Right Icons */}
            <div className="flex items-center space-x-2">
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
                <button
                  onClick={handleNotificationsClick}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Notifications"
                >
                  <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              
              {showUserMenu && isAuthenticated && user ? (
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
            <div className="w-full pb-4">
              <SearchBar 
                placeholder="Search products..."
                className="w-full max-w-md mx-auto"
                showSuggestions={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={showComingSoonModal} onOpenChange={setShowComingSoonModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BellIcon className="h-5 w-5 mr-2 text-[#1aa1aa]" />
              Notifications Coming Soon
            </DialogTitle>
            <DialogDescription>
              We're working on bringing you real-time notifications for your saved products, messages, and updates. Stay tuned!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="px-4 py-2 bg-[#1aa1aa] text-white rounded-md hover:bg-[#158a8f] transition-colors"
            >
              Got it
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
