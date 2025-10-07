import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import SignInForm from '@/components/auth/SignInForm';

interface LoginPageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  
  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect('/feed');
  }

  // Await searchParams for Next.js 15
  const { message } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
            <Link href="/splash" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </Button>
          
          <Link href="/feed" className="flex items-center">
            <div className="w-32 h-20 sm:w-40 sm:h-24 relative">
              <Image
                src="/ethniqrootz.png"
                alt="EthniqRootz"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-6">
          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {/* Login Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-2 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Sign in to EthniqRootz
              </CardTitle>
              <CardDescription className="text-gray-600">
                Join your niche community and discover curated authentic products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
