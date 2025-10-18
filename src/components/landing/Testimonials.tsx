import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const testimonials = [
  {
    name: 'Amina Ibrahim',
    role: 'Ankara Fabrics Vendor, Leeds',
    content: 'I was just selling on WhatsApp to friends. Now I have customers from all over the UK finding me on Sellexa. My business has tripled!',
    rating: 5,
    avatar: 'AI',
  },
  {
    name: 'Rajesh Patel',
    role: 'Spice Seller, Leicester',
    content: 'No more chasing payments or managing orders through texts. Sellexa gave me a proper business page and verification badge. Game changer.',
    rating: 5,
    avatar: 'RP',
  },
  {
    name: 'Grace Mensah',
    role: 'Aso Oke & Textiles, London',
    content: 'I started from my living room with no shop. Sellexa helped me reach customers who actually value my traditional fabrics. So grateful!',
    rating: 5,
    avatar: 'GM',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#159fa9]/5 via-white to-[#159fa9]/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Don't Just Take Our Word For It
          </h2>
          <p className="text-lg text-gray-600">
            Hear from vendors who went from WhatsApp contacts to customers nationwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
              <Card className="p-6 hover:shadow-lg transition-shadow border-gray-200 h-full">
              <Quote className="text-[#159fa9] mb-4" size={32} />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="text-gray-700 mb-6">"{testimonial.content}"</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#159fa9] to-[#0d7580] flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
