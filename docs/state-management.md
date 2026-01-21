# State Management

**Generated:** 2026-01-21  
**Scan Level:** Deep

---

## Overview

This application uses a **multi-layered state management approach**:

1. **TanStack Query v5** - Server state (data fetching, caching)
2. **React Context API** - Global UI state (auth, theme, dialogs)
3. **React Hook Form** - Form state
4. **React State (useState)** - Component-local state
5. **URL/SessionStorage** - Persistent table state

**Note:** Zustand is listed in dependencies but not actively used in current codebase.

---

## Server State: TanStack Query

**Location:** `src/App.tsx`  
**Version:** 5.90.2

### Configuration

```typescript
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: globalErrorHandler, // Global error handling
  }),
  defaultOptions: {
    mutations: {
      onError: globalErrorHandler, // Global mutation error handling
    }
  }
});
```

### Global Error Handler

**Location:** `src/App.tsx`

- Catches all query and mutation errors
- Uses `AppError` system for standardized errors
- Displays toast notifications via Sonner
- Duration: 5 seconds, dismissible

### Usage Pattern

**Data Fetching:**
```typescript
const { data, isLoading, isError } = useQuery({
  queryKey: [model.tableName + '_detail', model.id],
  queryFn: async () => model.loadData(),
  refetchOnWindowFocus: false,
  retry: false,
});
```

**Mutations:**
```typescript
const mutation = useMutation({
  mutationFn: (payload) => model.upsert(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: [model.tableName]});
    toast.success('Successfully updated');
  },
});
```

---

## Global UI State: React Context

### Authentication Context

**Location:** `src/AuthProvider.tsx`

**State:**
- `user` - Supabase Auth user object
- `profile` - User profile data (from `profile` table)
- `loading` - Loading state

**Methods:**
- `useAuth()` - Hook to access auth context

**Features:**
- Listens to Supabase auth state changes
- Automatically loads profile data when user changes
- Provides user and profile to entire app

**Usage:**
```typescript
const { user, profile, loading } = useAuth();
```

### Theme Context

**Location:** `src/components/theme-provider.tsx`  
**Library:** `next-themes` v0.4.6

**Features:**
- Dark/light mode support
- System theme detection
- Persistent theme preference
- Smooth transitions

**Configuration:**
- Attribute: `class`
- Default: `system`
- System detection: enabled

### Global Alert Dialog Context

**Location:** `src/components/global-alert-dialog.tsx`

**State:**
- Dialog visibility
- Title, description
- Confirm/cancel callbacks
- Destructive action flag

**Methods:**
- `showDialog(options)` - Show alert dialog
- `hideDialog()` - Hide dialog
- `useAlertDialog()` - Hook to access dialog context

**Usage:**
```typescript
const { showDialog } = useAlertDialog();

showDialog({
  title: 'Confirm Action',
  description: 'Are you sure?',
  onConfirm: () => handleConfirm(),
  isDestructive: true,
});
```

### Sidebar Context

**Location:** `src/components/ui/sidebar.tsx`  
**Library:** Radix UI

**State:**
- Sidebar open/closed state
- Mobile sidebar state
- Collapsed state

**Methods:**
- `useSidebar()` - Hook to access sidebar context

---

## Form State: React Hook Form

**Location:** `src/components/formbuilder/form-builder.tsx`  
**Version:** 7.64.0  
**Resolver:** `@hookform/resolvers` v5.2.2 (Zod)

### FormBuilder System

**Purpose:** Unified form handling with Zod validation

**Features:**
- Automatic form provider setup
- Zod schema validation
- Type-safe form data
- Loading/error state handling
- Integration with BaseModel

**Usage:**
```typescript
<FormBuilder baseModel={model} queryResult={queryResult}>
  <FBForm onSubmit={handleSubmit}>
    <FBInput name="field_name" label="Label" />
    <FBSubmit handleSubmit={handleSubmit} />
  </FBForm>
</FormBuilder>
```

**Form State:**
- Managed by React Hook Form
- Validated via Zod schemas
- Type inference from Zod schemas
- Error handling integrated

---

## Persistent Table State

**Location:** `src/components/data-table/data-table-use-persistent.tsx`

**Purpose:** Persist table sorting, filtering, pagination state

**Storage:**
1. **SessionStorage** - Primary storage (survives page refresh)
2. **URL Parameters** - Secondary storage (shareable state)

**State Persisted:**
- Sorting (`sorting`)
- Column filters (`columnFilters`)
- Global filter (`globalFilter`)
- Pagination (`pageIndex`, `pageSize`)

**Key Format:** `tableState:{tableKey}`

**URL Parameter Format:**
- `${tableKey}-sort`
- `${tableKey}-filters`
- `${tableKey}-global-filter`
- `${tableKey}-page`
- `${tableKey}-pageSize`

**Usage:**
```typescript
const tableState = usePersistentTableState('users-table');
```

---

## Component State Patterns

### Local State (useState)

Used for:
- Component-specific UI state
- Temporary form state
- Modal/dialog visibility
- Loading states (when not using TanStack Query)

### Derived State (useMemo, useCallback)

Used for:
- Computed values from props/state
- Memoized callbacks to prevent re-renders
- Filtered/sorted data transformations

---

## State Flow

### Data Flow Pattern

```
User Action
  ↓
Component Event Handler
  ↓
TanStack Query Mutation
  ↓
BaseModel Method (Supabase)
  ↓
Query Invalidation
  ↓
Automatic Refetch
  ↓
UI Update
```

### Authentication Flow

```
Supabase Auth State Change
  ↓
AuthProvider useEffect
  ↓
Load Profile Data (BaseModel)
  ↓
Update Auth Context
  ↓
Protected Routes Re-evaluate
  ↓
UI Updates
```

---

## Best Practices

1. **Server State:** Always use TanStack Query for data fetching
2. **Form State:** Use FormBuilder system for all forms
3. **Global UI:** Use Context API for app-wide UI state
4. **Local State:** Use useState for component-specific state
5. **Persistence:** Use persistent table state for data tables
6. **Error Handling:** Rely on global error handler for consistency

---

## Future Considerations

**Zustand** is installed but not currently used. Potential use cases:
- Complex global state that doesn't fit Context API
- State that needs to be accessed outside React components
- Performance optimization for frequently updated state
