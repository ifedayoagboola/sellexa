'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="w-32 h-20 relative">
              <Image
                src="/sellexa.png"
                alt="Sellexa"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/feed" className="text-sm font-medium text-gray-700 hover:text-[#159fa9] transition-colors">
              Browse Products
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#159fa9] transition-colors">
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-700 hover:text-[#159fa9]">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#159fa9] hover:bg-[#128a93] text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
