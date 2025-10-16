'use server';

import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signIn(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectTo = formData.get('redirectTo') as string;

    console.log('Sign in attempt:', { email, password: password ? '***' : 'empty' });

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    try {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log('Sign in result:', { data, error });

        if (error) {
            return { error: error.message };
        }

        revalidatePath('/');
        redirect(redirectTo || '/feed');
    } catch (err) {
        console.error('Sign in error:', err);
        return { error: 'An unexpected error occurred during sign in' };
    }
}

export async function signUp(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const fullName = formData.get('fullName') as string;

    if (!email || !password || !confirmPassword || !fullName) {
        return { error: 'All fields are required' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sellexa.app'}/auth/callback`,
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        // Handle specific error cases for existing users
        if (error.message.includes('already registered') ||
            error.message.includes('already been registered') ||
            error.message.includes('User already registered') ||
            error.message.includes('email address is already in use')) {
            return { error: 'An account with this email already exists. Please sign in instead.' };
        }
        return { error: error.message };
    }

    // Check if this is a duplicate email (user exists but identities are empty)
    // This happens when email confirmations are required and user tries to signup again
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { error: 'An account with this email already exists. Please sign in instead.' };
    }

    // Sign out the user immediately after signup to prevent automatic login
    // This ensures the user must confirm their email before accessing the app
    await supabase.auth.signOut();

    revalidatePath('/');
    redirect('/auth/login?message=Check your email to confirm your account');
}

export async function signOut() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    revalidatePath('/');
    redirect('/auth/login');
}
