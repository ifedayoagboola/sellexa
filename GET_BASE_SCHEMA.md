# Get Base Schema from Development Database

## Quick Steps

### 1. Go to Dev Database SQL Editor

https://app.supabase.com/project/kdoeomzqurcggvywqvdn/sql

### 2. Run This Query to Generate Schema

```sql
-- Get all table creation statements
SELECT
    'CREATE TABLE IF NOT EXISTS ' || schemaname || '.' || tablename || ' (' ||
    string_agg(
        column_name || ' ' || data_type ||
        CASE
            WHEN character_maximum_length IS NOT NULL
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END,
        ', '
    ) || ');'
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  AND t.table_name NOT IN ('schema_migrations', 'supabase_migrations')
GROUP BY schemaname, tablename
ORDER BY tablename;
```

### 3. Alternative: Manual Export

**OR** use the built-in schema export:

1. Go to: https://app.supabase.com/project/kdoeomzqurcggvywqvdn
2. Click on **Database** → **Schema Visualizer**
3. Or use the SQL Editor and export schema

### 4. What We Need

We need the CREATE TABLE statements for:

- `profiles`
- `products`
- `categories`
- `threads`
- `messages`
- Any other base tables

Once you have these, paste them here and I'll create the proper migration file.
