import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import PostPageClient from './PostPageClient';

export default async function PostPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return <PostPageClient user={user} />;
}