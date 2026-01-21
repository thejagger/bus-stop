# Architecture Documentation

**Generated:** 2026-01-21  
**Scan Level:** Deep  
**Project:** Bus Stop Display System

---

## Executive Summary

**Bus Stop Display System** is a React-based Single Page Application (SPA) for managing digital displays at bus/tram stops. The application integrates with Supabase for backend services and the ZET API for transit data.

**Architecture Type:** Component-Based React SPA  
**Deployment Model:** Static Site (SPA)  
**Backend:** Supabase (BaaS)  
**Database:** PostgreSQL (via Supabase)

---

## Technology Stack

See `technology-stack.md` for detailed technology information.

**Core:**
- React 19 - UI framework
- TypeScript 5.9 - Type-safe development
- Vite (Rolldown) - Build tool
- React Router DOM 7 - Client-side routing

**Backend:**
- Supabase - Backend as a Service
- PostgreSQL - Database
- Supabase Auth - Authentication

**State Management:**
- TanStack Query v5 - Server state
- React Context API - Global UI state
- React Hook Form - Form state

**UI:**
- Shadcn UI - Component library
- Radix UI - UI primitives
- Tailwind CSS v4 - Styling

---

## Architecture Pattern

### Component-Based Architecture

The application follows a **component-based architecture** with clear separation of concerns:

1. **Pages** (`src/app/`) - Route-based page components
2. **Components** (`src/components/`) - Reusable UI components
3. **Models** (`src/app/{feature}/model/`) - Data access layer
4. **Services** (`src/services/`) - External API integrations
5. **Lib** (`src/lib/`) - Core utilities and base classes

### Key Architectural Patterns

#### BaseModel Pattern

**Location:** `src/lib/base.model.ts`

All data operations extend the `BaseModel` class:

```typescript
class MyModel extends BaseModel<typeof MySchema> {
  constructor(id?: string | number) {
    super(supabase, "table_name", "/route", MySchema, id);
  }
}
```

**Benefits:**
- Unified data access
- Automatic validation
- Relation support
- Consistent error handling
- Query building

#### FormBuilder Pattern

**Location:** `src/components/formbuilder/`

All forms use the FormBuilder system:

```typescript
<FormBuilder baseModel={model} queryResult={queryResult}>
  <FBForm onSubmit={handleSubmit}>
    <FBInput name="field" label="Label" />
    <FBSubmit handleSubmit={handleSubmit} />
  </FBForm>
</FormBuilder>
```

**Benefits:**
- Consistent form patterns
- Automatic validation
- Type safety
- Reusable field components

#### DataTable Pattern

**Location:** `src/components/data-table/`

All tables use DataTableSupabase:

```typescript
<DataTableSupabase
  columns={columns}
  queryFn={() => model.getAllQuery()}
  baseModel={model}
/>
```

**Benefits:**
- Consistent table patterns
- Supabase integration
- Sorting, filtering, pagination
- State persistence

---

## Data Architecture

### Database Schema

See `data-models.md` for detailed schema information.

**Core Tables:**
- `devices` - Display devices
- `stops` - Bus/tram stops
- `lines` - Transit lines/routes
- `device_stop_lines` - Junction table
- `schedule_cache` - Cached arrival times
- `profile` - User profiles

### Data Flow

```
User Action
  ↓
Component Event Handler
  ↓
TanStack Query Mutation
  ↓
BaseModel Method
  ↓
Supabase Client
  ↓
PostgreSQL Database
  ↓
Response
  ↓
Query Invalidation
  ↓
UI Update
```

### Data Validation

- **Zod schemas** for all models
- **Runtime validation** on all data operations
- **Type inference** from schemas
- **Error handling** via AppError system

---

## API Design

See `api-contracts.md` for detailed API information.

### Internal APIs (Supabase)

- **Authentication:** Supabase Auth
- **Database:** Supabase PostgREST
- **Storage:** Supabase Storage (for file uploads)
- **Edge Functions:** Supabase Edge Functions

### External APIs

- **ZET API:** Transit data (stops, routes, arrivals)
- **Proxy:** Development proxy for CORS handling

---

## Component Architecture

### Component Hierarchy

```
App
├── QueryClientProvider
│   ├── ThemeProvider
│   │   ├── Routes
│   │   │   ├── PublicRoute (Login)
│   │   │   └── ProtectedRoute
│   │   │       └── Layout
│   │   │           ├── SidebarProvider
│   │   │           │   ├── AppSidebar
│   │   │           │   └── GlobalAlertDialogProvider
│   │   │           │       └── Page Components
│   │   │           └── SiteHeader
│   │   └── Toaster
```

### Component Categories

1. **Layout Components** - Structure (Layout, Sidebar, Header)
2. **Page Components** - Feature pages (Dashboard, Users, Setup)
3. **Form Components** - FormBuilder system
4. **Table Components** - DataTable system
5. **UI Primitives** - Shadcn UI components
6. **Feature Components** - Feature-specific UI

---

## State Management Architecture

See `state-management.md` for detailed state management information.

### State Layers

1. **Server State** - TanStack Query (data fetching, caching)
2. **Global UI State** - React Context (auth, theme, dialogs)
3. **Form State** - React Hook Form (form data, validation)
4. **Local State** - useState (component-specific)
5. **Persistent State** - URL/SessionStorage (table state)

