# Project Overview

**Generated:** 2026-01-21  
**Project:** Bus Stop Display System

---

## Project Name

**Bus Stop Display System**

---

## Purpose

Digital display management system for bus/tram stops. The application allows administrators to:
- Manage display devices
- Associate devices with stops and transit lines
- View and configure device displays
- Integrate with transit APIs for real-time data

---

## Executive Summary

Bus Stop Display System is a React-based Single Page Application (SPA) that provides a web interface for managing digital displays at public transit stops. The system integrates with Supabase for backend services and the ZET (Zagreb Electric Tram) API for transit data.

**Key Features:**
- Device management with setup codes
- Stop and line management
- Device-stop-line associations
- Schedule caching
- Real-time transit data integration

---

## Technology Stack Summary

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript 5.9, Vite (Rolldown) |
| **Routing** | React Router DOM 7 |
| **State** | TanStack Query v5, React Context, React Hook Form |
| **Backend** | Supabase (PostgreSQL, Auth) |
| **UI** | Shadcn UI, Radix UI, Tailwind CSS v4 |
| **External APIs** | ZET API (transit data) |

See `technology-stack.md` for detailed information.

---

## Architecture Type

**Component-Based React SPA**

- Single Page Application
- Component-driven development
- Route-based navigation
- Client-side rendering
- Static deployment

See `architecture.md` for detailed architecture information.

---

## Repository Structure

**Type:** Monolith  
**Parts:** 1 (single application)

**Key Directories:**
- `src/app/` - Feature pages and routes
- `src/components/` - Reusable components
- `src/lib/` - Core libraries
- `supabase/migrations/` - Database migrations

See `source-tree-analysis.md` for detailed structure.

---

## Quick Reference

### Entry Point
- **Application:** `src/main.tsx`
- **Root Component:** `src/App.tsx`
- **HTML:** `index.html`

### Key Files
- **BaseModel:** `src/lib/base.model.ts` (CRITICAL)
- **FormBuilder:** `src/components/formbuilder/form-builder.tsx`
- **DataTable:** `src/components/data-table/data-table-supabase.tsx`
- **Auth:** `src/AuthProvider.tsx`
- **Config:** `.cursor/rules/project-rule.mdc` (CRITICAL)

### Database
- **Type:** PostgreSQL (via Supabase)
- **Migrations:** `supabase/migrations/`
- **Tables:** devices, stops, lines, device_stop_lines, schedule_cache, profile

### APIs
- **Supabase:** Backend database and auth
- **ZET API:** External transit data

---

## Getting Started

### Prerequisites
- Node.js
- npm
- Supabase account

### Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment variables (`.env.local`)
4. Run migrations (Supabase)
5. Start dev server: `npm run dev`

See `development-guide.md` for detailed setup instructions.

---

## Documentation Index

### Core Documentation
- **[Architecture](./architecture.md)** - System architecture and patterns
- **[Technology Stack](./technology-stack.md)** - Detailed technology information
- **[Source Tree](./source-tree-analysis.md)** - Directory structure and organization

### API & Data
- **[API Contracts](./api-contracts.md)** - API endpoints and integrations
- **[Data Models](./data-models.md)** - Database schema and models

### Development
- **[Development Guide](./development-guide.md)** - Setup and development workflow
- **[State Management](./state-management.md)** - State management patterns
- **[UI Components](./ui-components.md)** - Component library inventory
- **[Deployment Guide](./deployment-guide.md)** - Build and deployment instructions

---

## Project Status

**Status:** Active Development  
**Last Updated:** 2026-01-21  
**Documentation:** Complete (initial scan)

---

## Key Patterns

### Data Access
- All models extend `BaseModel`
- Zod schemas for validation
- Supabase for backend

### Forms
- Always use `FormBuilder`
- Use FB field components
- Zod validation

### Tables
- Always use `DataTableSupabase`
- Column-based configuration
- Automatic state persistence

---

## Next Steps

1. Review documentation
2. Set up development environment
3. Run migrations
4. Start development
5. Refer to specific docs as needed

---

## Support

For development questions, refer to:
- `.cursor/rules/project-rule.mdc` - Development rules
- `development-guide.md` - Development workflow
- `architecture.md` - Architecture patterns
