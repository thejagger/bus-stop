# Package Installation Notes

## Important: Expo Package Management

**DO NOT manually specify versions for Expo SDK packages** (except for the main `expo` package).

Expo SDK packages that should be managed by `npx expo install`:
- `expo-router`
- `expo-status-bar`
- `expo-build-properties`
- `react-native-safe-area-context`
- `react-native-screens`
- `react-native`
- `react`
- All other `expo-*` packages

## Installation Process

1. **Install main dependencies:**
   ```bash
   npm install
   ```

2. **Let Expo install and fix all SDK packages:**
   ```bash
   npx expo install --fix
   ```

   This will:
   - Install all required Expo SDK packages
   - Set correct versions compatible with SDK 54
   - Resolve peer dependency conflicts
   - Update package.json automatically

3. **Verify installation:**
   ```bash
   npx expo-doctor
   ```

## Why This Approach?

- Expo SDK packages have complex interdependencies
- Manual version specification leads to conflicts (as seen with react-native-safe-area-context)
- `npx expo install` ensures all packages are compatible
- It automatically updates package.json with correct versions

## Current package.json Strategy

**Manually specified (third-party packages):**
- `expo`: ~54.0.0 (main SDK version)
- `expo-router`: ~6.0.21 (specified in story requirements)
- `@tanstack/react-query`: ^5.0.0
- `@supabase/supabase-js`: ^2.58.0
- `zustand`: ^5.0.10
- `react-native-ble-plx`: ^3.5.0
- `zod`: ^4.0.0
- `@react-native-async-storage/async-storage`: ^2.1.0

**Managed by Expo (will be added/updated by `npx expo install`):**
- `react-native`
- `react`
- `expo-status-bar`
- `expo-build-properties`
- `react-native-safe-area-context`
- `react-native-screens`
- All other Expo SDK packages
