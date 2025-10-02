import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  products: any[];
  variant?: 'mobile' | 'desktop';
}

export default function ProductGrid({ products, variant = 'mobile' }: ProductGridProps) {
  const isMobile = variant === 'mobile';
  
  const gridClasses = isMobile 
    ? 'grid grid-cols-2 gap-3'
    : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4';

  return (
    <div className={gridClasses}>
      {products.slice(0, 6).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
