import { createClient } from '@/integrations/supabase/server';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import SaveProvider from '@/components/SaveProvider';
import { getServerSideSaveData } from '@/lib/saves-server';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const VALID_CATEGORIES = ['food', 'fashion', 'hair', 'home', 'culture', 'other'];

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryLower = category.toLowerCase();
  
  if (!VALID_CATEGORIES.includes(categoryLower)) {
    return {
      title: 'Category Not Found | EthniqRootz',
      description: 'The category you are looking for could not be found.',
    };
  }

  const categoryName = categoryLower.charAt(0).toUpperCase() + categoryLower.slice(1);
  const title = `${categoryName} Products | Curated ${categoryName} | EthniqRootz`;
  const description = `Discover authentic ${categoryName.toLowerCase()} products from our exclusive network of verified merchants. Shop curated ${categoryName.toLowerCase()} items on EthniqRootz - where niche communities connect through authentic commerce.`;

  return {
    title,
    description,
    keywords: [
      `curated ${categoryName.toLowerCase()}`,
      `${categoryName.toLowerCase()} products`,
      'authentic marketplace',
      'EthniqRootz',
      'verified merchants',
      'niche commerce',
      'premium products',
      categoryName.toLowerCase()
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'EthniqRootz',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/category/${categoryLower}`,
    },
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryLower = category.toLowerCase();
  
  if (!VALID_CATEGORIES.includes(categoryLower)) {
    notFound();
  }

  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      price_pence,
      status,
      images,
      city,
      category,
      user_id,
      profiles:profiles!products_user_id_fkey(
        handle,
        name,
        avatar_url
      )
    `)
    .eq('category', categoryLower.toUpperCase() as 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER')
    .order('created_at', { ascending: false })
    .limit(40);

  if (error) {
    console.error('Error fetching products:', error);
  }

  // Get user for save data (optional for category pages)
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get save data for the first few products to initialize the store
  const saveDataPromises = products?.slice(0, 5).map(product => 
    getServerSideSaveData(product.id, user?.id)
  ) || [];
  
  const saveDataResults = await Promise.all(saveDataPromises);

  const categoryName = categoryLower.charAt(0).toUpperCase() + categoryLower.slice(1);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} Products`,
    "description": `African ${categoryName.toLowerCase()} products available on EthniqRootz`,
    "url": `/category/${categoryLower}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products?.map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.title,
        "url": `/product/${product.id}`,
        "offers": {
          "@type": "Offer",
          "price": (product.price_pence / 100).toFixed(2),
          "priceCurrency": "GBP",
          "availability": product.status === 'AVAILABLE' ? 'https://schema.org/InStock' : 
                         product.status === 'RESTOCKING' ? 'https://schema.org/LimitedAvailability' : 
                         'https://schema.org/OutOfStock',
        },
        "image": product.images?.[0] ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${product.images[0]}` : 
          undefined,
      })) || []
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <SaveProvider 
        productId={products?.[0]?.id || ''}
        initialSaveCount={saveDataResults[0]?.saveCount || 0}
        initialIsSaved={saveDataResults[0]?.isSaved || false}
      >
        <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-foreground">Home</a></li>
              <li>/</li>
              <li className="text-foreground">{categoryName}</li>
            </ol>
          </nav>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {categoryName} Products
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover authentic African {categoryName.toLowerCase()} from local sellers across the UK
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {products?.length || 0} products available
            </p>
          </div>

          {/* Products Grid */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                No {categoryName.toLowerCase()} products found
              </h2>
              <p className="text-muted-foreground mb-8">
                Be the first to list a {categoryName.toLowerCase()} product on EthniqRootz!
              </p>
              <a
                href="/post"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
              >
                List a Product
              </a>
            </div>
          )}
        </div>
        </div>
      </SaveProvider>
    </>
  );
}
