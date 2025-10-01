'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth-actions';
import { useSearchParams } from 'next/navigation';

export default function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4 sm:space-y-6">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-3 text-base border border-border rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-4 py-3 text-base border border-border rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          placeholder="Enter your password"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="/auth/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
}
