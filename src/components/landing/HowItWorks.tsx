import { UserPlus, Upload, CheckCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { AnimatedSection } from './AnimatedSection';

const steps = [
  {
    icon: UserPlus,
    step: '1',
    title: 'Sign Up Free',
    description: 'Create your account in under 2 minutes. No credit card needed, ever.',
  },
  {
    icon: Upload,
    step: '2',
    title: 'Add Your Products',
    description: 'Upload photos, set prices, and tell your story. Your business page goes live instantly.',
  },
  {
    icon: CheckCircle,
    step: '3',
    title: 'Get Verified',
    description: 'Build trust with our verification badge. Stand out and attract more customers.',
  },
  {
    icon: MessageSquare,
    step: '4',
    title: 'Connect & Sell',
    description: 'Chat with customers, manage orders, and grow your business beyond your city.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            From WhatsApp to Your Own Business Page
          </h2>
          <p className="text-lg text-gray-600">
            Join hundreds of vendors who've made the leap - here's how it works
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#159fa9] to-[#0d7580] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <Icon size={32} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#159fa9]">
                      <span className="text-sm font-bold text-[#159fa9]">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection animation="fade-up" delay={400} className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-[#159fa9]/10 rounded-2xl border border-[#159fa9]/20">
            <div className="text-left">
              <div className="text-lg font-semibold text-gray-900 mb-1">Ready to get started?</div>
              <div className="text-sm text-gray-600">Join hundreds of vendors already growing on Sellexa</div>
            </div>
            <Link href="/auth/signup">
              <button className="px-6 py-3 bg-[#159fa9] text-white rounded-lg hover:bg-[#128a93] transition-colors whitespace-nowrap font-medium">
                Create Free Page →
              </button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
