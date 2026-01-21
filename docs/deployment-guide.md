# Deployment Guide

**Generated:** 2026-01-21  
**Scan Level:** Deep

---

## Overview

This is a **static React SPA** built with Vite. Deployment involves building the application and serving static files.

---

## Build Process

### Prerequisites

- **Node.js** - Version compatible with package.json
- **npm** - Package manager

### Build Commands

**Development:**
```bash
npm run dev
```
- Starts Vite dev server
- Hot Module Replacement (HMR) enabled
- Proxy configured for `/zet-api` → `https://api.zet.hr`

**Production Build:**
```bash
npm run build
```
- TypeScript compilation (`tsc -b`)
- Vite production build
- Output: `dist/` directory

**Preview Build:**
```bash
npm run preview
```
- Preview production build locally

**Linting:**
```bash
npm run lint
```
- ESLint code checking

---

## Environment Variables

**Required Variables:**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# ZET API Configuration (optional, for transit data)
VITE_ZET_API_EMAIL=your_email
VITE_ZET_API_PASSWORD=your_password
```

**Location:** `.env.local` (not committed to git)

**Note:** `.env.local` file exists but is gitignored for security.

---

## Build Output

**Output Directory:** `dist/`

**Contents:**
- `index.html` - Entry HTML file
- `assets/` - JavaScript, CSS, and other assets
- Static files from `public/` directory

---

## Deployment Options

### Static Hosting

**Recommended Platforms:**
- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting for public repos
- **Cloudflare Pages** - Fast global CDN
- **AWS S3 + CloudFront** - Scalable static hosting

### Deployment Steps

1. **Set Environment Variables**
   - Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Optionally configure ZET API credentials

2. **Build Command**
   ```
   npm run build
   ```

3. **Output Directory**
   ```
   dist
   ```

4. **Deploy**
   - Upload `dist/` contents to hosting platform
   - Or configure platform to build automatically

---

## Vite Configuration

**File:** `vite.config.ts`

**Key Features:**
- React plugin
- Tailwind CSS plugin
- Path alias: `@` → `./src`
- Development proxy for ZET API (`/zet-api`)

**Proxy Configuration:**
- **Development Only** - Proxy routes `/zet-api` to `https://api.zet.hr`
- **Purpose:** CORS handling during development
- **Production:** Not needed (client makes direct requests)

---

## Supabase Configuration

### Database

**Migrations:**
- Location: `supabase/migrations/`
- Run migrations via Supabase CLI or dashboard

**Required Migrations:**
1. `20240101000000_create_bus_stop_tables.sql` - Initial schema
2. `20240102000000_update_stops_rls_policy.sql` - RLS policies
3. `20240102000001_update_lines_rls_policy.sql` - RLS policies

### Authentication

**Provider:** Supabase Auth
- Email/password authentication
- User creation via Edge Function `create-user`

### Row Level Security (RLS)

All tables have RLS enabled:
- Public read access (filtered by `is_deleted = false`)
- Authenticated write access
- Device-specific read access for polling

---

## Development vs Production

### Development

- **Proxy:** `/zet-api` → `https://api.zet.hr` (CORS handling)
- **Fetch Proxy:** Intercepts `api.zet.hr` requests (via `fetch-proxy.ts`)
- **Hot Reload:** Enabled
- **Source Maps:** Enabled

### Production

- **No Proxy:** Client makes direct API requests
- **No Fetch Proxy:** Not active in production
- **Optimized Build:** Minified, tree-shaken
- **CDN:** Static assets served via CDN

---

## CI/CD Considerations

**No CI/CD Configuration Found**

**Recommended Setup:**
- GitHub Actions workflow for automated builds
- Automated testing before deployment
- Environment variable management
- Automated Supabase migrations

**Example Workflow:**
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      # Deploy to hosting platform
```

---

## Performance Optimization

**Build Optimizations:**
- Tree shaking (automatic via Vite)
- Code splitting (automatic via Vite)
- Asset optimization
- Minification

**Runtime Optimizations:**
- TanStack Query caching
- React component memoization
- Lazy loading (can be added)
- Image optimization (can be added)

---

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local`
   - Use secure variable storage in hosting platform
   - Rotate keys regularly

2. **Supabase RLS**
   - All tables protected by RLS
   - Public read access filtered
   - Write access requires authentication

3. **API Keys**
   - Supabase anon key is safe for client-side use
   - ZET API credentials should be kept secure

---

## Troubleshooting

### Build Errors

**TypeScript Errors:**
- Run `tsc -b` separately to see detailed errors
- Check `tsconfig.json` configuration

**Vite Build Errors:**
- Check for missing dependencies
- Verify environment variables are set

### Runtime Errors

**CORS Issues:**
- Development: Proxy should handle this
- Production: Ensure API allows your domain

**Supabase Connection:**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project status

**ZET API Issues:**
- Verify credentials in environment variables
- Check API availability

---

## Next Steps

1. **Set up CI/CD** - Automated builds and deployments
2. **Configure hosting** - Choose and configure hosting platform
3. **Set environment variables** - Configure production environment
4. **Run migrations** - Ensure Supabase database is set up
5. **Test deployment** - Verify all features work in production
