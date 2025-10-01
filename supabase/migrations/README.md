# Database Migrations

This directory contains all database migrations for the EthniqRootz project. Migrations are applied in chronological order based on their timestamp.

## Migration Order

1. `00000000000000_migration_tracking.sql` - Migration tracking table
2. `20241220_create_saves_table.sql` - Initial saves table creation
3. `20250101140000_optimize_saves.sql` - Saves table optimization
4. `20250101180000_add_seller_kyc.sql` - KYC system implementation
5. `20250101180100_update_kyc_default_status.sql` - KYC instant verification
6. `20251001134018_add_product_reviews.sql` - Product reviews system
7. `20251001162322_enhance_chat_system.sql` - Chat system enhancement
8. `20251001171055_fix_ambiguous_column_references.sql` - Fix ambiguous column references
9. `20251001172920_fix_conversation_metadata_join.sql` - Fix conversation metadata join
10. `20251001174812_final_chat_cleanup.sql` - Final chat system cleanup

## Key Features Added

### Saves System

- User product saves functionality
- Save counts and tracking
- Optimized queries for performance

### KYC System

- Seller verification process
- Business information collection
- Instant verification upon submission
- Social media integration

### Chat System

- Real-time messaging
- Thread management
- Message status tracking
- Typing indicators
- Message reactions

### Product Reviews

- Product review system
- Rating functionality
- Review management

## Running Migrations

To apply all migrations:

```bash
npx supabase db push
```

To reset the database and apply all migrations:

```bash
npx supabase db reset
```

To check migration status:

```bash
npx supabase migration list
```
