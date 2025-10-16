# Database Migration Workflow Guide

## 🎯 Problem Statement

**Issue:** The `develop` branch has all database tables, but the `main` branch (production) is missing tables.

**Root Cause:** Migrations were created and applied to the dev database but never applied to the production database when merging to `main`.

## ✅ Long-Term Solution

This guide establishes a workflow to keep databases synchronized across environments.

---

## 📋 Environment Setup

### Your Current Setup

| Environment | Branch    | Supabase Project Name | Project Ref            | Command                |
| ----------- | --------- | --------------------- | ---------------------- | ---------------------- |
| Development | `develop` | `sellexa`             | `kdoeomzqurcggvywqvdn` | `npm run db:push:dev`  |
| Production  | `main`    | `sellexa-prod`        | `sxveqitmcfrhmagycahx` | `npm run db:push:prod` |

---

## 🔄 Standard Workflow

### When Creating New Features with Database Changes

```bash
# 1. Start on develop branch
git checkout develop
git pull origin develop

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Create a new migration
npx supabase migration new add_your_feature

# 4. Write your SQL migration in the generated file
# Location: supabase/migrations/YYYYMMDDHHMMSS_add_your_feature.sql

# 5. Test migration locally (if using local Supabase)
npx supabase db reset  # This runs all migrations fresh
npm run dev

# 6. OR test on dev environment
npm run db:push:dev

# 7. Test your application thoroughly
# - Create/read/update/delete operations
# - Check RLS policies
# - Verify data integrity

# 8. Commit migration files
git add supabase/migrations/
git commit -m "feat: add your feature migration"

# 9. Push to GitHub
git push origin feature/your-feature-name

# 10. Create Pull Request to develop
# Review and merge after approval

# 11. After merge to develop, test in dev environment
# Migrations should auto-apply or run manually:
npm run db:push:dev

# 12. When ready for production, merge develop → main
git checkout main
git pull origin main
git merge develop
git push origin main

# 13. Apply migrations to production
npm run db:push:prod
```

---

## 🤖 Automated CI/CD (Recommended)

### Setup Required

1. **Get Supabase Access Token:**

   ```bash
   # Login to Supabase
   npx supabase login

   # Generate access token at:
   # https://app.supabase.com/account/tokens
   ```

2. **Add GitHub Secrets:**

   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add these secrets:

   | Secret Name                 | Value                                              | Used For                    |
   | --------------------------- | -------------------------------------------------- | --------------------------- |
   | `SUPABASE_ACCESS_TOKEN`     | Your access token from step 1                      | Supabase CLI authentication |
   | `SUPABASE_URL`              | `https://sxveqitmcfrhmagycahx.supabase.co`         | Production database URL     |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your production service role key (optional backup) | Custom migration scripts    |

   **Note:** The `SUPABASE_ACCESS_TOKEN` is the primary secret needed for CI/CD.

3. **The Workflow File:**
   - Located at `.github/workflows/migrate.yml`
   - Triggers automatically when:
     - Code is pushed to `main`
     - Migration files are changed
     - Or triggered manually

### How It Works

```
Developer → Push to main → GitHub Actions → Run Migrations → Production DB Updated
```

### Manual Trigger

If you need to run migrations manually via GitHub Actions:

1. Go to Actions tab in GitHub
2. Select "Deploy Database Migrations"
3. Click "Run workflow"

---

## 🚨 Emergency: Sync Production NOW

If you need to sync production immediately:

```bash
# Check what migrations exist
ls -la supabase/migrations/

# Push all pending migrations to production
npm run db:push:prod

# Verify migrations were applied
npx supabase db remote --project-ref sxveqitmcfrhmagycahx
```

---

## 📊 Best Practices

### ✅ DO:

1. **Always test in dev first**

   ```bash
   npm run db:push:dev
   ```

2. **Keep migrations small and focused**

   - One feature per migration
   - Easier to debug and rollback

3. **Use idempotent SQL**

   ```sql
   -- Good
   CREATE TABLE IF NOT EXISTS users (...);

   -- Good
   ALTER TABLE products
   ADD COLUMN IF NOT EXISTS price DECIMAL;

   -- Good
   CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
   ```

4. **Document breaking changes**

   ```sql
   -- Migration: 20251010_add_user_profiles.sql
   -- Description: Adds user profiles table with foreign key to auth.users
   -- Breaking: Requires existing users to create profiles
   -- Rollback: Create migration to DROP TABLE user_profiles
   ```

5. **Test rollback strategy**

   - Create a reverse migration if needed
   - Test it in dev before production

6. **Version control everything**
   ```bash
   git add supabase/migrations/
   git commit -m "feat: add user profiles migration"
   ```

### ❌ DON'T:

1. **Never edit old migrations**

   - Create a new migration instead
   - Old migrations are historical records

2. **Never run raw SQL in production without migrations**

   - Always create a migration file
   - Commit it to git
   - Apply via CI/CD or npm scripts

3. **Never delete migration files**

   - This breaks the migration history
   - Can cause issues when setting up new environments

