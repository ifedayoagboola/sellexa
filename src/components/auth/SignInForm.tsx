'use client';

import { useState, useActionState } from 'react';
import { signIn } from '@/lib/auth-actions';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  
  const handleSignIn = async (prevState: any, formData: FormData) => {
    const result = await signIn(formData);
    return result;
  };
  
  const [state, formAction, isPending] = useActionState(handleSignIn, null);

  return (
    <form 
      action={formAction} 
      className="space-y-6"
    >
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}
      
      {state?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              className="pl-10 h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="pl-10 h-12"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#1aa1aa] hover:bg-[#158a8f] h-12 text-base font-medium"
      >
        {isPending ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-[#1aa1aa] hover:text-[#158a8f] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
