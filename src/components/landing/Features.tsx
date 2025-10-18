import { Store, ShieldCheck, MessageCircle, CreditCard, TrendingUp, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedSection } from './AnimatedSection';

const features = [
  {
    icon: Store,
    title: 'Free Business Page',
    description: 'Get your own mini-website to showcase your products. No technical skills needed.',
    color: 'text-[#159fa9]',
    bg: 'bg-gray-50',
  },
  {
    icon: ShieldCheck,
    title: 'Get Verified',
    description: 'Build trust with customers through our verification badge. Stand out from the crowd.',
    color: 'text-gray-700',
    bg: 'bg-gray-50',
  },
  {
    icon: MapPin,
    title: 'Be Discovered Locally',
    description: 'Customers in your city can find you easily. Grow beyond your WhatsApp contacts.',
    color: 'text-gray-700',
    bg: 'bg-gray-50',
  },
  {
    icon: MessageCircle,
    title: 'Chat with Buyers',
    description: 'Connect directly with customers, answer questions, and close sales faster.',
    color: 'text-gray-700',
    bg: 'bg-gray-50',
  },
  {
    icon: CreditCard,
    title: 'Accept Payments',
    description: 'Get paid securely through the platform. No more chasing payments (Coming Soon).',
    color: 'text-gray-700',
    bg: 'bg-gray-50',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Reach',
    description: 'Reach customers across the UK, not just your local area or social media followers.',
    color: 'text-gray-700',
    bg: 'bg-gray-50',
  },
];

export function Features() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              No Shop? No Problem.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              From selling on WhatsApp to running a real business. Get discovered, build trust, 
              and grow your customer base - completely free.
            </p>
          </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection 
                key={index} 
                animation="fade-up" 
                delay={index * 100}
              >
                <Card className="group p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-[#159fa9]/30 h-full bg-white hover:-translate-y-1">
                  <div className={`${feature.bg} ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#159fa9] transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
