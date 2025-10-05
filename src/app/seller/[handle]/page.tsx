import { createClient } from '@/integrations/supabase/server';
import { notFound } from 'next/navigation';
import SellerCatalogueClient from './SellerCatalogueClient';

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

  // Get seller's products
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
    .eq('status', 'AVAILABLE')
    .order('created_at', { ascending: false });

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  // Get seller stats
  const { data: stats } = await supabase
    .from('products')
    .select('id')
    .eq('user_id', seller.id)
    .eq('status', 'AVAILABLE');

  const productCount = stats?.length || 0;

  return (
    <SellerCatalogueClient 
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
    .select('handle, name, avatar_url, city')
    .eq('handle', handle)
    .single();

  if (!seller) {
    return {
      title: 'Seller Not Found',
    };
  }

  return {
    title: `${seller.name || seller.handle}'s Shop | EthniqRootz`,
    description: `Shop ${seller.name || seller.handle}'s unique products on EthniqRootz. Discover amazing items from ${seller.city || 'our marketplace'}.`,
    openGraph: {
      title: `${seller.name || seller.handle}'s Shop`,
      description: `Shop ${seller.name || seller.handle}'s unique products on EthniqRootz`,
      images: seller.avatar_url ? [seller.avatar_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${seller.name || seller.handle}'s Shop`,
      description: `Shop ${seller.name || seller.handle}'s unique products on EthniqRootz`,
      images: seller.avatar_url ? [seller.avatar_url] : [],
    },
  };
}
