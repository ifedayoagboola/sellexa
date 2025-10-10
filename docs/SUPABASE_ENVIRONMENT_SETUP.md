# Supabase Environment Setup

## 🏗️ Two-Project Architecture

Your EthniqRootz application uses **TWO separate Supabase projects** for isolation and safety:

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEVELOPMENT                                │
│                                                                 │
│  Git Branch:    develop                                         │
│  Project Name:  ethniqrootz                                     │
│  Project Ref:   kdoeomzqurcggvywqvdn                           │
│  URL:           https://kdoeomzqurcggvywqvdn.supabase.co       │
│  Command:       npm run db:push:dev                             │
│                                                                 │
│  Purpose:       Testing new features, breaking changes OK      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (test & validate migrations)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION                                 │
│                                                                 │
│  Git Branch:    main                                            │
│  Project Name:  ethniqrootz-prod                                │
│  Project Ref:   sxveqitmcfrhmagycahx                           │
│  URL:           https://sxveqitmcfrhmagycahx.supabase.co       │
│  Command:       npm run db:push:prod                            │
│  CI/CD:         .github/workflows/migrate.yml                   │
│                                                                 │
│  Purpose:       Live user data, must be stable                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Environment Variables

### Development (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://kdoeomzqurcggvywqvdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key
```

### Production (Vercel/Hosting Platform)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://sxveqitmcfrhmagycahx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
```

---

## 🔑 GitHub Secrets for CI/CD

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name                 | Value                                    | Purpose                           |
| --------------------------- | ---------------------------------------- | --------------------------------- |
| `SUPABASE_ACCESS_TOKEN`     | Get from app.supabase.com/account/tokens | Authenticate Supabase CLI         |
| `SUPABASE_URL`              | https://sxveqitmcfrhmagycahx.supabase.co | Production database URL           |
| `SUPABASE_SERVICE_ROLE_KEY` | Production service role key              | Backup for custom migration tools |

---

## 🔄 Workflow

### Development Flow

```bash
# 1. Work on develop branch
git checkout develop

# 2. Create migration
npx supabase migration new add_feature

# 3. Apply to dev database
npm run db:push:dev

# 4. Test thoroughly
npm run dev

# 5. Commit and push
git add supabase/migrations/
git commit -m "feat: add feature migration"
git push origin develop
```

### Production Deployment

```bash
# 1. Merge develop to main
git checkout main
git merge develop
git push origin main

# 2. GitHub Actions automatically runs
# .github/workflows/migrate.yml triggers

# 3. Migrations applied to ethniqrootz-prod

# 4. Verify
npm run migrate:status
```

---

## 🛠️ Useful Commands

### Check Which Database You're Connected To

```bash
# Check all projects
npx supabase projects list

# Development - Link first, then list
npx supabase link --project-ref kdoeomzqurcggvywqvdn
npx supabase migration list

# Production - Link first, then list
npx supabase link --project-ref sxveqitmcfrhmagycahx
npx supabase migration list
```

### Apply Migrations Manually

```bash
# Development (ethniqrootz)
npm run db:push:dev
# OR
npx supabase link --project-ref kdoeomzqurcggvywqvdn && npx supabase db push

# Production (ethniqrootz-prod)
npm run db:push:prod
# OR
npx supabase link --project-ref sxveqitmcfrhmagycahx && npx supabase db push
```

### Compare Databases

```bash
# Dump both schemas
npx supabase db dump --project-ref kdoeomzqurcggvywqvdn --schema public > dev-schema.sql
npx supabase db dump --project-ref sxveqitmcfrhmagycahx --schema public > prod-schema.sql

# Compare
diff dev-schema.sql prod-schema.sql
```

### Generate TypeScript Types

```bash
# Development types
npm run db:types:dev

# Production types
npm run db:types:prod
```

---

## 🎯 Benefits of Two-Project Setup

### ✅ Advantages

1. **Safety:** Test destructive changes without affecting production
2. **Isolation:** Dev experiments don't impact live users
3. **Testing:** Validate migrations before production deployment
4. **Rollback:** Easy to revert in dev without affecting prod
5. **Compliance:** Separate environments for data governance

### ⚠️ Considerations

1. **Cost:** Two projects mean two billing accounts (free tier usually sufficient)
2. **Sync:** Must ensure migrations are applied to both (automated via CI/CD)
3. **Secrets:** Need separate API keys for each environment

---

## 📊 Migration Tracking

Both projects use the `supabase_migrations.schema_migrations` table to track applied migrations:

```sql
-- Check migration history
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC;
```

This ensures migrations only run once per environment.

---

## 🚨 Common Issues

### Issue: Wrong Database Connected

**Symptom:** Tables missing or unexpected data

**Solution:** Check your environment variables

```bash
# Check current connection
echo $NEXT_PUBLIC_SUPABASE_URL

# Should be:
# Dev:  https://kdoeomzqurcggvywqvdn.supabase.co
# Prod: https://sxveqitmcfrhmagycahx.supabase.co
```

### Issue: Migrations Out of Sync

**Symptom:** Prod is missing migrations that dev has

**Solution:** Apply pending migrations

```bash
# Check both environments
npx supabase migration list --project-ref kdoeomzqurcggvywqvdn
npx supabase migration list --project-ref sxveqitmcfrhmagycahx

# Apply to prod
npm run db:push:prod
```

### Issue: CI/CD Not Running

**Symptom:** Push to main doesn't trigger migrations

**Solution:** Check GitHub Actions

1. Go to repository → Actions tab
2. Verify `SUPABASE_ACCESS_TOKEN` secret exists
3. Check workflow logs for errors
4. Manually trigger workflow if needed

---

## 📚 Quick Reference

| Task                   | Command                                               |
| ---------------------- | ----------------------------------------------------- |
| Apply dev migrations   | `npm run db:push:dev`                                 |
| Apply prod migrations  | `npm run db:push:prod`                                |
| Check migration status | `npm run migrate:status`                              |
| Create new migration   | `npx supabase migration new feature_name`             |
| Link dev project       | `npm run db:link:dev`                                 |
| Link prod project      | `npm run db:link:prod`                                |
| List migrations        | `npx supabase migration list`                         |
| Generate dev types     | `npm run db:types:dev`                                |
| Generate prod types    | `npm run db:types:prod`                               |
| View dev dashboard     | https://app.supabase.com/project/kdoeomzqurcggvywqvdn |
| View prod dashboard    | https://app.supabase.com/project/sxveqitmcfrhmagycahx |

---

## 🔗 Related Documentation

- [Database Workflow Guide](./DATABASE_WORKFLOW.md) - Complete workflow details
- [Pre-Merge Checklist](./PRE_MERGE_CHECKLIST.md) - Before merging to main
- [Immediate Action Plan](../IMMEDIATE_ACTION_PLAN.md) - Fix sync issues now
- [Migration Strategy](./MIGRATION_STRATEGY.md) - Overall approach

---

## 🎉 Summary

Your setup is **production-ready** with:

✅ Two isolated Supabase projects (dev & prod)  
✅ Automated CI/CD for production migrations  
✅ Version-controlled migration files  
✅ Environment-specific configuration  
✅ Safety checks before production deployment

This architecture ensures your production data stays safe while allowing you to develop and test freely! 🚀
