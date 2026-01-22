# Supabase Documentation

**Package:** @supabase/supabase-js  
**Version:** 2.58.0  
**Platform:** Supabase (PostgreSQL + Auth + Real-time)  
**Purpose:** Backend database, authentication, and API platform

---

## Overview

Supabase provides PostgreSQL database, authentication, real-time subscriptions, and API endpoints. This project uses Supabase as the primary backend platform for device management, user accounts, and data storage.

---

## Package Details

**Library:** @supabase/supabase-js v2.58.0  
**Client Creation:** `createClient(url, anonKey, options)`  
**Database:** PostgreSQL (version 17)  
**Authentication:** Supabase Auth (email/password, OAuth providers)

---

## Configuration

**Client Location:** `src/lib/supabase-client.ts`

**Environment Variables:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous/public key

**Client Configuration:**
```typescript
{
  db: {
    schema: "public"
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
}
```

---

## Database Schema

**Tables:**
- `devices` - Display devices (UUID id, code, area, etc.)
- `stops` - Bus/tram stops (from ZET API, cached locally)
- `lines` - Transit lines/routes (from ZET API, cached locally)
- `device_stop_lines` - Junction table (devices ↔ stops ↔ lines)
- `schedule_cache` - Cached arrival times
- `profile` - User profiles

**Features:**
- Row Level Security (RLS) enabled on all tables
- Soft deletes (`is_deleted` flag pattern)
- Automatic timestamps (`created_at`, `modified_at`)
- Foreign key relationships with CASCADE
- UUID primary keys

---

## Authentication

**Methods Supported:**
- Email/password authentication
- Google OAuth (Post-MVP per PRD)
- Session management (automatic refresh, persistent)

**User Creation:**
- Edge Function: `create-user`
- Handles user creation and returns user object
- Located: `supabase/functions/create-user/`

**Session Management:**
- Automatic token refresh
- Persistent sessions
- Auto-refresh enabled

---

## Data Access Pattern

**BaseModel System:**
- All database operations go through BaseModel (`src/lib/base.model.ts`)
- Provides consistent CRUD operations
- Handles relations automatically
- Supports soft deletes

**Common Methods:**
- `getAllQuery(select?)` - Returns Supabase query builder
- `loadData(select?)` - Loads single record by ID
- `upsert(data)` - Creates or updates record
- `delete(id)` - Soft deletes record

**Query Building:**
- Uses Supabase PostgREST query builder
- Supports filtering, sorting, pagination
- Automatic relation loading via `generateSelectString()`

---

## Edge Functions

**Functions:**
- `create-user` - User creation endpoint
- `device-config` - Device configuration management
- `device-heartbeat` - Device status monitoring
- `device-schedule` - Device schedule management
- `device-status` - Device status queries

**Location:** `supabase/functions/`

---

## Real-Time Features

**Capabilities:**
- Real-time subscriptions to database changes
- WebSocket-based updates
- Row-level change notifications

**Usage:**
- Can be used for device status updates (Post-MVP)
- Real-time configuration changes
- Live device monitoring

---

## Security

**Row Level Security (RLS):**
- Enabled on all tables
- Policies defined per table
- User-based access control

**API Security:**
- Anonymous key for public operations
- Service role key for admin operations (server-side only)
- RLS policies enforce data access rules

---

## Local Development

**Supabase CLI:**
- Local development setup available
- Database migrations: `supabase/migrations/`
- Local API port: 54321
- Local database port: 54322

**Migrations:**
- Migration files in `supabase/migrations/`
- Applied via `supabase db push`
- Version controlled SQL files

---

## Architecture Decision Impact

**Backend Platform:**
- Supabase is the primary backend platform
- Handles database, authentication, and API
- Edge Functions for serverless operations
- Real-time capabilities available (Post-MVP)

**Data Flow:**
- React Native app → Supabase API (device config, user accounts)
- Backend → Supabase (device data, user management)
- Backend → ZET API (transit data)
- Backend → Device (pre-rendered display data)

**Device Communication:**
- Device polls backend for display data
- Backend stores device config in Supabase
- Device status tracked in Supabase
- User accounts managed in Supabase

---

## Integration Points

**React Native App:**
- Authentication via Supabase Auth
- Device configuration stored in Supabase
- User account management
- Device status queries

**Backend Services:**
- Device data storage
- User management
- Configuration management
- Status tracking

**Device (ESP32):**
- Device configuration retrieved from backend
- Device status reported to backend
- Backend stores in Supabase