### State Flow

- **Server State:** Managed by TanStack Query
- **Global State:** Managed by Context API
- **Form State:** Managed by React Hook Form
- **Local State:** Managed by component useState

---

## Source Tree

See `source-tree-analysis.md` for detailed directory structure.

**Key Directories:**
- `src/app/` - Feature pages and routes
- `src/components/` - Reusable components
- `src/lib/` - Core libraries
- `src/config/` - Configuration
- `supabase/migrations/` - Database migrations

---

## Development Workflow

See `development-guide.md` for detailed development information.

### Key Workflows

1. **Adding Features:**
   - Create model (BaseModel)
   - Create pages (DataTable + FormBuilder)
   - Add routes (navigation config)
   - Add database table (migration)

2. **Form Development:**
   - Use FormBuilder
   - Use FB components
   - Define Zod schema
   - Handle submission

3. **Table Development:**
   - Use DataTableSupabase
   - Define columns
   - Configure filters
   - Handle actions

---

## Deployment Architecture

See `deployment-guide.md` for detailed deployment information.

### Deployment Model

**Type:** Static Site (SPA)

**Build Process:**
1. TypeScript compilation
2. Vite production build
3. Asset optimization
4. Static file generation

**Hosting:**
- Static file hosting (Vercel, Netlify, etc.)
- CDN for assets
- No server required

**Backend:**
- Supabase (hosted)
- External APIs (ZET API)

---

## Security Architecture

### Authentication

- **Provider:** Supabase Auth
- **Method:** Email/password
- **Session:** Persistent, auto-refresh
- **Protection:** ProtectedRoute component

### Authorization

- **Row Level Security (RLS):** Enabled on all tables
- **Policies:**
  - Public read (filtered)
  - Authenticated write
  - Device-specific read for polling

### Data Protection

- **Validation:** Zod schemas
- **Error Handling:** AppError system
- **Environment Variables:** Secure storage
- **CORS:** Proxy in development, direct in production

---

## Performance Considerations

### Optimization Strategies

1. **Code Splitting:** Automatic via Vite
2. **Tree Shaking:** Automatic via Vite
3. **Caching:** TanStack Query caching
4. **Lazy Loading:** Can be added for routes
5. **Asset Optimization:** Automatic via Vite

### Caching

- **TanStack Query:** Server state caching
- **ZET API:** 5-minute cache for static data
- **SessionStorage:** Table state persistence
- **Browser:** Static asset caching

---

## Testing Strategy

**Current Status:** No test configuration found

**Recommended:**
- Unit tests (Vitest)
- Integration tests (React Testing Library)
- E2E tests (Playwright)
- Model tests (BaseModel operations)
- Component tests (FormBuilder, DataTable)

---

## Error Handling

### Error Architecture

- **AppError System:** Standardized errors (`src/lib/app-error.ts`)
- **Global Handler:** Catches all query/mutation errors (`src/App.tsx`)
- **Display:** Toast notifications (Sonner)
- **Context:** Operation and table tracking

### Error Flow

```
Error Occurs
  ↓
AppError Created
  ↓
Global Error Handler
  ↓
Toast Notification
  ↓
User Feedback
```

---

## Integration Points

### Supabase Integration

- **Client:** `src/lib/supabase-client.ts`
- **Models:** BaseModel system
- **Auth:** AuthProvider
- **Storage:** File upload hooks

### ZET API Integration

- **Service:** `src/services/zet-api.ts`
- **Proxy:** Development proxy (`src/lib/fetch-proxy.ts`)
- **Vite Config:** Proxy configuration

---

## Future Considerations

### Potential Improvements

1. **Testing:** Add comprehensive test suite
2. **CI/CD:** Automated builds and deployments
3. **Monitoring:** Error tracking and analytics
4. **Performance:** Further optimization
5. **Accessibility:** Enhanced a11y features
6. **Internationalization:** Expand i18n support

### Scalability

- **Current:** Single application, single database
- **Future:** Can scale horizontally (static hosting)
- **Database:** Supabase handles scaling
- **API:** External APIs handle their own scaling

---

## Architecture Decisions

### Why BaseModel?

- **Consistency:** Unified data access pattern
- **Validation:** Automatic Zod validation
- **Relations:** Built-in relation support
- **Error Handling:** Consistent error patterns

### Why FormBuilder?

- **Consistency:** Unified form patterns
- **Validation:** Automatic Zod validation
- **Reusability:** Reusable field components
- **Type Safety:** Type inference from schemas

### Why DataTableSupabase?

- **Consistency:** Unified table patterns
- **Integration:** Direct Supabase integration
- **Features:** Sorting, filtering, pagination built-in
- **State:** Automatic state persistence

### Why Static SPA?

- **Simplicity:** No server to manage
- **Performance:** Fast loading, CDN distribution
- **Cost:** Lower hosting costs
- **Scalability:** Easy horizontal scaling

---

## Conclusion

The Bus Stop Display System follows modern React best practices with a component-based architecture, unified data access patterns, and a clear separation of concerns. The architecture is designed for maintainability, scalability, and developer productivity.
