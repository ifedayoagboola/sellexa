# RLS Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Apply RLS to Development
git checkout develop
npm run db:link:dev
npm run migrate:dev
npm run test:rls

# Apply RLS to Production
git checkout main
npm run db:link:prod
npm run migrate:prod
npm run test:rls
```

---

## 📋 What Each Table Allows

| Table        | Public Read  | Create      | Update Own | Delete Own |
| ------------ | ------------ | ----------- | ---------- | ---------- |
| **profiles** | ✅           | ✅ Own      | ✅         | ❌         |
| **products** | ✅ Available | ✅ Verified | ✅         | ✅         |
| **threads**  | ❌           | ✅ Buyer    | ✅ Both    | ❌         |
| **messages** | ❌           | ✅ Member   | ✅         | ✅         |
| **saves**    | ✅           | ✅ Own      | ❌         | ✅         |
| **reviews**  | ✅           | ✅ Own      | ✅         | ✅         |
| **KYC docs** | ❌           | ✅ Own      | ✅         | ❌         |

---

## 🔑 Key Policies

### Products

```
READ: Anyone (if AVAILABLE/SOLD) or owner
CREATE: KYC verified sellers only
UPDATE/DELETE: Owner only
```

### Conversations

```
READ: Buyer or Seller only
CREATE: Authenticated users (as buyer)
UPDATE: Participants only
DELETE: Blocked (preserve history)
```

### Profile

```
READ: Public (everyone)
CREATE: Own profile only
UPDATE: Own profile only
DELETE: Blocked (use auth deletion)
```

---

## 🧪 Test Commands

```bash
# Run full test suite
npm run test:rls

# Test specific table (in Supabase SQL Editor)
SELECT * FROM products;           -- Should work
SELECT * FROM threads;            -- Should return empty
SELECT * FROM messages;           -- Should return empty
```

---

## ⚠️ Common Issues

| Issue                | Cause             | Fix                              |
| -------------------- | ----------------- | -------------------------------- |
| "Permission denied"  | Not authenticated | Check `auth.getUser()`           |
| Can't create product | Not verified      | Update `kyc_status = 'verified'` |
| Can't see own data   | Policy too strict | Review SELECT policy             |
| Can see others' data | Policy too loose  | Review WHERE clause              |

---

## 📞 Quick Debug

```javascript
// Check if user is authenticated
const {
  data: { user },
} = await supabase.auth.getUser();
console.log("User:", user?.id);

// Check user's KYC status
const { data: profile } = await supabase
  .from("profiles")
  .select("kyc_status")
  .eq("id", user.id)
  .single();
console.log("KYC:", profile.kyc_status);

// Test if user can access data
const { data, error } = await supabase.from("products").select("*");
console.log("Error:", error?.message);
```

---

## 📚 Documentation

- **Full Guide:** `docs/RLS_SECURITY_GUIDE.md`
- **Setup Summary:** `docs/RLS_SETUP_SUMMARY.md`
- **Migration File:** `supabase/migrations/20251007000000_add_comprehensive_rls_policies.sql`

---

## ✅ Deployment Checklist

### Development

- [ ] `git checkout develop`
- [ ] `npm run db:link:dev`
- [ ] `npm run migrate:dev`
- [ ] `npm run test:rls` (all pass)
- [ ] Manual feature testing
- [ ] Commit and push

### Production

- [ ] `git checkout main`
- [ ] `git merge develop`
- [ ] `npm run db:link:prod`
- [ ] `npm run migrate:prod`
- [ ] `npm run test:rls` (all pass)
- [ ] Test production app
- [ ] Monitor for errors

---

**Need Help?** Check `docs/RLS_SECURITY_GUIDE.md` for detailed troubleshooting.
