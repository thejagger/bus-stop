---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - 'docs/index.md'
  - 'docs/project-overview.md'
  - 'docs/architecture.md'
  - 'docs/technology-stack.md'
  - 'docs/source-tree-analysis.md'
  - 'docs/api-contracts.md'
  - 'docs/data-models.md'
  - 'docs/state-management.md'
  - 'docs/ui-components.md'
  - 'docs/development-guide.md'
  - 'docs/deployment-guide.md'
  - '_bmad-output/planning-artifacts/zet-api-documentation.md'
  - '_bmad-output/planning-artifacts/supabase-documentation.md'
workflowType: 'architecture'
project_name: 'bus-stop'
user_name: 'derjäger'
date: '2026-01-21'
lastStep: 8
status: 'complete'
completedAt: '2026-01-21'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

45 functional requirements organized into 6 categories:

1. **Device Setup & Onboarding (8 FRs):** Bluetooth BLE device discovery, WiFi configuration via Bluetooth, device registration, secure pairing
2. **Device Configuration (9 FRs):** Interactive map-based stop selection, line configuration, live preview via Bluetooth, auto-save
3. **Real-Time Data Display (6 FRs):** ZET API integration, automatic refresh (30-60s), error handling, display prioritization
4. **Device Management (6 FRs):** Status monitoring, remote verification/restart, troubleshooting, offline configuration
5. **Account Management (6 FRs):** Post-MVP - Multi-device support, authentication, device dashboard
6. **User Interface (5 FRs):** Native mobile app, intuitive navigation, error messaging

**Non-Functional Requirements:**

**Performance:**
- Map interface: <3s load time, progressive loading, smooth interactions
- App performance: <2s launch, <5s Bluetooth discovery, smooth setup flow
- Real-time updates: 30-60s refresh intervals, non-blocking, battery-efficient
- Display updates: <60s regardless of stop/line count

**Security:**
- Authentication: Supabase Auth (email/password, Google OAuth)
- Device keys: Validation on all access attempts, secure generation/storage
- BLE communication: Encrypted pairing, secure credential transfer
- Data protection: Standard Supabase security practices

**Reliability:**
- Error handling: User-friendly messages, error codes for debugging
- API integration: Graceful degradation, fallback behavior, retry mechanisms
- System availability: Core operations remain functional, automatic recovery

**Accessibility:**
- WCAG baseline compliance
- Screen reader support (VoiceOver/TalkBack)
- Touch target sizes (44x44 minimum)
- Platform-specific accessibility features

**Integration:**
- ZET API: Rate limiting, caching, error handling
- Supabase: Standard patterns, RLS policies
- Bluetooth BLE: Platform-specific APIs, permission handling

**Scale & Complexity:**

- **Primary domain:** Full-stack mobile + IoT (React Native app + ESP32 devices)
- **Complexity level:** Medium (brownfield project with existing patterns)
- **Estimated architectural components:** 7 major components
  - React Native mobile app (iOS/Android)
  - Supabase backend (database, auth, Edge Functions)
  - ESP32 device firmware
  - Bluetooth BLE communication layer
  - ZET API integration service
  - Data caching and synchronization layer
  - Device management and monitoring system

### Technical Constraints & Dependencies

**Platform Constraints:**
- React Native required for cross-platform mobile development
- iOS 13.0+ and Android 6.0+ minimum versions
- Location permission required for BLE scanning (both platforms)
- App Store distribution (iOS) and Google Play Store (Android)

**Hardware Constraints:**
- ESP32 devices must have BLE + WiFi capability
- E-ink display (wide format, monochrome)
- 4MB minimum flash storage
- No cellular fallback (WiFi only)

**External Dependencies:**
- ZET API (external transit data API)
  - Requires authentication (email/password)
  - Manual registration required (not available via API)
  - Rate limiting considerations
  - Caching strategy needed
- Supabase platform
  - PostgreSQL database (version 17)
  - Authentication service
  - Edge Functions for serverless operations
  - Real-time capabilities (Post-MVP)

**Library Dependencies:**
- @tranzithr/zet-api v1.0.3 (ZET API wrapper)
- @supabase/supabase-js v2.58.0 (Supabase client)
- react-native-ble-plx (Bluetooth BLE library)
- react-native-webview (for Leaflet.js map embedding)
- Leaflet.js + react-leaflet (map library)

### Cross-Cutting Concerns Identified

1. **Bluetooth BLE Communication**
   - Device discovery and pairing
   - WiFi credential transfer
   - Configuration data transfer
   - Live preview data exchange
   - Error handling and reconnection
   - Platform-specific permission handling

2. **Real-Time Data Synchronization**
   - Device polling backend every 30-60 seconds
   - Backend polling ZET API
   - Caching strategy (static data vs real-time data)
   - Rate limiting and error recovery
   - Offline capability and stale data handling

3. **Multi-Platform Mobile Development**
   - iOS and Android feature parity
   - Platform-specific Bluetooth APIs
   - Location permission handling
   - App store distribution
   - Version synchronization

4. **Device State Management**
   - Online/offline status tracking
   - Pairing mode activation
   - Configuration synchronization
   - Device heartbeat monitoring
   - Remote control capabilities

5. **External API Integration**
   - ZET API authentication and session management
   - Rate limiting and caching
   - Error handling and fallback
   - Data transformation for device display

6. **Data Persistence**
   - Local app storage (AsyncStorage) for configuration state
   - Backend database (Supabase) for device data
   - Offline configuration capability
   - Configuration recovery after app restart

## Starter Template Evaluation

### Primary Technology Domain

**React Native Mobile App** (iOS + Android) based on project requirements analysis.

### Technical Preferences from Existing Project

From existing project rules and patterns:
- **TypeScript** - Strict mode, full type safety
- **Supabase** - Backend platform (PostgreSQL, Auth, Edge Functions)
- **Zod** - Schema validation and type inference
- **TanStack Query** - Server state management and data fetching
- **Component reusability** - FormBuilder and DataTable patterns
- **Schema-first development** - Zod schemas for all data models

### Starter Options Considered

#### Option 1: Expo CLI with TypeScript (Recommended for 2026)

**Template:** Expo TypeScript template with Supabase integration

**Rationale:**
- **Expo CLI is now the recommended default** for React Native projects in 2026
- Better developer experience with faster setup and improved tooling
- Continuous Native Generation (CNG) support for easier React Native upgrades
- File-based routing with Expo Router
- Built-in environment variable and TypeScript support
- Development builds support custom native modules (including Bluetooth BLE)
- Over-the-air (OTA) updates capability
- Pre-configured Supabase starter templates available

**Initialization Command:**
```bash
npx create-expo-app BusStopApp --template blank-typescript
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript configured with strict mode
- Expo SDK with React Native runtime
- Metro bundler configured

**Development Experience:**
- Hot reloading and fast refresh
- Expo DevTools integration
- Built-in debugging support
- Environment variable management (`EXPO_PUBLIC_` prefix)

**Native Module Support:**
- Development builds required for custom native modules (Bluetooth BLE)
- Config plugins for native library integration
- Custom native modules via Expo Modules API
- Continuous Native Generation (CNG) for native code management

**What You'll Need to Add:**
- Supabase client integration (@supabase/supabase-js)
- Bluetooth BLE library (react-native-ble-plx v3.5.0 - compatible with Expo 51)
- TanStack Query setup (@tanstack/react-query)
- Zod validation (zod)
- React Navigation for routing
- Leaflet.js via react-native-webview for maps
- Development build setup for Bluetooth BLE support

---

#### Option 2: React Native CLI + TypeScript

**Template:** Official React Native Community TypeScript template

**Rationale:**
- Direct native module support without abstraction layers
- Full control over native iOS and Android code
- No development build requirements for custom native modules
- Standard React Native CLI workflow
- Better for projects requiring extensive native customization

**Initialization Command:**
```bash
npx @react-native-community/cli@latest init BusStopApp --template react-native-template-typescript
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript configured
- React Native runtime
- Metro bundler configured

**Native Projects:**
- iOS project (Xcode) included
- Android project (Gradle) included
- Direct access to native code

**Development Experience:**
- Hot reloading support
- Standard React Native development workflow
- Manual native dependency management

**What You'll Need to Add:**
- Supabase client integration
- Bluetooth BLE library (react-native-ble-plx v3.5.0)
- TanStack Query setup
- Zod validation
- React Navigation for routing
- Leaflet.js via react-native-webview for maps
- Manual native module linking and configuration

---

### Selected Starter: Expo CLI with TypeScript

**Rationale for Selection:**

1. **2026 Best Practice:** Expo CLI is now the officially recommended approach for React Native development
2. **Developer Experience:** Faster setup, better tooling, and easier React Native version upgrades
3. **Bluetooth BLE Support:** Development builds fully support custom native modules including react-native-ble-plx (v3.5.0 compatible with Expo 51)
4. **Supabase Integration:** Multiple well-maintained Supabase starter templates available
5. **Future-Proof:** Continuous Native Generation (CNG) simplifies React Native upgrades
6. **OTA Updates:** Over-the-air update capability for faster iteration
7. **Existing Patterns:** Can leverage existing TypeScript, Zod, and TanStack Query patterns from web app

**Initialization Command:**
```bash
npx create-expo-app BusStopApp --template blank-typescript
```

**Note:** After initialization, you'll need to:
1. Set up development builds for Bluetooth BLE support (`npx expo prebuild` + EAS Build or local build)
2. Add Supabase integration (consider using `expo-supabase-starter-kit` template as reference)
3. Install and configure react-native-ble-plx via config plugin
4. Add remaining dependencies (TanStack Query, Zod, React Navigation, etc.)

