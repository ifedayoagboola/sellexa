import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing/LandingPage';

export default async function HomePage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect('/feed');
  } else {
    return <LandingPage />;
  }
}
