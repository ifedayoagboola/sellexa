#!/usr/bin/env node

/**
 * Simple migration tracker
 * Shows what migrations need to be run and tracks them
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function main() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`🚀 Migration Tracker for ${environment} environment`);
  console.log(`📍 Target: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);
  
  // Get all migration files
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    console.log('ℹ️  No migration files found');
    return;
  }
  
  console.log(`📁 Found ${migrationFiles.length} migration files:\n`);
  
  // Show each migration
  migrationFiles.forEach((file, index) => {
    const migrationPath = path.join(migrationsDir, file);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`${index + 1}. ${file}`);
    console.log(`   Preview: ${migrationSQL.substring(0, 100)}...`);
    console.log(`   `);
  });
  
  console.log('='.repeat(60));
  console.log('📋 Next Steps:');
  console.log('1. Go to Supabase Dashboard → SQL Editor');
  console.log('2. Run each migration SQL manually');
  console.log('3. Keep track of what you\'ve run');
  console.log('='.repeat(60));
  
  console.log('\n💡 Pro Tip: Use Supabase CLI for automated migrations:');
  console.log('   npm install -g supabase');
  console.log('   npx supabase init');
  console.log('   npx supabase db push');
}

if (require.main === module) {
  main().catch(console.error);
}

