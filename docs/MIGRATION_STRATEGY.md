# Migration Strategy Guide

## Overview

This guide outlines the best practices for keeping development and production databases in sync.

## Approach: Supabase CLI + Migration Tracking

### 1. Setup Supabase CLI

```bash
# Install Supabase CLI
npm install supabase --save-dev

# Initialize Supabase (if not already done)
npx supabase init

# Link to your project
npx supabase link --project-ref your-project-ref
```

### 2. Migration Workflow

#### Development

```bash
# Create a new migration
npx supabase migration new <descriptive_name>

# Edit the migration file in supabase/migrations/

# Apply migrations locally (if using local dev)
npx supabase db push

# Or generate migration from schema diff
npx supabase db diff -f <migration_name>
```

#### Testing

```bash
# Reset local database (dev only)
npx supabase db reset

# Check migration status
npx supabase migration list
```

#### Production Deployment

```bash
# Push migrations to production
npx supabase db push --db-url $DATABASE_URL

# Or let Supabase Dashboard auto-apply
# (recommended for hosted Supabase projects)
```

### 3. Migration Tracking Table

Supabase automatically creates a `schema_migrations` table to track applied migrations. This ensures:

- ✅ Migrations run only once
- ✅ Same migrations in dev and prod
- ✅ No duplicate executions

### 4. Environment-Specific Configuration

**Local Development:**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-key
```

**Production:**

```bash
# Environment variables in hosting platform (Vercel, etc.)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key
```

### 5. Git Workflow

```
1. Developer creates migration locally
2. Commit migration file to git
3. Push to GitHub
4. CI/CD runs migrations on staging
5. Merge to main
6. CI/CD runs migrations on production
```

### 6. Rollback Strategy

```bash
# Create a rollback migration
npx supabase migration new rollback_<original_migration_name>

# Write reverse SQL in the new migration file
# Apply it like any other migration
npx supabase db push
```

## Best Practices

### ✅ DO:

- Always use migrations for schema changes
- Test migrations in dev/staging before prod
- Use descriptive migration names with timestamps
- Commit migrations to version control
- Keep migrations small and focused
- Document breaking changes
- Use `IF NOT EXISTS` for idempotent operations

### ❌ DON'T:

- Edit old migration files (create new ones instead)
- Run raw SQL in production without migrations
- Skip testing migrations
- Delete migration files
- Use application code for migrations (use Supabase CLI)

## Emergency Manual Migration

If you need to run a manual migration:

```bash
# Connect to database directly
psql $DATABASE_URL

# Or use Supabase Dashboard SQL Editor
# https://app.supabase.com/project/your-project/sql
```

## Automated CI/CD Setup

### GitHub Actions Example

```yaml
name: Run Migrations

on:
  push:
    branches: [main]
    paths:
      - "supabase/migrations/**"

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Supabase CLI
        run: npm install -g supabase

      - name: Run migrations
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        run: |
          npx supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          npx supabase db push
```

## Migration Tracking Implementation

Instead of the current approach in `/api/migrate/route.ts`, use Supabase's built-in tracking:

```typescript
// supabase/migrations/YYYYMMDDHHMMSS_migration_tracking.sql
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

This table tracks which migrations have been applied, preventing duplicate runs.

## Monitoring & Alerts

1. **Monitor migration status** in Supabase Dashboard
2. **Set up alerts** for failed migrations
3. **Log all migrations** in your application logs
4. **Track schema drift** using `supabase db diff`

## Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)

