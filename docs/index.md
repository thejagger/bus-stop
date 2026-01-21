# Bus Stop Display System - Documentation Index

**Generated:** 2026-01-21  
**Scan Level:** Deep  
**Project Type:** Web Application (React + TypeScript + Vite)

---

## Project Overview

**Type:** Monolith with 1 part  
**Primary Language:** TypeScript  
**Architecture:** Component-based React SPA  
**Backend:** Supabase (PostgreSQL + Auth)

---

## Quick Reference

- **Tech Stack:** React 19 + TypeScript 5.9 + Vite (Rolldown) + Supabase
- **Entry Point:** `src/main.tsx`
- **Architecture Pattern:** Component-Based React SPA
- **Database:** PostgreSQL (via Supabase)

---

## Generated Documentation

### Core Documentation

- **[Project Overview](./project-overview.md)** - Executive summary and quick reference
- **[Architecture](./architecture.md)** - System architecture, patterns, and decisions
- **[Technology Stack](./technology-stack.md)** - Complete technology inventory
- **[Source Tree Analysis](./source-tree-analysis.md)** - Directory structure with annotations

### API & Data Documentation

- **[API Contracts](./api-contracts.md)** - Supabase and ZET API endpoints
- **[Data Models](./data-models.md)** - Database schema, models, and relationships

### Development Documentation

- **[Development Guide](./development-guide.md)** - Setup, workflow, and common tasks
- **[State Management](./state-management.md)** - State management patterns and architecture
- **[UI Components](./ui-components.md)** - Component library inventory
- **[Deployment Guide](./deployment-guide.md)** - Build and deployment instructions

---

## Existing Documentation

- **[README.md](../README.md)** - Basic project information
- **[Project Rules](../.cursor/rules/project-rule.mdc)** - Development rules and patterns (CRITICAL)

---

## Getting Started

### For New Developers

1. Read **[Project Overview](./project-overview.md)** for context
2. Follow **[Development Guide](./development-guide.md)** for setup
3. Review **[Architecture](./architecture.md)** for patterns
4. Check **[Project Rules](../.cursor/rules/project-rule.mdc)** for guidelines

### For AI-Assisted Development

1. Start with **[Architecture](./architecture.md)** for system understanding
2. Reference **[Data Models](./data-models.md)** for data structure
3. Use **[API Contracts](./api-contracts.md)** for API integration
4. Follow **[Development Guide](./development-guide.md)** for workflows

### For Feature Development

1. Review **[Architecture](./architecture.md)** for patterns
2. Check **[Data Models](./data-models.md)** for schema
3. Use **[UI Components](./ui-components.md)** for available components
4. Follow **[Development Guide](./development-guide.md)** for workflow

---

## Key Systems

### BaseModel System

**Location:** `src/lib/base.model.ts`

Unified data access layer for all database operations. All models extend BaseModel.

**See:** [Architecture](./architecture.md#basemodel-pattern), [Data Models](./data-models.md#basemodel-architecture)

### FormBuilder System

**Location:** `src/components/formbuilder/`

Unified form system with validation. All forms use FormBuilder.

**See:** [Architecture](./architecture.md#formbuilder-pattern), [UI Components](./ui-components.md#form-components)

### DataTable System

**Location:** `src/components/data-table/`

Unified table system with Supabase integration. All tables use DataTableSupabase.

**See:** [Architecture](./architecture.md#datatable-pattern), [UI Components](./ui-components.md#data-display-components)

---

## Database Schema

**Tables:**
- `devices` - Display devices
- `stops` - Bus/tram stops
- `lines` - Transit lines/routes
- `device_stop_lines` - Junction table
- `schedule_cache` - Cached arrival times
- `profile` - User profiles

**See:** [Data Models](./data-models.md) for detailed schema

---

## API Integrations

### Supabase

- Database operations
- Authentication
- Storage (file uploads)
- Edge Functions

**See:** [API Contracts](./api-contracts.md#supabase-api)

### ZET API

- Transit data (stops, routes, arrivals)
- External API integration

**See:** [API Contracts](./api-contracts.md#zet-api-external)

---

## Development Workflow

### Adding a Feature

1. Create model (extends BaseModel)
2. Create pages (DataTable + FormBuilder)
3. Add routes (navigation config)
4. Add database table (migration)

**See:** [Development Guide](./development-guide.md#adding-a-new-feature)

### Common Tasks

- **Forms:** Use FormBuilder system
- **Tables:** Use DataTableSupabase
- **Models:** Extend BaseModel
- **Validation:** Use Zod schemas

**See:** [Development Guide](./development-guide.md#common-tasks)

---

## Architecture Highlights

- **Component-Based:** React component architecture
- **Type-Safe:** Full TypeScript with Zod validation
- **Reusable:** FormBuilder and DataTable systems
- **Consistent:** BaseModel for all data operations
- **Modern:** React 19, Vite, TanStack Query

**See:** [Architecture](./architecture.md) for detailed information

---

## Project Status

**Documentation Status:** Complete (initial scan)  
**Last Updated:** 2026-01-21  
**Scan Level:** Deep  
**Mode:** Initial Scan

---

## Next Steps

1. **Review Documentation** - Familiarize yourself with the system
2. **Set Up Environment** - Follow development guide
3. **Start Development** - Use patterns and guidelines
4. **Refer to Docs** - Use specific docs as needed

---

## Documentation Structure

```
docs/
├── index.md                    # This file (master index)
├── project-overview.md         # Executive summary
├── architecture.md             # System architecture
├── technology-stack.md         # Technology inventory
├── source-tree-analysis.md     # Directory structure
├── api-contracts.md            # API documentation
├── data-models.md              # Database schema
├── state-management.md          # State patterns
├── ui-components.md             # Component inventory
├── development-guide.md         # Development workflow
├── deployment-guide.md          # Deployment instructions
└── project-scan-report.json     # Workflow state
```

---

## Important Notes

- **Always use BaseModel** for data operations
- **Always use FormBuilder** for forms
- **Always use DataTableSupabase** for tables
- **Follow project rules** in `.cursor/rules/project-rule.mdc`
- **Refer to architecture** for patterns and decisions

---

**This index is your primary entry point for AI-assisted development.**
