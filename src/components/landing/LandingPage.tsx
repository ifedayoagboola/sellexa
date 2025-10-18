import { Header } from './Header';
import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Categories } from './Categories';
import { VendorSpotlight } from './VendorSpotlight';
import { Testimonials } from './Testimonials';
import { CTA } from './CTA';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Categories />
        <VendorSpotlight />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}