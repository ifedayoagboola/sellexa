import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AnimatedSection } from './AnimatedSection';

const categories = [
  {
    name: 'Ankara & African Prints',
    count: '850+ items',
    image: 'https://images.unsplash.com/photo-1715881634011-2c3e0dea96c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmthcmElMjBmYWJyaWMlMjByb2xscyUyMHRleHRpbGV8ZW58MXx8fHwxNzYwNzk4ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    gradient: 'from-[#159fa9]/90 to-[#0d7580]/90',
    category: 'Fabrics',
  },
  {
    name: 'Traditional Fabrics',
    count: '620+ items',
    image: 'https://images.unsplash.com/photo-1758264839086-2bdecc06d9a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZhYnJpYyUyMHNob3AlMjBtYXJrZXR8ZW58MXx8fHwxNzYwNzk4ODc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    gradient: 'from-[#159fa9]/90 to-[#0d7580]/90',
    category: 'Fabrics',
  },
  {
    name: 'Spices & Ingredients',
    count: '1,200+ items',
    image: '/indian-spicesinbags.jpeg',
    gradient: 'from-[#159fa9]/90 to-[#0d7580]/90',
    category: 'Food',
  },
  {
    name: 'Saris & Indian Textiles',
    count: '730+ items',
    image: '/indianart.jpeg',
    gradient: 'from-[#159fa9]/90 to-[#0d7580]/90',
    category: 'Clothing',
  },
];

export function Categories() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <AnimatedSection animation="fade-up" className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Are You Looking For?
            </h2>
            <p className="text-lg text-gray-600">
              Ankara fabrics, aso oke, spices, and more from vendors near you
            </p>
          </div>
          <Link href="/feed" className="hidden sm:block flex-shrink-0">
            <Button variant="outline" className="flex items-center gap-2 border-2 border-gray-300 hover:border-[#159fa9] hover:text-[#159fa9] transition-all">
              View All <ArrowRight size={16} />
            </Button>
          </Link>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <AnimatedSection key={index} animation="scale" delay={index * 100}>
              <Link href={`/category/${category.category.toLowerCase()}`}>
                <div className="group relative overflow-hidden rounded-3xl cursor-pointer h-80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03]">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  fill
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-75 transition-opacity duration-300`}></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-white/90 font-medium mb-4">{category.count}</p>
                  <div className="flex items-center text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span className="font-semibold">Shop Now</span>
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <Link href="/feed" className="sm:hidden block mt-6">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            View All Categories <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
