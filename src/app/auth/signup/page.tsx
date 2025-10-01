import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignUpForm from '@/components/auth/SignUpForm';

export default async function SignUpPage() {
  const supabase = await createClient();
  
  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect('/feed');
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Link 
            href="/splash" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>

        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Join EthniqRootz and start selling authentic African products
          </p>
        </div>
        
        <div className="mt-6 sm:mt-8">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
