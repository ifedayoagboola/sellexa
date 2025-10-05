import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import UserProvider from '@/components/UserProvider';
import ProfilePageClient from './ProfilePageClient';

export default async function ProfilePage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Fetch user profile information
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  // Fetch user's products for dashboard stats and management
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      id,
      title,
      price_pence,
      status,
      images,
      created_at,
      updated_at
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  return (
    <UserProvider initialUser={user}>
      <div className="min-h-screen bg-gray-50 pb-20">
        <TopBar />
        <ProfilePageClient user={user} profile={profile} products={products || []} />
      </div>
    </UserProvider>
  );
}