# Supabase CLI Tutorial

## 🚀 **Complete Guide to Using Supabase CLI**

The Supabase CLI is the **industry standard** for database migrations. It's what professional teams use because it's automated, reliable, and works seamlessly with your existing Supabase project.

---

## **Prerequisites**

✅ **Supabase CLI installed** (via `npx supabase`)
✅ **Supabase project** (you have one)
✅ **Access token** (get from Supabase Dashboard)

---

## **Step 1: Get Your Access Token**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click your **profile** (top right corner)
3. Go to **"Access Tokens"**
4. Click **"Generate new token"**
5. Give it a name: `CLI Token`
6. **Copy the token** (you'll need it)

---

## **Step 2: Link Your Project**

```bash
# Option A: Use token directly
npx supabase link --project-ref kdoeomzqurcggvywqvdn --token YOUR_ACCESS_TOKEN

# Option B: Set environment variable
export SUPABASE_ACCESS_TOKEN=your_access_token_here
npx supabase link --project-ref kdoeomzqurcggvywqvdn
```

**Your project reference**: `kdoeomzqurcggvywqvdn` (from your URL)

---

## **Step 3: Verify Connection**

```bash
# Check if linked successfully
npx supabase status

# List your projects
npx supabase projects list
```

---

## **Step 4: Create Your First Migration**

```bash
# Create a new migration
npx supabase migration new add_user_profiles

# This creates: supabase/migrations/YYYYMMDDHHMMSS_add_user_profiles.sql
```

**Edit the migration file** with your SQL:

```sql
-- Add user profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
```

---

## **Step 5: Apply Migrations**

### **To Development (Local)**

```bash
# Start local Supabase (optional - for testing)
npx supabase start

# Apply migrations to local database
npx supabase db push --local
```

### **To Production**

```bash
# Apply migrations to production
npx supabase db push

# Check what will be applied first
npx supabase db diff
```

---

## **Step 6: Check Migration Status**

```bash
# List all migrations
npx supabase migration list

# Check database status
npx supabase status

# See what's different between local and remote
npx supabase db diff
```

---

## **Common Commands**

### **Migration Management**

```bash
# Create new migration
npx supabase migration new <name>

# Apply migrations
npx supabase db push

# Reset local database
npx supabase db reset

# Generate migration from schema changes
npx supabase db diff -f <migration_name>
```

### **Development**

```bash
# Start local Supabase
npx supabase start

# Stop local Supabase
npx supabase stop

# View local database
npx supabase db diff --local
```

### **Production**

```bash
# Deploy to production
npx supabase db push

# Check production status
npx supabase status

# Generate types for your app
npx supabase gen types typescript --project-id kdoeomzqurcggvywqvdn > src/types/database.ts
```

---

## **Workflow Examples**

### **Daily Development**

```bash
# 1. Create new feature migration
npx supabase migration new add_product_reviews

# 2. Edit the migration file with your SQL
# 3. Test locally (optional)
npx supabase start
npx supabase db push --local

# 4. Apply to production
npx supabase db push

# 5. Generate updated types
npx supabase gen types typescript --project-id kdoeomzqurcggvywqvdn > src/types/database.ts
```

### **Team Collaboration**

```bash
# 1. Pull latest changes
git pull

# 2. Apply new migrations
npx supabase db push

# 3. Generate types
npx supabase gen types typescript --project-id kdoeomzqurcggvywqvdn > src/types/database.ts
```

---

## **Advanced Features**

### **Schema Diff**

```bash
# See what's different
npx supabase db diff

# Generate migration from differences
npx supabase db diff -f add_missing_columns
```

### **Type Generation**

```bash
# Generate TypeScript types
npx supabase gen types typescript --project-id kdoeomzqurcggvywqvdn > src/types/database.ts

# Generate other languages
npx supabase gen types typescript --lang=typescript > types/database.ts
```

### **Seeding Data**

```bash
# Create seed file
touch supabase/seed.sql

# Add seed data
echo "INSERT INTO user_profiles (id, username) VALUES (gen_random_uuid(), 'admin');" > supabase/seed.sql

# Apply seeds
npx supabase db reset --with-seed
```

---

## **Best Practices**

### **✅ DO:**

- Always test migrations locally first
- Use descriptive migration names
- Keep migrations small and focused
- Commit migration files to git
- Use `IF NOT EXISTS` for safety
- Generate types after schema changes

### **❌ DON'T:**

- Edit old migration files
- Skip testing migrations
- Deploy without reviewing changes
- Forget to generate types
- Use production for development

---

## **Troubleshooting**

### **"Access token not provided"**

```bash
# Get token from Supabase Dashboard
export SUPABASE_ACCESS_TOKEN=your_token
npx supabase link --project-ref kdoeomzqurcggvywqvdn
```

### **"Project not found"**

```bash
# Check your project reference
npx supabase projects list

# Use correct project reference
npx supabase link --project-ref correct_project_ref
```

### **"Migration failed"**

```bash
# Check what went wrong
npx supabase migration list

# Reset and try again
npx supabase db reset
npx supabase db push
```

---

## **Migration from Manual Approach**

Since you already have migrations in `supabase/migrations/`, the CLI will automatically detect them:

1. **Your existing migrations** will be recognized
2. **No need to recreate** them
3. **Just start using CLI** for new migrations

---

## **Next Steps**

1. **Get your access token** from Supabase Dashboard
2. **Link your project**: `npx supabase link --project-ref kdoeomzqurcggvywqvdn --token YOUR_TOKEN`
3. **Create your first CLI migration**: `npx supabase migration new add_user_profiles`
4. **Apply it**: `npx supabase db push`

---

**🎉 You're now ready to use the industry-standard Supabase CLI!**

