#!/usr/bin/env node

/**
 * Migration Status Checker
 * 
 * This script checks the status of database migrations and provides
 * helpful information about the current state of the database.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkSupabaseStatus() {
  try {
    log('🔍 Checking Supabase status...', 'blue');
    const status = execSync('npx supabase status', { encoding: 'utf8' });
    log('✅ Supabase is running', 'green');
    return true;
  } catch (error) {
    log('❌ Supabase is not running. Please start it with: npx supabase start', 'red');
    return false;
  }
}

function checkMigrationFiles() {
  log('\n📁 Checking migration files...', 'blue');
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql') && file !== '00000000000000_migration_tracking.sql')
    .sort();

  log(`Found ${migrationFiles.length} migration files:`, 'green');
  migrationFiles.forEach((file, index) => {
    const timestamp = file.split('_')[0];
    const description = file.split('_').slice(1).join('_').replace('.sql', '');
    log(`  ${index + 1}. ${timestamp} - ${description}`, 'reset');
  });

  return migrationFiles;
}

function checkDatabaseMigrations() {
  try {
    log('\n🗄️ Checking database migration status...', 'blue');
    const migrations = execSync('npx supabase migration list', { encoding: 'utf8' });
    log('Database migration status:', 'green');
    console.log(migrations);
    return true;
  } catch (error) {
    log('❌ Could not check database migrations. Make sure Supabase is running.', 'red');
    return false;
  }
}

function checkDatabaseSchema() {
  try {
    log('\n🏗️ Checking database schema...', 'blue');
    const schema = execSync('npx supabase db diff --schema public', { encoding: 'utf8' });
    
    if (schema.trim() === '') {
      log('✅ Database schema is up to date', 'green');
    } else {
      log('⚠️ Database schema has changes:', 'yellow');
      console.log(schema);
    }
    return true;
  } catch (error) {
    log('❌ Could not check database schema', 'red');
    return false;
  }
}

function main() {
  log('🚀 EthniqRootz Migration Status Checker', 'bold');
  log('=====================================\n', 'bold');

  const isSupabaseRunning = checkSupabaseStatus();
  if (!isSupabaseRunning) {
    process.exit(1);
  }

  const migrationFiles = checkMigrationFiles();
  const dbMigrationsOk = checkDatabaseMigrations();
  const schemaOk = checkDatabaseSchema();

  log('\n📊 Summary:', 'bold');
  log(`Migration files: ${migrationFiles.length}`, 'green');
  log(`Database migrations: ${dbMigrationsOk ? 'OK' : 'ERROR'}`, dbMigrationsOk ? 'green' : 'red');
  log(`Schema status: ${schemaOk ? 'OK' : 'ERROR'}`, schemaOk ? 'green' : 'red');

  if (dbMigrationsOk && schemaOk) {
    log('\n✅ All systems are ready!', 'green');
  } else {
    log('\n⚠️ Some issues detected. Please check the output above.', 'yellow');
  }
}

// Run the script
main();
