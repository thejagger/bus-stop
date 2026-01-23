# Installation Instructions

## Why We Have Version Issues

The problem occurs because:
1. Expo SDK packages have complex peer dependencies
2. Manual version specification causes conflicts
3. `expo-router@6.0.22` (latest) requires `react-native-safe-area-context@>= 5.4.0`
4. But Expo SDK 54 might ship with different versions

## Solution: Let Expo Manage SDK Packages

**Best Practice:** Only specify the main `expo` SDK version. Let `npx expo install` manage all Expo SDK packages automatically.

## Installation Steps

### Step 1: Install Third-Party Packages

```bash
cd mobile
npm install
```

This installs only the third-party packages:
- `@tanstack/react-query`
- `@supabase/supabase-js`
- `zustand`
- `react-native-ble-plx`
- `zod`
- `@react-native-async-storage/async-storage`

### Step 2: Install Expo SDK Packages (This Fixes Versions!)

```bash
npx expo install expo-router expo-status-bar expo-build-properties
```

This command:
- ✅ Installs the **latest compatible** versions for SDK 54
- ✅ Resolves all peer dependencies automatically
- ✅ Updates `package.json` with correct versions
- ✅ Ensures `react-native-safe-area-context` is the right version

### Step 3: Verify Installation

```bash
npx expo-doctor
```

## Why This Works

- `npx expo install` knows which versions work with SDK 54
- It automatically installs compatible versions of React Native, React, and all Expo packages
- No manual version conflicts
- Always uses current compatible versions

## Alternative: One Command Install

If you want Expo to install everything at once:

```bash
npx expo install expo-router expo-status-bar expo-build-properties @tanstack/react-query @supabase/supabase-js zustand react-native-ble-plx zod @react-native-async-storage/async-storage
```

But the two-step approach (npm install + expo install) is clearer.

## Updated package.json Strategy

**What's in package.json:**
- `expo`: ~54.0.0 (SDK version - we control this)
- Third-party packages (we control these)

**What Expo installs automatically:**
- `expo-router` (latest compatible with SDK 54)
- `expo-status-bar`
- `expo-build-properties`
- `react-native` (0.81.x compatible with SDK 54)
- `react` (compatible version)
- `react-native-safe-area-context` (latest compatible - will be 5.4.0+)
- `react-native-screens`
- All other Expo SDK packages

## Result

After running `npx expo install`, your `package.json` will be automatically updated with the correct versions that all work together. No conflicts!
