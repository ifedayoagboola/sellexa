-- Enhanced Chat System Migration
-- This migration adds advanced chat features while maintaining existing functionality

-- 1. Add message status tracking
ALTER TABLE messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed'));

-- 2. Add message reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- 3. Add typing indicators table
CREATE TABLE IF NOT EXISTS typing_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_typing BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- 4. Add conversation metadata table
CREATE TABLE IF NOT EXISTS conversation_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_archived BOOLEAN DEFAULT false,
  is_muted BOOLEAN DEFAULT false,
  last_read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- 5. Add message attachments table for future file sharing
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at_desc ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_thread_created ON messages(thread_id, created_at);

CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON message_reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_typing_indicators_thread_id ON typing_indicators(thread_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_user_id ON typing_indicators(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_updated_at ON typing_indicators(updated_at);

CREATE INDEX IF NOT EXISTS idx_conversation_metadata_thread_id ON conversation_metadata(thread_id);
CREATE INDEX IF NOT EXISTS idx_conversation_metadata_user_id ON conversation_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_metadata_archived ON conversation_metadata(is_archived);

CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);

-- 7. Enable RLS on new tables
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for message_reactions
CREATE POLICY "Users can view message reactions" ON message_reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reactions" ON message_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON message_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Create RLS policies for typing_indicators
CREATE POLICY "Users can view typing indicators in their threads" ON typing_indicators
  FOR SELECT USING (
    thread_id IN (
      SELECT id FROM threads 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own typing indicators" ON typing_indicators
  FOR ALL USING (auth.uid() = user_id);

-- 10. Create RLS policies for conversation_metadata
CREATE POLICY "Users can view their own conversation metadata" ON conversation_metadata
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own conversation metadata" ON conversation_metadata
  FOR ALL USING (auth.uid() = user_id);

-- 11. Create RLS policies for message_attachments
CREATE POLICY "Users can view attachments in their threads" ON message_attachments
  FOR SELECT USING (
    message_id IN (
      SELECT m.id FROM messages m
      JOIN threads t ON m.thread_id = t.id
      WHERE t.buyer_id = auth.uid() OR t.seller_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert attachments to their messages" ON message_attachments
  FOR INSERT WITH CHECK (
    message_id IN (
      SELECT id FROM messages WHERE sender_id = auth.uid()
    )
  );

-- 12. Create database functions for common operations

-- Function to get conversation list with metadata
CREATE OR REPLACE FUNCTION get_user_conversations(user_uuid UUID)
RETURNS TABLE (
  thread_id UUID,
  product_id UUID,
  product_title TEXT,
  product_price_pence INTEGER,
  product_image TEXT,
  other_user_id UUID,
  other_user_name TEXT,
  other_user_handle TEXT,
  other_user_avatar_url TEXT,
  last_message_body TEXT,
  last_message_created_at TIMESTAMP WITH TIME ZONE,
  unread_count BIGINT,
  is_archived BOOLEAN,
  is_muted BOOLEAN,
  last_read_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as thread_id,
    t.product_id,
    p.title as product_title,
    p.price_pence,
    p.images[1] as product_image,
    CASE 
      WHEN t.buyer_id = user_uuid THEN t.seller_id
      ELSE t.buyer_id
    END as other_user_id,
    CASE 
      WHEN t.buyer_id = user_uuid THEN seller.name
      ELSE buyer.name
    END as other_user_name,
    CASE 
      WHEN t.buyer_id = user_uuid THEN seller.handle
      ELSE buyer.handle
    END as other_user_handle,
    CASE 
      WHEN t.buyer_id = user_uuid THEN seller.avatar_url
      ELSE buyer.avatar_url
    END as other_user_avatar_url,
    last_msg.body as last_message_body,
    last_msg.created_at as last_message_created_at,
    COALESCE(unread.count, 0) as unread_count,
    COALESCE(cm.is_archived, false) as is_archived,
    COALESCE(cm.is_muted, false) as is_muted,
    cm.last_read_at
  FROM threads t
  JOIN products p ON t.product_id = p.id
  JOIN profiles buyer ON t.buyer_id = buyer.id
  JOIN profiles seller ON t.seller_id = seller.id
  LEFT JOIN LATERAL (
    SELECT body, created_at
    FROM messages m
    WHERE m.thread_id = t.id
    ORDER BY m.created_at DESC
    LIMIT 1
  ) last_msg ON true
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count
    FROM messages m
    WHERE m.thread_id = t.id 
    AND m.sender_id != user_uuid
    AND m.created_at > COALESCE(cm.last_read_at, '1970-01-01'::timestamp)
  ) unread ON true
  LEFT JOIN conversation_metadata cm ON t.id = cm.thread_id AND cm.user_id = user_uuid
  WHERE t.buyer_id = user_uuid OR t.seller_id = user_uuid
  ORDER BY COALESCE(last_msg.created_at, t.created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(thread_uuid UUID, user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Update conversation metadata
  INSERT INTO conversation_metadata (thread_id, user_id, last_read_at)
  VALUES (thread_uuid, user_uuid, NOW())
  ON CONFLICT (thread_id, user_id)
  DO UPDATE SET 
    last_read_at = NOW(),
    updated_at = NOW();
    
  -- Update message status to read
  UPDATE messages 
  SET status = 'read'
  WHERE messages.thread_id = thread_uuid 
  AND messages.sender_id != user_uuid
  AND messages.status != 'read';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get typing indicators for a thread
CREATE OR REPLACE FUNCTION get_typing_indicators(thread_uuid UUID, user_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_handle TEXT,
  is_typing BOOLEAN,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ti.user_id,
    p.name as user_name,
    p.handle as user_handle,
    ti.is_typing,
    ti.updated_at
  FROM typing_indicators ti
  JOIN profiles p ON ti.user_id = p.id
  WHERE ti.thread_id = thread_uuid 
  AND ti.user_id != user_uuid
  AND ti.is_typing = true
  AND ti.updated_at > NOW() - INTERVAL '10 seconds'
  ORDER BY ti.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set typing indicator
CREATE OR REPLACE FUNCTION set_typing_indicator(thread_uuid UUID, user_uuid UUID, typing BOOLEAN)
RETURNS VOID AS $$
BEGIN
  INSERT INTO typing_indicators (thread_id, user_id, is_typing)
  VALUES (thread_uuid, user_uuid, typing)
  ON CONFLICT (thread_id, user_id)
  DO UPDATE SET 
    is_typing = typing,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get message reactions
CREATE OR REPLACE FUNCTION get_message_reactions(message_uuid UUID)
RETURNS TABLE (
  emoji TEXT,
  count BIGINT,
  user_reacted BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mr.emoji,
    COUNT(*) as count,
    EXISTS(
      SELECT 1 FROM message_reactions mr2 
      WHERE mr2.message_id = message_uuid 
      AND mr2.emoji = mr.emoji 
      AND mr2.user_id = auth.uid()
    ) as user_reacted
  FROM message_reactions mr
  WHERE mr.message_id = message_uuid
  GROUP BY mr.emoji
  ORDER BY count DESC, mr.emoji;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create trigger to update thread last_message_at
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE threads 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_thread_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_last_message();

-- 14. Create trigger to clean up old typing indicators
CREATE OR REPLACE FUNCTION cleanup_old_typing_indicators()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM typing_indicators 
  WHERE updated_at < NOW() - INTERVAL '30 seconds';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_typing_indicators
  AFTER INSERT OR UPDATE ON typing_indicators
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_old_typing_indicators();
