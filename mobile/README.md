# Bus Stop Mobile App

React Native mobile app for device setup and management using Bluetooth BLE.

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development tooling and deployment
- **Expo Router** v6.0.21 - File-based routing
- **React Native Reusables** - UI component library (shadcn/ui for React Native) - *To be installed*
- **Supabase** - Backend (shared with web app)
- **TanStack Query** v5 - Server state management
- **Zustand** v5.0.10 - Client state management
- **react-native-ble-plx** v3.5.0 - Bluetooth BLE communication
- **Zod** v4 - Schema validation
- **AsyncStorage** - Local storage

## Project Status

✅ **Epic 1: Project Foundation & Infrastructure** - COMPLETE

- ✅ Story 1.1: Initialize Expo Project with TypeScript
- ✅ Story 1.2: Configure Core Dependencies and Libraries
- ✅ Story 1.3: Set Up Development Environment and Build Configuration
- ✅ Story 1.4: Establish Project Structure and Error Handling Infrastructure

**Note:** Package versions updated for 2026 compatibility:
- Expo SDK 54 (latest stable)
- React Native 0.81 (compatible with SDK 54)
- All Expo packages managed via `npx expo install --fix`

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode (Mac only)
- Android: Android Studio

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
npx expo install --fix
npx expo-doctor
```

**Important:** The `npx expo install --fix` command ensures all Expo SDK packages are aligned with SDK 54. This is required for compatibility.

### 2. Environment Variables

Copy `.env.example` to `.env.development` and fill in your values:

```bash
cp .env.example .env.development
```

Edit `.env.development`:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EXPO_PUBLIC_ENV=development
```

### 3. Run Development Server

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

**Note:** Bluetooth BLE requires a development build. Use `eas build --profile development` to create a development build.

## Project Structure

```
mobile/
├── app/                          # Expo Router routes
│   ├── _layout.tsx              # Root layout with providers
│   ├── index.tsx                 # Home screen
│   ├── features/                 # Feature modules
│   │   ├── device-setup/         # Device discovery & setup
│   │   │   └── stores/           # Zustand stores
│   │   ├── device-config/         # Device configuration
│   │   └── device-management/   # Device management
│   ├── lib/                      # Core libraries
│   │   ├── supabase/            # Supabase client & models
│   │   │   ├── client.ts
│   │   │   └── models/
│   │   ├── ble/                 # Bluetooth BLE
│   │   ├── errors/               # Error handling
│   │   ├── storage/              # AsyncStorage utilities
│   │   └── utils.ts
│   └── components/              # Shared components
├── assets/                       # Images, icons, etc.
├── app.config.ts                # Expo configuration
├── eas.json                     # EAS Build configuration
└── package.json
```

## Key Features

### Device Discovery (Epic 2 - Coming Next)
- Bluetooth BLE scanning for devices
- Device list with status
- QR code scanning (fallback)

### WiFi Provisioning (Epic 2)
- BLE-based WiFi credential transfer
- Real-time connection status
- Error handling and retry

### Device Configuration (Epic 3)
- Map-based stop selection
- Line/direction selection
- Live preview

### Device Management (Epic 5)
- Device status monitoring
- Configuration management
- Troubleshooting guides

## Development

### Running on Physical Device

1. Install Expo Go app on your phone
2. Run `npm start`
3. Scan QR code with Expo Go

**Note:** For Bluetooth BLE support, you need a development build:
```bash
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

### Testing Bluetooth

- Requires physical ESP32 device
- Device must be in BLE advertising mode
- Service UUID: `0000ff00-0000-1000-8000-00805f9b34fb`

## Building for Production

### Development Build (for Bluetooth BLE)

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

## API Endpoints

All endpoints are Supabase Edge Functions:

- `GET /api/devices/:deviceId/config` - Get device configuration
- `GET /api/devices/:deviceId/status` - Get device status
- `POST /api/devices/:deviceId/heartbeat` - Device heartbeat
- `GET /api/devices/:deviceId/schedule` - Get schedule data

## Bluetooth BLE Protocol

### Service UUID
`0000ff00-0000-1000-8000-00805f9b34fb`

### Characteristics

- **WiFi Config** (`0000ff01-...`) - Write WiFi credentials
- **Device Status** (`0000ff02-...`) - Notify connection status
- **Device Info** (`0000ff03-...`) - Read device information

## Error Handling

The app uses centralized error handling with standardized error codes:

- `BLE_*` - Bluetooth BLE errors
- `DEVICE_*` - Device-related errors
- `NETWORK_*` - Network errors
- `API_*` - API errors
- `VALIDATION_*` - Validation errors
- `STORAGE_*` - Storage errors

See `app/lib/errors/errorCodes.ts` for all error codes.

## Troubleshooting

### Bluetooth Not Working
- Check device permissions
- Ensure Bluetooth is enabled
- Use development build (not Expo Go)
- Restart app if needed

### Supabase Connection Issues
- Verify environment variables
- Check Supabase project status
- Review network connectivity

## Resources

- [React Native Reusables Docs](https://www.reactnativereusables.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
