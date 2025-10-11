# Supabase Auth Configuration for Production

## ⚠️ IMPORTANT: Required Supabase Dashboard Settings

After deploying to production, you **MUST** configure these settings in your Supabase dashboard to fix email verification redirects.

---

## 📋 Step-by-Step Configuration

### 1. Go to Supabase Dashboard

Visit: https://app.supabase.com/project/sxveqitmcfrhmagycahx/auth/url-configuration

(Replace `sxveqitmcfrhmagycahx` with your production project ref)

---

### 2. Configure Site URL

**Setting:** Site URL  
**Value:** `https://ethniqrootz.com`

This is the main URL that will be used in email templates and as the default redirect.

---

### 3. Configure Redirect URLs

**Setting:** Redirect URLs  
**Add these URLs (one per line):**

```
https://ethniqrootz.com/auth/callback
https://ethniqrootz.com/**
```

These URLs are allowed as redirect destinations after email verification.

---

### 4. Optional: Environment Variables

If you want to use a different site URL for development vs production, add this to your `.env.local` (dev) or hosting platform (production):

```bash
# Production
NEXT_PUBLIC_SITE_URL=https://ethniqrootz.com

# Development (optional)
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## ✅ How It Works Now

### User Signup Flow:

1. User fills out signup form on `ethniqrootz.com/auth/signup`
2. Supabase sends verification email
3. Email contains link to `https://ethniqrootz.com/auth/callback?code=...`
4. Callback route exchanges code for session
5. User is redirected to `/feed` ✅

### Duplicate Email Handling:

- If user tries to signup with existing email, they now get: "An account with this email already exists. Please sign in instead."
- No more confusing "check your email" message for existing accounts

---

## 🔍 Verification

To verify the setup is working:

1. Go to production site: `https://ethniqrootz.com/auth/signup`
2. Create a test account
3. Check your email
4. Click verification link
5. Should redirect to `https://ethniqrootz.com/feed` (NOT localhost)

---

## 📝 Files Modified

- ✅ Created: `src/app/auth/callback/route.ts` - Handles email verification redirects
- ✅ Updated: `src/lib/auth-actions.ts` - Added emailRedirectTo and duplicate detection

---

## 🚨 Common Issues

**Issue:** Still redirecting to localhost after email verification  
**Fix:** Make sure Site URL in Supabase dashboard is set to `https://ethniqrootz.com`

**Issue:** Getting "check your email" for existing accounts  
**Fix:** Already fixed in the code (checks for empty identities array)

**Issue:** Redirect URL not allowed error  
**Fix:** Add `https://ethniqrootz.com/**` to Redirect URLs in Supabase dashboard

---

_Last Updated: October 11, 2025_
