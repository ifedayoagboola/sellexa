# Database Migration Guide

This guide explains how to manage database migrations in the Sellexa project.

## Overview

The project uses Supabase for database management with a comprehensive migration system that includes:

- **Saves System**: User product saves and tracking
- **KYC System**: Seller verification and business information
- **Chat System**: Real-time messaging and conversations
- **Product Reviews**: Review and rating system

## Migration Files

All migrations are located in `supabase/migrations/` and are applied in chronological order:

1. `00000000000000_migration_tracking.sql` - Migration tracking
2. `20241220_create_saves_table.sql` - Initial saves system
3. `20250101140000_optimize_saves.sql` - Saves optimization
4. `20250101180000_add_seller_kyc.sql` - KYC system
5. `20250101180100_update_kyc_default_status.sql` - KYC instant verification
6. `20251001134018_add_product_reviews.sql` - Product reviews
7. `20251001162322_enhance_chat_system.sql` - Chat system
8. `20251001171055_fix_ambiguous_column_references.sql` - Fix column references
9. `20251001172920_fix_conversation_metadata_join.sql` - Fix conversation joins
10. `20251001174812_final_chat_cleanup.sql` - Final cleanup

## Available Scripts

### Development

```bash
# Start Supabase locally
npm run db:start

# Check migration status
npm run db:check

# Apply migrations
npm run db:migrate

# Reset database with seed data
npm run db:seed

# Stop Supabase
npm run db:stop
```

### Production

```bash
# Link to production project
npm run db:link

# Deploy migrations to production
npm run db:push

# Generate TypeScript types
npm run db:types
```

## Migration Management

### Creating New Migrations

1. **Create a new migration file:**

   ```bash
   npx supabase migration new your_migration_name
   ```

2. **Write your SQL in the generated file:**

   ```sql
   -- Your migration SQL here
   CREATE TABLE example_table (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Apply the migration:**
   ```bash
   npm run db:migrate
   ```

### Checking Migration Status

```bash
# Check local migration status
npm run db:check

# List all migrations
npx supabase migration list

# Check for schema differences
npm run db:diff
```

### Resolving Migration Issues

1. **If migrations fail:**

   ```bash
   # Check the error logs
   npx supabase logs

   # Reset and try again
   npm run db:seed
   ```

2. **If you need to modify a migration:**
   - Never modify existing migration files
   - Create a new migration to fix the issue
   - Use `ALTER` statements to modify existing tables

## Database Schema

### Key Tables

#### Profiles

- User profiles with KYC information
- Business details for sellers
- Social media links

#### Products

- Product listings
- Images, pricing, categories
- Status tracking

#### Saves

- User product saves
- Save counts and tracking

#### Threads & Messages

- Chat conversations
- Message status and reactions
- Typing indicators

#### KYC Documents

- Verification documents
- Status tracking

### Relationships

- `profiles` → `products` (one-to-many)
- `profiles` → `saves` (one-to-many)
- `products` → `saves` (one-to-many)
- `threads` → `messages` (one-to-many)
- `profiles` → `kyc_documents` (one-to-many)

## Seed Data

The `supabase/seed.sql` file contains sample data for development:

- Sample categories
- Example products
- Test conversations
- KYC verification data

## Best Practices

1. **Always test migrations locally first**
2. **Use descriptive migration names**
3. **Include rollback information in comments**
4. **Never modify existing migration files**
5. **Backup production data before major migrations**
6. **Use transactions for complex migrations**

## Troubleshooting

### Common Issues

1. **Migration conflicts:**

   - Check migration order
   - Ensure no duplicate timestamps

2. **Permission errors:**

   - Verify Supabase CLI is logged in
   - Check project permissions

3. **Schema drift:**
   - Use `npm run db:diff` to identify differences
   - Create new migration to sync

### Getting Help

- Check Supabase documentation
- Review migration logs
- Use the migration checker script
- Check the project's migration README

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Security Notes

- Never commit sensitive data to migrations
- Use environment variables for secrets
- Test migrations in staging before production
- Keep migration files in version control
