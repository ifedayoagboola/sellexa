import Link from 'next/link';

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center space-y-6 sm:space-y-8 max-w-md w-full">
        {/* Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">ER</span>
        </div>
        
        {/* Tagline */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            EthniqRootz
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Discover. Share. Trade. Rootz that connect us.
          </p>
        </div>
        
        {/* Auth Buttons */}
        <div className="space-y-4 w-full">
          <Link
            href="/auth/login"
            className="block w-full bg-primary text-primary-foreground py-3 sm:py-4 rounded-lg font-medium text-center hover:bg-primary/90 transition-colors text-base"
          >
            Continue with Email
          </Link>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
        {/* Terms */}
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