**Alternative:** If you prefer a more opinionated starter with Supabase pre-configured, consider using `expo-supabase-starter-kit` template as a base, then add Bluetooth BLE support.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Routing strategy (Expo Router)
- State management (Zustand + TanStack Query)
- API design pattern (REST)
- BLE communication protocol (JSON)
- Device key generation (UUID v4)
- CI/CD approach (EAS Build free tier)

**Important Decisions (Shape Architecture):**
- Component organization (Feature-based)
- Error handling strategy (Centralized with toast notifications)
- Caching strategy (TanStack Query + AsyncStorage)
- Environment configuration (Expo variables with separate configs)

**Deferred Decisions (Post-MVP):**
- Advanced caching layers (Redis)
- GraphQL migration (if needed)
- Binary BLE protocol optimization
- Advanced monitoring and analytics

### Frontend Architecture

#### Routing Strategy

**Decision:** Expo Router (file-based routing)

**Version:** v6.0.21 (stable, bundled with Expo SDK 54)

**Rationale:**
- Built into Expo ecosystem, no additional setup required
- File-based routing aligns with modern React patterns
- Type-safe routes with TypeScript
- Deep linking support for mobile apps
- Seamless integration with Expo development workflow

**Implementation Notes:**
- Use file-based routing structure (`app/` directory)
- Leverage Expo Router's navigation hooks (`useRouter`, `usePathname`)
- Configure deep linking for device setup flows
- Type-safe route parameters using TypeScript

**Affects:** All navigation flows, deep linking, route structure

---

#### Client State Management

**Decision:** Zustand for client state management

**Version:** v5.0.10 (latest, published January 12, 2026)

**Rationale:**
- Lightweight and minimal boilerplate
- Already established in project rules
- Complements TanStack Query (server state) perfectly
- Simple API for device connection state, UI state, offline configuration
- No context provider overhead

**Implementation Notes:**
- Use Zustand stores for:
  - Bluetooth device connection state
  - Offline configuration state
  - UI state (modals, loading states)
  - User preferences
- TanStack Query handles all server state (Supabase data, API responses)
- Clear separation: Zustand = client state, TanStack Query = server state

**Affects:** State management patterns, component architecture, offline support

---

#### Component Organization

**Decision:** Feature-based organization

**Rationale:**
- Aligns with domain-driven approach from existing web app
- Groups related functionality together (device setup, configuration, management)
- Easier to navigate and maintain as app grows
- Supports code splitting and lazy loading
- Matches existing project patterns

**Structure:**
```
app/
├── (tabs)/                    # Expo Router tabs
│   ├── devices/
│   ├── configure/
│   └── settings/
├── features/
│   ├── device-setup/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/           # Zustand stores
│   │   └── types/
│   ├── device-config/
│   ├── device-management/
│   └── map/
├── lib/                       # Shared utilities
│   ├── supabase/
│   ├── ble/
│   └── utils/
└── components/                # Shared UI components
```

**Affects:** Project structure, import paths, code organization

---

### API & Communication Patterns

#### API Design Pattern

**Decision:** REST API design

**Rationale:**
- Aligns with Supabase Edge Functions patterns
- Matches existing web app architecture
- Simple and straightforward for mobile app consumption
- Well-established patterns and tooling
- Easy to document and debug

**Implementation Notes:**
- Supabase Edge Functions for backend API endpoints
- RESTful resource naming conventions
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Error responses follow consistent structure

**Affects:** Backend API design, Edge Functions structure, error handling

---

#### Error Handling Strategy

**Decision:** Centralized error handling with toast notifications

**Rationale:**
- Consistent user experience across the app
- User-friendly error messages (as per PRD requirements)
- Error codes for debugging (as per PRD requirements)
- Toast notifications provide non-intrusive feedback
- Centralized error boundary catches unexpected errors

**Implementation Notes:**
- Global error boundary component
- Centralized error handler utility
- Toast notifications using `sonner` (already in project rules)
- Error codes for technical debugging
- User-friendly messages for common errors
- Error logging for production debugging

**Error Response Format:**
```typescript
{
  error: {
    code: string,        // Technical error code
    message: string,     // User-friendly message
    details?: any        // Additional context
  }
}
```

**Affects:** Error handling patterns, user experience, debugging workflow

---

#### Caching Strategy

**Decision:** TanStack Query caching + AsyncStorage for offline state

**Rationale:**
- TanStack Query provides excellent caching out-of-the-box
- AsyncStorage for offline device configuration state
- No additional caching layer needed for MVP
- TanStack Query handles API response caching automatically
- AsyncStorage persists configuration state across app restarts

**Implementation Notes:**
- TanStack Query cache configuration:
  - Stale time: 30-60 seconds for real-time data
  - Cache time: 5 minutes for static data
  - Automatic refetch on app focus
- AsyncStorage for:
  - Device configuration drafts
  - Offline configuration state
  - User preferences
- No Redis or additional caching layer for MVP

**Affects:** Data fetching patterns, offline support, performance

---

### Bluetooth BLE Communication

#### BLE Communication Protocol

**Decision:** JSON over BLE characteristics

**Rationale:**
- Simple and easy to debug
- Human-readable for development
- Flexible schema for different message types
- Easy to extend with new message types
- Sufficient for configuration and live preview data
- Can optimize later if needed (compression, binary protocol)

**Implementation Notes:**
- JSON message format:
  ```typescript
  {
    type: 'wifi_config' | 'device_config' | 'live_preview' | 'status',
    payload: any,
    timestamp?: number
  }
  ```
- UTF-8 encoding for JSON strings
- Characteristic-based communication (read/write/notify)
- Error handling for malformed JSON
- Message size limits (BLE MTU constraints)

**Future Optimization:** Consider binary protocol or compression if message sizes become an issue

**Affects:** BLE communication layer, device firmware, message parsing

---

#### Device Key Generation

**Decision:** UUID v4 generation

**Rationale:**
- UUID v4 is cryptographically random and unique
- Already used for Supabase IDs (consistency)
- Standard format, well-supported
- No collision risk for device keys
- Simple to generate and validate

**Implementation Notes:**
- Generate UUID v4 in mobile app during device registration
- Store in Supabase `device` table as primary key
- Validate on all device access attempts (as per PRD)
- Use standard UUID library (`uuid` npm package)
- Format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`

**Security Considerations:**
- UUID v4 provides sufficient uniqueness for device identification
- Additional security via Supabase RLS policies
- Device keys validated on backend (Edge Functions)

**Affects:** Device registration flow, database schema, security model

---

### Infrastructure & Deployment

#### CI/CD Approach

**Decision:** EAS Build (free tier)

**Rationale:**
- **Free tier includes:** 15 Android + 15 iOS builds/month (sufficient for MVP)
- Integrated with Expo workflow
- No additional setup required
- App store submission included
- Low-priority queue acceptable for MVP
- Can migrate to GitHub Actions later if needed

**Alternative Considered:** GitHub Actions
- Would require additional setup
- Need to configure build environments
- More complex for initial MVP
- EAS Build free tier is sufficient for MVP phase

**Implementation Notes:**
- Use EAS Build for:
  - Development builds (Bluetooth BLE support)
  - Production builds for App Store/Play Store
  - Over-the-air (OTA) updates
- Monitor build usage (15 builds/month limit)
- Consider paid plan ($19/month) if exceeding free tier limits

**Future Migration Path:** Can switch to GitHub Actions if build limits become an issue

**Affects:** Build workflow, deployment process, development builds

---

#### Environment Configuration

**Decision:** Expo environment variables with separate configs

**Rationale:**
- Built into Expo (`EXPO_PUBLIC_` prefix)
- Type-safe configuration
- Separate configs for dev/staging/prod
- No runtime configuration overhead
- Standard Expo pattern

**Implementation Notes:**
- Use `EXPO_PUBLIC_` prefix for public variables:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Separate `.env` files:
  - `.env.development`
  - `.env.staging`
  - `.env.production`
- Type-safe config using TypeScript
- Never commit `.env` files (use `.env.example`)

**Configuration Structure:**
```typescript
// app.config.ts
export default {
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  }
}
```

**Affects:** Configuration management, environment setup, deployment process

---

### Decision Impact Analysis

**Implementation Sequence:**

1. **Project Setup:**
   - Initialize Expo app with TypeScript template
   - Configure Expo Router (file-based routing)
   - Set up environment variables

2. **Core Infrastructure:**
   - Supabase client integration
   - TanStack Query setup
   - Zustand stores for client state
   - Error handling infrastructure

3. **Bluetooth BLE:**
   - Development build setup (EAS Build)
   - react-native-ble-plx integration
   - BLE communication layer (JSON protocol)
   - Device discovery and pairing

4. **Feature Development:**
   - Device setup flow
   - Device configuration (map-based)
   - Device management
   - Offline support (AsyncStorage)

5. **Polish & Deployment:**
   - Error handling refinement
   - Performance optimization
   - App store preparation
   - EAS Build configuration

**Cross-Component Dependencies:**

- **Expo Router** → Requires feature-based structure
- **Zustand + TanStack Query** → Clear separation of client vs server state
- **BLE JSON Protocol** → Affects device firmware implementation
- **UUID v4** → Used in both app and backend (Supabase)
- **EAS Build** → Required for Bluetooth BLE (development builds)
- **Environment Config** → Needed for Supabase connection in all environments

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
15+ areas where AI agents could make different choices without established patterns.

### Naming Patterns

#### Database Naming Conventions

**Established Patterns (from existing project):**
- **Tables:** Singular, lowercase with underscores (`device`, `device_stop_line`)
- **Columns:** Lowercase with underscores (`device_id`, `is_active`, `created_at`)
- **Foreign Keys:** `{table}_id` format (e.g., `device_id`, `stop_id`)
- **Indexes:** `idx_{table}_{column}` format (e.g., `idx_devices_code`)
- **Required Columns:** `id` (UUID v4), `is_active`, `is_deleted`, `created_at`, `modified_at`

**Examples:**
```sql
-- Table naming
CREATE TABLE device ( ... );
CREATE TABLE device_stop_line ( ... );

