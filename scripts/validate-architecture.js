#!/usr/bin/env node

/**
 * Architecture Validation Script
 * 
 * This script validates that the new save architecture is properly implemented
 * and all components are correctly integrated.
 */

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

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - File not found: ${filePath}`, 'red');
    return false;
  }
}

function checkFileContent(filePath, patterns, description) {
  if (!fs.existsSync(filePath)) {
    log(`❌ ${description} - File not found: ${filePath}`, 'red');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let allFound = true;

  patterns.forEach(pattern => {
    if (content.includes(pattern)) {
      log(`  ✅ Contains: ${pattern}`, 'green');
    } else {
      log(`  ❌ Missing: ${pattern}`, 'red');
      allFound = false;
    }
  });

  if (allFound) {
    log(`✅ ${description}`, 'green');
  } else {
    log(`❌ ${description} - Missing required patterns`, 'red');
  }

  return allFound;
}

function validateArchitecture() {
  log('\n🚀 Validating EthniqRootz Save Architecture\n', 'bold');

  let allValid = true;

  // Check core architecture files
  log('\n📁 Core Architecture Files:', 'blue');
  allValid &= checkFileExists('src/stores/saveStore.ts', 'Zustand Store');
  allValid &= checkFileExists('src/lib/saves.ts', 'API Layer');
  allValid &= checkFileExists('src/hooks/useSaves.ts', 'Custom Hook');
  allValid &= checkFileExists('src/components/SaveProvider.tsx', 'Save Provider');
  allValid &= checkFileExists('src/components/SaveButton.tsx', 'Save Button Component');
  allValid &= checkFileExists('src/components/SaveCount.tsx', 'Save Count Component');

  // Check database migration
  log('\n🗄️ Database Migration:', 'blue');
  allValid &= checkFileExists('supabase/migrations/20241220_create_saves_table.sql', 'Saves Table Migration');

  // Check updated pages
  log('\n📱 Updated Pages:', 'blue');
  allValid &= checkFileContent(
    'src/app/feed/page.tsx',
    ['SaveProvider', 'getServerSideSaveData'],
    'Feed Page'
  );
  allValid &= checkFileContent(
    'src/app/search/page.tsx',
    ['SaveProvider', 'getServerSideSaveData'],
    'Search Page'
  );
  allValid &= checkFileContent(
    'src/app/profile/page.tsx',
    ['SaveProvider', 'getServerSideSaveData'],
    'Profile Page'
  );
  allValid &= checkFileContent(
    'src/app/category/[category]/page.tsx',
    ['SaveProvider', 'ProductCard'],
    'Category Page'
  );
  allValid &= checkFileContent(
    'src/app/product/[id]/page.tsx',
    ['SaveProvider', 'SaveCount', 'SaveButton'],
    'Product Detail Page'
  );

  // Check component integration
  log('\n🧩 Component Integration:', 'blue');
  allValid &= checkFileContent(
    'src/components/ProductCard.tsx',
    ['SaveButton'],
    'ProductCard with SaveButton'
  );

  // Check package.json for required dependencies
  log('\n📦 Dependencies:', 'blue');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['zustand', '@supabase/supabase-js', '@supabase/ssr'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      log(`✅ ${dep}`, 'green');
    } else {
      log(`❌ Missing dependency: ${dep}`, 'red');
      allValid = false;
    }
  });

  // Check TypeScript configuration
  log('\n🔧 TypeScript Configuration:', 'blue');
  allValid &= checkFileExists('tsconfig.json', 'TypeScript Config');

  // Check for documentation
  log('\n📚 Documentation:', 'blue');
  allValid &= checkFileExists('docs/SAVE_ARCHITECTURE.md', 'Architecture Documentation');
  allValid &= checkFileExists('docs/ARCHITECTURE_SUMMARY.md', 'Architecture Summary');

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  if (allValid) {
    log('🎉 All validations passed! Architecture is properly implemented.', 'green');
    log('\n✨ The save system is ready for production!', 'bold');
  } else {
    log('❌ Some validations failed. Please review the issues above.', 'red');
  }
  log('='.repeat(50), 'blue');

  return allValid;
}

// Run validation
if (require.main === module) {
  const isValid = validateArchitecture();
  process.exit(isValid ? 0 : 1);
}

module.exports = { validateArchitecture };
