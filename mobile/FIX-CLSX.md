# Fix: clsx Module Resolution Error

## Issue
Web bundling fails with: `Unable to resolve "clsx" from "app/lib/utils.ts"`

## Solution

`clsx` is already installed in `package.json`. This is a Metro bundler cache issue.

### Fix Steps:

1. **Stop the Expo dev server** (Ctrl+C)

2. **Clear Metro bundler cache:**
   ```bash
   cd mobile
   npx expo start --clear
   ```

   Or manually:
   ```bash
   rm -rf node_modules/.cache
   rm -rf .expo
   npx expo start --clear
   ```

3. **If that doesn't work, reinstall:**
   ```bash
   npm install --legacy-peer-deps
   npx expo start --clear
   ```

## Verification

After clearing cache, the web bundler should resolve `clsx` correctly.

## Note

`clsx@^2.1.1` is correctly installed in `package.json` dependencies. The error is purely a bundler cache issue.
