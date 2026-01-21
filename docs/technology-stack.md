# Technology Stack Analysis

## Project: Bus Stop Display System

**Generated:** 2026-01-21  
**Scan Level:** Deep  
**Project Type:** Web Application (React + TypeScript)

---

## Core Framework

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Frontend Framework** | React | 19.1.1 | UI framework with concurrent features |
| **Language** | TypeScript | 5.9.3 | Type-safe development |
| **Build Tool** | Vite (Rolldown) | 7.1.14 | Ultra-fast build and dev server |
| **Routing** | React Router DOM | 7.9.3 | Client-side routing |

---

## State & Data Management

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Server State** | TanStack Query | 5.90.2 | Data fetching, caching, synchronization |
| **Client State** | Zustand | 5.0.8 | Lightweight global state management |
| **Form State** | React Hook Form | 7.64.0 | Form state and validation |
| **Validation** | Zod | 4.1.12 | Schema validation and type inference |

---

## Backend & Database

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Backend Platform** | Supabase | 2.58.0 | PostgreSQL database, authentication, real-time |
| **Database** | PostgreSQL | - | Primary data store |
| **ORM/Client** | @supabase/supabase-js | 2.58.0 | Supabase client library |

**Database Schema:**
- `devices` - Display devices
- `stops` - Bus/tram stops
- `lines` - Transit lines/routes
- `device_stop_lines` - Junction table (devices ↔ stops ↔ lines)
- `schedule_cache` - Cached arrival times

**Features:**
- Row Level Security (RLS) enabled
- Soft deletes (`is_deleted` flag)
- Automatic timestamps (`created_at`, `modified_at`)
- Foreign key relationships with CASCADE

---

## UI & Styling

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **CSS Framework** | Tailwind CSS | 4.1.14 | Utility-first CSS |
| **Component Library** | Shadcn UI | - | Accessible component primitives |
| **UI Primitives** | Radix UI | Various | Headless, accessible UI components |
| **Icons (Primary)** | Lucide React | 0.544.0 | Icon library |
| **Icons (Secondary)** | Tabler Icons | 3.35.0 | Additional icons |
| **Maps** | React Leaflet | 5.0.0 | Interactive maps |
| **Map Clustering** | React Leaflet MarkerCluster | 5.0.0-rc.0 | Marker clustering for maps |

---

## Additional Libraries

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Date Handling** | date-fns | 4.1.0 | Date manipulation |
| **Date Picker** | react-day-picker | 9.11.1 | Calendar date picker |
| **Notifications** | Sonner | 2.0.7 | Toast notifications |
| **Drawer** | Vaul | 1.1.2 | Drawer/sheet component |
| **Theme** | next-themes | 0.4.6 | Dark/light mode management |
| **Utilities** | clsx + tailwind-merge | 2.1.1 / 3.4.0 | Conditional class names |
| **Drag & Drop** | @dnd-kit | Various | Drag and drop functionality |
| **Charts** | Recharts | 2.15.4 | Data visualization |
| **Internationalization** | i18next | 23.12.3 | Multi-language support |
| **i18n Browser** | i18next-browser-languagedetector | 8.0.5 | Language detection |
| **React i18n** | react-i18next | 15.5.2 | React i18n integration |
| **File Upload** | react-dropzone | 14.3.8 | File upload handling |
| **Command Palette** | cmdk | 1.1.1 | Command menu component |
| **Country Flags** | country-flag-icons | 1.5.21 | Country flag icons |
| **Animation** | Motion (Framer Motion) | 12.23.24 | Animation library |

---

## External APIs

| Service | Library | Version | Purpose |
|---------|---------|---------|---------|
| **ZET API** | @tranzithr/zet-api | 1.0.3 | Zagreb Electric Tram API integration |

**ZET API Features:**
- Stop information and search
- Route/line data
- Incoming trips (arrivals)
- Route trips
- Caching (5-minute cache for static data)

---

## Development Tools

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Linting** | ESLint | 9.36.0 | Code linting |
| **TypeScript ESLint** | typescript-eslint | 8.45.0 | TypeScript-specific linting |
| **React Hooks Lint** | eslint-plugin-react-hooks | 5.2.0 | React hooks linting |
| **React Refresh** | eslint-plugin-react-refresh | 0.4.22 | Fast Refresh linting |

---

## Architecture Patterns

### BaseModel System
- **Location:** `src/lib/base.model.ts`
- **Purpose:** Unified data access layer for Supabase
- **Features:**
  - Zod schema validation
  - Relation support (1:1, 1:n, n:m)
  - Soft deletes
  - Automatic query building
  - Error handling via AppError

### FormBuilder System
- **Location:** `src/components/formbuilder/`
- **Purpose:** Reusable form components with validation
- **Features:**
  - React Hook Form integration
  - Zod schema validation
  - Pre-built field components (Input, Select, DatePicker, etc.)
  - Consistent form patterns

### DataTable System
- **Location:** `src/components/data-table/`
- **Purpose:** Reusable data table with Supabase integration
- **Features:**
  - TanStack Table integration
  - Supabase query building
  - Sorting, filtering, pagination
  - Column customization
  - Action buttons

---

## Architecture Type

**Component-Based React SPA**

- Single Page Application architecture
- Component-driven UI development
- Route-based navigation
- Client-side rendering
- API integration via Supabase and external APIs

---

## Project Purpose

**Bus Stop Display System**

This application manages digital displays for bus/tram stops:
- Device management (display devices with setup codes)
- Stop and line management
- Association of devices with stops and transit lines
- Schedule caching for performance
- Integration with ZET (Zagreb Electric Tram) API for real-time transit data
