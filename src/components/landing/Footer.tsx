import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <div className="w-32 h-20 relative">
                <Image
                  src="/sellexa.png"
                  alt="Sellexa"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Connecting UK diaspora with cultural products from small vendors.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#159fa9] transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#159fa9] transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#159fa9] transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Buyers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/feed" className="hover:text-[#159fa9] transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[#159fa9] transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/feed" className="hover:text-[#159fa9] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#159fa9] transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/signup" className="hover:text-[#159fa9] transition-colors">
                  Start Selling
                </Link>
              </li>
              <li>
                <Link href="/kyc" className="hover:text-[#159fa9] transition-colors">
                  Get Verified
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#159fa9] transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/post" className="hover:text-[#159fa9] transition-colors">
                  List a Product
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#159fa9] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="mailto:support@sellexa.com" className="hover:text-[#159fa9] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="mailto:support@sellexa.com" className="hover:text-[#159fa9] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="mailto:support@sellexa.com" className="hover:text-[#159fa9] transition-colors">
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms" className="hover:text-[#159fa9] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-[#159fa9] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-[#159fa9] transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/seller-agreement" className="hover:text-[#159fa9] transition-colors">
                  Seller Agreement
                </Link>
              </li>
              <li>
                <Link href="/legal/returns" className="hover:text-[#159fa9] transition-colors">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/prohibited" className="hover:text-[#159fa9] transition-colors">
                  Prohibited Items
                </Link>
              </li>
              <li>
                <Link href="/legal/dmca" className="hover:text-[#159fa9] transition-colors">
                  DMCA Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sellexa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