-- Column naming
device_id UUID NOT NULL,
device_name TEXT NOT NULL,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT NOW(),

-- Foreign keys
device_id UUID REFERENCES device(id),
stop_id UUID REFERENCES stop(id),

-- Indexes
CREATE INDEX idx_devices_code ON device(code) WHERE is_deleted = false;
```

**Enforcement:** All database migrations MUST follow these conventions.

---

#### API Naming Conventions

**REST Endpoint Patterns:**
- **Base paths:** Plural resource names (`/devices`, `/stops`, `/lines`)
- **Nested resources:** `/devices/{deviceId}/stops`
- **Route parameters:** Use `{id}` format in Expo Router, `:id` in Edge Functions
- **Query parameters:** snake_case (`device_id`, `is_active`)
- **HTTP Methods:** Standard REST (GET, POST, PUT, DELETE)

**Examples:**
```
GET    /devices                    # List all devices
GET    /devices/{deviceId}         # Get single device
POST   /devices                    # Create device
PUT    /devices/{deviceId}         # Update device
DELETE /devices/{deviceId}         # Delete device
GET    /devices/{deviceId}/stops   # Get device stops
```

**Edge Function Endpoints:**
```
POST /functions/v1/device-config
POST /functions/v1/device-heartbeat
POST /functions/v1/device-status
```

**Enforcement:** All API endpoints MUST follow RESTful conventions.

---

#### Code Naming Conventions

**React Native Components:**
- **Component files:** PascalCase (`DeviceCard.tsx`, `StopSelector.tsx`)
- **Component names:** PascalCase (`DeviceCard`, `StopSelector`)
- **Hook files:** camelCase with `use` prefix (`useDeviceStore.ts`, `useBleConnection.ts`)
- **Hook names:** camelCase with `use` prefix (`useDeviceStore`, `useBleConnection`)
- **Utility files:** camelCase (`deviceUtils.ts`, `bleHelpers.ts`)
- **Utility functions:** camelCase (`formatDeviceName`, `parseBleMessage`)

**Zustand Stores:**
- **Store files:** camelCase with `Store` suffix (`deviceStore.ts`, `bleStore.ts`)
- **Store hooks:** camelCase with `use` prefix (`useDeviceStore`, `useBleStore`)
- **Store names:** Feature-based (`useDeviceStore`, `useBleStore`, `useConfigStore`)

**Examples:**
```typescript
// Components
app/features/device-setup/components/DeviceCard.tsx
export function DeviceCard({ device }: { device: Device }) { ... }

// Hooks
app/features/device-setup/hooks/useDeviceStore.ts
export const useDeviceStore = create<DeviceState>((set) => ({ ... }));

// Utilities
app/lib/ble/bleHelpers.ts
export function parseBleMessage(data: string): BleMessage { ... }
```

**Enforcement:** All code MUST follow TypeScript/React naming conventions.

---

### Structure Patterns

#### Project Organization

**Expo Router File Structure:**
- **Route files:** Match route structure in `app/` directory
- **Feature organization:** Feature-based with co-located components, hooks, stores
- **Shared code:** `app/lib/` for utilities, `app/components/` for shared UI

**Directory Structure:**
```
app/
├── (tabs)/                          # Expo Router tab groups
│   ├── devices/
│   │   └── index.tsx               # Route: /devices
│   ├── configure/
│   │   └── index.tsx               # Route: /configure
│   └── settings/
│       └── index.tsx                # Route: /settings
├── devices/
│   ├── [deviceId]/
│   │   └── index.tsx               # Route: /devices/:deviceId
│   └── new/
│       └── index.tsx               # Route: /devices/new
├── features/                        # Feature modules
│   ├── device-setup/
│   │   ├── components/
│   │   │   ├── DeviceCard.tsx
│   │   │   └── SetupWizard.tsx
│   │   ├── hooks/
│   │   │   ├── useDeviceStore.ts
│   │   │   └── useBleConnection.ts
│   │   ├── stores/
│   │   │   └── deviceStore.ts
│   │   └── types/
│   │       └── device.types.ts
│   ├── device-config/
│   ├── device-management/
│   └── map/
├── lib/                             # Shared utilities
│   ├── supabase/
│   │   └── client.ts
│   ├── ble/
│   │   ├── bleClient.ts
│   │   └── bleHelpers.ts
│   └── utils/
│       └── errors.ts
└── components/                      # Shared UI components
    ├── ErrorBoundary.tsx
    └── LoadingSpinner.tsx
```

**Test Organization:**
- **Co-located tests:** `*.test.ts` or `*.test.tsx` next to source files
- **Test utilities:** `app/lib/test/` for test helpers
- **E2E tests:** `e2e/` directory at root (if needed)

**Examples:**
```
app/features/device-setup/
├── components/
│   ├── DeviceCard.tsx
│   └── DeviceCard.test.tsx        # Co-located test
├── hooks/
│   ├── useDeviceStore.ts
│   └── useDeviceStore.test.ts     # Co-located test
```

**Enforcement:** All files MUST follow this structure. No exceptions.

---

#### File Structure Patterns

**Configuration Files:**
- **Root level:** `app.config.ts`, `tsconfig.json`, `package.json`
- **Environment:** `.env.development`, `.env.staging`, `.env.production` (gitignored)
- **Example:** `.env.example` (committed)

**Static Assets:**
- **Images:** `assets/images/`
- **Fonts:** `assets/fonts/`
- **Icons:** Use Lucide React (no static icon files)

**Documentation:**
- **Architecture:** `_bmad-output/planning-artifacts/`
- **API docs:** `docs/api-contracts.md`
- **Development:** `docs/development-guide.md`

**Enforcement:** Follow Expo conventions for asset organization.

---

### Format Patterns

#### API Response Formats

**Supabase PostgREST Responses:**
- **Success:** Direct data response (no wrapper)
- **Error:** Supabase error format (handled by client)

**Edge Function Responses:**
- **Success:** `{ data: {...}, success: true }`
- **Error:** `{ error: { code: string, message: string, details?: any }, success: false }`

**Examples:**
```typescript
// Success response
{
  data: {
    id: "uuid",
    device_name: "Living Room Display",
    ...
  },
  success: true
}

// Error response
{
  error: {
    code: "DEVICE_NOT_FOUND",
    message: "Device not found",
    details: { deviceId: "..." }
  },
  success: false
}
```

**Enforcement:** All Edge Functions MUST use this response format.

---

#### Data Exchange Formats

**JSON Field Naming:**
- **Database/API:** snake_case (`device_id`, `created_at`)
- **TypeScript types:** camelCase (`deviceId`, `createdAt`) - transform in client
- **BLE Messages:** camelCase for consistency (`deviceId`, `wifiConfig`)

**Date Formats:**
- **Database:** ISO 8601 with timezone (`2026-01-21T10:30:00Z`)
- **API:** ISO 8601 strings
- **Display:** Use `date-fns` for formatting

**Boolean Representations:**
- **Always:** `true`/`false` (never `1`/`0` or `"true"`/`"false"`)

**Null Handling:**
- **Use:** `null` for missing values (not `undefined` in JSON)
- **Optional fields:** Use `z.nullish()` in Zod schemas

**Enforcement:** All data transformations MUST follow these conventions.

---

#### BLE Message Format

**Message Structure:**
```typescript
{
  type: 'wifi_config' | 'device_config' | 'live_preview' | 'status' | 'error',
  payload: {
    // Type-specific payload
  },
  timestamp?: number,  // Unix timestamp (milliseconds)
  requestId?: string    // For request/response correlation
}
```

**Message Types:**

**WiFi Config:**
```typescript
{
  type: 'wifi_config',
  payload: {
    ssid: string,
    password: string,
    security: 'WPA2' | 'WPA3' | 'OPEN'
  },
  timestamp: 1705849200000
}
```

**Device Config:**
```typescript
{
  type: 'device_config',
  payload: {
    stops: Array<{ stopId: string, lineIds: string[] }>,
    refreshInterval: number  // seconds
  },
  timestamp: 1705849200000
}
```

**Live Preview:**
```typescript
{
  type: 'live_preview',
  payload: {
    stops: Array<{
      stopId: string,
      stopName: string,
      arrivals: Array<{
        lineId: string,
        lineName: string,
        arrivalTime: number  // seconds until arrival
      }>
    }>
  },
  timestamp: 1705849200000
}
```

**Status:**
```typescript
{
  type: 'status',
  payload: {
    status: 'connected' | 'disconnected' | 'pairing' | 'error',
    message?: string,
    errorCode?: string
  },
  timestamp: 1705849200000
}
```

**Error:**
```typescript
{
  type: 'error',
  payload: {
    code: string,
    message: string,
    details?: any
  },
  timestamp: 1705849200000
}
```

**Enforcement:** All BLE messages MUST follow this structure.

---

### Communication Patterns

#### State Management Patterns

**Zustand Store Patterns:**
- **Store structure:** Feature-based stores (`useDeviceStore`, `useBleStore`)
- **State updates:** Immutable updates (use Immer if needed)
- **Actions:** camelCase with descriptive names (`connectDevice`, `disconnectDevice`)
- **Selectors:** Use Zustand selectors for performance

**Examples:**
```typescript
// Store definition
interface DeviceState {
  connectedDevice: Device | null;
  isConnecting: boolean;
  error: Error | null;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  connectedDevice: null,
  isConnecting: false,
  error: null,
  
