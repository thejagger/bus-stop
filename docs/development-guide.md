# Development Guide

**Generated:** 2026-01-21  
**Scan Level:** Deep

---

## Prerequisites

- **Node.js** - Version compatible with package.json (check `engines` field if present)
- **npm** - Package manager (comes with Node.js)
- **Supabase Account** - For database and authentication
- **Git** - Version control

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd bus-stop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env.local` file in project root:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# ZET API Configuration (Optional - for transit data features)
VITE_ZET_API_EMAIL=your_email
VITE_ZET_API_PASSWORD=your_password
```

**Note:** `.env.local` is gitignored. Never commit environment variables.

### 4. Supabase Setup

**Run Migrations:**

```bash
# Using Supabase CLI
supabase db push

# Or via Supabase Dashboard
# Upload migration files from supabase/migrations/
```

**Required Migrations:**
1. `20240101000000_create_bus_stop_tables.sql`
2. `20240102000000_update_stops_rls_policy.sql`
3. `20240102000001_update_lines_rls_policy.sql`

**Edge Function:**
- Create `create-user` Edge Function in Supabase Dashboard
- Function should handle user creation and return user object

---

## Development Commands

### Start Development Server

```bash
npm run dev
```

**Features:**
- Hot Module Replacement (HMR)
- Fast refresh
- Proxy configured for `/zet-api` → `https://api.zet.hr`
- Fetch proxy active (intercepts `api.zet.hr` requests)

**Access:** `http://localhost:5173` (or port shown in terminal)

### Build for Production

```bash
npm run build
```

**Output:** `dist/` directory

**Process:**
1. TypeScript compilation (`tsc -b`)
2. Vite production build
3. Asset optimization
4. Code splitting

### Preview Production Build

```bash
npm run preview
```

**Purpose:** Test production build locally before deployment

### Lint Code

```bash
npm run lint
```

**Tool:** ESLint  
**Configuration:** `eslint.config.js`

---

## Development Workflow

### Adding a New Feature

1. **Create Data Model**
   - Location: `src/app/{feature}/model/{name}.model.ts`
   - Extend `BaseModel` from `src/lib/base.model.ts`
   - Define Zod schema
   - Export TypeScript type

2. **Create Pages**
   - List view: `src/app/{feature}/page.tsx`
   - Detail view: `src/app/{feature}/detail.tsx`
   - Use `DataTableSupabase` for lists
   - Use `FormBuilder` for forms

3. **Add Routes**
   - Update `src/config/navigation.ts`
   - Routes automatically generated from navigation config

4. **Add Database Table** (if needed)
   - Create migration in `supabase/migrations/`
   - Follow naming conventions (singular, lowercase, underscores)
   - Include: `id`, `is_active`, `is_deleted`, `created_at`, `modified_at`

### Code Style

**Follow:** `.cursor/rules/project-rule.mdc` (CRITICAL)

**Key Rules:**
- Always use FormBuilder for forms
- Always use DataTableSupabase for tables
- Always extend BaseModel for data operations
- Use Zod schemas for validation
- TypeScript strict mode
- No `any` types without justification

### Component Patterns

**Forms:**
```typescript
<FormBuilder baseModel={model} queryResult={queryResult}>
  <FBForm onSubmit={handleSubmit}>
    <FBInput name="field" label="Label" />
    <FBSubmit handleSubmit={handleSubmit} />
  </FBForm>
</FormBuilder>
```

**Tables:**
```typescript
<DataTableSupabase
  columns={columns}
  queryFn={() => model.getAllQuery()}
  baseModel={model}
/>
```

---

## Testing

**No test configuration found**

**Recommended:**
- Add Vitest for unit tests
- Add Playwright for E2E tests
- Test BaseModel operations
- Test form validation
- Test table functionality

---

## Common Tasks

### Adding a New Form Field

1. Use appropriate FB component from `form-builder-fields-default.tsx`
2. Add field to Zod schema in model
3. Field automatically validated and typed

### Adding a New Table Column

1. Add column definition to `columns` array
2. Use `key` for data access
3. Use `callback` for custom rendering
4. Use `filter` for filtering options

### Creating a New Model

1. Define Zod schema
2. Export TypeScript type
3. Create class extending BaseModel
4. Configure relations if needed
5. Add custom methods if needed

### Database Migration

1. Create new migration file: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`
2. Write SQL for schema changes
3. Run migration: `supabase db push`
4. Update model if schema changed

---

## Debugging

### Development Tools

- **React DevTools** - Component inspection
- **Browser DevTools** - Network, console, performance
- **Vite DevTools** - Build inspection

### Common Issues

**CORS Errors:**
- Development: Proxy should handle this
- Check `vite.config.ts` proxy configuration
- Verify fetch proxy is active (`src/lib/fetch-proxy.ts`)

**Supabase Connection:**
- Verify environment variables
- Check Supabase project status
- Verify RLS policies

**TypeScript Errors:**
- Run `tsc -b` to see detailed errors
- Check `tsconfig.json` configuration
- Verify imports are correct

**Build Errors:**
- Clear `node_modules` and reinstall
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for missing dependencies

---

## Project Structure

See `source-tree-analysis.md` for detailed directory structure.

**Key Directories:**
- `src/app/` - Feature pages and routes
- `src/components/` - Reusable components
- `src/lib/` - Core libraries
- `src/config/` - Configuration files
- `supabase/migrations/` - Database migrations

---

## Best Practices

1. **Always use BaseModel** for data operations
2. **Always use FormBuilder** for forms
3. **Always use DataTableSupabase** for tables
4. **Follow existing patterns** - consistency is key
5. **Make components reusable** - think about future use
6. **Use TypeScript strictly** - leverage type safety
7. **Validate with Zod** - never bypass validation
8. **Handle errors gracefully** - use AppError system
9. **Test locally** before committing
10. **Follow git workflow** - use meaningful commits

---

## Environment-Specific Notes

### Development

- Proxy active for ZET API
- Fetch proxy intercepts requests
- Hot reload enabled
- Source maps enabled
- Detailed error messages

### Production

- No proxy (direct API calls)
- Optimized build
- Minified code
- Tree-shaken dependencies
- CDN for static assets

---

## Next Steps

1. **Set up testing** - Add test framework
2. **Set up CI/CD** - Automated builds and tests
3. **Add error tracking** - Sentry or similar
4. **Add analytics** - User behavior tracking
5. **Performance monitoring** - Track performance metrics
