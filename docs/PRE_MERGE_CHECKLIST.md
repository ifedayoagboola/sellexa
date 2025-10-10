# Pre-Merge Checklist for Database Changes

Use this checklist before merging any branch with database migrations to `main`.

---

## ✅ Before Merging to Main

### 1. Migration Testing

- [ ] Migration file created in `supabase/migrations/`
- [ ] Migration has descriptive name: `YYYYMMDDHHMMSS_description.sql`
- [ ] Migration tested in development environment
  ```bash
  npm run db:push:dev
  ```
- [ ] No errors in migration execution
- [ ] Schema changes verified in Supabase dashboard

### 2. Application Testing

- [ ] Application works with new schema changes
- [ ] All CRUD operations tested
- [ ] No breaking changes to existing features
- [ ] TypeScript types regenerated if needed
  ```bash
  npm run db:types:dev
  ```

### 3. Security & Policies

- [ ] RLS policies created/updated for new tables
- [ ] RLS policies tested (run `npm run test:rls`)
- [ ] No sensitive data exposed
- [ ] Service role key not used in client code

### 4. Code Quality

- [ ] Migration uses idempotent SQL (`IF NOT EXISTS`, `OR REPLACE`)
- [ ] Migration includes comments explaining purpose
- [ ] No hardcoded values that should be environment variables
- [ ] Migration file committed to git

### 5. Documentation

- [ ] Breaking changes documented (if any)
- [ ] Migration purpose documented in file comments
- [ ] Rollback strategy documented (if needed)
- [ ] Team notified of significant changes

---

## ✅ After Merging to Main

### 1. Deployment

- [ ] Migrations applied to production

  ```bash
  npm run db:push:prod
  ```

  Or wait for CI/CD to auto-apply

- [ ] No errors in production deployment
- [ ] Production types regenerated
  ```bash
  npm run db:types:prod
  ```

### 2. Verification

- [ ] Production application tested
- [ ] Database tables exist in production
- [ ] Sample data can be created
- [ ] No errors in application logs
- [ ] Monitoring dashboard checked

### 3. Post-Deployment

- [ ] Migration status verified
  ```bash
  npm run migrate:status
  ```
- [ ] Performance metrics checked
- [ ] Team notified of successful deployment
- [ ] Documentation updated (if needed)

---

## 🚨 If Something Goes Wrong

1. **Check error logs immediately**
2. **Don't panic - create a rollback migration if needed**
3. **Test rollback in dev first**
4. **Document the issue for future reference**

---

## 📱 Quick Commands

```bash
# Test in dev
npm run db:push:dev

# Deploy to prod
npm run db:push:prod

# Check status
npm run migrate:status

# Regenerate types
npm run db:types:dev
npm run db:types:prod

# Test RLS policies
npm run test:rls
```

---

## 💡 Tips

- **Test early, test often** - Run migrations in dev frequently
- **Small migrations** - Keep changes focused and atomic
- **Backup strategy** - Supabase has automatic backups, but verify
- **Communication** - Tell your team about significant changes
- **Monitor** - Watch logs after deployment

---

**Remember:** If in doubt, test in dev first! 🛡️