  connectDevice: async (deviceId: string) => {
    set({ isConnecting: true, error: null });
    try {
      const device = await connectToDevice(deviceId);
      set({ connectedDevice: device, isConnecting: false });
    } catch (error) {
      set({ error, isConnecting: false });
    }
  },
  
  disconnectDevice: () => {
    set({ connectedDevice: null, error: null });
  }
}));

// Usage with selector
const connectedDevice = useDeviceStore((state) => state.connectedDevice);
const connectDevice = useDeviceStore((state) => state.connectDevice);
```

**TanStack Query Key Patterns:**
- **Format:** Array format for hierarchical keys
- **Structure:** `[resource, id?, subResource?, ...]`
- **Examples:**
  - `['devices']` - List all devices
  - `['devices', deviceId]` - Single device
  - `['devices', deviceId, 'stops']` - Device stops
  - `['devices', deviceId, 'config']` - Device configuration
  - `['stops', stopId, 'arrivals']` - Stop arrivals

**Examples:**
```typescript
// Query keys
const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: (filters: DeviceFilters) => [...deviceKeys.lists(), filters] as const,
  details: () => [...deviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...deviceKeys.details(), id] as const,
  config: (id: string) => [...deviceKeys.detail(id), 'config'] as const,
};

// Usage
useQuery({
  queryKey: deviceKeys.detail(deviceId),
  queryFn: () => deviceModel.loadData()
});
```

**Enforcement:** All query keys MUST use array format and follow this structure.

---

#### AsyncStorage Key Patterns

**Key Naming:**
- **Format:** Namespaced with `@busstop:` prefix
- **Structure:** `@busstop:{feature}:{resource}:{id?}:{subResource?}`
- **Examples:**
  - `@busstop:device:${deviceId}:config` - Device configuration
  - `@busstop:device:${deviceId}:draft` - Draft configuration
  - `@busstop:user:preferences` - User preferences
  - `@busstop:offline:queue` - Offline action queue

**Examples:**
```typescript
// Key constants
const STORAGE_KEYS = {
  deviceConfig: (deviceId: string) => `@busstop:device:${deviceId}:config`,
  deviceDraft: (deviceId: string) => `@busstop:device:${deviceId}:draft`,
  userPreferences: '@busstop:user:preferences',
  offlineQueue: '@busstop:offline:queue',
} as const;

// Usage
await AsyncStorage.setItem(
  STORAGE_KEYS.deviceConfig(deviceId),
  JSON.stringify(config)
);
```

**Enforcement:** All AsyncStorage keys MUST use namespaced format.

---

### Process Patterns

#### Error Handling Patterns

**Error Response Format:**
```typescript
{
  error: {
    code: string,        // Technical error code (e.g., "DEVICE_NOT_FOUND")
    message: string,     // User-friendly message
    details?: any        // Additional context for debugging
  }
}
```

**Error Codes:**
- **Format:** `UPPER_SNAKE_CASE` with descriptive names
- **Categories:**
  - `BLE_*` - Bluetooth errors (`BLE_CONNECTION_FAILED`, `BLE_DEVICE_NOT_FOUND`)
  - `DEVICE_*` - Device errors (`DEVICE_NOT_FOUND`, `DEVICE_OFFLINE`)
  - `NETWORK_*` - Network errors (`NETWORK_TIMEOUT`, `NETWORK_OFFLINE`)
  - `VALIDATION_*` - Validation errors (`VALIDATION_INVALID_STOP_ID`)
  - `API_*` - API errors (`API_RATE_LIMIT_EXCEEDED`)

**Error Handling Flow:**
1. Catch error in try-catch block
2. Transform to standardized error format
3. Log error (with details) for debugging
4. Show user-friendly toast notification
5. Return error response (if API)

**Examples:**
```typescript
// Error handling utility
export function handleError(error: unknown, context?: string) {
  const errorObj = {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    details: error
  };
  
  // Log for debugging
  console.error(`[${context}]`, error);
  
  // Show toast
  toast.error(errorObj.message);
  
  return errorObj;
}

// Usage
try {
  await connectToDevice(deviceId);
} catch (error) {
  handleError(error, 'DeviceConnection');
}
```

**Enforcement:** All errors MUST follow this format and handling pattern.

---

#### Loading State Patterns

**Loading State Management:**
- **TanStack Query:** Use `isLoading`, `isFetching` from queries
- **Zustand:** Use `isLoading` boolean in store state
- **UI:** Show loading indicators during async operations

**Loading State Naming:**
- **Format:** `is{Action}ing` or `isLoading`
- **Examples:** `isConnecting`, `isSaving`, `isLoading`

**Examples:**
```typescript
// TanStack Query
const { data, isLoading, isFetching } = useQuery({
  queryKey: deviceKeys.detail(deviceId),
  queryFn: () => deviceModel.loadData()
});

// Zustand
const isConnecting = useDeviceStore((state) => state.isConnecting);

// Combined
const isLoading = isLoading || isConnecting;
```

**Enforcement:** All loading states MUST use consistent naming.

---

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Follow naming conventions:**
   - Database: snake_case, singular tables
   - Components: PascalCase
   - Functions: camelCase
   - Constants: UPPER_SNAKE_CASE

2. **Follow structure patterns:**
   - Feature-based organization
   - Co-located tests
   - Expo Router file structure

3. **Follow format patterns:**
   - API responses: Consistent error format
   - BLE messages: Type-based structure
   - AsyncStorage: Namespaced keys

4. **Follow communication patterns:**
   - TanStack Query: Array-based keys
   - Zustand: Feature-based stores
   - Errors: Standardized error format

5. **Document deviations:**
   - If a pattern doesn't fit, document why
   - Update patterns document if needed
   - Get approval before deviating

**Pattern Enforcement:**

- **Code Review:** Check patterns in PR reviews
- **Linting:** Use ESLint rules where possible
- **Documentation:** Keep patterns document updated
- **Examples:** Provide examples for new patterns

**Pattern Updates:**

- **Process:** Discuss changes before implementing
- **Documentation:** Update this document immediately
- **Communication:** Notify team of pattern changes
- **Examples:** Update examples when patterns change

---

### Pattern Examples

#### Good Examples

**Component Structure:**
```typescript
// ✅ Good: PascalCase component, co-located types
// app/features/device-setup/components/DeviceCard.tsx
import { Device } from '../types/device.types';

export function DeviceCard({ device }: { device: Device }) {
  return <View>...</View>;
}
```

**Zustand Store:**
```typescript
// ✅ Good: Feature-based store, clear actions
export const useDeviceStore = create<DeviceState>((set) => ({
  connectDevice: async (deviceId: string) => { ... }
}));
```

**TanStack Query:**
```typescript
// ✅ Good: Array-based keys, hierarchical structure
const { data } = useQuery({
  queryKey: ['devices', deviceId, 'config'],
  queryFn: () => loadDeviceConfig(deviceId)
});
```

**BLE Message:**
```typescript
// ✅ Good: Type-based structure, clear payload
const message: BleMessage = {
  type: 'wifi_config',
  payload: { ssid: '...', password: '...' },
  timestamp: Date.now()
};
```

**AsyncStorage:**
```typescript
// ✅ Good: Namespaced key, consistent format
await AsyncStorage.setItem(
  '@busstop:device:123:config',
  JSON.stringify(config)
);
```

---

#### Anti-Patterns

**Component Naming:**
```typescript
// ❌ Bad: kebab-case component file
// device-card.tsx
export function DeviceCard() { ... }

// ✅ Good: PascalCase component file
// DeviceCard.tsx
export function DeviceCard() { ... }
```

**Query Keys:**
```typescript
// ❌ Bad: String-based keys
useQuery({
  queryKey: `device:${deviceId}:config`,
  ...
});

// ✅ Good: Array-based keys
useQuery({
  queryKey: ['devices', deviceId, 'config'],
  ...
});
```

**AsyncStorage Keys:**
```typescript
// ❌ Bad: Unnamespaced key
await AsyncStorage.setItem('deviceConfig', ...);

// ✅ Good: Namespaced key
await AsyncStorage.setItem('@busstop:device:123:config', ...);
```

**Error Handling:**
```typescript
// ❌ Bad: Inconsistent error format
catch (error) {
  toast.error(error.message);
}

// ✅ Good: Standardized error format
catch (error) {
  handleError(error, 'DeviceConnection');
}
```

**BLE Messages:**
```typescript
// ❌ Bad: Inconsistent structure
const message = { action: 'SET_WIFI', data: {...} };

