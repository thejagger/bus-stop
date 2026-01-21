# Data Models

**Generated:** 2026-01-21  
**Scan Level:** Deep

---

## Overview

All data models extend the **BaseModel** class (`src/lib/base.model.ts`) and use **Zod** schemas for validation. Models follow a consistent pattern:

1. Define Zod schema
2. Export TypeScript type via `z.infer<typeof Schema>`
3. Create model class extending BaseModel
4. Configure relations (if applicable)

---

## BaseModel Architecture

**Location:** `src/lib/base.model.ts`

**Key Features:**
- Unified Supabase client access
- Zod schema validation
- Relation support (1:1, 1:n, n:m)
- Soft deletes (`is_deleted` flag)
- Automatic query building
- Error handling integration

**Common Methods:**
- `getAllQuery(select?: string)` - Returns Supabase query builder
- `loadData(select?: string)` - Loads single record by ID
- `upsert(data)` - Creates or updates record
- `delete(id)` - Soft deletes record

**Relation Configuration:**
```typescript
type Relation<K extends z.ZodType> = {
  key: string;                    // Property name in schema
  nestedModel: BaseModel<K>;      // Nested model instance
  isArray?: boolean;              // true for 1:n, false for 1:1
  exclude?: boolean;              // Exclude from upsert
  foreignKey: string;             // Foreign key column name
};
```

---

## Database Schema

### Devices Table

**Table:** `devices`  
**Model:** `src/app/setup/model/device.model.ts`

**Schema:**
```typescript
{
  id: UUID (primary key, auto-generated)
  code: TEXT (unique, not null) - Setup code for device
  area: TEXT (not null) - Geographic area identifier
  display_name: TEXT (nullable) - Human-readable name
  is_active: BOOLEAN (default: true)
  is_deleted: BOOLEAN (default: false)
  created_at: TIMESTAMPTZ (auto-generated)
  modified_at: TIMESTAMPTZ (auto-updated via trigger)
}
```

**Indexes:**
- `idx_devices_code` on `code` WHERE `is_deleted = false`
- `idx_devices_area` on `area` WHERE `is_deleted = false`

**Custom Methods:**
- `getByCode(code: string)` - Find device by setup code

---

### Stops Table

**Table:** `stops`  
**Model:** `src/app/setup/model/stop.model.ts`

**Schema:**
```typescript
{
  id: UUID (primary key, auto-generated)
  area: TEXT (not null) - Geographic area identifier
  external_id: TEXT (not null) - External API identifier
  name: TEXT (not null) - Stop name
  latitude: DOUBLE PRECISION (not null)
  longitude: DOUBLE PRECISION (not null)
  is_active: BOOLEAN (default: true)
  is_deleted: BOOLEAN (default: false)
  created_at: TIMESTAMPTZ (auto-generated)
  modified_at: TIMESTAMPTZ (auto-updated via trigger)
  
  UNIQUE(area, external_id)
}
```

**Indexes:**
- `idx_stops_area` on `area` WHERE `is_deleted = false`
- `idx_stops_external_id` on `external_id`

**Custom Methods:**
- `getByArea(area: string)` - Get all stops for an area
- `getByAreaQuery(area: string)` - Query builder for area filtering
- `getByExternalId(externalId: string, area: string)` - Find by external ID and area

---

### Lines Table

**Table:** `lines`  
**Model:** `src/app/setup/model/line.model.ts`

**Schema:**
```typescript
{
  id: UUID (primary key, auto-generated)
  area: TEXT (not null) - Geographic area identifier
  external_id: TEXT (not null) - External API identifier
  name: TEXT (not null) - Line name
  direction: TEXT (not null) - Direction (e.g., "A", "B")
  is_active: BOOLEAN (default: true)
  is_deleted: BOOLEAN (default: false)
  created_at: TIMESTAMPTZ (auto-generated)
  modified_at: TIMESTAMPTZ (auto-updated via trigger)
  
  UNIQUE(area, external_id, direction)
}
```

**Indexes:**
- `idx_lines_area` on `area` WHERE `is_deleted = false`
- `idx_lines_external_id` on `external_id`

**Custom Methods:**
- `getByArea(area: string)` - Get all lines for an area
- `getByAreaQuery(area: string)` - Query builder for area filtering
- `getByExternalIdAndDirection(externalId, area, direction)` - Find by external ID, area, and direction

---

### Device Stop Lines Table (Junction)

**Table:** `device_stop_lines`  
**Model:** `src/app/setup/model/device-stop-line.model.ts`

**Purpose:** Associates devices with stops and lines (many-to-many relationship)

