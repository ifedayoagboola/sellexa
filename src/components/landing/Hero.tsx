'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import Link from 'next/link';

const headlines = [
  { text: 'Find Authentic Products', highlight: 'From Your Culture' },
  { text: 'Miss the Taste of Home?', highlight: "We've Got You Covered" },
  { text: 'Your Business Deserves', highlight: 'Success' },
  { text: 'Grow Beyond WhatsApp', highlight: 'Get Discovered' },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#159fa9]/5 via-transparent to-[#159fa9]/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-block animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#159fa9]/10 text-[#159fa9] text-sm font-medium border border-[#159fa9]/20 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#159fa9] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#159fa9]"></span>
                </span>
                500+ Small Businesses Growing
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight min-h-[140px] sm:min-h-[160px] lg:min-h-[140px] relative leading-tight">
                {headlines.map((headline, index) => (
                  <span
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span className="text-gray-900">{headline.text}</span>{' '}
                    <span className="bg-gradient-to-r from-[#159fa9] to-[#0d7580] bg-clip-text text-transparent block mt-1">
                      {headline.highlight}
                    </span>
                  </span>
                ))}
              </h1>

              {/* Carousel Indicators */}
              <div className="flex gap-2 pt-2">
                {headlines.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-8 bg-[#159fa9]' 
                        : 'w-1 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to headline ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-base lg:text-lg text-gray-600 max-w-xl leading-relaxed">
              No shop? No problem. Get your free business page and reach customers beyond WhatsApp. 
              Sell cultural products to diaspora communities across the UK.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup" className="group">
                <Button size="lg" className="w-full sm:w-auto bg-[#159fa9] hover:bg-[#128a93] text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  Create Your Free Page
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
              <Link href="/feed">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-[#159fa9]/30 hover:border-[#159fa9] hover:bg-[#159fa9]/5 text-[#159fa9] transition-all duration-300">
                  Browse Products
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <div className="flex items-center gap-2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg border border-gray-200 hover:border-[#159fa9]/30 transition-all duration-300 max-w-md">
                <Search className="ml-4 text-gray-400 group-hover:text-[#159fa9] transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search ankara, spices, textiles..."
                  className="flex-1 px-3 py-2.5 outline-none bg-transparent text-sm"
                />
                <Link href="/search">
                  <Button className="rounded-full bg-[#159fa9] hover:bg-[#128a93] shadow-sm">
                    Search
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-2">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#159fa9] to-[#0d7580] bg-clip-text text-transparent">5K+</div>
                <div className="text-gray-600 text-xs sm:text-sm font-medium">Products</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#159fa9] to-[#0d7580] bg-clip-text text-transparent">500+</div>
                <div className="text-gray-600 text-xs sm:text-sm font-medium">UK Vendors</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#159fa9] to-[#0d7580] bg-clip-text text-transparent">4.9★</div>
                <div className="text-gray-600 text-xs sm:text-sm font-medium">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:block hidden">
            {/* Decorative blob */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#159fa9]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#0d7580]/10 rounded-full blur-3xl"></div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <ImageWithFallback
                src="/AsoOlona core.jpeg"
                alt="Aso Olona cultural fabrics and textiles"
                className="w-full h-[550px] object-cover"
                width={600}
                height={550}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating cards with animation */}
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#159fa9] to-[#0d7580] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Adaeze's Ankara</div>
                  <div className="text-xs text-[#159fa9] flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Verified • Manchester
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#159fa9] to-[#0d7580] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  P
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Priya's Spices</div>
                  <div className="text-xs text-[#159fa9] flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Verified • Birmingham
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
