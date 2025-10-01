# Environment Setup Guide

## 🔐 Environment Variables

Create these files in your project root:

### `.env.local` (Development)

```bash
# Development Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key
NODE_ENV=development
```

### Production Environment Variables

Set these in your hosting platform (Vercel, Netlify, etc.):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
NODE_ENV=production
```

## 🎯 Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

## 🚀 Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy and edit with your values
cp .env.example .env.local
```

### 3. Run Initial Migration

```bash
# This will create the migration tracking table
npm run migrate:dev
```

### 4. Verify Setup

```bash
# Check migration status
npm run db:status
```

### 5. Start Development

```bash
npm run dev
```

## 🏢 Production Setup

### Option 1: Vercel (Recommended)

1. **Deploy to Vercel**

   ```bash
   vercel
   ```

2. **Add Environment Variables**

   - Go to your project on Vercel dashboard
   - Settings → Environment Variables
   - Add all production variables

3. **Set Up GitHub Secrets** (for CI/CD)

   - Go to your GitHub repo
   - Settings → Secrets and variables → Actions
   - Add:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy with Migrations**
   - Push to main branch
   - GitHub Actions will run migrations automatically
   - Or run manually: `npm run migrate:prod`

### Option 2: Other Platforms

1. Set environment variables in your platform
2. Deploy your application
3. Run migrations:
   ```bash
   npm run migrate:prod
   ```

## 🔄 Multiple Environments Strategy

### Separate Supabase Projects (Recommended)

**Development Project:**

- Use for local development
- Free plan is fine
- Can reset/test freely

**Staging Project (Optional):**

- Mirror of production
- Test deployments before prod
- Separate from dev

**Production Project:**

- Live user data
- Paid plan recommended
- Strict access control

### Environment Variable Management

```bash
# .env.local (never commit)
NEXT_PUBLIC_SUPABASE_URL=dev-url
SUPABASE_SERVICE_ROLE_KEY=dev-key

# .env.staging (never commit)
NEXT_PUBLIC_SUPABASE_URL=staging-url
SUPABASE_SERVICE_ROLE_KEY=staging-key

# Production (set in hosting platform)
NEXT_PUBLIC_SUPABASE_URL=prod-url
SUPABASE_SERVICE_ROLE_KEY=prod-key
```

## 🧪 Testing Environments

### Local Development

```bash
# Use dev Supabase project
export NODE_ENV=development
npm run migrate:dev
npm run dev
```

### Staging

```bash
# Use staging Supabase project
export NEXT_PUBLIC_SUPABASE_URL=$STAGING_SUPABASE_URL
export SUPABASE_SERVICE_ROLE_KEY=$STAGING_SERVICE_KEY
npm run migrate
```

### Production

```bash
# Use production Supabase project
export NODE_ENV=production
npm run migrate:prod
```

## 🔒 Security Best Practices

### ✅ DO:

- Keep `.env.local` in `.gitignore`
- Use separate Supabase projects for dev/prod
- Rotate service role keys regularly
- Use environment variables in CI/CD
- Enable Row Level Security (RLS) on all tables

### ❌ DON'T:

- Commit service role keys to git
- Share production credentials
- Use production database for development
- Hard-code credentials in source code
- Expose service role key to client-side

## 📋 Checklist

### Development Setup

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env.local` with dev credentials
- [ ] Run migrations (`npm run migrate:dev`)
- [ ] Verify status (`npm run db:status`)
- [ ] Start dev server (`npm run dev`)

### Production Setup

- [ ] Create production Supabase project
- [ ] Set environment variables in hosting platform
- [ ] Set up GitHub secrets for CI/CD
- [ ] Deploy application
- [ ] Run production migrations (`npm run migrate:prod`)
- [ ] Verify status (`npm run db:status`)
- [ ] Test application

### CI/CD Setup

- [ ] Add GitHub secrets (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Verify `.github/workflows/migrate.yml` exists
- [ ] Test migration workflow
- [ ] Set up notifications for failures

## 🆘 Troubleshooting

### "Missing environment variables" error

```bash
# Check your .env.local file exists and has all required variables
cat .env.local

# Make sure it's loaded
source .env.local
```

### Can't connect to Supabase

```bash
# Verify URL is correct
echo $NEXT_PUBLIC_SUPABASE_URL

# Test connection
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/
```

### Migrations fail in production

```bash
# Check environment variables are set
npm run db:status

# Verify service role key has proper permissions
# Check Supabase dashboard for error logs
```

## 📚 Next Steps

1. Read [Migration Quick Start](./MIGRATION_QUICK_START.md)
2. Review [Full Migration Strategy](./MIGRATION_STRATEGY.md)
3. Set up your environments
4. Run your first migration!

