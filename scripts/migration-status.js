#!/usr/bin/env node

/**
 * Check migration status
 * Shows which migrations have been executed and which are pending
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local first, then .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const getConfig = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!baseUrl || !serviceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  
  return { baseUrl, serviceKey };
};

const config = getConfig();
const supabase = createClient(config.baseUrl, config.serviceKey);

async function getExecutedMigrations() {
  try {
    const { data, error } = await supabase
      .from('schema_migrations')
      .select('version, name, executed_at')
      .order('executed_at', { ascending: true });
    
    if (error) {
      console.warn('⚠️  Could not fetch migration history:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.warn('⚠️  Migration tracking not set up yet');
    return [];
  }
}

async function main() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`📊 Migration Status for ${environment} environment`);
  console.log(`📍 Target URL: ${config.baseUrl}\n`);
  
  // Get all migration files
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    console.log('ℹ️  No migration files found');
    return;
  }
  
  // Get executed migrations
  const executedMigrations = await getExecutedMigrations();
  const executedVersions = new Set(executedMigrations.map(m => m.version));
  
  console.log('='.repeat(80));
  console.log('Migration Files Status:');
  console.log('='.repeat(80));
  
  let executedCount = 0;
  let pendingCount = 0;
  
  for (const file of migrationFiles) {
    const version = file.replace('.sql', '');
    const isExecuted = executedVersions.has(version);
    
    if (isExecuted) {
      const migration = executedMigrations.find(m => m.version === version);
      const executedAt = new Date(migration.executed_at).toLocaleString();
      console.log(`✅ ${file}`);
      console.log(`   Executed: ${executedAt}\n`);
      executedCount++;
    } else {
      console.log(`⏳ ${file}`);
      console.log(`   Status: PENDING\n`);
      pendingCount++;
    }
  }
  
  console.log('='.repeat(80));
  console.log('Summary:');
  console.log(`   Total migrations: ${migrationFiles.length}`);
  console.log(`   ✅ Executed: ${executedCount}`);
  console.log(`   ⏳ Pending: ${pendingCount}`);
  console.log('='.repeat(80));
  
  if (pendingCount > 0) {
    console.log('\n💡 Run `npm run migrate` to apply pending migrations');
  } else {
    console.log('\n🎉 All migrations are up to date!');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { getExecutedMigrations };

