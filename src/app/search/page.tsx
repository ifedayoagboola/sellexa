import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import TopBar from '@/components/TopBar';
import ProductCard from '@/components/ProductCard';
import Navigation from '@/components/Navigation';
import SaveProvider from '@/components/SaveProvider';
import SearchPageClient from './SearchPageClient';

export default async function SearchPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return <SearchPageClient user={user} />;
}