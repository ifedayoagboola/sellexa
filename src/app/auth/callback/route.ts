import { createClient } from '@/integrations/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const type = requestUrl.searchParams.get('type');
    const redirectTo = requestUrl.searchParams.get('redirectTo');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Auth callback error:', error);
            // If verification fails, redirect to login with error message
            return NextResponse.redirect(`${origin}/auth/login?error=verification_failed&message=${encodeURIComponent(error.message)}`);
        }

        // Handle different auth flows
        if (type === 'recovery') {
            // Password reset flow - redirect to reset password page with session established
            return NextResponse.redirect(`${origin}/auth/reset-password`);
        } else if (type === 'signup' || type === 'email_change') {
            // Email confirmation flow - redirect to login with success message
            return NextResponse.redirect(`${origin}/auth/login?message=Email confirmed successfully. Please sign in.`);
        } else {
            // OAuth flow (Google, etc.) - redirect to intended destination
            const destination = redirectTo || '/feed';
            return NextResponse.redirect(`${origin}${destination}`);
        }
    }

    // If no code, redirect to login
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
}

