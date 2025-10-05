import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import EditProductClient from './EditProductClient';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = await createClient();
  const { id } = await params;
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login?redirectTo=/edit-product/' + id);
  }

  // Fetch the product to edit
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      price_pence,
      category,
      status,
      city,
      postcode,
      tags,
      images,
      user_id
    `)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only edit their own products
    .single();

  if (error || !product) {
    redirect('/profile');
  }

  // Check KYC status
  const { data: profile } = await supabase
    .from('profiles')
    .select('kyc_status')
    .eq('id', user.id)
    .maybeSingle();

  // If KYC is not verified, redirect to KYC page
  if (!profile || profile.kyc_status !== 'verified') {
    redirect('/kyc?redirectTo=/edit-product/' + id);
  }

  return <EditProductClient user={user} product={product} />;
}