4. **Never skip testing**

   - Always test in dev before production
   - Check RLS policies
   - Verify data integrity

5. **Never merge to main without applying dev migrations first**

   ```bash
   # BAD: Merge to main without testing migrations
   git merge feature-branch  # ❌

   # GOOD: Test migrations in dev first
   npm run db:push:dev       # ✅
   # Test application
   git merge feature-branch  # ✅
   ```

---

## 🔍 Monitoring & Verification

### Check Migration Status

```bash
# Development (sellexa)
npx supabase link --project-ref kdoeomzqurcggvywqvdn
npx supabase migration list

# Production (sellexa-prod)
npx supabase link --project-ref sxveqitmcfrhmagycahx
npx supabase migration list

# Or use npm scripts (if configured)
npm run migrate:status
```

### Verify Schema

```bash
# Check for differences between local and remote
npx supabase db diff --linked

# Generate types after migration
npm run db:types:dev   # Development
npm run db:types:prod  # Production
```

### Compare Environments

```bash
# Get dev schema (sellexa)
npx supabase db dump --project-ref kdoeomzqurcggvywqvdn --schema public > dev-schema.sql

# Get prod schema (sellexa-prod)
npx supabase db dump --project-ref sxveqitmcfrhmagycahx --schema public > prod-schema.sql

# Compare
diff dev-schema.sql prod-schema.sql
```

---

## 🆘 Troubleshooting

### Issue: "Migration already applied"

**Solution:** This is normal. Supabase tracks migrations and won't re-run them.

### Issue: "Migration failed halfway"

```bash
# 1. Check the error message
# 2. Fix the SQL in the migration file
# 3. Remove the failed migration record from the database

# Connect to database
npx supabase db remote --project-ref YOUR_PROJECT_REF

# Check migration_history table
SELECT * FROM supabase_migrations.schema_migrations;

# Delete failed migration record
DELETE FROM supabase_migrations.schema_migrations
WHERE version = 'YYYYMMDDHHMMSS_migration_name';

# 4. Re-run the migration
npm run db:push:prod
```

### Issue: "Dev and prod schemas are different"

```bash
# Option 1: Create a new migration to fix differences
npx supabase db diff -f fix_schema_drift

# Option 2: Force production to match dev (DANGEROUS - data loss)
# Only do this if you're 100% sure
npx supabase db push --project-ref sxveqitmcfrhmagycahx --include-all
```

### Issue: "Need to rollback a migration"

```bash
# Create a reverse migration
npx supabase migration new rollback_feature_name

# Write the reverse SQL
# Example: If original migration created a table, DROP it
DROP TABLE IF EXISTS table_name;

# Apply the rollback
npm run db:push:prod
```

---

## 🎓 Migration Checklist

Before merging to `main`:

- [ ] Migration file created with descriptive name
- [ ] SQL is idempotent (uses IF NOT EXISTS, etc.)
- [ ] Migration tested in dev environment
- [ ] Application tested with new schema
- [ ] RLS policies verified
- [ ] No sensitive data in migration
- [ ] Migration file committed to git
- [ ] Documentation updated if needed
- [ ] Rollback strategy documented
- [ ] Team notified of breaking changes (if any)

After merging to `main`:

- [ ] Migrations applied to production
- [ ] Production application tested
- [ ] No errors in application logs
- [ ] Database performance monitored
- [ ] Types regenerated (`npm run db:types:prod`)

---

## 📚 Quick Reference

### Common Commands

```bash
# Create migration
npx supabase migration new feature_name

# Apply to dev
npm run db:push:dev

# Apply to prod
npm run db:push:prod

# Check status
npm run migrate:status

# Generate types
npm run db:types:dev    # or db:types:prod

# View migration history
npx supabase migration list

# Reset local database (development only)
npm run db:reset
```

### File Locations

- Migrations: `supabase/migrations/`
- Config: `supabase/config.toml`
- Seed data: `supabase/seed.sql`
- Scripts: `scripts/`
- Docs: `docs/`

---

## 🔐 Security Notes

1. **Never commit secrets**

   - Use environment variables
   - Use GitHub Secrets for CI/CD
   - Store tokens securely

2. **RLS Policies**

   - Always enable RLS on new tables
   - Test policies thoroughly
   - Document policy logic

3. **Service Role Key**
   - Never expose in client code
   - Only use server-side
   - Rotate periodically

---

## 📞 Support

If you encounter issues:

1. Check migration status: `npm run migrate:status`
2. Review error logs carefully
3. Test in dev environment first
4. Consult this guide
5. Check Supabase docs: https://supabase.com/docs/guides/cli

---

## 🎉 Summary

**The Solution:**

1. ✅ Use the CI/CD workflow (`.github/workflows/deploy-migrations.yml`)
2. ✅ Always test migrations in `develop` before merging to `main`
3. ✅ Migrations auto-apply to production when code is pushed to `main`
4. ✅ Monitor and verify after each deployment

**Result:** Develop and main branches stay in sync automatically! 🚀
