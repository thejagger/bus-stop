# UI Components Inventory

**Generated:** 2026-01-21  
**Scan Level:** Deep

---

## Overview

This application uses **Shadcn UI** built on **Radix UI** primitives with **Tailwind CSS v4** styling.

**Component Library:** Shadcn UI  
**UI Primitives:** Radix UI  
**Styling:** Tailwind CSS v4  
**Icons:** Lucide React (primary), Tabler Icons (secondary)

---

## Component Categories

### Form Components

**Location:** `src/components/formbuilder/form-builder-fields-default.tsx`

- **FBInput** - Text input (text, email, number, password, tel, url, search)
- **FBTextArea** - Multi-line text input
- **FBSelect** - Dropdown select
- **FBCombobox** - Searchable select (command palette style)
- **FBCheckbox** - Single checkbox
- **FBRadio** - Radio button group
- **FBSwitch** - Toggle switch
- **FBDatePicker** - Date picker with calendar
- **FBHiddenInput** - Hidden input field

**File Upload:**
- **FBAvatarUpload** - Avatar/image upload with Supabase Storage

**Actions:**
- **FBSubmit** - Submit button
- **FBCancel** - Cancel button

---

### Data Display Components

**Data Tables:**
- **DataTableSupabase** - Full-featured data table with Supabase integration
- **DataTable** - Generic data table component
- **DataTableToolbar** - Table toolbar with filters
- **DataTablePagination** - Pagination controls
- **DataTableActions** - Action buttons (edit, copy, delete)
- **DataTableFacetedFilter** - Faceted filtering
- **DataTableViewOptions** - Column visibility controls

**Charts:**
- **ChartAreaInteractive** - Interactive area chart (Recharts)
- **Chart Components** - Recharts wrapper components

**Cards:**
- **Card** - Basic card component
- **DefaultCards** - Pre-styled card components
- **SectionCards** - Section card layouts

---

### Navigation Components

**Sidebar:**
- **AppSidebar** - Main application sidebar
- **Sidebar** - Sidebar container (Radix UI)
- **NavMain** - Main navigation items
- **NavSecondary** - Secondary navigation items
- **NavUser** - User navigation menu
- **NavDocuments** - Document navigation

**Breadcrumbs:**
- **Breadcrumb** - Breadcrumb navigation

**Menus:**
- **QuickMenuDialog** - Quick action menu dialog
- **DropdownMenu** - Dropdown menu (Radix UI)

---

### Layout Components

**Layout:**
- **Layout** - Main application layout wrapper
- **SiteHeader** - Site header component

**Overlays:**
- **Overlay** - Overlay component
- **GlobalAlertDialog** - Global alert dialog system
- **Dialog** - Dialog component (Radix UI)
- **Sheet** - Sheet/drawer component (Radix UI)
- **Drawer** - Drawer component (Vaul)

---

### Form Primitives (Radix UI)

**Location:** `src/components/ui/`

- **Form** - Form wrapper with validation
- **Field** - Form field wrapper
- **Input** - Text input
- **Textarea** - Multi-line input
- **Select** - Select dropdown
- **Checkbox** - Checkbox input
- **RadioGroup** - Radio button group
- **Switch** - Toggle switch
- **Label** - Form label
- **InputGroup** - Input with prefix/suffix

---

### Display Components

**Feedback:**
- **Alert** - Alert message
- **AlertDialog** - Alert dialog
- **Toast/Sonner** - Toast notifications
- **Skeleton** - Loading skeleton
- **Spinner** - Loading spinner
- **Empty** - Empty state

**Badges & Tags:**
- **Badge** - Badge component
- **Kbd** - Keyboard key display

**Data Display:**
- **Table** - Table component
- **Tabs** - Tab navigation
- **Separator** - Visual separator
- **Avatar** - Avatar image

**Interactive:**
- **Button** - Button component
- **Toggle** - Toggle button
- **ToggleGroup** - Toggle button group
- **Tooltip** - Tooltip (Radix UI)
- **Popover** - Popover (Radix UI)
- **Command** - Command palette (cmdk)

---

### Specialized Components

**Map:**
- **CustomMap** - Leaflet map component
- **Map Integration** - React Leaflet with marker clustering

**Kanban:**
- **Kanban** - Kanban board component (drag & drop)

**Dropzone:**
- **Dropzone** - File dropzone component

**Calendar:**
- **Calendar** - Calendar component (react-day-picker)

**Language:**
- **LanguageSwitcher** - i18n language switcher

**Theme:**
- **ThemeSwitcher** - Dark/light mode switcher

---

### Skeleton Components

**Location:** `src/components/skeletons/`

- **DataTableSkeleton** - Data table loading skeleton
- **FormBuilderSkeleton** - Form loading skeleton
- **NavigationSkeleton** - Navigation loading skeleton
- **PageSkeleton** - Page loading skeleton

---

## Component Patterns

### Reusability

All components follow the **reusability first** principle:
- Generic, configurable components
- No one-off, inline solutions
- Consistent prop interfaces
- Type-safe with TypeScript

### Form Integration

Form components integrate with:
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **FormBuilder** - Unified form system

### Data Table Integration

Data table components integrate with:
- **TanStack Table** - Table functionality
- **Supabase** - Data fetching
- **BaseModel** - Data operations
- **URL/SessionStorage** - State persistence

---

## Design System

**Colors:** Tailwind CSS color palette  
**Typography:** Tailwind CSS typography  
**Spacing:** Tailwind CSS spacing scale  
**Shadows:** Tailwind CSS shadow utilities  
**Animations:** Motion (Framer Motion) library

**Theme Support:**
- Dark mode via `next-themes`
- System theme detection
- Smooth theme transitions

---

## Component Usage Guidelines

1. **Always use FormBuilder** for forms (never inline forms)
2. **Always use DataTableSupabase** for tables (never inline tables)
3. **Use Shadcn components** from `src/components/ui/`
4. **Follow existing patterns** for consistency
5. **Make components reusable** - think about future use cases

---

## Custom Components

**Location:** `src/components/`

- **ProtectedRoute** - Route protection wrapper
- **PublicRoute** - Public route wrapper
- **Error** - Error boundary component
- **GlobalLoader** - Global loading indicator

---

## Third-Party Integrations

**Maps:** React Leaflet + Marker Clustering  
**Charts:** Recharts  
**Date Picker:** react-day-picker  
**Icons:** Lucide React, Tabler Icons  
**Notifications:** Sonner  
**Drawer:** Vaul  
**Command:** cmdk  
**Drag & Drop:** @dnd-kit
