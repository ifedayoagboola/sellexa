import { createClient } from '@/integrations/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            // If verification fails, redirect to login with error message
            return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`);
        }
    }

    // Redirect to feed after successful email verification
    return NextResponse.redirect(`${origin}/feed`);
}

