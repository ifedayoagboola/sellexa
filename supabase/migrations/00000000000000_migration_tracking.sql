-- Migration tracking table
-- This ensures migrations are only run once per environment

CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  name TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_schema_migrations_executed_at ON schema_migrations(executed_at);

-- Function to record migration execution
CREATE OR REPLACE FUNCTION record_migration(migration_version VARCHAR(255), migration_name TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO schema_migrations (version, name)
  VALUES (migration_version, migration_name)
  ON CONFLICT (version) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if migration has been executed
CREATE OR REPLACE FUNCTION migration_executed(migration_version VARCHAR(255))
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM schema_migrations WHERE version = migration_version
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


