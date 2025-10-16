import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Globe, Heart, Users } from 'lucide-react';

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Welcome to Sellexa
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                The digital home for diaspora commerce
              </p>
            </div>
            
            {/* Feature Icons */}
            <div className="flex justify-center space-x-8 py-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-[#1aa1aa]/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-[#1aa1aa]" />
                </div>
                <span className="text-xs text-gray-600">Curate</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-[#1aa1aa]/10 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-[#1aa1aa]" />
                </div>
                <span className="text-xs text-gray-600">Connect</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-[#1aa1aa]/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#1aa1aa]" />
                </div>
                <span className="text-xs text-gray-600">Commerce</span>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <Button asChild className="w-full bg-[#1aa1aa] hover:bg-[#158a8f] h-12 text-base font-medium">
                  <Link href="/auth/login" className="flex items-center justify-center space-x-2">
                    <span>Continue with Email</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      href="/auth/signup" 
                      className="font-medium text-[#1aa1aa] hover:text-[#158a8f] transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Terms */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
