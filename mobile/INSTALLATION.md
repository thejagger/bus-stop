# Installation Guide

## Prerequisites

- Node.js 18+ (v25.4.0 verified)
- npm or yarn
- Expo CLI (installed globally or via npx)

## Step-by-Step Installation

### 1. Install Node Dependencies

```bash
cd mobile
npm install
```

### 2. Fix Expo Package Versions

**Critical Step:** Expo SDK packages must be aligned with SDK 54:

```bash
npx expo install --fix
```

This command will:
- Install all Expo SDK packages compatible with SDK 54
- Update any mismatched versions
- Ensure React Native 0.81 compatibility

### 3. Verify Installation

```bash
npx expo-doctor
```

This will check for:
- Missing dependencies
- Version mismatches
- Configuration issues

### 4. Set Up Environment Variables

```bash
cp .env.example .env.development
```

Edit `.env.development` with your Supabase credentials:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EXPO_PUBLIC_ENV=development
```

### 5. Start Development Server

```bash
npm start
```

## Troubleshooting npm install Issues

### Issue: Package Version Conflicts

**Solution:** Use Expo's package manager:
```bash
npx expo install --fix
```

### Issue: React Native Version Mismatch

**Solution:** Expo SDK 54 requires React Native 0.81. The `expo install --fix` command handles this automatically.

### Issue: Missing Expo Packages

**Solution:** Install missing packages individually:
```bash
npx expo install <package-name>
```

### Issue: TypeScript Errors

**Solution:** Ensure TypeScript is properly configured:
```bash
npx tsc --noEmit
```

## Package Version Management

### Expo SDK Packages

**Best Practice:** Only specify the main `expo` package version in `package.json`. Let `npx expo install` manage all other Expo packages.

**Current Setup:**
- `expo`: ~54.0.0 (managed manually)
- All other `expo-*` packages: Managed by `npx expo install --fix`

### Third-Party Packages

These packages are managed manually:
- `@tanstack/react-query`: ^5.0.0
- `@supabase/supabase-js`: ^2.58.0
- `zustand`: ^5.0.10
- `react-native-ble-plx`: ^3.5.0
- `zod`: ^4.0.0
- `@react-native-async-storage/async-storage`: ^2.1.0

## Verification Checklist

After installation, verify:

- [ ] `npm install` completes without errors
- [ ] `npx expo install --fix` completes successfully
- [ ] `npx expo-doctor` shows no critical issues
- [ ] `npm start` starts the development server
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)

## Next Steps

Once installation is complete:

1. Review `EPIC-1-REVIEW.md` for Epic 1 completion status
2. Set up environment variables (`.env.development`)
3. Start development server: `npm start`
4. Begin Epic 2: Device Discovery & Initial Setup
