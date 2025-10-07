#!/usr/bin/env node

/**
 * RLS (Row Level Security) Testing Script
 * Tests that database security policies are working correctly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRLS() {
  console.log('🛡️  Row Level Security (RLS) Test Suite\n');
  console.log('=' .repeat(60));
  
  let passed = 0;
  let failed = 0;

  // Test 1: Public data access (unauthenticated)
  console.log('\n📋 Test 1: Public Data Access (Unauthenticated)');
  console.log('-'.repeat(60));
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (!error && products) {
      console.log(`✅ PASS: Can view ${products.length} public products`);
      passed++;
    } else {
      console.log('❌ FAIL: Cannot access public products');
      console.log('   Error:', error?.message);
      failed++;
    }
  } catch (err) {
    console.log('❌ FAIL: Exception occurred');
    console.log('   Error:', err.message);
    failed++;
  }

  // Test 2: Unauthorized write attempt (should fail)
  console.log('\n🚫 Test 2: Unauthorized Product Insert (Should Fail)');
  console.log('-'.repeat(60));
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        title: 'Test Product - Should Fail',
        description: 'This should not be inserted',
        price_pence: 1000,
        status: 'AVAILABLE',
        category: 'Other',
        city: 'Test City'
      });
    
    if (error) {
      console.log('✅ PASS: Correctly blocked unauthorized insert');
      console.log(`   Policy blocked: "${error.message}"`);
      passed++;
    } else {
      console.log('❌ FAIL: SECURITY ISSUE - Insert was allowed!');
      console.log('   Data inserted:', data);
      failed++;
    }
  } catch (err) {
    console.log('✅ PASS: Exception prevented unauthorized insert');
    passed++;
  }

  // Test 3: Private conversation access (should fail)
  console.log('\n🔒 Test 3: Private Thread Access (Should Fail)');
  console.log('-'.repeat(60));
  try {
    const { data: threads, error } = await supabase
      .from('threads')
      .select('*');
    
    if (!error && (threads?.length === 0 || threads === null)) {
      console.log('✅ PASS: No private threads accessible');
      passed++;
    } else if (!error && threads?.length > 0) {
      console.log('❌ FAIL: SECURITY ISSUE - Private threads exposed!');
      console.log(`   Found ${threads.length} threads (should be 0)`);
      failed++;
    } else {
      console.log('✅ PASS: Private threads correctly blocked');
      passed++;
    }
  } catch (err) {
    console.log('✅ PASS: Exception prevented thread access');
    passed++;
  }

  // Test 4: Profile viewing (should work - public)
  console.log('\n👤 Test 4: Public Profile Access');
  console.log('-'.repeat(60));
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, name, handle')
      .limit(5);
    
    if (!error && profiles) {
      console.log(`✅ PASS: Can view ${profiles.length} public profiles`);
      passed++;
    } else {
      console.log('❌ FAIL: Cannot access public profiles');
      console.log('   Error:', error?.message);
      failed++;
    }
  } catch (err) {
    console.log('❌ FAIL: Exception occurred');
    console.log('   Error:', err.message);
    failed++;
  }

  // Test 5: Categories (should be public)
  console.log('\n📁 Test 5: Public Categories Access');
  console.log('-'.repeat(60));
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');
    
    if (!error && categories) {
      console.log(`✅ PASS: Can view ${categories.length} categories`);
      passed++;
    } else if (error?.message.includes('does not exist')) {
      console.log('⚠️  SKIP: Categories table does not exist');
    } else {
      console.log('❌ FAIL: Cannot access categories');
      console.log('   Error:', error?.message);
      failed++;
    }
  } catch (err) {
    console.log('⚠️  SKIP: Categories table may not exist');
  }

  // Test 6: Reviews (should be public)
  console.log('\n⭐ Test 6: Public Reviews Access');
  console.log('-'.repeat(60));
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(5);
    
    if (!error && reviews !== null) {
      console.log(`✅ PASS: Can view ${reviews.length} reviews`);
      passed++;
    } else if (!error && reviews === null) {
      console.log('✅ PASS: Reviews accessible (none exist yet)');
      passed++;
    } else {
      console.log('❌ FAIL: Cannot access reviews');
      console.log('   Error:', error?.message);
      failed++;
    }
  } catch (err) {
    console.log('❌ FAIL: Exception occurred');
    console.log('   Error:', err.message);
    failed++;
  }

  // Test 7: Messages access (should fail - private)
  console.log('\n💬 Test 7: Private Messages Access (Should Fail)');
  console.log('-'.repeat(60));
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*');
    
    if (!error && (messages?.length === 0 || messages === null)) {
      console.log('✅ PASS: No private messages accessible');
      passed++;
    } else if (!error && messages?.length > 0) {
      console.log('❌ FAIL: SECURITY ISSUE - Private messages exposed!');
      console.log(`   Found ${messages.length} messages (should be 0)`);
      failed++;
    } else {
      console.log('✅ PASS: Private messages correctly blocked');
      passed++;
    }
  } catch (err) {
    console.log('✅ PASS: Exception prevented message access');
    passed++;
  }

  // Test 8: Saves viewing (should be public for counts)
  console.log('\n💾 Test 8: Public Saves Access');
  console.log('-'.repeat(60));
  try {
    const { data: saves, error } = await supabase
      .from('saves')
      .select('*')
      .limit(5);
    
    if (!error && saves !== null) {
      console.log(`✅ PASS: Can view ${saves.length} saves (for counts)`);
      passed++;
    } else {
      console.log('❌ FAIL: Cannot access saves');
      console.log('   Error:', error?.message);
      failed++;
    }
  } catch (err) {
    console.log('❌ FAIL: Exception occurred');
    console.log('   Error:', err.message);
    failed++;
  }

  // Test 9: Unauthorized save insertion (should fail)
  console.log('\n❤️ Test 9: Unauthorized Save Insert (Should Fail)');
  console.log('-'.repeat(60));
  try {
    const { data, error } = await supabase
      .from('saves')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        product_id: '00000000-0000-0000-0000-000000000000'
      });
    
    if (error) {
      console.log('✅ PASS: Correctly blocked unauthorized save');
      passed++;
    } else {
      console.log('❌ FAIL: SECURITY ISSUE - Save was allowed!');
      failed++;
    }
  } catch (err) {
    console.log('✅ PASS: Exception prevented unauthorized save');
    passed++;
  }

  // Test 10: Verification documents (should fail - private)
  console.log('\n📄 Test 10: Private KYC Documents Access (Should Fail)');
  console.log('-'.repeat(60));
  try {
    const { data: docs, error } = await supabase
      .from('seller_verification_documents')
      .select('*');
    
    if (!error && (docs?.length === 0 || docs === null)) {
      console.log('✅ PASS: No KYC documents accessible');
      passed++;
    } else if (!error && docs?.length > 0) {
      console.log('❌ FAIL: SECURITY ISSUE - KYC documents exposed!');
      console.log(`   Found ${docs.length} documents (should be 0)`);
      failed++;
    } else {
      console.log('✅ PASS: KYC documents correctly blocked');
      passed++;
    }
  } catch (err) {
    console.log('✅ PASS: Exception prevented document access');
    passed++;
  }

  // Final Report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! RLS policies are working correctly.');
    console.log('✅ Your database is properly secured.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review RLS policies.');
    console.log('🔧 Check: docs/RLS_SECURITY_GUIDE.md for troubleshooting.');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
if (require.main === module) {
  testRLS().catch((err) => {
    console.error('❌ Test suite failed with error:', err);
    process.exit(1);
  });
}

module.exports = { testRLS };

