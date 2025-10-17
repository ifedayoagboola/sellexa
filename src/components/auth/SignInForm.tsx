'use client';

import { useState, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn, signInWithGoogle } from '@/lib/auth-actions';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

// Validation schema
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const errorParam = searchParams.get('error');
  const messageParam = searchParams.get('message');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === 'verification_failed' 
      ? (messageParam || 'Email verification failed. Please try again.') 
      : null
  );
  const [message, setMessage] = useState<string | null>(messageParam);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for the server action
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (redirectTo) {
        formData.append('redirectTo', redirectTo);
      }

      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
      }
      // If no error, the signIn function will redirect
    } catch (err: any) {
      // Ignore NEXT_REDIRECT errors (expected for successful redirects)
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return; // Don't show error toast for successful redirects
      }
      console.error('Sign in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      if (redirectTo) {
        formData.append('redirectTo', redirectTo);
      }

      await signInWithGoogle(formData);
    } catch (err: any) {
      // Ignore NEXT_REDIRECT errors (expected for successful redirects)
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return;
      }
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google sign in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {message && !error && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{message}</AlertDescription>
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
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className={`pl-10 h-12 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`pl-10 h-12 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>
      </div>

          <Button
            type="submit"
            disabled={isSubmitting || isFormSubmitting}
            className="w-full bg-[#1aa1aa] hover:bg-[#158a8f] h-12 text-base font-medium"
          >
            {isSubmitting || isFormSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isFormSubmitting}
            className="w-full h-12 text-base font-medium"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            {isSubmitting || isFormSubmitting ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-[#1aa1aa] hover:text-[#158a8f] transition-colors">
                Sign up
              </Link>
            </p>
            <p className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-[#1aa1aa] hover:text-[#158a8f] transition-colors">
                Forgot your password?
              </Link>
            </p>
          </div>
    </form>
  );
}
