import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  products: any[];
  variant?: 'mobile' | 'desktop';
}

export default function ProductGrid({ products, variant = 'mobile' }: ProductGridProps) {
  // Responsive grid classes:
  // Mobile (0-640px): 2 products per row
  // Tablet (641-1023px): 4 products per row  
  // Desktop (1024px+): 6 products per row
  const gridClasses = 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4';

  return (
    <div className={gridClasses}>
      {products.slice(0, 6).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
