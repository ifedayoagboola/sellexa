// Test script for chat functionality
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testChatFunctions() {
  console.log('🧪 Testing Chat Functions...\n');

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Not authenticated. Please log in first.');
      console.log('   You can test the functions by visiting /test-chat page in your browser.\n');
      return;
    }
    
    console.log('✅ Connected as user:', user.email);

    // Test 2: Test get_user_conversations function
    console.log('\n2. Testing get_user_conversations function...');
    const { data: conversations, error: convError } = await supabase.rpc('get_user_conversations', {
      user_uuid: user.id
    });

    if (convError) {
      console.log('❌ Error fetching conversations:', convError.message);
    } else {
      console.log('✅ Conversations fetched successfully:', conversations?.length || 0, 'conversations found');
    }

    // Test 3: Test if threads table exists and has data
    console.log('\n3. Testing threads table...');
    const { data: threads, error: threadsError } = await supabase
      .from('threads')
      .select('id, buyer_id, seller_id, product_id, created_at')
      .limit(5);

    if (threadsError) {
      console.log('❌ Error fetching threads:', threadsError.message);
    } else {
      console.log('✅ Threads table accessible:', threads?.length || 0, 'threads found');
    }

    // Test 4: Test if messages table exists and has data
    console.log('\n4. Testing messages table...');
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('id, thread_id, sender_id, body, created_at, status')
      .limit(5);

    if (messagesError) {
      console.log('❌ Error fetching messages:', messagesError.message);
    } else {
      console.log('✅ Messages table accessible:', messages?.length || 0, 'messages found');
    }

    // Test 5: Test new chat tables
    console.log('\n5. Testing new chat tables...');
    
    // Test message_reactions table
    const { data: reactions, error: reactionsError } = await supabase
      .from('message_reactions')
      .select('id, message_id, user_id, emoji')
      .limit(5);

    if (reactionsError) {
      console.log('❌ Error fetching message_reactions:', reactionsError.message);
    } else {
      console.log('✅ message_reactions table accessible:', reactions?.length || 0, 'reactions found');
    }

    // Test typing_indicators table
    const { data: typing, error: typingError } = await supabase
      .from('typing_indicators')
      .select('id, thread_id, user_id, is_typing')
      .limit(5);

    if (typingError) {
      console.log('❌ Error fetching typing_indicators:', typingError.message);
    } else {
      console.log('✅ typing_indicators table accessible:', typing?.length || 0, 'indicators found');
    }

    // Test conversation_metadata table
    const { data: metadata, error: metadataError } = await supabase
      .from('conversation_metadata')
      .select('id, thread_id, user_id, is_archived, is_muted')
      .limit(5);

    if (metadataError) {
      console.log('❌ Error fetching conversation_metadata:', metadataError.message);
    } else {
      console.log('✅ conversation_metadata table accessible:', metadata?.length || 0, 'metadata entries found');
    }

    console.log('\n🎉 Chat system test completed!');
    console.log('\nTo test the full functionality:');
    console.log('1. Visit http://localhost:3000/test-chat in your browser');
    console.log('2. Make sure you are logged in');
    console.log('3. Try creating a conversation and sending messages');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testChatFunctions();
