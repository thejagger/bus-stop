# Clean Installation - Let Expo Choose Versions

## Step 1: Install Expo SDK Packages (Auto-resolves versions)

```bash
npx expo install expo-router expo-status-bar expo-build-properties
```

This installs:
- `expo-router` (latest compatible with SDK 54)
- `expo-status-bar` (latest compatible)
- `expo-build-properties` (latest compatible)
- All dependencies (React Native, React, etc.) with correct versions

## Step 2: Install Third-Party Packages (Latest versions)

```bash
npm install @tanstack/react-query@latest @supabase/supabase-js@latest zustand@latest react-native-ble-plx@latest zod@latest @react-native-async-storage/async-storage@latest
```

## Step 3: Install TypeScript Types (Latest)

```bash
npm install --save-dev @types/react@latest
```

## Step 4: Verify

```bash
npx expo-doctor
```

## Complete One-Liner (After Step 1)

```bash
npm install @tanstack/react-query@latest @supabase/supabase-js@latest zustand@latest react-native-ble-plx@latest zod@latest @react-native-async-storage/async-storage@latest @types/react@latest --save-dev
```

## Why This Works

- `npx expo install` = Expo chooses compatible versions for SDK 54
- `npm install @package@latest` = Gets the latest version
- No manual version conflicts
- No deprecated packages (if they exist, npm will warn)
