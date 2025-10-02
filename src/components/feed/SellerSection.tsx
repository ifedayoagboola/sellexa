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
  
  const isMobile = variant === 'mobile';
  const spacingClass = isMobile ? 'space-y-4' : 'space-y-8';
  const containerClass = isMobile ? 'space-y-8' : 'space-y-16';

  return (
    <div key={seller?.user_id || index} className={spacingClass}>
      <BrandHeader 
        seller={seller}
        rating={rating}
        reviewCount={reviewCount}
        variant={variant}
      />
      <ProductGrid 
        products={section.products}
        variant={variant}
      />
    </div>
  );
}
