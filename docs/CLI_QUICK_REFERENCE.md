# Supabase CLI Quick Reference

## 🚀 **Quick Start**

```bash
# 1. Get access token from Supabase Dashboard
# 2. Link your project
npx supabase link --project-ref kdoeomzqurcggvywqvdn --token YOUR_TOKEN

# 3. Create migration
npx supabase migration new add_user_profiles

# 4. Apply migration
npx supabase db push
```

## 📋 **Essential Commands**

### **Project Management**

```bash
npm run db:link          # Link to Supabase project
npm run db:push          # Apply migrations to production
npm run db:diff          # See what's different
npm run db:types         # Generate TypeScript types
```

### **Development**

```bash
npm run db:start         # Start local Supabase
npm run db:stop          # Stop local Supabase
npm run db:reset         # Reset local database
```

### **Migration Management**

```bash
# Create new migration
npx supabase migration new <name>

# List migrations
npx supabase migration list

# Apply migrations
npx supabase db push

# Generate from schema diff
npx supabase db diff -f <migration_name>
```

## 🎯 **Your Project Details**

- **Project Reference**: `kdoeomzqurcggvywqvdn`
- **Project URL**: `https://kdoeomzqurcggvywqvdn.supabase.co`
- **Migrations Folder**: `supabase/migrations/`

## 🔄 **Daily Workflow**

```bash
# 1. Create migration
npx supabase migration new add_feature

# 2. Edit migration file
# 3. Apply to production
npm run db:push

# 4. Generate types
npm run db:types
```

## 🆘 **Troubleshooting**

```bash
# Check status
npx supabase status

# See what's different
npm run db:diff

# Reset and retry
npm run db:reset
npm run db:push
```

---

**📚 Full tutorial**: See `SUPABASE_CLI_TUTORIAL.md`

