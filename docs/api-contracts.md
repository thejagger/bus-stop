# API Contracts

**Generated:** 2026-01-21  
**Scan Level:** Deep

---

## Overview

This application uses two primary API sources:
1. **Supabase** - Backend database and authentication API
2. **ZET API** - External transit data API (Zagreb Electric Tram)

---

## Supabase API

### Authentication

**Base URL:** Configured via `VITE_SUPABASE_URL` environment variable

#### User Authentication
- **Provider:** Supabase Auth
- **Methods:** Email/password authentication
- **Session Management:** Automatic token refresh, persistent sessions
- **Location:** `src/lib/supabase-client.ts`

#### User Creation
- **Endpoint:** Supabase Edge Function `create-user`
- **Method:** `POST`
- **Location:** `src/app/users/model/profile.model.ts`
- **Payload:**
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response:** User object with `id`

---

### Database Operations

All database operations go through the **BaseModel** system (`src/lib/base.model.ts`).

#### BaseModel API

**Common Methods:**
- `getAllQuery(select?: string)` - Returns Supabase query builder
- `loadData(select?: string)` - Loads single record by ID
- `upsert(data)` - Creates or updates record
- `delete(id)` - Soft deletes record (sets `is_deleted = true`)

**Query Building:**
- Uses Supabase PostgREST query builder
- Supports filtering, sorting, pagination
- Automatic relation loading via `generateSelectString()`

#### Data Models & Tables

**Profile (Users)**
- **Table:** `profile`
- **Model:** `src/app/users/model/profile.model.ts`
- **Base Path:** `/admin/users`
- **Operations:**
  - Create user (via Edge Function)
  - Update profile
  - Load profile by ID

**Devices**
- **Table:** `devices`
- **Model:** `src/app/setup/model/device.model.ts`
- **Base Path:** `/setup`
- **Operations:**
  - CRUD operations
  - `getByCode(code: string)` - Find device by setup code
- **Fields:**
  - `id` (UUID)
  - `code` (TEXT, unique)
  - `area` (TEXT)
  - `display_name` (TEXT, nullable)
  - `is_active` (BOOLEAN)
  - `is_deleted` (BOOLEAN)

**Stops**
- **Table:** `stops`
- **Model:** `src/app/setup/model/stop.model.ts`
- **Base Path:** `/setup`
- **Operations:**
  - CRUD operations
  - `getByArea(area: string)` - Get all stops for an area
  - `getByExternalId(externalId: string, area: string)` - Find by external ID
- **Fields:**
  - `id` (UUID)
  - `area` (TEXT)
  - `external_id` (TEXT)
  - `name` (TEXT)
  - `latitude` (DOUBLE PRECISION)
  - `longitude` (DOUBLE PRECISION)
  - `is_active` (BOOLEAN)
  - `is_deleted` (BOOLEAN)

**Lines**
- **Table:** `lines`
- **Model:** `src/app/setup/model/line.model.ts`
- **Base Path:** `/setup`
- **Operations:**
  - CRUD operations
  - `getByArea(area: string)` - Get all lines for an area
  - `getByExternalIdAndDirection(externalId, area, direction)` - Find by external ID and direction
- **Fields:**
  - `id` (UUID)
  - `area` (TEXT)
  - `external_id` (TEXT)
  - `name` (TEXT)
  - `direction` (TEXT)
  - `is_active` (BOOLEAN)
  - `is_deleted` (BOOLEAN)

**Device Stop Lines (Junction Table)**
- **Table:** `device_stop_lines`
- **Model:** `src/app/setup/model/device-stop-line.model.ts`
- **Base Path:** `/setup`
- **Operations:**
  - CRUD operations
  - `getByDevice(deviceId: string)` - Get all configurations for a device
  - `exists(deviceId, stopId, lineId)` - Check if combination exists
- **Relations:**
  - `stop` (1:1)
  - `line` (1:1)
  - `device` (1:1)
