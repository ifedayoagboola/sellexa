# Row Level Security (RLS) Guide

## 📋 Overview

Row Level Security (RLS) is PostgreSQL's built-in security feature that controls which rows users can access in database tables. This guide explains how RLS is configured in EthniqRootz and how to verify it's working correctly.

---

## 🛡️ Why RLS Matters

**Without RLS:**

- Any authenticated user could potentially access ALL data
- Users could read/modify other users' private information
- Conversations, products, and profiles would be vulnerable

**With RLS:**

- Users can only access data they own or are permitted to see
- Automatic enforcement at the database level
- Security can't be bypassed by client-side code

---

## 📊 RLS Policies by Table

### 1. **Profiles Table**

| Operation  | Who Can Access   | Policy                                   |
| ---------- | ---------------- | ---------------------------------------- |
| **SELECT** | Everyone         | View all public profiles                 |
| **INSERT** | Own profile only | Users create their own profile on signup |
| **UPDATE** | Own profile only | Users can edit their own info            |
| **DELETE** | Blocked          | Prevents accidental deletion             |

**Security Notes:**

- ✅ All profile data is public (names, handles, bios)
- ✅ KYC data included but visible to all (for seller verification transparency)
- ⚠️ If you want private profile fields, add them to a separate `private_profiles` table

---

### 2. **Products Table**

| Operation  | Who Can Access        | Policy                                      |
| ---------- | --------------------- | ------------------------------------------- |
| **SELECT** | Everyone              | View AVAILABLE/SOLD products                |
|            | Own products          | Sellers see their own products (any status) |
| **INSERT** | Verified sellers only | Must have `kyc_status = 'verified'`         |
| **UPDATE** | Product owner only    | Sellers can edit their products             |
| **DELETE** | Product owner only    | Sellers can delete their products           |

**Security Notes:**

- ✅ Only verified sellers can create products
- ✅ Draft products only visible to owner
- ✅ Prevents unauthorized product editing/deletion

---

### 3. **Threads Table** (Chat Conversations)

| Operation  | Who Can Access    | Policy                               |
| ---------- | ----------------- | ------------------------------------ |
| **SELECT** | Participants only | Buyer or seller in the conversation  |
| **INSERT** | Buyer only        | User must be the buyer in new thread |
| **UPDATE** | Participants only | Both parties can update metadata     |
| **DELETE** | Blocked           | Conversations are permanent          |

**Security Notes:**

- ✅ Only conversation participants can see messages
- ✅ Prevents thread hijacking
- ✅ No deletion preserves conversation history

---

### 4. **Messages Table**

| Operation  | Who Can Access      | Policy                            |
| ---------- | ------------------- | --------------------------------- |
| **SELECT** | Thread participants | Must be buyer or seller of thread |
| **INSERT** | Thread participants | Can only send to own threads      |
| **UPDATE** | Message sender only | Can edit own messages             |
| **DELETE** | Message sender only | Can delete own messages           |

**Security Notes:**

- ✅ Messages only visible to conversation participants
- ✅ Can't send messages to someone else's conversation
- ✅ Can only edit/delete own messages

---

### 5. **Saves Table**

| Operation  | Who Can Access | Policy                                 |
| ---------- | -------------- | -------------------------------------- |
| **SELECT** | Everyone       | All saves are public (for save counts) |
| **INSERT** | Own saves only | Users save products for themselves     |
| **DELETE** | Own saves only | Users unsave their own products        |

**Security Notes:**

- ✅ Save counts are public (feature transparency)
- ✅ Users can only save/unsave for themselves

---

### 6. **Reviews Table**

| Operation  | Who Can Access     | Policy                          |
| ---------- | ------------------ | ------------------------------- |
| **SELECT** | Everyone           | Reviews are public              |
| **INSERT** | Own reviews only   | One review per user per product |
| **UPDATE** | Review author only | Edit own reviews                |
| **DELETE** | Review author only | Delete own reviews              |

**Security Notes:**

- ✅ Public reviews for transparency
- ✅ One review per product per user
- ✅ Can't edit others' reviews

---

### 7. **Seller Verification Documents**

| Operation  | Who Can Access      | Policy                     |
| ---------- | ------------------- | -------------------------- |
| **SELECT** | Document owner only | Sellers see their own docs |
| **INSERT** | Own documents only  | Upload own verification    |
| **UPDATE** | Own documents only  | Update submission          |

**Security Notes:**

- ✅ Highly sensitive - only owner can view
- ✅ Admins access via service role key (bypasses RLS)
- ✅ Documents never exposed to other users

---

### 8. **Chat Enhancement Tables**

**Message Reactions:**

- Anyone can view reactions
- Users create/delete their own reactions

**Typing Indicators:**

- Thread participants can see indicators
- Users manage their own indicators

**Conversation Metadata:**

- Users see their own metadata (archived, muted, etc.)

**Message Attachments:**

