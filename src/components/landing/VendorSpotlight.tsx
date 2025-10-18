import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { AnimatedSection } from './AnimatedSection';

const vendors = [
  {
    name: "Adaeze's Fabrics",
    location: 'Manchester, UK',
    specialty: 'Ankara & Aso Oke Fabrics',
    rating: 4.9,
    products: 87,
    image: 'https://images.unsplash.com/photo-1715881634011-2c3e0dea96c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmthcmElMjBmYWJyaWMlMjByb2xscyUyMHRleHRpbGV8ZW58MXx8fHwxNzYwNzk4ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    verified: true,
    story: 'Started from home in 2023',
    handle: 'adaezes-fabrics',
  },
  {
    name: "Priya's Spice Corner",
    location: 'Birmingham, UK',
    specialty: 'Indian Spices & Masalas',
    rating: 5.0,
    products: 52,
    image: 'https://images.unsplash.com/photo-1660760418951-e7dfc134ea7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZSUyMG1hcmtldCUyMHZlbmRvciUyMGJ1c2luZXNzfGVufDF8fHx8MTc2MDc5ODg3OXww&ixlib=rb-4.1.0&q=80&w=1080',
    verified: true,
    story: 'Grew beyond WhatsApp',
    handle: 'priyas-spice-corner',
  },
  {
    name: "Blessing's Hair Empire",
    location: 'London, UK',
    specialty: 'Wigs & Hair Extensions',
    rating: 4.8,
    products: 73,
    image: 'https://images.unsplash.com/photo-1515172371186-85d50c9f1fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHdpZ3MlMjBiZWF1dHklMjBzdXBwbHl8ZW58MXx8fHwxNzYwNzk4ODgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    verified: true,
    story: 'No shop needed',
    handle: 'blessings-hair-empire',
  },
];

export function VendorSpotlight() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            They Started on WhatsApp. Now They're Everywhere.
          </h2>
          <p className="text-lg text-gray-600">
            Meet vendors who took the leap from their living rooms to reaching customers 
            across the UK. Your turn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {vendors.map((vendor, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-gray-200 h-full">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  fill
                />
                {vendor.verified && (
                  <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white">
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{vendor.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MapPin size={14} />
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span>{vendor.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-2">{vendor.specialty}</p>
                <p className="text-purple-600 text-xs font-medium mb-4">💫 {vendor.story}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{vendor.products} products</span>
                  <Link href={`/seller/${vendor.handle}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      View Shop <ExternalLink size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <div className="text-center">
          <Link href="/feed">
            <Button size="lg" variant="outline">
              Explore All Vendors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
