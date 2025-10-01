# Save System Architecture

## Overview

The save system has been completely redesigned to follow best practices for scalability, maintainability, and performance. The new architecture uses:

- **Zustand** for state management
- **Supabase** for database persistence
- **Custom hooks** for data fetching
- **Server-side rendering** for initial data
- **Type-safe** implementation throughout

## Architecture Components

### 1. Database Layer (`supabase/migrations/`)

```sql
-- Saves table with proper indexing and RLS
CREATE TABLE saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

**Features:**

- Row Level Security (RLS) enabled
- Proper foreign key constraints
- Optimized indexes for performance
- Database functions for common operations

### 2. State Management (`src/stores/saveStore.ts`)

```typescript
interface SaveState {
  savedProducts: Set<string>;
  saveCounts: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  // ... actions
}
```

**Features:**

- Centralized state management
- Optimistic updates for better UX
- Error handling and loading states
- DevTools integration

### 3. API Layer (`src/lib/saves.ts`)

```typescript
// Client-side operations
export async function saveProduct(productId: string): Promise<SaveResult>
export async function unsaveProduct(productId: string): Promise<SaveResult>
export async function getUserSavedProducts(): Promise<{...}>
export async function getProductSaveCount(productId: string): Promise<{...}>

// Server-side operations
export async function getServerSideSaveData(productId: string, userId?: string)
```

**Features:**

- Type-safe API functions
- Proper error handling
- Server and client-side variants
- Database function integration

### 4. Custom Hook (`src/hooks/useSaves.ts`)

```typescript
export function useSaves() {
  return {
    // State
    savedProducts: string[],
    saveCounts: Record<string, number>,
    isLoading: boolean,
    error: string | null,

    // Actions
    toggleSave: (productId: string) => Promise<{...}>,
    loadProductSaveCount: (productId: string) => Promise<void>,
    // ... more actions
  };
}
```

**Features:**

- Encapsulates all save-related logic
- Automatic data loading
- Error handling and recovery
- Optimistic updates

### 5. UI Components

#### SaveButton (`src/components/SaveButton.tsx`)

- Multiple variants: `default`, `compact`, `icon-only`
- Configurable toast notifications
- Loading states and error handling
- Accessible design

#### SaveCount (`src/components/SaveCount.tsx`)

- Real-time save count display
- Visual indicators for saved state
- Loading states
- Configurable display options

#### SaveProvider (`src/components/SaveProvider.tsx`)

- Initializes store with server-side data
- Prevents hydration mismatches
- Optimizes initial page load

## Data Flow

### 1. Initial Load (SSR)

```
Server → getServerSideSaveData() → SaveProvider → Store
```

### 2. User Interaction

```
User Action → useSaves.toggleSave() → API → Store Update → UI Update
```

### 3. Cross-Component Sync

```
Component A → Store Update → All Components → UI Update
```

## Benefits of New Architecture

### ✅ **Scalability**

- Database-backed persistence
- Proper indexing for performance
- Efficient queries with database functions
- Handles thousands of users and products

### ✅ **Maintainability**

- Clear separation of concerns
- Type-safe throughout
- Centralized state management
- Reusable components and hooks

### ✅ **Performance**

- Server-side data loading
- Optimistic updates
- Efficient database queries
- Minimal re-renders

### ✅ **User Experience**

- Instant feedback with optimistic updates
- Proper loading states
- Error handling and recovery
- Cross-tab synchronization

### ✅ **Developer Experience**

- TypeScript throughout
- Clear API contracts
- Easy to test
- DevTools integration

## Usage Examples

### Basic Save Button

```tsx
<SaveButton
  productId={product.id}
  productTitle={product.title}
  variant="default"
/>
```

### Icon-Only Save Button

```tsx
<SaveButton
  productId={product.id}
  productTitle={product.title}
  variant="icon-only"
  showToast={false}
/>
```

### Save Count Display

```tsx
<SaveCount productId={product.id} showIcon={true} />
```

### Using the Hook

```tsx
function MyComponent({ productId }) {
  const { isProductSaved, getSaveCount, toggleSave, isLoading } = useSaves();

  const isSaved = isProductSaved(productId);
  const saveCount = getSaveCount(productId);

  const handleSave = () => {
    toggleSave(productId);
  };

  return (
    <div>
      <button onClick={handleSave} disabled={isLoading}>
        {isSaved ? "Saved" : "Save"} ({saveCount})
      </button>
    </div>
  );
}
```

## Migration from Old System

The old localStorage-based system has been completely replaced. Key changes:

1. **No more localStorage** - All data persisted in database
2. **Centralized state** - No more component-level state management
3. **Server-side data** - Initial data loaded server-side
4. **Type safety** - Full TypeScript coverage
5. **Error handling** - Proper error states and recovery

## Future Enhancements

This architecture makes it easy to add:

- **Analytics**: Track save patterns and popular products
- **Notifications**: Notify users when saved products are updated
- **Collections**: Group saved products into collections
- **Sharing**: Share saved product lists
- **Offline Support**: Sync when connection restored
- **Real-time Updates**: Live updates when others save/unsave

## Best Practices

1. **Always use the hook** - Don't access store directly
2. **Handle loading states** - Show appropriate UI feedback
3. **Use server-side data** - Initialize with SSR data when possible
4. **Error boundaries** - Wrap components in error boundaries
5. **Type safety** - Use TypeScript interfaces throughout
6. **Testing** - Test hooks and components independently
