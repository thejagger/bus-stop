# Source Tree Analysis

**Generated:** 2026-01-21  
**Scan Level:** Deep

---

## Project Structure

```
bus-stop/
├── src/                          # Source code directory
│   ├── app/                      # Application routes and pages
│   │   ├── dashboard/            # Dashboard page
│   │   │   ├── data.json         # Dashboard data
│   │   │   └── page.tsx          # Dashboard component
│   │   ├── error/                # Error page
│   │   │   └── page.tsx          # 404/error component
│   │   ├── login/                # Login page
│   │   │   └── page.tsx          # Login component
│   │   ├── setup/                # Device setup feature
│   │   │   ├── [code]/           # Dynamic route (device code)
│   │   │   │   └── page.tsx      # Setup page component
│   │   │   ├── model/             # Setup data models
│   │   │   │   ├── device.model.ts
│   │   │   │   ├── device-stop-line.model.ts
│   │   │   │   ├── line.model.ts
│   │   │   │   └── stop.model.ts
│   │   │   └── ui/                # Setup UI components
│   │   │       ├── preview-display.tsx
│   │   │       └── stop-selector-dialog.tsx
│   │   └── users/                # User management feature
│   │       ├── detail.tsx         # User detail page
│   │       ├── page.tsx           # User list page
│   │       ├── profile_detail.tsx # Profile detail page
│   │       └── model/             # User data models
│   │           └── profile.model.ts
│   ├── components/                # Reusable components
│   │   ├── app-sidebar.tsx        # Main sidebar component
│   │   ├── chart-area-interactive.tsx
│   │   ├── data-table/           # Data table system
│   │   │   ├── custom-callback-fn.tsx
│   │   │   ├── custom-filter-fn.tsx
│   │   │   ├── data-table-actions.tsx
│   │   │   ├── data-table-cell-viewer.tsx
│   │   │   ├── data-table-column-header.tsx
│   │   │   ├── data-table-faceted-filter.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   ├── data-table-supabase.tsx  # Main Supabase table
│   │   │   ├── data-table-toolbar.tsx
│   │   │   ├── data-table-use-persistent.tsx
│   │   │   └── data-table-view-options.tsx
│   │   ├── data-table.tsx        # Generic data table
│   │   ├── default-cards.tsx
│   │   ├── error.tsx              # Error boundary component
│   │   ├── formbuilder/           # Form builder system
│   │   │   ├── form-builder-fields-action.tsx
│   │   │   ├── form-builder-fields-default.tsx
│   │   │   ├── form-builder-fields-file.tsx
│   │   │   └── form-builder.tsx   # Main form builder
│   │   ├── global-alert-dialog.tsx
│   │   ├── global-loader.tsx
│   │   ├── layout.tsx             # Main layout wrapper
│   │   ├── login-form.tsx
│   │   ├── map/                   # Map components
│   │   │   └── custom-map.tsx     # Leaflet map component
│   │   ├── nav-documents.tsx
│   │   ├── nav-main.tsx
│   │   ├── nav-secondary.tsx
│   │   ├── nav-user.tsx
│   │   ├── overlay.tsx
│   │   ├── protected-route.tsx    # Route protection
│   │   ├── public-route.tsx       # Public route wrapper
│   │   ├── quick-menu-dialog.tsx
│   │   ├── section-cards.tsx
│   │   ├── shadcn-studio/         # Shadcn component examples
│   │   │   └── combobox/
│   │   │       └── combobox-11.tsx
│   │   ├── skeletons/             # Loading skeletons
│   │   │   ├── data-table-skeleton.tsx
│   │   │   ├── form-builder-skeleton.tsx
│   │   │   ├── navigation-skeleton.tsx
│   │   │   └── page-skeleton.tsx
│   │   ├── theme-provider.tsx     # Theme context provider
│   │   └── ui/                    # Shadcn UI components
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── dropzone.tsx
│   │       ├── empty.tsx
│   │       ├── field.tsx
│   │       ├── form.tsx
│   │       ├── input-group.tsx
│   │       ├── input.tsx
│   │       ├── kanban.tsx
│   │       ├── kbd.tsx
│   │       ├── label.tsx
│   │       ├── language-switcher.tsx
│   │       ├── popover.tsx
│   │       ├── radio-group.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── shadcn-io/
│   │       │   └── theme-switcher/
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx
│   │       ├── spinner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       └── tooltip.tsx
│   ├── config/                    # Configuration files
│   │   ├── constant.ts            # App constants
│   │   └── navigation.ts          # Navigation configuration
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-file-upload.ts
│   │   ├── use-mobile.ts
│   │   └── use-supabase-upload.ts
│   ├── lib/                       # Core libraries
│   │   ├── app-error.ts           # Error handling system
│   │   ├── base.model.ts         # BaseModel class (CRITICAL)
│   │   ├── fetch-proxy.ts        # ZET API proxy (dev only)
│   │   ├── supabase-client.ts    # Supabase client setup
│   │   └── utils.ts              # Utility functions
│   ├── services/                  # External service integrations
│   │   └── zet-api.ts            # ZET API service wrapper
│   ├── utils/                     # Utility functions
│   │   ├── data-table-formatters.ts
│   │   ├── navigation-helper.ts
│   │   └── use-select-options.ts
│   ├── App.tsx                    # Root application component
│   ├── AuthProvider.tsx           # Authentication context provider
│   ├── assets/                    # Static assets
│   │   └── react.svg
│   ├── i18n.ts                    # Internationalization setup
│   ├── index.css                  # Global styles
│   └── main.tsx                   # Application entry point
├── supabase/                      # Supabase configuration
│   ├── migrations/                # Database migrations
│   │   ├── 20240101000000_create_bus_stop_tables.sql
│   │   ├── 20240102000000_update_stops_rls_policy.sql
│   │   └── 20240102000001_update_lines_rls_policy.sql
│   ├── config.toml                # Supabase config
│   └── seed.sql                   # Seed data
├── public/                        # Public static files
│   └── vite.svg
├── docs/                          # Project documentation (generated)
│   ├── project-scan-report.json   # Workflow state
│   ├── technology-stack.md
│   ├── api-contracts.md
│   ├── data-models.md
│   ├── state-management.md
│   ├── ui-components.md
│   ├── deployment-guide.md
│   └── source-tree-analysis.md    # This file
├── .cursor/                       # Cursor IDE configuration
│   ├── commands/                  # BMAD commands
│   └── rules/                     # Project rules
│       └── project-rule.mdc       # Development rules (CRITICAL)
├── _bmad/                         # BMAD framework files
├── _bmad-output/                  # BMAD output files
├── scripts/                       # Utility scripts
│   └── register-zet-user.js
├── components.json                # Shadcn UI configuration
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript root config
├── tsconfig.app.json              # TypeScript app config
├── tsconfig.node.json             # TypeScript node config
├── vite.config.ts                 # Vite configuration
└── README.md                      # Project README
```

