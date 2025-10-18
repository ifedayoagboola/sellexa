import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import SignUpForm from '@/components/auth/SignUpForm';

export default async function SignUpPage() {
  const supabase = await createClient();
  
  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect('/feed');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </Button>
          
          <Link href="/feed" className="flex items-center">
            <div className="w-32 h-20 sm:w-40 sm:h-24 relative">
              <Image
                src="/sellexa.png"
                alt="Sellexa"
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
          {/* Signup Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-2 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create your account
              </CardTitle>
              <CardDescription className="text-gray-600">
                The digital home for diaspora commerce - start your entrepreneurial journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
