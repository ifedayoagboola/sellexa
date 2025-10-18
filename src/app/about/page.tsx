import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Heart, Users, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-[#159fa9]/5 via-white to-[#159fa9]/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                You Don't Need a Shop to Build a Business
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                We're connecting UK diaspora with authentic cultural products while helping 
                small vendors grow beyond WhatsApp.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Why We Built This</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Sellexa was born from a simple observation: thousands of talented vendors across the UK 
                    were selling amazing cultural products (Ankara fabrics, Indian spices, Caribbean foods, 
                    traditional textiles) but only to their WhatsApp contacts and local communities.
                  </p>
                  <p>
                    Meanwhile, diaspora communities across the UK were craving these authentic products but 
                    had no easy way to discover vendors beyond their immediate network.
                  </p>
                  <p>
                    We realized these small business owners didn't need a physical shop to succeed. They needed 
                    visibility, trust, and a simple way to reach customers beyond their city. That's why we built 
                    Sellexa, a free platform where vendors get their own business page, verification badge, and 
                    access to customers who genuinely value what they sell.
                  </p>
                </div>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop"
                  alt="Community marketplace"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What We Stand For</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Empowering small vendors and connecting diaspora communities with authentic cultural products
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#159fa9]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-[#159fa9]" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">For the Culture</h3>
                <p className="text-gray-600 text-sm">
                  Preserving and celebrating cultural heritage through authentic products
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#159fa9]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-[#159fa9]" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community First</h3>
                <p className="text-gray-600 text-sm">
                  Building connections between vendors and buyers who share cultural values
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#159fa9]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-[#159fa9]" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Vendor Success</h3>
                <p className="text-gray-600 text-sm">
                  Helping small businesses grow beyond WhatsApp and social media
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#159fa9]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-[#159fa9]" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust & Safety</h3>
                <p className="text-gray-600 text-sm">
                  Verified vendors and secure transactions for peace of mind
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">It's Simple, Really</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Whether you're shopping for cultural products or ready to grow your business
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* For Buyers */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">For Buyers</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#159fa9] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Browse & Discover</h4>
                      <p className="text-gray-600 text-sm">
                        Search for cultural products by category, location, or vendor name
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#159fa9] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Connect with Vendors</h4>
                      <p className="text-gray-600 text-sm">
                        Chat directly with verified sellers, ask questions, and negotiate
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#159fa9] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Shop with Confidence</h4>
                      <p className="text-gray-600 text-sm">
                        Buy from verified vendors with ratings and reviews from real customers
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Sellers */}
              <div className="bg-gradient-to-br from-[#159fa9] to-[#0d7580] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">For Sellers</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Create Your Free Page</h4>
                      <p className="text-white/90 text-sm">
                        Sign up in 2 minutes and get your own business page—like a mini-website
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">List Your Products</h4>
                      <p className="text-white/90 text-sm">
                        Upload photos, set prices, and describe your products. It's that simple
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Get Verified & Grow</h4>
                      <p className="text-white/90 text-sm">
                        Build trust with our verification badge and reach customers across the UK
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-[#159fa9]/5 via-white to-[#159fa9]/10">
          <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Your Turn
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Whether you're craving a taste of home or ready to take your business beyond WhatsApp, 
              we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/feed">
                <Button size="lg" variant="outline" className="border-[#159fa9]/20 hover:bg-[#159fa9]/5 text-[#159fa9]">
                  Browse Products
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#159fa9] hover:bg-[#128a93] text-white">
                  Start Selling Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

