# 🚨 Immediate Action Plan: Sync Main Branch Database

## The Problem

- ✅ `develop` branch: Database has all tables (working perfectly)
- ❌ `main` branch: Database missing tables (not working)

## The Solution

Follow these steps **right now** to fix the issue, then implement the long-term solution.

---

## Step 1: Immediate Fix (Do This Now) ⚡

### Option A: Apply Migrations via CLI

```bash
# From your project root
npm run db:push:prod
```

This will apply all migration files from `supabase/migrations/` to your production database.

### Option B: Manual Application (If Option A Fails)

1. Go to Supabase Dashboard for **ethniqrootz-prod**: https://app.supabase.com/project/sxveqitmcfrhmagycahx/sql
2. Copy the SQL from each migration file in order:
   - `supabase/migrations/00000000000000_migration_tracking.sql`
   - `supabase/migrations/20241220_create_saves_table.sql`
   - `supabase/migrations/20250101140000_optimize_saves.sql`
   - `supabase/migrations/20250101180000_add_seller_kyc.sql`
   - `supabase/migrations/20250101180100_update_kyc_default_status.sql`
   - `supabase/migrations/20251001134018_add_product_reviews.sql`
   - `supabase/migrations/20251001162322_enhance_chat_system.sql`
   - `supabase/migrations/20251001171055_fix_ambiguous_column_references.sql`
   - `supabase/migrations/20251001172920_fix_conversation_metadata_join.sql`
   - `supabase/migrations/20251001174812_final_chat_cleanup.sql`
   - `supabase/migrations/20251007000000_add_comprehensive_rls_policies.sql`
3. Run each SQL query in the SQL Editor
4. Verify tables are created

### Verify It Worked

```bash
# Check migration status
npm run migrate:status

# Or check directly
npx supabase migration list --project-ref sxveqitmcfrhmagycahx
```

---

## Step 2: Set Up GitHub Actions (Prevent Future Issues) 🤖

### A. Get Supabase Access Token

1. Visit: https://app.supabase.com/account/tokens
2. Click "Generate new token"
3. Copy the token

### B. Add GitHub Secret

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `SUPABASE_ACCESS_TOKEN`
5. Value: [paste the token from step A]
6. Click "Add secret"

### C. Verify CI/CD File

The workflow file exists at: `.github/workflows/migrate.yml`

This will automatically apply migrations to **ethniqrootz-prod** when you push to `main`.

---

## Step 3: Implement Workflow Going Forward 📋

### For Every Feature with Database Changes:

```bash
# 1. Create feature branch from develop
git checkout develop
git pull
git checkout -b feature/my-feature

# 2. Create migration
npx supabase migration new my_feature_description

# 3. Write SQL in the generated file
# (edit the file in supabase/migrations/)

# 4. Test in development
npm run db:push:dev

# 5. Test your application
npm run dev

# 6. Commit and push
git add supabase/migrations/
git commit -m "feat: add my feature migration"
git push origin feature/my-feature

# 7. Create PR to develop → merge after review

# 8. When ready for production, merge develop to main
git checkout main
git pull
git merge develop
git push origin main

# 9. GitHub Actions will automatically apply migrations to production
# Or manually: npm run db:push:prod
```

---

## Step 4: Verify Everything Works 🎉

### After Step 1 (Immediate Fix):

```bash
# 1. Checkout main branch
git checkout main

# 2. Pull latest
git pull origin main

# 3. Run your application
npm run dev

# 4. Test that everything works:
# - User signup/login
# - Product creation
# - Save functionality
# - Chat system
# - KYC submission
# - Product reviews
```

### Check Database Tables:

1. Go to **ethniqrootz-prod** dashboard: https://app.supabase.com/project/sxveqitmcfrhmagycahx/editor
2. Verify these tables exist:
   - `schema_migrations`
   - `saves`
   - `seller_kyc`
   - `product_reviews`
   - `conversations`
   - `messages`
   - And other tables from your migrations

---

## 📚 Reference Documents

All guides have been created in `docs/`:

1. **SUPABASE_ENVIRONMENT_SETUP.md** - Your two-project architecture explained
2. **DATABASE_WORKFLOW.md** - Complete workflow guide
3. **PRE_MERGE_CHECKLIST.md** - Checklist before merging
4. **MIGRATION_STRATEGY.md** - Overall strategy (already existed)
5. **MIGRATION_QUICK_START.md** - Quick reference (already existed)

---

## 🆘 Troubleshooting

### Issue: "Migration already applied"

This is normal! Supabase won't re-run migrations. If you see this, your migrations are already applied.

### Issue: "Cannot connect to database"

Check your environment variables:

```bash
# Make sure these are set for production
NEXT_PUBLIC_SUPABASE_URL=https://sxveqitmcfrhmagycahx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key
```

### Issue: "Migration failed"

1. Check the error message carefully
2. Fix the SQL in the migration file
3. Remove the failed migration from `schema_migrations` table
4. Re-run: `npm run db:push:prod`

### Need Help?

Run these diagnostic commands:

```bash
# Check npm scripts are available
npm run --list

# Check migration files
ls -la supabase/migrations/

# Check Supabase connection
npx supabase projects list

# Check migration status
npm run migrate:status
```

---

## ✅ Success Criteria

You know it's working when:

- [ ] All tables exist in production database
- [ ] Application on main branch works correctly
- [ ] No database-related errors in logs
- [ ] GitHub Actions workflow completes successfully
- [ ] Migrations auto-apply when merging to main

---

## 🎯 Timeline

- **Step 1 (Immediate Fix):** 5 minutes
- **Step 2 (GitHub Actions):** 10 minutes
- **Step 3 (Implement Workflow):** Ongoing
- **Step 4 (Verify):** 15 minutes

**Total setup time:** ~30 minutes
**Long-term benefit:** Automatic database sync forever! 🚀

---

## 📞 Quick Commands Reference

```bash
# Apply migrations to production (immediate fix)
npm run db:push:prod

# Check migration status
npm run migrate:status

# Create new migration
npx supabase migration new feature_name

# Test in dev
npm run db:push:dev

# Generate TypeScript types
npm run db:types:prod
```

---

## 🎉 You're Done!

After completing these steps:

- Your production database will have all tables
- Future migrations will apply automatically
- Develop and main branches will stay in sync

**Remember:** Always test migrations in `develop` before merging to `main`! ✨