---

## Critical Directories

### `src/lib/` - Core Libraries

**Purpose:** Foundation libraries used throughout the application

**Key Files:**
- **`base.model.ts`** - BaseModel class (CRITICAL) - All data operations extend this
- **`supabase-client.ts`** - Supabase client initialization
- **`app-error.ts`** - Standardized error handling
- **`fetch-proxy.ts`** - Development proxy for ZET API
- **`utils.ts`** - Shared utility functions

### `src/components/formbuilder/` - Form System

**Purpose:** Reusable form components with validation

**Key Files:**
- **`form-builder.tsx`** - Main form builder wrapper
- **`form-builder-fields-default.tsx`** - Standard form fields
- **`form-builder-fields-action.tsx`** - Action buttons
- **`form-builder-fields-file.tsx`** - File upload fields

### `src/components/data-table/` - Table System

**Purpose:** Reusable data table components with Supabase integration

**Key Files:**
- **`data-table-supabase.tsx`** - Main Supabase-integrated table
- **`data-table-use-persistent.tsx`** - State persistence
- **`data-table-actions.tsx`** - Default actions (edit, copy, delete)
- **`data-table-toolbar.tsx`** - Table toolbar with filters

### `src/app/` - Application Routes

**Purpose:** Feature-based routing and pages

