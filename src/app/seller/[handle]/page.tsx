import { createClient } from '@/integrations/supabase/server';
import { notFound } from 'next/navigation';
import CulturalStorefrontClient from './CulturalStorefrontClient';

interface SellerCataloguePageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function SellerCataloguePage({ params }: SellerCataloguePageProps) {
  const { handle } = await params;
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get seller profile by handle
  const { data: seller, error: sellerError } = await supabase
    .from('profiles')
    .select(`
      id,
      handle,
      name,
      avatar_url,
      city,
      postcode,
      created_at
    `)
    .eq('handle', handle)
    .single();

  if (sellerError || !seller) {
    notFound();
  }

  // Get seller's KYC data
  const { data: kycData } = await supabase
    .from('profiles')
    .select(`
      kyc_status,
      business_name,
      business_description,
      business_logo_url,
      business_address,
      business_city,
      business_country,
      business_phone,
      business_whatsapp,
      business_website,
      business_instagram,
      business_twitter,
      business_facebook
    `)
    .eq('id', seller.id)
    .single();

  // Get seller's products (all products regardless of status)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      id,
      title,
      price_pence,
      status,
      images,
      city,
      category,
      created_at,
      description
    `)
    .eq('user_id', seller.id)
    .order('created_at', { ascending: false });


  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  // Get seller stats (all products, not just available)
  const { data: stats } = await supabase
    .from('products')
    .select('id')
    .eq('user_id', seller.id);

  const productCount = stats?.length || 0;

  return (
    <CulturalStorefrontClient 
      seller={seller}
      products={products || []}
      productCount={productCount}
      kycData={kycData as any}
      user={user}
    />
  );
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: SellerCataloguePageProps) {
  const { handle } = await params;
  const supabase = await createClient();
  
  const { data: seller } = await supabase
    .from('profiles')
    .select('id, handle, name, avatar_url, city')
    .eq('handle', handle)
    .single();

  if (!seller) {
    return {
      title: 'Seller Not Found',
    };
  }

  // Get seller's KYC data for business information
  const { data: kycData } = await supabase
    .from('profiles')
    .select('business_name, business_logo_url')
    .eq('id', seller.id)
    .single();

  // Get business name for metadata
  const businessName = kycData?.business_name || seller.name || seller.handle;
  const businessLogo = kycData?.business_logo_url || seller.avatar_url;

  return {
    title: `${businessName}'s Cultural Storefront | Sellexa`,
    description: `Discover authentic cultural products and stories from ${businessName}'s cultural storefront. Shop with confidence and connect with our heritage.`,
    openGraph: {
      title: `${businessName}'s Cultural Storefront`,
      description: `Discover authentic cultural products and stories from ${businessName}'s cultural storefront.`,
      images: businessLogo ? [businessLogo] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${businessName}'s Cultural Storefront`,
      description: `Discover authentic cultural products and stories from ${businessName}'s cultural storefront.`,
      images: businessLogo ? [businessLogo] : [],
    },
  };
}