// ✅ Good: Type-based structure
const message: BleMessage = {
  type: 'wifi_config',
  payload: {...}
};
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
bus-stop-mobile/
├── README.md                          # Project documentation
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── app.config.ts                     # Expo configuration
├── babel.config.js                   # Babel configuration
├── metro.config.js                   # Metro bundler configuration
├── .env.development                  # Development environment variables (gitignored)
├── .env.staging                      # Staging environment variables (gitignored)
├── .env.production                   # Production environment variables (gitignored)
├── .env.example                      # Example environment file (committed)
├── .gitignore                        # Git ignore rules
├── .eslintrc.js                      # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── eas.json                          # EAS Build configuration
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI workflow
├── app/                              # Expo Router app directory
│   ├── _layout.tsx                  # Root layout with providers
│   ├── (tabs)/                       # Tab navigation group
│   │   ├── _layout.tsx              # Tab layout
│   │   ├── devices/
│   │   │   └── index.tsx            # Route: /devices (device list)
│   │   ├── configure/
│   │   │   └── index.tsx            # Route: /configure (device config)
│   │   └── settings/
│   │       └── index.tsx            # Route: /settings
│   ├── devices/
│   │   ├── [deviceId]/
│   │   │   └── index.tsx           # Route: /devices/:deviceId (device detail)
│   │   └── new/
│   │       └── index.tsx           # Route: /devices/new (setup wizard)
│   ├── setup/
│   │   └── index.tsx                # Route: /setup (device setup flow)
│   └── +not-found.tsx               # 404 page
├── app/features/                     # Feature modules (feature-based organization)
│   ├── device-setup/                 # FR Category 1: Device Setup & Onboarding
│   │   ├── components/
│   │   │   ├── DeviceDiscovery.tsx  # BLE device scanning UI
│   │   │   ├── DeviceCard.tsx       # Device card component
│   │   │   ├── SetupWizard.tsx      # Multi-step setup wizard
│   │   │   ├── WifiConfigForm.tsx   # WiFi configuration form
│   │   │   └── PairingIndicator.tsx # BLE pairing status indicator
│   │   ├── hooks/
│   │   │   ├── useBleDiscovery.ts   # BLE device discovery hook
│   │   │   ├── useBleConnection.ts  # BLE connection management
│   │   │   ├── useDeviceSetup.ts    # Device setup flow logic
│   │   │   └── useWifiConfig.ts     # WiFi configuration logic
│   │   ├── stores/
│   │   │   ├── bleStore.ts          # BLE connection state (Zustand)
│   │   │   └── setupStore.ts        # Setup flow state (Zustand)
│   │   ├── types/
│   │   │   ├── device.types.ts       # Device type definitions
│   │   │   └── ble.types.ts         # BLE message types
│   │   └── utils/
│   │       ├── bleHelpers.ts         # BLE message parsing/formatting
│   │       └── deviceHelpers.ts     # Device utility functions
│   ├── device-config/                # FR Category 2: Device Configuration
│   │   ├── components/
│   │   │   ├── StopSelector.tsx     # Map-based stop selection
│   │   │   ├── LineSelector.tsx      # Line/direction selection
│   │   │   ├── ConfigPreview.tsx      # Live preview component
│   │   │   ├── ConfigSummary.tsx     # Configuration summary view
│   │   │   └── MapView.tsx          # Leaflet.js map wrapper
│   │   ├── hooks/
│   │   │   ├── useStopSelection.ts   # Stop selection logic
│   │   │   ├── useLineSelection.ts   # Line selection logic
│   │   │   ├── useConfigPreview.ts   # Live preview via BLE
│   │   │   └── useAutoSave.ts        # Auto-save functionality
│   │   ├── stores/
│   │   │   └── configStore.ts       # Configuration state (Zustand)
│   │   ├── types/
│   │   │   └── config.types.ts      # Configuration type definitions
│   │   └── utils/
│   │       └── configHelpers.ts     # Configuration utilities
│   ├── device-management/           # FR Category 4: Device Management
│   │   ├── components/
│   │   │   ├── DeviceStatus.tsx     # Device status display
│   │   │   ├── DeviceActions.tsx     # Remote actions (restart, verify)
│   │   │   ├── TroubleshootingGuide.tsx # Troubleshooting UI
│   │   │   └── StatusIndicator.tsx  # Online/offline indicator
│   │   ├── hooks/
│   │   │   ├── useDeviceStatus.ts    # Device status monitoring
│   │   │   ├── useDeviceActions.ts   # Remote device actions
│   │   │   └── useHeartbeat.ts       # Device heartbeat monitoring
│   │   ├── stores/
│   │   │   └── managementStore.ts    # Management state (Zustand)
│   │   └── types/
│   │       └── management.types.ts   # Management type definitions
│   ├── real-time-display/            # FR Category 3: Real-Time Data Display
│   │   ├── components/
│   │   │   ├── ArrivalDisplay.tsx    # Arrival time display
│   │   │   ├── LineDisplay.tsx        # Line information display
│   │   │   └── RefreshIndicator.tsx   # Refresh status indicator
│   │   ├── hooks/
│   │   │   ├── useArrivalData.ts      # Arrival data fetching
│   │   │   └── useAutoRefresh.ts     # Auto-refresh logic
│   │   └── types/
│   │       └── arrival.types.ts      # Arrival data types
│   ├── account/                      # FR Category 5: Account Management (Post-MVP)
│   │   ├── components/
│   │   │   ├── LoginForm.tsx         # Authentication UI
│   │   │   ├── DeviceDashboard.tsx   # Multi-device dashboard
│   │   │   └── ProfileSettings.tsx   # User profile settings
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Authentication hook
│   │   │   └── useUserProfile.ts    # User profile management
│   │   └── stores/
│   │       └── authStore.ts          # Authentication state (Zustand)
│   └── map/                          # Shared map functionality
│       ├── components/
│       │   ├── MapContainer.tsx      # Leaflet.js container
│       │   ├── StopMarker.tsx         # Stop marker component
│       │   └── MapControls.tsx       # Map control buttons
│       ├── hooks/
│       │   └── useMapInteractions.ts # Map interaction logic
│       └── types/
│           └── map.types.ts          # Map type definitions
├── app/lib/                          # Shared libraries and utilities
│   ├── supabase/
│   │   ├── client.ts                 # Supabase client initialization
│   │   ├── models/                    # BaseModel classes
│   │   │   ├── device.model.ts       # Device model
│   │   │   ├── stop.model.ts         # Stop model
│   │   │   └── line.model.ts         # Line model
│   │   └── queries/                  # Query key factories
│   │       ├── deviceKeys.ts          # Device query keys
│   │       ├── stopKeys.ts            # Stop query keys
│   │       └── lineKeys.ts           # Line query keys
│   ├── ble/
│   │   ├── bleClient.ts               # BLE client wrapper
│   │   ├── bleHelpers.ts              # BLE utility functions
│   │   ├── messageTypes.ts            # BLE message type definitions
│   │   └── constants.ts              # BLE constants (UUIDs, etc.)
│   ├── storage/
│   │   ├── asyncStorage.ts            # AsyncStorage wrapper
│   │   └── storageKeys.ts             # Storage key constants
│   ├── errors/
│   │   ├── errorHandler.ts            # Centralized error handler
│   │   ├── errorCodes.ts              # Error code constants
│   │   └── errorTypes.ts              # Error type definitions
│   ├── utils/
│   │   ├── dateUtils.ts               # Date formatting utilities
│   │   ├── validation.ts              # Validation helpers
│   │   └── constants.ts               # App-wide constants
│   └── types/
│       └── global.types.ts            # Global type definitions
├── app/components/                   # Shared UI components
│   ├── ErrorBoundary.tsx              # Global error boundary
│   ├── LoadingSpinner.tsx             # Loading indicator
│   ├── EmptyState.tsx                 # Empty state component
│   ├── Button.tsx                     # Button component
│   ├── Card.tsx                       # Card component
│   └── Toast.tsx                      # Toast notification wrapper
├── assets/                            # Static assets
│   ├── images/                        # Image assets
│   ├── fonts/                         # Custom fonts (if any)
│   └── icons/                         # Static icons (use Lucide React instead)
├── supabase/                          # Supabase backend code
│   ├── functions/                     # Edge Functions
│   │   ├── device-config/
│   │   │   └── index.ts              # Device configuration endpoint
│   │   ├── device-heartbeat/
│   │   │   └── index.ts              # Device heartbeat endpoint
│   │   ├── device-status/
│   │   │   └── index.ts              # Device status endpoint
│   │   └── device-schedule/
│   │       └── index.ts              # Device schedule data endpoint
│   └── migrations/                    # Database migrations
│       ├── 20240103000000_add_device_status_fields.sql
│       └── ...                        # Additional migrations
├── tests/                             # Test files (co-located with source)
│   ├── __mocks__/                     # Test mocks
│   │   ├── react-native-ble-plx.ts   # BLE mock
│   │   └── @supabase-supabase-js.ts  # Supabase mock
│   └── utils/                         # Test utilities
│       └── testHelpers.ts             # Test helper functions
├── docs/                              # Documentation
│   ├── api-contracts.md               # API documentation
│   ├── development-guide.md           # Development guide
│   └── deployment-guide.md            # Deployment guide
└── _bmad-output/                      # BMAD workflow outputs
    └── planning-artifacts/
        ├── prd.md                     # Product Requirements Document
        └── architecture.md             # This document
