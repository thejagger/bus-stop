---
project_name: 'bus-stop'
user_name: 'derjäger'
date: '2026-01-21'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality', 'workflow_rules', 'critical_rules']
existing_patterns_found: 15
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Mobile App Framework:**
- Expo CLI with TypeScript template
- Expo SDK 54 (React Native 0.74+)
- Expo Router v6.0.21 (file-based routing)

**Core Libraries:**
- TypeScript 5.9 (strict mode required)
- Zustand v5.0.10 (client state management)
- TanStack Query v5 (server state management)
- Zod v4 (schema validation)
- react-native-ble-plx v3.5.0 (Bluetooth BLE - requires development builds)
- @supabase/supabase-js v2.58.0 (backend client)
- react-native-webview (for Leaflet.js maps)

**Backend:**
- Supabase (PostgreSQL 17, Auth, Edge Functions)
- ZET API integration (via Edge Functions only - never call directly from mobile)

**Build & Deployment:**
- EAS Build (free tier: 15 builds/month)
- Metro bundler (via Expo)

**Critical Version Constraints:**
- react-native-ble-plx v3.5.0 requires Expo 51+ (compatible with Expo SDK 54)
- Development builds REQUIRED for Bluetooth BLE (cannot use Expo Go)
- TypeScript strict mode MUST be enabled

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

**TypeScript Configuration:**
- **MUST** use strict mode (`"strict": true` in tsconfig.json)
- **MUST** use `z.infer<typeof Schema>` for type inference from Zod schemas
- **NEVER** use `any` type without explicit justification
- **ALWAYS** define types for function parameters and return values

**Import/Export Patterns:**
- Use named exports for components and utilities: `export function ComponentName() {}`
- Use default exports only for route files (Expo Router requirement)
- Group imports: React → React Native → Third-party → Local → Types
- Use absolute imports with `@/` alias when configured

**Error Handling:**
- **ALWAYS** use try-catch for async operations
- **ALWAYS** transform errors to standardized format: `{ error: { code, message, details? } }`
- **ALWAYS** use centralized `handleError()` utility from `app/lib/errors/`
- **NEVER** throw raw errors to users - always show user-friendly messages

**Async/Await Patterns:**
- **PREFER** async/await over Promise chains
- **ALWAYS** handle errors in async functions
- Use `Promise.all()` for parallel operations, not sequential awaits

---

### Framework-Specific Rules (React Native/Expo)

**Expo Router (File-Based Routing):**
- **MUST** use file-based routing in `app/` directory
- Route files: `app/devices/index.tsx` → `/devices` route
- Dynamic routes: `app/devices/[deviceId]/index.tsx` → `/devices/:deviceId`
- **MUST** use `useRouter()` and `usePathname()` hooks for navigation
- **NEVER** use React Navigation directly (Expo Router handles this)

**React Hooks Rules:**
- **MUST** follow Rules of Hooks (no conditional hooks)
- **MUST** use `useMemo()` for expensive computations
- **MUST** use `useCallback()` for functions passed to child components
- **MUST** use `useQuery()` from TanStack Query for server data (never useState)
- **MUST** use Zustand stores for client state (BLE connection, UI state)

**Component Structure:**
- **MUST** use PascalCase for component files: `DeviceCard.tsx`
- **MUST** use PascalCase for component names: `export function DeviceCard() {}`
- **MUST** co-locate types: `app/features/{feature}/types/{feature}.types.ts`
- **MUST** place components in feature directories: `app/features/{feature}/components/`

**State Management Boundaries:**
- **Zustand** = Client state ONLY (BLE connection, UI state, offline config, user preferences)
- **TanStack Query** = Server state ONLY (Supabase data, API responses)
- **NEVER** mix Zustand and TanStack Query for same data
- **NEVER** use useState for server data - always use TanStack Query

**Performance Rules:**
- **MUST** use React.memo() for expensive components
- **MUST** use Zustand selectors for performance: `useDeviceStore((state) => state.device)`
- **MUST** configure TanStack Query staleTime (30-60s for real-time data, 5min for static)
- **MUST** use `useMemo()` for derived state calculations

---

### Testing Rules

**Test Organization:**
- **MUST** co-locate tests: `Component.tsx` → `Component.test.tsx` (same directory)
- **MUST** use `.test.ts` or `.test.tsx` suffix
- Test utilities: `app/lib/test/` directory

**Test Structure:**
- **MUST** use descriptive test names: `describe('DeviceCard', () => { it('displays device name', ...) })`
- **MUST** mock BLE client: `tests/__mocks__/react-native-ble-plx.ts`
- **MUST** mock Supabase client: `tests/__mocks__/@supabase-supabase-js.ts`
- **MUST** test error handling paths

**Mock Usage:**
- **MUST** mock all external dependencies (BLE, Supabase, AsyncStorage)
- **MUST** use consistent mock patterns across tests
- **MUST** reset mocks between tests

---

### Code Quality & Style Rules

**Naming Conventions:**
- **Database:** snake_case, singular tables (`device`, `device_stop_line`)
- **Components:** PascalCase (`DeviceCard.tsx`, `StopSelector.tsx`)
- **Functions/Hooks:** camelCase (`useDeviceStore`, `connectDevice`)
- **Constants:** UPPER_SNAKE_CASE (`STORAGE_KEYS`, `ERROR_CODES`)
- **Files:** Match export name (component file = component name)

