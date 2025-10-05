#!/usr/bin/env node

/**
 * Migration Status Checker
 * Shows the current status of database migrations
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function main() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`📊 Migration Status for ${environment} environment`);
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    process.exit(1);
  }

  console.log(`📍 Target: ${supabaseUrl}`);
  
  // Get all migration files
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('ℹ️  No migrations directory found');
    return;
  }

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    console.log('ℹ️  No migration files found');
    return;
  }
  
  console.log(`\n📁 Migration Files (${migrationFiles.length}):`);
  migrationFiles.forEach((file, index) => {
    const migrationPath = path.join(migrationsDir, file);
    const stats = fs.statSync(migrationPath);
    console.log(`   ${index + 1}. ${file} (${stats.size} bytes)`);
  });
  
  console.log('\n⚠️  Manual Status Check Required');
  console.log('To check which migrations have been applied:');
  console.log('1. Go to Supabase Dashboard → SQL Editor');
  console.log('2. Check the supabase_migrations.schema_migrations table');
  console.log('3. Compare with the files listed above');
  
  if (environment === 'production') {
    console.log('\n🔧 Production Migration Status:');
    console.log('   - Check Supabase Dashboard for applied migrations');
    console.log('   - Verify all required tables and functions exist');
    console.log('   - Test critical functionality after migrations');
  }
}

if (require.main === module) {
  main().catch(console.error);
}