**Structure:**
- Each feature has its own directory
- `page.tsx` for list views
- `detail.tsx` for detail/edit views
- `model/` for data models
- `ui/` for feature-specific components

### `src/components/ui/` - UI Component Library

**Purpose:** Shadcn UI components (Radix UI + Tailwind)

**Note:** These are pre-built components from Shadcn UI library. Do not modify directly - customize via composition.

---

## Entry Points

### Application Entry

**`src/main.tsx`**
- React root rendering
- Router setup
- Auth provider setup
- i18n initialization
- Fetch proxy setup (dev only)

### Application Component

**`src/App.tsx`**
- Route configuration
- Query client setup
- Theme provider
- Global error handling
- Toast notifications

---

## Feature Organization

### User Management (`src/app/users/`)

- List view: `page.tsx`
- Detail view: `detail.tsx`
- Profile view: `profile_detail.tsx`
- Model: `model/profile.model.ts`

### Device Setup (`src/app/setup/`)

- Setup page: `[code]/page.tsx` (dynamic route)
- Models: `model/` (device, stop, line, device-stop-line)
- UI: `ui/` (preview display, stop selector)

### Dashboard (`src/app/dashboard/`)

- Dashboard page: `page.tsx`
- Data: `data.json`

---

## Configuration Files

### Build Configuration

- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript configuration
- **`package.json`** - Dependencies and scripts
- **`components.json`** - Shadcn UI configuration

### Development Configuration

- **`.cursor/rules/project-rule.mdc`** - Development rules (CRITICAL)
- **`eslint.config.js`** - Code linting rules

### Database Configuration

- **`supabase/config.toml`** - Supabase project configuration
- **`supabase/migrations/`** - Database schema migrations

---

## Key Patterns

### Model Organization

Models are co-located with features:
- `src/app/users/model/` - User models
- `src/app/setup/model/` - Setup models

All models extend `BaseModel` from `src/lib/base.model.ts`.

### Component Organization

- **Reusable components:** `src/components/`
- **Feature-specific components:** `src/app/{feature}/ui/`
- **UI primitives:** `src/components/ui/`

### Route Organization

- Feature-based routing in `src/app/`
- Dynamic routes use `[param]` syntax
- Protected routes via `ProtectedRoute` component
- Public routes via `PublicRoute` component

---

## Integration Points

### Supabase Integration

- **Client:** `src/lib/supabase-client.ts`
- **Models:** All extend `BaseModel`
- **Auth:** `src/AuthProvider.tsx`

### ZET API Integration

- **Service:** `src/services/zet-api.ts`
- **Proxy:** `src/lib/fetch-proxy.ts` (dev only)
- **Vite Config:** Proxy configuration in `vite.config.ts`

---

## Build Output

**Output Directory:** `dist/`

**Contents:**
- `index.html` - Entry HTML
- `assets/` - Compiled JavaScript and CSS
- Static files from `public/`

---

## Development Workflow

1. **Start Dev Server:** `npm run dev`
2. **Build:** `npm run build`
3. **Lint:** `npm run lint`
4. **Preview:** `npm run preview`

---

## Notes

- **No backend server** - Pure static SPA
- **Supabase** handles backend functionality
- **Vite proxy** only active in development
- **All data operations** go through BaseModel system
- **Form operations** use FormBuilder system
- **Table operations** use DataTableSupabase system