**File Organization:**
- **MUST** use feature-based structure: `app/features/{feature}/`
- **MUST** place shared code in `app/lib/` or `app/components/`
- **MUST** follow Expo Router file structure for routes
- **NEVER** import from other features directly - use shared libraries

**Code Organization:**
- **MUST** group imports: React → React Native → Third-party → Local → Types
- **MUST** use absolute imports when `@/` alias configured
- **MUST** export types from `types/` directory, not inline

**Documentation:**
- **MUST** add JSDoc comments for complex functions
- **MUST** document BLE message types and structures
- **MUST** document error code meanings

---

### Development Workflow Rules

**Git Patterns:**
- Branch naming: `feature/{feature-name}`, `fix/{issue-name}`, `chore/{task-name}`
- Commit messages: Use conventional commits format
- **MUST** reference architecture document in PR descriptions

**Environment Configuration:**
- **MUST** use `EXPO_PUBLIC_` prefix for public environment variables
- **MUST** use separate `.env` files: `.env.development`, `.env.staging`, `.env.production`
- **NEVER** commit `.env` files (use `.env.example`)

**Build Requirements:**
- **MUST** use development builds for Bluetooth BLE (cannot use Expo Go)
- **MUST** run `npx expo prebuild` before building with native modules
- **MUST** use EAS Build for production builds

**Code Review Checklist:**
- [ ] Follows naming conventions (database, API, code, components)
- [ ] Uses correct state management (Zustand vs TanStack Query)
- [ ] Follows error handling patterns
- [ ] Uses correct BLE message structure
- [ ] Follows project structure (feature-based organization)
- [ ] Uses correct AsyncStorage key format (namespaced)

---

### Critical Don't-Miss Rules

**State Management Anti-Patterns:**
- ❌ **NEVER** use useState for server data - use TanStack Query
- ❌ **NEVER** use TanStack Query for client state (BLE connection, UI state) - use Zustand
- ❌ **NEVER** mix Zustand and TanStack Query for same data
- ❌ **NEVER** use Context API for state - use Zustand or TanStack Query

**BLE Communication Rules:**
- ❌ **NEVER** call ZET API directly from mobile - always via Edge Functions
- ✅ **MUST** use JSON over BLE with type-based structure: `{ type, payload, timestamp? }`
- ✅ **MUST** use namespaced AsyncStorage keys: `@busstop:{feature}:{resource}:{id?}`
- ✅ **MUST** handle BLE connection errors gracefully with retry logic

**Error Handling Anti-Patterns:**
- ❌ **NEVER** show raw error messages to users
- ❌ **NEVER** throw errors without catching and transforming
- ✅ **MUST** use centralized `handleError()` utility
- ✅ **MUST** use error codes: `BLE_*`, `DEVICE_*`, `NETWORK_*`, `VALIDATION_*`, `API_*`

**Project Structure Anti-Patterns:**
- ❌ **NEVER** create files outside feature directories (except shared code)
- ❌ **NEVER** use kebab-case for component files (use PascalCase)
- ❌ **NEVER** use string-based TanStack Query keys (use array format)
- ❌ **NEVER** use unnamespaced AsyncStorage keys

**TypeScript Anti-Patterns:**
- ❌ **NEVER** use `any` type without justification
- ❌ **NEVER** bypass Zod validation
- ✅ **MUST** use `z.infer<typeof Schema>` for type inference
- ✅ **MUST** define types for all function parameters

**Performance Gotchas:**
- ❌ **NEVER** fetch data in render - use TanStack Query
- ❌ **NEVER** create new objects in render (use useMemo)
- ❌ **NEVER** pass inline functions to child components (use useCallback)
- ✅ **MUST** use Zustand selectors for performance

**Security Rules:**
- ❌ **NEVER** expose Supabase service role key in mobile app
- ❌ **NEVER** store sensitive data in AsyncStorage without encryption
- ✅ **MUST** validate all user input with Zod schemas
- ✅ **MUST** use Supabase RLS policies for data access

**Edge Cases to Handle:**
- BLE device disconnection during operation
- Network offline during API calls
- AsyncStorage quota exceeded
- BLE message size limits (MTU constraints)
- Device firmware version mismatches
- Supabase connection failures

---

## Quick Reference

**TanStack Query Keys:**
```typescript
['devices']                    // List all devices
['devices', deviceId]          // Single device
['devices', deviceId, 'config'] // Device configuration
```

**Zustand Store Pattern:**
```typescript
export const useDeviceStore = create<DeviceState>((set) => ({
  connectDevice: async (deviceId: string) => { ... }
}));
```

**BLE Message Format:**
```typescript
{ type: 'wifi_config' | 'device_config' | 'live_preview' | 'status' | 'error',
  payload: {...},
  timestamp?: number }
```

**AsyncStorage Keys:**
```typescript
`@busstop:device:${deviceId}:config`
`@busstop:device:${deviceId}:draft`
`@busstop:user:preferences`
```

**Error Handling:**
```typescript
try {
  await operation();
} catch (error) {
  handleError(error, 'ContextName');
}
```
