# Bus Stop Mobile App

React Native mobile app for device setup and management using Bluetooth BLE.

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **React Native Reusables** - UI component library (shadcn/ui for React Native)
- **Expo** - Development tooling and deployment
- **Supabase** - Backend (shared with web app)
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **react-native-ble-plx** - Bluetooth BLE communication

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
```

### 2. Environment Variables

Create `.env` file:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## Project Structure

```
mobile/
├── app/                    # Expo Router routes
│   ├── (auth)/            # Auth screens
│   ├── (tabs)/            # Main app tabs
│   └── device/            # Device detail screens
├── components/            # Reusable components
│   ├── ui/               # React Native Reusables
│   ├── device/           # Device components
│   └── setup/            # Setup flow components
├── lib/                   # Core libraries
│   ├── supabase.ts       # Supabase client
│   └── ble/              # Bluetooth BLE service
├── services/             # API services
└── hooks/                 # Custom hooks
```

## Key Features

### Device Discovery
- Bluetooth BLE scanning for devices
- Device list with status
- QR code scanning (fallback)

### WiFi Provisioning
- BLE-based WiFi credential transfer
- Real-time connection status
- Error handling and retry

### Device Configuration
- Map-based stop selection
- Line/direction selection
- Live preview

### Device Management
- Device status monitoring
- Configuration management
- Troubleshooting guides

## Development

### Running on Physical Device

1. Install Expo Go app on your phone
2. Run `npm start`
3. Scan QR code with Expo Go
4. Enable Bluetooth permissions when prompted

### Testing Bluetooth

- Requires physical ESP32 device
- Device must be in BLE advertising mode
- Service UUID: `0000ff00-0000-1000-8000-00805f9b34fb`

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
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

## Troubleshooting

### Bluetooth Not Working
- Check device permissions
- Ensure Bluetooth is enabled
- Restart app if needed

### Supabase Connection Issues
- Verify environment variables
- Check Supabase project status
- Review network connectivity

## Resources

- [React Native Reusables Docs](https://www.reactnativereusables.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx)
