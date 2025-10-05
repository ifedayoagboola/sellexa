import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import PostPageClient from './PostPageClient';

export default async function PostPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login?redirectTo=/post');
  }

  // Check KYC status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('kyc_status')
    .eq('id', user.id)
    .maybeSingle();

  // If KYC is not verified, redirect to KYC page
  if (!profile || profile.kyc_status !== 'verified') {
    redirect('/kyc?redirectTo=/post');
  }

  return <PostPageClient user={user} />;
}