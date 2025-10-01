import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ImageCarousel from '@/components/ImageCarousel';
import UserMenu from '@/components/UserMenu';
import Navigation from '@/components/Navigation';
import SaveCount from '@/components/SaveCount';
import SaveButton from '@/components/SaveButton';
import SaveProvider from '@/components/SaveProvider';
import { StartChatButton } from '@/components/StartChatButton';
import { getServerSideSaveData } from '@/lib/saves-server';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Await params for Next.js 15
  const { id } = await params;

  // Fetch product details
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      price_pence,
      status,
      images,
      city,
      postcode,
      category,
      tags,
      user_id,
      created_at,
      profiles:profiles!products_user_id_fkey(
        handle,
        name,
        avatar_url,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  // Get save data server-side
  const saveData = await getServerSideSaveData(product.id, user.id);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'RESTOCKING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'SOLD':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <SaveProvider 
      productId={product.id}
      initialSaveCount={saveData.saveCount}
      initialIsSaved={saveData.isSaved}
    >
      <div className="min-h-screen bg-background pb-32">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Link 
              href="/feed" 
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <UserMenu user={user} />
          </div>
        </div>

        {/* Image Carousel */}
        <ImageCarousel
          images={product.images || []}
          title={product.title}
        />

        {/* Product Info */}
        <div className="p-4 space-y-4 pb-24">
          {/* Title and Price */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{product.title}</h1>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">£{(product.price_pence / 100).toFixed(2)}</p>
          </div>

          {/* Status and Location */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
              {product.status}
            </span>
            <span className="text-muted-foreground">
              {product.city}{product.postcode && `, ${product.postcode}`}
            </span>
          </div>

          {/* Save Count and Stats */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <SaveCount productId={product.id} />
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Listed {new Date(product.created_at).toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {product.category.toLowerCase()} • {product.city}
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base">
              {product.profiles?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm sm:text-base truncate">@{product.profiles?.handle || 'unknown'}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Joined {new Date(product.profiles?.created_at || '').toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Link
                href={`/seller/${product.profiles?.handle}`}
                className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Shop
              </Link>
              <span className="text-yellow-500 text-sm sm:text-base">★★★★★</span>
              <span className="text-xs sm:text-sm text-muted-foreground">(4.8)</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Category</h3>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm capitalize">
              {product.category.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Action Buttons - Sticky Bottom */}
        <div className="fixed bottom-20 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-3 sm:p-4 z-30">
          <div className="max-w-7xl mx-auto flex space-x-2 sm:space-x-3">
            <StartChatButton
              productId={product.id}
              sellerId={product.user_id}
              sellerName={product.profiles?.name || undefined}
              className="flex-1"
            />
            <button className="flex-1 bg-primary text-primary-foreground py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base">
              🛒 Buy
            </button>
            <SaveButton 
              productId={product.id} 
              productTitle={product.title}
              className="px-3 sm:px-4 py-2.5 sm:py-3"
            />
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <Navigation />
        </div>
      </div>
    </SaveProvider>
  );
}