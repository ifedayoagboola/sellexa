'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // TODO: Implement newsletter subscription API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage('Thanks for subscribing! Check your email for confirmation.');
      setEmail('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Vendor CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="bg-gradient-to-r from-[#159fa9] to-[#0d7580] rounded-3xl overflow-hidden shadow-xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="p-8 lg:p-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-6">
                  <TrendingUp size={16} />
                  <span>Join 500+ Vendors</span>
                </div>
                
                <h2 className="text-white text-4xl mb-4">
                  Ready to Grow Beyond WhatsApp?
                </h2>
                <p className="text-white/90 mb-8">
                  You don't need a shop to build a real business in the UK. Get your free business page, 
                  get discovered by the diaspora community, get verified, and get paid. It takes just 5 minutes.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                    <span>100% free forever - No hidden fees</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                    <span>Your own business page - Like a mini-website</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                    <span>Be found by customers in your city and beyond</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/signup">
                    <Button size="lg" className="bg-white text-[#159fa9] hover:bg-gray-100">
                      Create Your Free Page
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative h-full min-h-[400px] hidden lg:block">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1578332656030-12f6110a0fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGVudHJlcHJlbmV1ciUyMHN0b3JlJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzYwNzk4ODgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Small business owner"
                  className="w-full h-full object-cover"
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="mx-auto text-[#159fa9] mb-4" size={48} />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            New vendors, exclusive deals, and cultural products delivered to your inbox. 
            No spam, just the good stuff.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-[#159fa9] focus:ring-2 focus:ring-[#159fa9]/20 disabled:opacity-50"
            />
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="bg-[#159fa9] hover:bg-[#128a93] disabled:opacity-50"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>

          {message && (
            <p className={`text-sm mt-4 ${message.includes('Thanks') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <p className="text-xs text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </>
  );
}
