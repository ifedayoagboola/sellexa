-- Final chat system cleanup
-- This migration ensures all functions are properly defined and optimized

-- Drop and recreate functions to ensure they're up to date
DROP FUNCTION IF EXISTS get_user_conversations(UUID);
DROP FUNCTION IF EXISTS mark_messages_as_read(UUID, UUID);
DROP FUNCTION IF EXISTS get_typing_indicators(UUID, UUID);
DROP FUNCTION IF EXISTS set_typing_indicator(UUID, UUID, BOOLEAN);
DROP FUNCTION IF EXISTS get_message_reactions(UUID);

-- Recreate optimized functions
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
  LEFT JOIN conversation_metadata cm ON t.id = cm.thread_id AND cm.user_id = user_uuid
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
  WHERE t.buyer_id = user_uuid OR t.seller_id = user_uuid
  ORDER BY COALESCE(last_msg.created_at, t.created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