```

### Architectural Boundaries

#### API Boundaries

**External APIs:**
- **Supabase:** `app/lib/supabase/client.ts` - Single entry point for all Supabase operations
- **ZET API:** Backend Edge Functions proxy ZET API calls (no direct client access)
- **BLE:** `app/lib/ble/bleClient.ts` - Single entry point for all BLE operations

**Edge Function Endpoints:**
- `/functions/v1/device-config` - Device configuration management
- `/functions/v1/device-heartbeat` - Device heartbeat monitoring
- `/functions/v1/device-status` - Device status queries
- `/functions/v1/device-schedule` - Schedule data for devices

**Boundary Rules:**
- Mobile app NEVER calls ZET API directly (always via Edge Functions)
- All database operations go through BaseModel classes
- BLE operations isolated to `app/lib/ble/` and feature hooks

---

#### Component Boundaries

**Feature Module Boundaries:**
- Each feature (`device-setup`, `device-config`, etc.) is self-contained
- Features communicate via:
  - Shared Zustand stores (when needed)
  - TanStack Query cache (for server state)
  - Expo Router navigation (for screen transitions)
  - Event system (for cross-feature events)

**Component Communication Patterns:**
- **Parent → Child:** Props
- **Child → Parent:** Callback functions
- **Sibling Components:** Shared Zustand store or TanStack Query cache
- **Cross-Feature:** Navigation params or shared stores

**Boundary Rules:**
- Components within a feature can import from same feature freely
- Components should NOT import from other features directly
- Shared components live in `app/components/`
- Shared utilities live in `app/lib/`

---

#### Service Boundaries

**State Management Boundaries:**
- **Zustand:** Client state (BLE connection, UI state, offline config)
- **TanStack Query:** Server state (Supabase data, API responses)
- **AsyncStorage:** Persistent offline state (config drafts, preferences)

**Data Flow Boundaries:**
```
User Action
  ↓
Component Event Handler
  ↓
Zustand Action (client state) OR TanStack Query Mutation (server state)
  ↓
Service Layer (BLE client, Supabase client)
  ↓
External Service (BLE device, Supabase backend)
  ↓
Response
  ↓
State Update (Zustand store OR TanStack Query cache)
  ↓
UI Re-render
```

**Boundary Rules:**
- Never mix Zustand and TanStack Query for same data
- Clear separation: Zustand = client state, TanStack Query = server state
- AsyncStorage only for persistence, not as primary state store

---

#### Data Boundaries

**Database Schema Boundaries:**
- **Tables:** Defined in Supabase migrations
- **Models:** BaseModel classes in `app/lib/supabase/models/`
- **Access:** All database access via BaseModel methods
- **Validation:** Zod schemas in model files

**Data Access Patterns:**
- **Read:** TanStack Query + BaseModel `getAllQuery()` or `loadData()`
- **Write:** TanStack Query mutations + BaseModel `upsert()` or `delete()`
- **Cache:** TanStack Query automatic caching
- **Offline:** AsyncStorage for drafts, TanStack Query for server data

**Boundary Rules:**
- Never use raw Supabase client directly (always via BaseModel)
- All data validation via Zod schemas
- Database schema changes only via migrations

---

### Requirements to Structure Mapping

#### Feature/FR Category Mapping

**FR Category 1: Device Setup & Onboarding (8 FRs)**
- **Location:** `app/features/device-setup/`
- **Routes:** `/setup`, `/devices/new`
- **Components:** DeviceDiscovery, SetupWizard, WifiConfigForm
- **Stores:** bleStore, setupStore
- **Hooks:** useBleDiscovery, useBleConnection, useDeviceSetup
- **Models:** device.model.ts
- **Edge Functions:** None (direct BLE communication)

**FR Category 2: Device Configuration (9 FRs)**
- **Location:** `app/features/device-config/`
- **Routes:** `/devices/[deviceId]`, `/configure`
- **Components:** StopSelector, LineSelector, ConfigPreview, MapView
- **Stores:** configStore
- **Hooks:** useStopSelection, useLineSelection, useConfigPreview, useAutoSave
- **Models:** device.model.ts, stop.model.ts, line.model.ts
- **Edge Functions:** `device-config`

**FR Category 3: Real-Time Data Display (6 FRs)**
- **Location:** `app/features/real-time-display/`
- **Routes:** Integrated into device detail view
- **Components:** ArrivalDisplay, LineDisplay, RefreshIndicator
- **Hooks:** useArrivalData, useAutoRefresh
- **Models:** stop.model.ts, line.model.ts
- **Edge Functions:** `device-schedule`

**FR Category 4: Device Management (6 FRs)**
- **Location:** `app/features/device-management/`
- **Routes:** `/devices/[deviceId]` (management section)
- **Components:** DeviceStatus, DeviceActions, TroubleshootingGuide
- **Stores:** managementStore
- **Hooks:** useDeviceStatus, useDeviceActions, useHeartbeat
- **Models:** device.model.ts
- **Edge Functions:** `device-status`, `device-heartbeat`

**FR Category 5: Account Management (6 FRs - Post-MVP)**
- **Location:** `app/features/account/`
- **Routes:** `/settings`, `/login` (Post-MVP)
- **Components:** LoginForm, DeviceDashboard, ProfileSettings
- **Stores:** authStore
- **Hooks:** useAuth, useUserProfile
- **Models:** profile.model.ts (Post-MVP)
- **Edge Functions:** None (uses Supabase Auth)

**FR Category 6: User Interface (5 FRs)**
- **Location:** `app/components/` (shared), feature-specific components
- **Routes:** All routes
- **Components:** ErrorBoundary, LoadingSpinner, EmptyState, Button, Card
- **Hooks:** None (presentational components)
- **Stores:** None (presentational components)

---

#### Cross-Cutting Concerns

**Bluetooth BLE Communication:**
- **Location:** `app/lib/ble/`
- **Used by:** `device-setup`, `device-config` features
- **Boundary:** Single BLE client instance, shared across features

**Error Handling:**
- **Location:** `app/lib/errors/`
- **Used by:** All features
- **Boundary:** Centralized error handler, consistent error format

**State Management:**
- **Location:** Feature stores in `app/features/{feature}/stores/`
- **Used by:** Feature-specific components
- **Boundary:** Feature stores isolated, shared stores in `app/lib/` if needed

**Data Models:**
- **Location:** `app/lib/supabase/models/`
- **Used by:** All features via TanStack Query
- **Boundary:** BaseModel pattern, Zod validation

**Map Functionality:**
- **Location:** `app/features/map/`
- **Used by:** `device-config` feature
- **Boundary:** Shared map components, Leaflet.js via WebView

---

### Integration Points

#### Internal Communication

**Component Communication:**
- **Props:** Parent → Child data flow
- **Callbacks:** Child → Parent events
- **Zustand:** Cross-component client state
- **TanStack Query:** Cross-component server state
- **Navigation:** Expo Router for screen transitions

**State Synchronization:**
- **Server State:** TanStack Query cache invalidation
- **Client State:** Zustand store updates
- **Offline State:** AsyncStorage persistence

**Event Flow:**
```
User Action (Component)
  ↓
Event Handler (Component)
  ↓
Zustand Action OR TanStack Query Mutation
  ↓
Service Layer (BLE Client, Supabase Client)
  ↓
External Service Response
  ↓
State Update (Zustand Store OR TanStack Query Cache)
  ↓
