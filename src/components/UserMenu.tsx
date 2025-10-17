'use client';

import { useState } from 'react';
import { signOut } from '@/lib/auth-actions';
import { useUser } from '@/stores/userStore';
import Link from 'next/link';

interface UserMenuProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { displayName } = useUser();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm text-foreground hover:text-muted-foreground"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
          {displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
        </div>
        <span className="hidden md:block">
          {displayName || user.email}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg z-20">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                {user.email}
              </div>
              <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                Legal & Support
              </div>
              <Link
                href="/legal/privacy"
                className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/terms"
                className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                Terms of Service
              </Link>
              <Link
                href="/legal/cookies"
                className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                Cookie Policy
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted border-t border-border mt-1"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
