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
            return NextResponse.redirect(`${origin}/auth/login?error=verification_failed&message=${encodeURIComponent(error.message)}`);
        }

        // Handle different auth flows
        if (type === 'recovery') {
            return NextResponse.redirect(`${origin}/auth/reset-password`);
        } else if (type === 'signup' || type === 'email_change') {
            return NextResponse.redirect(`${origin}/auth/login?message=Email confirmed successfully. Please sign in.`);
        } else {
            // OAuth flow - redirect to intended destination or feed
            const finalRedirectTo = redirectTo || '/feed';
            return NextResponse.redirect(`${origin}${finalRedirectTo}`);
        }
    }

    return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
}