Component Re-render (React)
```

---

#### External Integrations

**Supabase Integration:**
- **Entry Point:** `app/lib/supabase/client.ts`
- **Models:** `app/lib/supabase/models/`
- **Edge Functions:** `supabase/functions/`
- **Authentication:** Supabase Auth (Post-MVP)

**Bluetooth BLE Integration:**
- **Entry Point:** `app/lib/ble/bleClient.ts`
- **Library:** `react-native-ble-plx`
- **Features:** Device discovery, connection, message exchange

**ZET API Integration:**
- **Entry Point:** Backend Edge Functions (no direct client access)
- **Proxy:** `supabase/functions/device-schedule/`
- **Data Flow:** Device → Backend → ZET API → Backend → Device

**Map Integration:**
- **Library:** Leaflet.js via `react-native-webview`
- **Components:** `app/features/map/components/`
- **Tiles:** OpenStreetMap

---

#### Data Flow

**Device Setup Flow:**
```
1. User opens app → /setup route
2. BLE discovery starts → useBleDiscovery hook
3. Device found → bleStore updated
4. User selects device → SetupWizard component
5. WiFi config entered → useWifiConfig hook
6. Config sent via BLE → bleClient.sendMessage()
7. Device connects to WiFi → Device registered
8. Device ID saved → AsyncStorage + Supabase
9. Navigate to device config → /devices/[deviceId]
```

**Device Configuration Flow:**
```
1. User opens device → /devices/[deviceId] route
2. Load device data → TanStack Query + device.model.ts
3. User selects stops → StopSelector component
4. Stops saved → useAutoSave hook
5. Config persisted → AsyncStorage (draft) + Supabase (final)
6. Live preview → useConfigPreview hook → BLE message
7. Device updates display → Device firmware renders
```

**Real-Time Data Flow:**
```
1. Device polls backend → Edge Function /device-schedule
2. Backend fetches ZET API → ZET API wrapper
3. Data cached → Backend cache (30-60s)
4. Data returned → Device receives schedule
5. Device updates display → E-ink display refresh
6. App shows status → DeviceStatus component
```

---

### File Organization Patterns

#### Configuration Files

**Root Level:**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `app.config.ts` - Expo configuration
- `eas.json` - EAS Build configuration
- `.env.*` - Environment variables (gitignored)
- `.env.example` - Example environment file (committed)

**Pattern:** All configuration at root level, environment-specific files gitignored.

---

#### Source Organization

**Feature-Based Structure:**
- Each feature in `app/features/{feature-name}/`
- Feature contains: `components/`, `hooks/`, `stores/`, `types/`, `utils/`
- Shared code in `app/lib/` or `app/components/`

**Pattern:** Features are self-contained, shared code is extracted to `lib/` or `components/`.

---

#### Test Organization

**Co-Located Tests:**
- Test files next to source: `Component.tsx` → `Component.test.tsx`
- Test utilities in `tests/utils/`
- Mocks in `tests/__mocks__/`

**Pattern:** Tests live next to source files, not in separate test directory.

---

#### Asset Organization

**Static Assets:**
- Images: `assets/images/`
- Fonts: `assets/fonts/`
- Icons: Use Lucide React (no static icon files)

**Pattern:** Minimal static assets, prefer code-based solutions (Lucide React for icons).

---

### Development Workflow Integration

**Development Server Structure:**
- `expo start` - Starts Metro bundler
- `expo start --dev-client` - Development build
- Hot reloading enabled for all TypeScript/TSX files
- Fast refresh for React components

**Build Process Structure:**
- `eas build` - Creates development or production builds
- `eas build --platform ios` - iOS build
- `eas build --platform android` - Android build
- Build artifacts stored in EAS cloud

**Deployment Structure:**
- Development builds: EAS Build (free tier: 15/month)
- Production builds: EAS Build → App Store/Play Store
- OTA updates: `eas update` for JavaScript bundle updates
- Native updates: Require new build via EAS Build

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

All architectural decisions are compatible and work together seamlessly:

- **Expo CLI + TypeScript:** Fully compatible, Expo Router integrates perfectly
- **Zustand + TanStack Query:** Clear separation of concerns (client vs server state)
- **Supabase + REST API:** Standard integration pattern, well-supported
- **react-native-ble-plx + Expo:** Compatible via development builds (v3.5.0 supports Expo 51)
- **Leaflet.js + WebView:** Standard React Native pattern for web-based maps
- **UUID v4 + Supabase:** Native UUID support in PostgreSQL, consistent format

**Version Compatibility:**
- Expo SDK 54 + Expo Router 6.0.21 ✅
- React Native 0.74+ + react-native-ble-plx 3.5.0 ✅
- TypeScript 5.9 + Zod v4 ✅
- TanStack Query v5 + Zustand 5.0.10 ✅
- Supabase JS v2.58.0 + PostgreSQL 17 ✅

**Pattern Consistency:**

All implementation patterns align with architectural decisions:

- **Naming:** Consistent snake_case (DB) → camelCase (TypeScript) transformation
- **Structure:** Feature-based organization supports Expo Router file-based routing
- **State Management:** Clear boundaries between Zustand (client) and TanStack Query (server)
- **Error Handling:** Centralized pattern supports all error sources (BLE, API, network)
- **BLE Communication:** JSON protocol aligns with TypeScript type safety

**Structure Alignment:**

Project structure fully supports all architectural decisions:

- **Expo Router:** File-based routing structure (`app/` directory) ✅
- **Feature Modules:** Self-contained features with clear boundaries ✅
- **Shared Libraries:** Centralized utilities (`app/lib/`) ✅
- **State Management:** Feature stores co-located with features ✅
- **Models:** BaseModel pattern in `app/lib/supabase/models/` ✅

**No Contradictory Decisions Found:** All decisions are coherent and mutually supportive.

---

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

**FR Category 1: Device Setup & Onboarding (8 FRs)**
- ✅ BLE device discovery → `app/features/device-setup/` with `useBleDiscovery` hook
- ✅ WiFi configuration via Bluetooth → `WifiConfigForm` component + BLE message protocol
- ✅ Device registration → `device.model.ts` + UUID v4 generation
- ✅ Secure pairing → BLE encryption + device key validation
- **Architectural Support:** Complete - BLE client, device models, setup flow all defined

**FR Category 2: Device Configuration (9 FRs)**
- ✅ Interactive map-based stop selection → `StopSelector` component + Leaflet.js via WebView
- ✅ Line/direction selection → `LineSelector` component
- ✅ Auto-save → `useAutoSave` hook + AsyncStorage persistence
- ✅ Live preview via Bluetooth → `useConfigPreview` hook + BLE message protocol
- **Architectural Support:** Complete - Map integration, config state management, BLE preview all defined

**FR Category 3: Real-Time Data Display (6 FRs)**
- ✅ ZET API integration → Backend Edge Functions (`device-schedule`)
- ✅ Automatic refresh (30-60s) → TanStack Query stale time configuration
- ✅ Error handling → Centralized error handler + user-friendly messages
- ✅ Display prioritization → Backend logic in Edge Functions
- **Architectural Support:** Complete - Backend integration, caching strategy, error handling all defined

**FR Category 4: Device Management (6 FRs)**
- ✅ Status monitoring → `useDeviceStatus` hook + Edge Function `device-status`
- ✅ Remote verification → `useDeviceActions` hook + Edge Functions
- ✅ Remote restart → Device actions via Edge Functions
- ✅ Troubleshooting → `TroubleshootingGuide` component
- **Architectural Support:** Complete - Management features, Edge Functions, status monitoring all defined

**FR Category 5: Account Management (6 FRs - Post-MVP)**
- ✅ Multi-device support → Post-MVP feature structure defined
- ✅ Authentication → Supabase Auth integration pattern documented
- ✅ Device dashboard → `DeviceDashboard` component structure defined
- **Architectural Support:** Complete - Post-MVP structure prepared, can be implemented when needed

**FR Category 6: User Interface (5 FRs)**
- ✅ Native mobile app → Expo React Native architecture ✅
- ✅ Intuitive navigation → Expo Router with tab navigation ✅
- ✅ Error messaging → Centralized error handling + toast notifications ✅
- **Architectural Support:** Complete - All UI requirements architecturally supported

**All 45 Functional Requirements:** ✅ Architecturally supported

---

**Non-Functional Requirements Coverage:**

**Performance Requirements:**
- ✅ Map interface <3s load → Leaflet.js via WebView, progressive loading pattern
- ✅ App launch <2s → Expo optimization, code splitting ready
- ✅ BLE discovery <5s → BLE client optimization, efficient scanning
- ✅ Real-time updates 30-60s → TanStack Query stale time configuration
- ✅ Display updates <60s → Backend polling strategy defined
- **Architectural Support:** Complete - All performance targets architecturally achievable

**Security Requirements:**
- ✅ Authentication → Supabase Auth (email/password, Google OAuth) ✅
- ✅ Device keys → UUID v4 generation + backend validation ✅
- ✅ BLE encryption → BLE secure pairing protocol ✅
- ✅ Data protection → Supabase RLS policies + standard security practices ✅
- **Architectural Support:** Complete - All security requirements addressed

**Reliability Requirements:**
- ✅ Error handling → Centralized error handler with user-friendly messages ✅
- ✅ Error codes → Standardized error code system defined ✅
- ✅ Graceful degradation → Error handling patterns support fallback behavior ✅
- ✅ Retry mechanisms → TanStack Query retry configuration ✅
- ✅ Automatic recovery → Error recovery patterns defined ✅
- **Architectural Support:** Complete - Reliability patterns comprehensively defined

**Accessibility Requirements:**
- ✅ WCAG baseline → React Native accessibility APIs ✅
- ✅ Screen reader support → VoiceOver/TalkBack integration ready ✅
- ✅ Touch targets 44x44 → UI component patterns support this ✅
- ✅ Platform accessibility → React Native accessibility features ✅
- **Architectural Support:** Complete - Accessibility requirements architecturally supported

**Integration Requirements:**
- ✅ ZET API → Backend Edge Functions proxy pattern ✅
- ✅ Rate limiting → Backend caching strategy defined ✅
- ✅ Supabase → Standard integration patterns ✅
- ✅ BLE → Platform-specific API handling defined ✅
- **Architectural Support:** Complete - All integration requirements addressed

**All Non-Functional Requirements:** ✅ Architecturally supported

---

### Implementation Readiness Validation ✅

**Decision Completeness:**

**Critical Decisions Documented:**
- ✅ Starter template: Expo CLI with TypeScript (command provided)
- ✅ Routing: Expo Router v6.0.21 (version specified)
- ✅ State management: Zustand 5.0.10 + TanStack Query v5 (versions specified)
- ✅ API design: REST pattern (structure defined)
- ✅ BLE protocol: JSON over BLE (message structure defined)
- ✅ Device keys: UUID v4 (generation pattern defined)
- ✅ CI/CD: EAS Build free tier (limits documented)
- ✅ Environment: Expo variables (structure defined)

**Implementation Patterns:**
- ✅ Naming conventions: Comprehensive (DB, API, code, components)
- ✅ Structure patterns: Complete (feature-based, co-located tests)
- ✅ Format patterns: Complete (API responses, BLE messages, AsyncStorage)
- ✅ Communication patterns: Complete (TanStack Query keys, Zustand stores)
- ✅ Process patterns: Complete (error handling, loading states)

**Consistency Rules:**
- ✅ Enforcement guidelines: Clear and actionable
- ✅ Pattern examples: Good examples and anti-patterns provided
- ✅ Conflict prevention: All major conflict points addressed

**All Critical Decisions:** ✅ Fully documented with versions and rationale

---

**Structure Completeness:**

**Project Structure:**
- ✅ Complete directory tree: All files and directories specified
- ✅ Feature mapping: All FR categories mapped to directories
- ✅ Integration points: All boundaries clearly defined
- ✅ Component boundaries: Clear separation between features
- ✅ Shared code: Centralized libraries and components defined

**File Organization:**
- ✅ Configuration files: All config files specified
- ✅ Source organization: Feature-based structure complete
- ✅ Test organization: Co-located test pattern defined
- ✅ Asset organization: Minimal assets pattern defined

**All Structural Elements:** ✅ Complete and specific

---

**Pattern Completeness:**

**Naming Patterns:**
- ✅ Database naming: snake_case, singular tables ✅
- ✅ API naming: RESTful plural endpoints ✅
- ✅ Component naming: PascalCase files and names ✅
- ✅ Store naming: Feature-based Zustand stores ✅
- ✅ Query key naming: Array-based hierarchical keys ✅
- ✅ Storage key naming: Namespaced AsyncStorage keys ✅

**Structure Patterns:**
- ✅ Feature organization: Self-contained feature modules ✅
- ✅ File structure: Expo Router file-based routing ✅
- ✅ Test location: Co-located test files ✅
- ✅ Shared code: Centralized libraries ✅

**Format Patterns:**
- ✅ API responses: Consistent error format ✅
- ✅ BLE messages: Type-based JSON structure ✅
- ✅ Data formats: snake_case → camelCase transformation ✅
- ✅ Date formats: ISO 8601 strings ✅

**Communication Patterns:**
- ✅ TanStack Query: Array-based keys with factories ✅
- ✅ Zustand: Feature-based stores with actions ✅
- ✅ Error handling: Centralized with toast notifications ✅
- ✅ Loading states: Consistent naming conventions ✅

**All Pattern Categories:** ✅ Comprehensive and complete

---

### Gap Analysis Results

**Critical Gaps:** None identified ✅

All critical architectural decisions are complete and implementation can proceed.

**Important Gaps (Non-Blocking):**

1. **Device Firmware Architecture:**
   - **Gap:** ESP32 firmware architecture not fully specified
   - **Impact:** Device-side implementation needs separate architecture document
   - **Status:** Acceptable - firmware is separate system, can be documented separately
   - **Recommendation:** Create firmware architecture document when implementing device code

2. **Testing Strategy:**
   - **Gap:** Testing patterns mentioned but not detailed (unit, integration, E2E)
   - **Impact:** Testing approach needs clarification during implementation
   - **Status:** Acceptable - testing patterns can be refined during development
   - **Recommendation:** Define testing strategy in first implementation sprint

3. **Performance Monitoring:**
   - **Gap:** Performance monitoring and analytics not specified
   - **Impact:** Performance optimization may need additional tooling
   - **Status:** Acceptable - can be added post-MVP
   - **Recommendation:** Add performance monitoring tools during MVP refinement

**Nice-to-Have Gaps:**

1. **Development Tooling:**
   - Additional ESLint rules for pattern enforcement
   - Pre-commit hooks for pattern validation
   - Storybook for component documentation (Post-MVP)

2. **Documentation:**
   - API documentation generation (OpenAPI/Swagger)
   - Component storybook (Post-MVP)
   - Architecture decision records (ADRs) for future decisions

3. **Optimization:**
   - Code splitting strategy details
   - Image optimization patterns
   - Bundle size optimization guidelines

**Overall Gap Assessment:** ✅ Architecture is complete for MVP implementation. Identified gaps are non-critical and can be addressed during development or post-MVP.

---

### Validation Issues Addressed

**No Critical Issues Found:** ✅

All architectural decisions are coherent, requirements are covered, and implementation patterns are complete.

**Minor Refinements Made:**

1. **BLE Message Structure:** Clarified message types and payload structures
2. **Error Handling:** Standardized error code categories and formats
3. **State Management:** Clarified separation between Zustand and TanStack Query
4. **Project Structure:** Refined feature boundaries and integration points

**All Issues:** ✅ Resolved or documented as acceptable gaps

---

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped
- [x] 45 functional requirements categorized and analyzed
- [x] Non-functional requirements comprehensively reviewed

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed
- [x] Security requirements covered
- [x] All 10 major architectural decisions documented

**✅ Implementation Patterns**

- [x] Naming conventions established (6 categories)
- [x] Structure patterns defined (4 categories)
- [x] Communication patterns specified (3 categories)
- [x] Process patterns documented (2 categories)
- [x] Pattern examples provided (good and anti-patterns)
- [x] Enforcement guidelines established

**✅ Project Structure**

- [x] Complete directory structure defined (200+ files/directories)
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete
- [x] All 6 FR categories mapped to specific directories
- [x] Cross-cutting concerns identified and located

**✅ Validation**

- [x] Coherence validation completed
- [x] Requirements coverage verified
- [x] Implementation readiness confirmed
- [x] Gap analysis performed
- [x] Completeness checklist completed

---

### Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** **HIGH** - Architecture is complete, coherent, and ready to guide implementation.

**Key Strengths:**

1. **Comprehensive Coverage:** All 45 functional requirements and all non-functional requirements are architecturally supported
2. **Clear Patterns:** Implementation patterns are detailed with examples and anti-patterns
3. **Complete Structure:** Project structure is specific and complete, not generic placeholders
4. **Coherent Decisions:** All architectural decisions work together seamlessly
5. **Version Specificity:** All technology versions are verified and documented
6. **Boundary Clarity:** Component and service boundaries are well-defined
7. **Integration Points:** All integration points are clearly specified
8. **Enforcement Guidelines:** Clear rules for maintaining consistency

**Areas for Future Enhancement:**

1. **Device Firmware Architecture:** Separate architecture document for ESP32 firmware
2. **Testing Strategy:** Detailed testing patterns and tooling
3. **Performance Monitoring:** Analytics and monitoring tooling
4. **Advanced Tooling:** ESLint rules, pre-commit hooks, Storybook (Post-MVP)
5. **API Documentation:** OpenAPI/Swagger generation
6. **Component Library:** Storybook documentation (Post-MVP)

**Implementation Confidence:** ✅ **HIGH** - AI agents can implement consistently using this architecture.

---

### Implementation Handoff

**AI Agent Guidelines:**

1. **Follow Architectural Decisions Exactly:**
   - Use Expo CLI with TypeScript template
   - Implement Expo Router file-based routing
   - Use Zustand for client state, TanStack Query for server state
   - Follow REST API patterns for Edge Functions
   - Implement JSON over BLE protocol as specified
   - Use UUID v4 for device keys

2. **Apply Implementation Patterns Consistently:**
   - Follow all naming conventions (database, API, code, components)
   - Use feature-based organization structure
   - Apply format patterns (API responses, BLE messages, AsyncStorage)
   - Follow communication patterns (TanStack Query keys, Zustand stores)
   - Implement process patterns (error handling, loading states)

3. **Respect Project Structure and Boundaries:**
   - Place code in correct feature directories
   - Use shared libraries for common functionality
   - Maintain component boundaries between features
   - Follow integration point patterns

4. **Refer to This Document:**
   - Use this document as the single source of truth for architectural decisions
   - Check patterns before implementing new features
   - Update document if architectural decisions change
   - Follow examples and avoid anti-patterns

**First Implementation Priority:**

1. **Initialize Project:**
   ```bash
   npx create-expo-app BusStopApp --template blank-typescript
   ```

2. **Set Up Core Infrastructure:**
   - Configure Expo Router
   - Set up Supabase client
   - Configure TanStack Query
   - Set up Zustand stores structure
   - Implement error handling infrastructure

3. **Implement Device Setup Feature:**
   - BLE discovery and connection
   - WiFi configuration flow
   - Device registration

4. **Implement Device Configuration Feature:**
   - Map-based stop selection
   - Line configuration
   - Auto-save functionality

**Architecture Document Status:** ✅ **COMPLETE AND READY**

This architecture document provides comprehensive guidance for consistent, high-quality implementation across all features and components.

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅  
**Total Steps Completed:** 8  
**Date Completed:** 2026-01-21  
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- **10 major architectural decisions** made and documented
- **15+ implementation patterns** defined across 6 categories
- **7 architectural components** specified (mobile app, backend, BLE, etc.)
- **45 functional requirements** fully supported
- **All non-functional requirements** architecturally addressed

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions (Expo SDK 54, React Native 0.74+, etc.)
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries (200+ files/directories)
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing the bus-stop mobile application. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**

```bash
npx create-expo-app BusStopApp --template blank-typescript
```

**Development Sequence:**

1. **Initialize project** using documented starter template
2. **Set up development environment** per architecture (EAS Build, Expo Router, etc.)
3. **Implement core architectural foundations** (Supabase client, TanStack Query, Zustand, error handling)
4. **Build features** following established patterns (device-setup, device-config, etc.)
5. **Maintain consistency** with documented rules and patterns

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts
- [x] Technology choices are compatible (Expo + React Native + Supabase + BLE)
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices (feature-based, Expo Router)

**✅ Requirements Coverage**

- [x] All 45 functional requirements are supported
- [x] All non-functional requirements are addressed (performance, security, reliability, accessibility)
- [x] Cross-cutting concerns are handled (BLE, errors, state, models, maps)
- [x] Integration points are defined (Supabase, ZET API, BLE, maps)

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable (with versions and commands)
- [x] Patterns prevent agent conflicts (naming, structure, communication)
- [x] Structure is complete and unambiguous (specific files and directories)
- [x] Examples are provided for clarity (good patterns and anti-patterns)

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction. All 10 major decisions are documented with versions and implementation notes.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly. 15+ patterns across 6 categories prevent conflicts.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs (45 FRs) to technical implementation (specific directories and components).

**🏗️ Solid Foundation**
The chosen starter template (Expo CLI with TypeScript) and architectural patterns provide a production-ready foundation following 2026 best practices.

---

**Architecture Status:** ✅ **READY FOR IMPLEMENTATION**

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

---

**Workflow Complete:** The architecture for bus-stop mobile application is comprehensive, validated, and ready to guide consistent, high-quality implementation across all development work.
