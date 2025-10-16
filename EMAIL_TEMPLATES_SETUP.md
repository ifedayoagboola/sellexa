# 📧 Custom Email Templates Setup Guide

## ✨ What's Included

I've created professional, branded email templates for:

- ✅ **Email Confirmation** (`confirmation.html`) - Welcome new users
- ✅ **Password Recovery** (`recovery.html`) - Reset password emails
- ✅ **Magic Link** (`magic_link.html`) - Passwordless login

All templates are:

- 📱 Mobile-responsive
- 🎨 Branded with Sellexa colors (#1aa1aa)
- 🔒 Include security notices
- ✉️ Professional and clean design

---

## 🚀 How to Set Up in Supabase

### **Option 1: Via Supabase Dashboard (Easiest)**

1. **Go to Email Templates:**

   - Visit: https://app.supabase.com/project/sxveqitmcfrhmagycahx/auth/templates
   - Or navigate: Your Project → Authentication → Email Templates

2. **Update Each Template:**

   **For Confirmation Email:**

   - Click on "Confirm signup"
   - Replace the HTML with content from `supabase/templates/confirmation.html`
   - Click "Save"

   **For Password Recovery:**

   - Click on "Reset password"
   - Replace the HTML with content from `supabase/templates/recovery.html`
   - Click "Save"

   **For Magic Link (Optional):**

   - Click on "Magic Link"
   - Replace the HTML with content from `supabase/templates/magic_link.html`
   - Click "Save"

---

### **Option 2: Via supabase/config.toml (For Local/CLI)**

Update your `supabase/config.toml`:

```toml
[auth.email.template.confirmation]
subject = "Welcome to Sellexa - Confirm Your Email"
content_path = "./supabase/templates/confirmation.html"

[auth.email.template.recovery]
subject = "Reset Your Sellexa Password"
content_path = "./supabase/templates/recovery.html"

[auth.email.template.magic_link]
subject = "Sign in to Sellexa"
content_path = "./supabase/templates/magic_link.html"
```

Then push to production:

```bash
npm run db:push:prod
```

---

## 🎯 Template Features

### **Design Elements:**

- Clean, modern layout with rounded corners
- Sellexa brand color (#1aa1aa)
- Large, clickable button CTAs
- Alternative text link for accessibility
- Security warning boxes
- Mobile-optimized layout

### **Available Variables:**

These variables are automatically replaced by Supabase:

- `{{ .ConfirmationURL }}` - The verification/action link
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email (if needed)

---

## ✅ Verification

After setting up, test by:

1. **Test Signup:**

   - Create a new account on `https://sellexa.app/auth/signup`
   - Check your email
   - Should see the branded Sellexa template ✨

2. **Test Password Reset:**
   - Go to forgot password (if you have that page)
   - Check your email
   - Should see the branded reset template

---

## 🎨 Customization Tips

### **Change Colors:**

Replace `#1aa1aa` with your preferred color throughout the templates.

### **Change Support Email:**

Update `support@sellexa.app` to your actual support email.

### **Add Logo Image:**

Add an `<img>` tag in the header section:

```html
<img
  src="https://sellexa.app/ethniqrootz.png"
  alt="Sellexa"
  style="max-width: 200px; height: auto;"
/>
```

### **Change Footer Text:**

Update copyright year or add social media links in the footer section.

---

## 📋 Template Locations

All templates are in:

```
supabase/templates/
├── confirmation.html   # Email confirmation
├── recovery.html      # Password reset
└── magic_link.html    # Magic link sign-in
```

---

## 🔧 Troubleshooting

**Templates not showing:**

- Make sure you saved them in the Supabase dashboard
- Clear cache and try again
- Check that Site URL is set correctly

**Links going to localhost:**

- Update Site URL in Supabase dashboard to `https://sellexa.app`
- Update Redirect URLs as mentioned in AUTH_FIX_SUMMARY.md

**Email not sending:**

- Check Supabase logs
- Verify SMTP settings if using custom SMTP
- Check spam folder

---

## 🎉 Result

Before:

```
Confirm your signup
Follow this link to confirm your user:
Confirm your mail
```

After:

```
✨ Beautiful branded email with:
- Sellexa logo
- Welcome message
- Large "Confirm Your Email" button
- Security notices
- Professional footer
```

---

_Created: October 11, 2025_  
_Sellexa Custom Email Templates_
