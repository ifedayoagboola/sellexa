# Migration Quick Start Guide

## 🚀 Quick Commands

```bash
# Check migration status
npm run db:status

# Run pending migrations (dev)
npm run migrate:dev

# Run migrations (production)
npm run migrate:prod
```

## 📝 Creating a New Migration

### Option 1: Manual (Current Setup)

```bash
# Create a new migration file with timestamp
cd supabase/migrations
touch $(date +%Y%m%d%H%M%S)_your_migration_name.sql
```

### Option 2: Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install supabase --save-dev

# Create migration
npx supabase migration new your_migration_name
```

## 📋 Migration File Template

```sql
-- Description: What this migration does
-- Created: YYYY-MM-DD

-- Your migration SQL here
CREATE TABLE IF NOT EXISTS your_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_your_table_created_at ON your_table(created_at);

-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON your_table
  FOR SELECT USING (auth.uid() = user_id);
```

## 🔄 Development Workflow

### Daily Development

```bash
# 1. Pull latest code
git pull

# 2. Check migration status
npm run db:status

# 3. Apply new migrations
npm run migrate:dev

# 4. Start development
npm run dev
```

### Creating New Features

```bash
# 1. Create migration file
npx supabase migration new add_user_profiles

# 2. Write SQL in the new file
# 3. Test migration locally
npm run migrate:dev

# 4. Verify with status
npm run db:status

# 5. Commit and push
git add supabase/migrations/
git commit -m "Add user profiles migration"
git push
```

## 🚢 Deployment Workflow

### Manual Deployment

```bash
# Set production environment variables
export NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Run migrations
npm run migrate:prod
```

### Automated Deployment (Recommended)

See `.github/workflows/migrate.yml` for CI/CD setup

## ✅ Best Practices

1. **Always test migrations locally first**

   ```bash
   npm run migrate:dev
   ```

2. **Check status before and after**

   ```bash
   npm run db:status
   ```

3. **Use descriptive migration names**

   - ✅ Good: `20241001_add_user_profiles_table.sql`
   - ❌ Bad: `migration1.sql`

4. **Make migrations idempotent**

   - Use `IF NOT EXISTS` for CREATE statements
   - Use `OR REPLACE` for functions
   - Use `ON CONFLICT DO NOTHING` for inserts

5. **Keep migrations small and focused**

   - One feature or change per migration
   - Easier to debug and rollback

6. **Never edit executed migrations**
   - Create a new migration instead
   - Old migrations are historical records

## 🔍 Troubleshooting

### Migration tracking table doesn't exist

```bash
# Run the tracking migration first
npm run migrate:dev
```

### Migration fails halfway through

```bash
# 1. Check the error message
# 2. Fix the SQL in the migration file
# 3. Remove the failed migration from schema_migrations table
# 4. Run again
```

### Dev and prod out of sync

```bash
# 1. Check status in both environments
npm run db:status

# 2. Ensure all migrations are committed to git
git status

# 3. Deploy to production
npm run migrate:prod
```

### Reset development database

```sql
-- Connect to your dev database and run:
TRUNCATE schema_migrations;
-- Then run migrations again
npm run migrate:dev
```

## 🛡️ Safety Features

✅ **Migration Tracking**: Migrations run only once per environment
✅ **Idempotent**: Safe to run multiple times
✅ **Version Control**: All migrations in git
✅ **Rollback Support**: Create reverse migrations
✅ **Environment Separation**: Dev/prod isolated

## 📚 Resources

- [Full Migration Strategy](./MIGRATION_STRATEGY.md)
- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [SQL Best Practices](https://supabase.com/docs/guides/database/tables)

## 🆘 Need Help?

1. Check migration status: `npm run db:status`
2. Review error logs carefully
3. Test in development first
4. Create reverse migration if needed