- Thread participants can view attachments
- Users upload attachments to their messages

---

## 🧪 Testing RLS Policies

### **Test Script**

Create a test file: `scripts/test-rls.js`

```javascript
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRLS() {
  console.log("🧪 Testing RLS Policies...\n");

  // Test 1: Unauthenticated user
  console.log("Test 1: Unauthenticated access");
  const { data: products } = await supabase.from("products").select("*");
  console.log(`✓ Can view ${products?.length || 0} public products\n`);

  // Test 2: Try to insert without auth (should fail)
  console.log("Test 2: Unauthorized insert attempt");
  const { error } = await supabase
    .from("products")
    .insert({ title: "Test Product", price_pence: 1000 });
  console.log(
    error
      ? "✓ Correctly blocked unauthorized insert"
      : "❌ SECURITY ISSUE: Insert allowed!\n"
  );

  // Test 3: View private data (should be blocked)
  console.log("Test 3: Access to private conversations");
  const { data: threads } = await supabase.from("threads").select("*");
  console.log(
    threads?.length === 0
      ? "✓ Correctly blocked private threads"
      : "❌ SECURITY ISSUE: Private data exposed!\n"
  );

  console.log("✅ RLS tests complete!");
}

testRLS().catch(console.error);
```

### **Run Tests**

```bash
# Add to package.json scripts:
"test:rls": "node scripts/test-rls.js"

# Run test
npm run test:rls
```

---

## 🚀 Applying RLS to Production

### **Step 1: Test Locally First**

```bash
# Make sure you're on develop branch
git checkout develop

# Link to dev Supabase
npm run db:link:dev

# Apply the new RLS migration
npm run migrate:dev

# Verify no errors
npm run db:status
```

### **Step 2: Test in Development**

```bash
# Start your app
npm run dev

# Test all features:
# - Create product (as verified seller)
# - View profiles
# - Send messages
# - Save products
# - Leave reviews
```

### **Step 3: Deploy to Production**

```bash
# Switch to main branch
git checkout main

# Merge from develop
git merge develop

# Link to production
npm run db:link:prod

# Apply migration to production
npm run migrate:prod

# Verify
npm run db:status
```

---

## ⚠️ Important Security Notes

### **What RLS Protects:**

- ✅ Unauthorized data access through the API
- ✅ Malicious client-side code
- ✅ SQL injection attempts through Supabase
- ✅ Accidental data exposure

### **What RLS Does NOT Protect:**

- ❌ Service role key abuse (bypasses RLS)
- ❌ Physical database access
- ❌ Compromised user credentials
- ❌ Application logic bugs

### **Additional Security Measures:**

1. **Never expose service role key to client:**

   ```javascript
   // ❌ NEVER do this:
   const supabase = createClient(url, serviceRoleKey);

   // ✅ Always use anon key on client:
   const supabase = createClient(url, anonKey);
   ```

2. **Use service role key only in server-side code:**

   - API routes
   - Server components
   - Background jobs
   - Admin functions

3. **Monitor access patterns:**

   - Set up Supabase logging
   - Watch for unusual query patterns
   - Alert on policy violations

4. **Regular audits:**
   - Review RLS policies quarterly
   - Test with different user roles
   - Verify new features have proper RLS

---

## 🔧 Troubleshooting

### **Issue: "Permission denied" errors**

**Cause:** RLS policies are too restrictive

**Solution:**

1. Check if user is authenticated: `await supabase.auth.getUser()`
2. Verify user has required status (e.g., KYC verified)
3. Check policy conditions in migration file
4. Test with service role key to confirm RLS is the issue

### **Issue: Users can see data they shouldn't**

**Cause:** RLS policies are too permissive

**Solution:**

1. Review SELECT policies for the table
2. Add additional conditions to restrict access
3. Create new migration to update policy:
   ```sql
   DROP POLICY "policy_name" ON table_name;
   CREATE POLICY "new_policy_name" ON table_name
     FOR SELECT USING (stricter_condition);
   ```

### **Issue: Can't perform operations as admin**

**Cause:** Need to bypass RLS for admin functions

**Solution:**

```javascript
// Use service role key for admin operations
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role bypasses RLS
);

// Now can perform admin operations
await supabaseAdmin.from("products").update({ status: "SOLD" });
```

---

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [RLS Performance Tips](https://supabase.com/docs/guides/database/postgres/row-level-security#performance)

---

## ✅ Security Checklist

After applying RLS migration:

- [ ] RLS enabled on all tables
- [ ] Policies tested for each table
- [ ] Unauthenticated access properly restricted
- [ ] Users can only access their own data
- [ ] Verified sellers can create products
- [ ] Chat conversations are private
- [ ] KYC documents are secure
- [ ] Service role key kept secret
- [ ] Production migration successful
- [ ] All features working correctly

---

**Last Updated:** October 7, 2025  
**Migration File:** `20251007000000_add_comprehensive_rls_policies.sql`
