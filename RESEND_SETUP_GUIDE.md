# 📧 Resend + Supabase Email Setup Guide

## 🎯 Overview

This guide shows you how to set up Resend for Supabase transactional emails while keeping Zoho for your business emails.

**Setup:**

- 📨 **Zoho** → Business emails (support@sellexa.app, hello@sellexa.app)
- 🤖 **Resend** → Automated emails (signup confirmations, password resets)

---

## ✅ **Recommended: Subdomain Setup (Easiest)**

This avoids any DNS conflicts with your existing Zoho setup.

### **Step 1: Create Resend Account**

1. Go to: https://resend.com
2. Sign up with your email
3. Verify your account

---

### **Step 2: Add Domain in Resend**

1. In Resend Dashboard, go to: **Domains**
2. Click **"Add Domain"**
3. Enter: `mail.sellexa.app` (or `transactional.sellexa.app`)
4. Click **"Add"**

Resend will show you DNS records to add. They'll look like:

```
Type: TXT
Name: mail.sellexa.app
Value: resend_verify=abc123xyz...

Type: MX
Name: mail.sellexa.app
Value: feedback-smtp.resend.com
Priority: 10

Type: TXT
Name: resend._domainkey.mail.sellexa.app
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4...
```

---

### **Step 3: Add DNS Records in Namecheap**

1. Log in to Namecheap
2. Go to: **Domain List** → Click **"Manage"** next to sellexa.app
3. Go to: **Advanced DNS**
4. Click **"Add New Record"**

**Add each record from Resend:**

**Verification Record:**

- Type: `TXT Record`
- Host: `mail`
- Value: `resend_verify=abc123xyz...` (from Resend)
- TTL: `Automatic`

**MX Record:**

- Type: `MX Record`
- Host: `mail`
- Value: `feedback-smtp.resend.com`
- Priority: `10`
- TTL: `Automatic`

**DKIM Record:**

- Type: `TXT Record`
- Host: `resend._domainkey.mail`
- Value: (long string from Resend)
- TTL: `Automatic`

**⚠️ Important:** Don't touch any existing Zoho records!

---

### **Step 4: Verify Domain in Resend**

1. Back in Resend Dashboard
2. Wait 5-10 minutes for DNS to propagate
3. Click **"Verify"** next to your domain
4. Should show ✅ Verified

---

### **Step 5: Get Resend API Key**

1. In Resend Dashboard, go to: **API Keys**
2. Click **"Create API Key"**
3. Name it: `Supabase Production`
4. Copy the key (starts with `re_...`)

---

### **Step 6: Add to Supabase**

**Option A: Via Supabase Dashboard**

1. Go to: https://app.supabase.com/project/sxveqitmcfrhmagycahx/settings/auth
2. Scroll to **SMTP Settings**
3. Enable SMTP
4. Fill in:
   ```
   Host: smtp.resend.com
   Port: 465
   Username: resend
   Password: re_yourApiKey...
   Sender email: noreply@mail.sellexa.app
   Sender name: EthniqRootz
   ```
5. Click **Save**

**Option B: Via Environment Variables (Production Hosting)**

Add to your production environment (Vercel, Netlify, etc.):

```bash
RESEND_API_KEY=re_yourApiKey...
```

Then update `supabase/config.toml` (for local dev):

```toml
[auth.email.smtp]
enabled = true
host = "smtp.resend.com"
port = 465
user = "resend"
pass = "env(RESEND_API_KEY)"
admin_email = "noreply@mail.sellexa.app"
sender_name = "EthniqRootz"
```

---

### **Step 7: Test It!**

1. Go to: https://sellexa.app/auth/signup
2. Create a test account
3. Check email - should come from `noreply@mail.sellexa.app`
4. Should use your beautiful custom template! ✨

---

## 🔄 **Alternative: Main Domain Setup**

If you want emails from `@sellexa.app` instead of `@mail.sellexa.app`:

### **DNS Configuration:**

**Keep existing Zoho records:**

```
MX    @    mx.zoho.com         10
MX    @    mx2.zoho.com        20
MX    @    mx3.zoho.com        50
TXT   @    v=spf1 include:zoho.com ~all
TXT   zoho._domainkey    [Zoho DKIM value]
```

**Add Resend records:**

```
TXT   @                    [Resend verification]
TXT   resend._domainkey    [Resend DKIM value]
```

**Update SPF record:**
Change:

```
v=spf1 include:zoho.com ~all
```

To:

```
v=spf1 include:zoho.com include:resend.com ~all
```

**In Supabase, use:**

```
Sender email: noreply@sellexa.app
```

---

## 🎨 **Update Email Templates**

Don't forget to update the sender in your templates!

In `supabase/templates/*.html`, the footer shows:

```html
<a href="mailto:support@sellexa.app">support@sellexa.app</a>
```

This is fine! Users can reply to your Zoho-managed support email even though the automated email comes from Resend.

---

## 🔍 **Troubleshooting**

### **DNS not propagating:**

- Wait 10-30 minutes
- Use https://dnschecker.org to check
- Make sure you saved changes in Namecheap

### **Emails not sending:**

- Check Supabase logs
- Verify Resend domain shows as "Verified"
- Check Resend dashboard for error logs

### **Emails going to spam:**

- Make sure DKIM is set up correctly
- Add SPF record
- Ask recipients to whitelist `noreply@mail.sellexa.app`

### **Zoho emails stopped working:**

- Make sure you didn't delete any Zoho MX/SPF/DKIM records
- Check Zoho admin panel for issues

---

## 📊 **Final DNS Configuration**

Your Namecheap DNS should look like:

```
# Zoho Records (Keep These!)
MX    @               mx.zoho.com                  10
MX    @               mx2.zoho.com                 20
MX    @               mx3.zoho.com                 50
TXT   @               v=spf1 include:zoho.com ~all
TXT   zoho._domainkey [Zoho DKIM]

# Resend Records (Add These!)
TXT   mail                       resend_verify=...
MX    mail                       feedback-smtp.resend.com  10
TXT   resend._domainkey.mail     [Resend DKIM]

# Your existing website records
A     @               [Your hosting IP]
CNAME www             [Your hosting]
```

---

## 💡 **Email Flow**

**Business Emails (Zoho):**

```
support@sellexa.app  →  Zoho Mail  →  Your inbox
hello@sellexa.app    →  Zoho Mail  →  Your inbox
```

**Automated Emails (Resend via Supabase):**

```
User signs up  →  Supabase  →  Resend  →  User's inbox
               (from: noreply@mail.sellexa.app)
```

Both work independently without conflicts! 🎉

---

## ✅ **Checklist**

- [ ] Created Resend account
- [ ] Added `mail.sellexa.app` domain in Resend
- [ ] Added DNS records in Namecheap
- [ ] Verified domain in Resend (shows green checkmark)
- [ ] Got Resend API key
- [ ] Updated Supabase SMTP settings
- [ ] Updated email templates (already done!)
- [ ] Tested signup flow
- [ ] Checked email doesn't go to spam

---

## 💰 **Resend Pricing**

- Free tier: 3,000 emails/month
- Perfect for starting out
- Upgrade later if needed

vs Zoho is for your regular business correspondence.

---

## 🎉 **Benefits**

✅ Professional transactional emails  
✅ High deliverability (better than Zoho SMTP)  
✅ Detailed analytics in Resend dashboard  
✅ No conflict with Zoho business emails  
✅ Beautiful branded templates  
✅ Reliable service built for developers

---

_Setup Guide Created: October 11, 2025_  
_EthniqRootz Email Infrastructure_
