import BrandHeader from './BrandHeader';
import ProductGrid from './ProductGrid';

interface SellerSectionProps {
  section: {
    seller: any;
    products: any[];
  };
  index: number;
  variant?: 'mobile' | 'desktop';
}

export default function SellerSection({ section, index, variant = 'mobile' }: SellerSectionProps) {
  const seller = section.seller;
  
  // Add defensive checks
  if (!seller || !section.products || section.products.length === 0) {
    return null;
  }
  
  // Mock rating data - deterministic to avoid hydration issues
  const rating = 4.0 + (index % 2) * 0.3;
  const reviewCount = 100 + (index * 50) % 900; // Deterministic based on index

  return (
    <div key={seller?.user_id || index} className="space-y-4 lg:space-y-8">
      <BrandHeader 
        seller={seller}
        rating={rating}
        reviewCount={reviewCount}
        variant={variant}
      />
      <ProductGrid 
        products={section.products}
      />
    </div>
  );
}