- **Fields:**
  - `id` (UUID)
  - `device_id` (UUID, FK → devices)
  - `stop_id` (UUID, FK → stops)
  - `line_id` (UUID, FK → lines)
  - `display_order` (INTEGER)
  - `is_active` (BOOLEAN)
  - `is_deleted` (BOOLEAN)

**Schedule Cache**
- **Table:** `schedule_cache`
- **Purpose:** Cached arrival times for devices
- **Fields:**
  - `id` (UUID)
  - `device_id` (UUID, FK → devices)
  - `stop_id` (UUID, FK → stops)
  - `line_id` (UUID, FK → lines)
  - `arrival_time` (TIMESTAMPTZ)
  - `created_at` (TIMESTAMPTZ)

---

## ZET API (External)

**Base URL:** `https://api.zet.hr`  
**Proxy:** `/zet-api` (development only, via Vite proxy)  
**Service:** `src/services/zet-api.ts`  
**Library:** `@tranzithr/zet-api` v1.0.3

### Authentication

**Method:** Email/password login
- **Environment Variables:**
  - `VITE_ZET_API_EMAIL`
  - `VITE_ZET_API_PASSWORD`
- **Note:** Registration not available via API (must register manually on ZET website)

**Methods:**
- `login()` - Authenticate with ZET API
- `register()` - ⚠️ Deprecated (returns Method Not Allowed)

### Stops API

**Get All Stops**
- **Method:** `getStops()`
- **Returns:** `Promise<Stop[]>`
- **Cache:** 5 minutes for static data

**Search Stops**
- **Method:** `searchStops(query: string, limit?: number)`
- **Parameters:**
  - `query` - Search string
  - `limit` - Max results (default: 50)
- **Returns:** `Promise<Stop[]>`

**Get Stop by ID**
- **Method:** `getStopById(stopId: string)`
- **Returns:** `Promise<Stop | null>`

**Get Incoming Trips (Arrivals)**
- **Method:** `getStopIncomingTrips(stopId: string)`
- **Returns:** `Promise<StopIncomingTripWithDates[]>`
- **Purpose:** Real-time arrival times for a stop

### Routes/Lines API

**Get All Routes**
- **Method:** `getRoutes()`
- **Returns:** `Promise<Route[]>`
- **Cache:** 5 minutes for static data

**Get Route by ID**
- **Method:** `getRouteById(routeId: number)`
- **Returns:** `Promise<Route | null>`

**Get Route Trips**
- **Method:** `getRouteTrips(routeId: number, daysFromToday?: number)`
- **Parameters:**
  - `routeId` - Route ID
  - `daysFromToday` - Days offset (default: 0)
- **Returns:** Trip data for the route

### Cache Management

**Refresh Cache**
- **Method:** `refreshCache()`
- **Purpose:** Manually refresh cached static data

**Clear Cache**
- **Method:** `clearCache()`
- **Purpose:** Clear all cached data

---

## Development Proxy

**Location:** `src/lib/fetch-proxy.ts`  
**Purpose:** CORS handling in development

**How it works:**
- Intercepts `fetch` and `XMLHttpRequest` calls
- Routes `api.zet.hr` requests through `/zet-api` proxy
- Only active in development mode (`import.meta.env.DEV`)
- Configured in `vite.config.ts`:
  ```typescript
  proxy: {
    '/zet-api': {
      target: 'https://api.zet.hr',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/zet-api/, ''),
    }
  }
  ```

---

## Error Handling

**AppError System**
- **Location:** `src/lib/app-error.ts`
- **Purpose:** Standardized error handling
- **Features:**
  - Display messages for users
  - Context tracking (operation, table name)
  - Original error preservation
  - Global error handler integration

**Global Error Handler**
- **Location:** `src/App.tsx`
- **Integration:** TanStack Query QueryCache and mutations
- **Display:** Toast notifications via Sonner
- **Duration:** 5 seconds, dismissible

