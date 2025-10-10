# Apply Base Schema to Production - Manual Steps

Since CLI is having connection issues, let's apply the migration through the Supabase Dashboard (more reliable):

## Steps

### 1. Open Production SQL Editor

https://app.supabase.com/project/sxveqitmcfrhmagycahx/sql

### 2. Copy the Base Schema Migration

Open this file: `supabase/migrations/00000000000001_initial_base_schema.sql`

### 3. Paste and Run in SQL Editor

- Copy ALL the contents of the file
- Paste into the SQL Editor
- Click "Run" button

### 4. Verify Tables Were Created

After running, go to: https://app.supabase.com/project/sxveqitmcfrhmagycahx/editor

You should now see these tables:

- ✅ profiles
- ✅ products
- ✅ threads
- ✅ messages
- ✅ categories
- ✅ schema_migrations (already existed)

### 5. Record the Migration

Run this SQL to mark the migration as applied:

```sql
INSERT INTO supabase_migrations.schema_migrations (version, name, executed_at)
VALUES ('00000000000001', 'initial_base_schema', NOW())
ON CONFLICT (version) DO NOTHING;
```

### 6. Apply Remaining Feature Migrations

After the base schema is in place, run:

```bash
npm run db:push:prod
```

This will apply all the remaining migrations (saves, KYC, reviews, chat enhancements, etc.)

---

## Alternative: Use Supabase Access Token

If you have your Supabase Access Token set up, you can try:

```bash
export SUPABASE_ACCESS_TOKEN=your_token_here
npx supabase db push --linked
```

But the dashboard method is more reliable for this initial setup.