**Schema:**
```typescript
{
  id: UUID (primary key, auto-generated)
  device_id: UUID (FK → devices, CASCADE DELETE)
  stop_id: UUID (FK → stops, CASCADE DELETE)
  line_id: UUID (FK → lines, CASCADE DELETE)
  display_order: INTEGER (default: 0) - Order for display
  is_active: BOOLEAN (default: true)
  is_deleted: BOOLEAN (default: false)
  created_at: TIMESTAMPTZ (auto-generated)
  modified_at: TIMESTAMPTZ (auto-updated via trigger)
  
  // Relations (loaded via BaseModel)
  stop: StopSchema (nullable)
  line: LineSchema (nullable)
  device: DeviceSchema (nullable)
}
```

**Indexes:**
- `idx_device_stop_lines_device_id` on `device_id` WHERE `is_deleted = false`
- `idx_device_stop_lines_stop_id` on `stop_id` WHERE `is_deleted = false`
- `idx_device_stop_lines_line_id` on `line_id` WHERE `is_deleted = false`

**Relations:**
- `stop` (1:1) - Related stop
- `line` (1:1) - Related line
- `device` (1:1) - Related device

**Custom Methods:**
- `getByDevice(deviceId: string)` - Get all configurations for a device
- `getByDeviceQuery(deviceId: string)` - Query builder for device filtering (ordered by `display_order`)
- `exists(deviceId, stopId, lineId)` - Check if device-stop-line combination exists

---

### Schedule Cache Table

**Table:** `schedule_cache`  
**Purpose:** Cached arrival times for devices

**Schema:**
```typescript
{
  id: UUID (primary key, auto-generated)
  device_id: UUID (FK → devices, CASCADE DELETE)
  stop_id: UUID (FK → stops, CASCADE DELETE)
  line_id: UUID (FK → lines, CASCADE DELETE)
  arrival_time: TIMESTAMPTZ (not null)
  created_at: TIMESTAMPTZ (auto-generated)
}
```

**Indexes:**
- `idx_schedule_cache_device_id` on `device_id`
- `idx_schedule_cache_stop_line` on `(stop_id, line_id)`

**Note:** No soft deletes - cache entries are replaced/expired naturally

---

### Profile Table (Users)

**Table:** `profile`  
**Model:** `src/app/users/model/profile.model.ts`

**Schema:**
```typescript
{
  id: UUID (primary key) - Supabase Auth user ID
  email: TEXT (email validation)
  password: TEXT (min 1, max 32) - Only used during creation
  first_name: TEXT (min 1, max 32)
  last_name: TEXT (min 1, max 32)
  role_id: INTEGER (min 1) - Foreign key to roles table
  is_active: BOOLEAN (default: true)
  created_at: TIMESTAMPTZ (nullable)
  modified_at: TIMESTAMPTZ (nullable)
}
```

**Custom Methods:**
- `upsert(entity)` - Overridden to handle user creation via Edge Function
  - Creates user via Supabase Edge Function `create-user`
  - Then updates profile record
  - Omits password and role from schema after creation

---

## Common Patterns

### Soft Deletes

All tables (except `schedule_cache`) use soft deletes:
- `is_deleted` boolean flag
- Default: `false`
- Queries automatically filter `is_deleted = false` via BaseModel
- Indexes include `WHERE is_deleted = false` for performance

### Timestamps

All tables include:
- `created_at` - Set on insert (auto-generated)
- `modified_at` - Updated via database trigger (`update_modified_at()` function)

### Active Status

Most tables include:
- `is_active` boolean flag
- Default: `true`
- Used for logical enable/disable without deletion

### Area-Based Partitioning

Stops, Lines, and Devices use `area` field:
- Geographic area identifier
- Used for filtering and organization
- Enables multi-region support

---

## Migration Files

**Location:** `supabase/migrations/`

**Files:**
1. `20240101000000_create_bus_stop_tables.sql` - Initial schema
2. `20240102000000_update_stops_rls_policy.sql` - RLS policy updates
3. `20240102000001_update_lines_rls_policy.sql` - RLS policy updates

**Migration Features:**
- Table creation with constraints
- Index creation with partial indexes
- RLS policy creation
- Trigger creation for `modified_at` updates
- Foreign key relationships with CASCADE DELETE

---

## Validation

All models use **Zod v4** for validation:

**Benefits:**
- Type inference (`z.infer<typeof Schema>`)
- Runtime validation
- Type-safe data access
- Consistent error messages

**Example:**
```typescript
export const StopSchema = z.object({
  id: z.string().uuid().nullish(),
  area: z.string().min(1),
  external_id: z.string().min(1),
  name: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  is_active: z.boolean().default(true),
  is_deleted: z.boolean().default(false),
  created_at: z.iso.datetime({offset: true}).nullish(),
  modified_at: z.iso.datetime({offset: true}).nullish(),
});

export type Stop = z.infer<typeof StopSchema>;
```