---

## Row Level Security (RLS)

All Supabase tables have RLS enabled:

**Devices:**
- Public read (for setup page)
- Authenticated write

**Stops:**
- Public read (filtered by `is_deleted = false`)
- Authenticated write

**Lines:**
- Public read (filtered by `is_deleted = false`)
- Authenticated write

**Device Stop Lines:**
- Public read by device_id (for device polling)
- Authenticated write

**Schedule Cache:**
- Public read by device_id (for device polling)
- Authenticated write

---

## Device Polling API (Edge Functions)

**Base URL:** `{SUPABASE_URL}/functions/v1`  
**Purpose:** ESP32 devices poll these endpoints for configuration and schedule data  
**Authentication:** Device ID validation (no user auth required)

### Get Device Configuration

**Endpoint:** `GET /device-config/:deviceId`  
**Purpose:** Get device configuration (stops and lines)  
**Location:** `supabase/functions/device-config/index.ts`

**Response:**
```typescript
{
  device: {
    id: string;
    code: string;
    area: string;
    display_name: string | null;
  };
  configurations: Array<{
    id: string;
    stop: {
      id: string;
      name: string;
      external_id: string;
      latitude: number;
      longitude: number;
    };
    line: {
      id: string;
      name: string;
      external_id: string;
      direction: string;
    };
    display_order: number;
  }>;
}
```

**Usage:** Device polls this endpoint every 30-60 seconds to get updated configuration.

---

### Get Device Status

**Endpoint:** `GET /device-status/:deviceId`  
**Purpose:** Get device online status and metadata  
**Location:** `supabase/functions/device-status/index.ts`

**Response:**
```typescript
{
  device_id: string;
  is_online: boolean;
  last_seen: string | null;
  firmware_version: string | null;
  wifi_ssid: string | null;
  wifi_connected: boolean;
}
```

**Usage:** Mobile app queries this to show device status in dashboard.

---

### Device Heartbeat

**Endpoint:** `POST /device-heartbeat/:deviceId`  
**Purpose:** Device sends heartbeat to update last_seen timestamp  
**Location:** `supabase/functions/device-heartbeat/index.ts`

**Payload:**
```typescript
{
  firmware_version?: string;
  wifi_ssid?: string;
  wifi_connected?: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  timestamp: string;
}
```

**Usage:** Device sends heartbeat every 30-60 seconds after successful WiFi connection.

---

### Get Device Schedule

**Endpoint:** `GET /device-schedule/:deviceId`  
**Purpose:** Get cached schedule data for device display  
**Location:** `supabase/functions/device-schedule/index.ts`

**Response:**
```typescript
{
  device_id: string;
  schedules: Array<{
    stop_id: string;
    line_id: string;
    stop: {
      id: string;
      name: string;
      external_id: string;
    };
    line: {
      id: string;
      name: string;
      external_id: string;
      direction: string;
    };
    arrivals: Array<{
      arrival_time: string;
      route_name: string;
      headsign: string;
    }>;
  }>;
  cached_at: string;
}
```

**Usage:** Device polls this endpoint to get cached arrival times for display.

---

## Mobile App API

**Base URL:** Same Supabase endpoints as web app  
**Authentication:** Supabase Auth (email/password or Google OAuth)

### Bluetooth BLE Communication

**Service UUID:** `0000ff00-0000-1000-8000-00805f9b34fb`

**Characteristics:**
- **WiFi Configuration** (`0000ff01-...`) - Write WiFi credentials to device
- **Device Status** (`0000ff02-...`) - Notify connection status updates
- **Device Info** (`0000ff03-...`) - Read device information (code, firmware version)

**Protocol:**
1. App scans for BLE devices with service UUID
2. App connects to device
3. App writes WiFi credentials via WiFi Config characteristic
4. Device attempts WiFi connection
5. Device sends status updates via Device Status characteristic
6. Once connected, device closes BLE and starts polling API endpoints
