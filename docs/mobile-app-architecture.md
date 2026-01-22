# Mobile App Architecture

**Created:** 2026-01-21  
**Platform:** React Native (iOS + Android)  
**UI Framework:** React Native Reusables (shadcn/ui for React Native)  
**Backend:** Supabase (shared with web app)

---

## Overview

The mobile app provides a superior device setup experience using Bluetooth BLE for device discovery and WiFi provisioning. It eliminates the need for network switching and provides real-time device status and management capabilities.

---

## Technology Stack

### Core Framework
- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **React Native Reusables** - UI component library (shadcn/ui for React Native)
- **Expo** (optional) - Development tooling and deployment

### State Management
- **TanStack Query v5** - Server state management (shared patterns with web)
- **Zustand** - Client state management
- **React Hook Form** - Form state management
- **Zod v4** - Schema validation

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions
- **@supabase/supabase-js v2** - Supabase client library

### Device Communication
- **react-native-ble-manager** or **react-native-ble-plx** - Bluetooth BLE communication
- **@react-native-async-storage/async-storage** - Local storage

### Additional Libraries
- **react-native-qrcode-scanner** - QR code scanning (fallback)
- **react-native-maps** - Map interface for stop selection
- **date-fns** - Date manipulation
- **zod** - Schema validation

---

## Architecture Pattern

### Monorepo Structure

```
bus-stop/
├── web/                    # Web app (existing)
│   └── src/
├── mobile/                 # React Native app (new)
│   ├── app/               # Expo Router or React Navigation routes
│   ├── components/        # Reusable components
│   ├── lib/               # Core libraries (Supabase, BLE, etc.)
│   ├── services/          # API services
│   ├── hooks/             # Custom hooks
│   └── types/             # Shared types
└── shared/                # Shared code between web and mobile
    ├── types/             # Shared TypeScript types
    ├── schemas/           # Shared Zod schemas
    └── constants/         # Shared constants
```

### Component Architecture

**Mobile App Structure:**
```
mobile/
├── app/                   # Routes/screens
│   ├── (auth)/           # Auth screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/           # Main app tabs
│   │   ├── index.tsx     # Device list/dashboard
│   │   ├── setup/        # Device setup flow
│   │   │   ├── index.tsx # Device discovery
│   │   │   ├── wifi.tsx  # WiFi configuration
│   │   │   └── configure.tsx # Stop/line selection
│   │   └── settings.tsx
│   └── device/[id]/      # Device detail screens
│       ├── index.tsx     # Device status
│       └── configure.tsx # Device configuration
├── components/            # Reusable components
│   ├── ui/              # React Native Reusables components
│   ├── device/          # Device-specific components
│   │   ├── device-card.tsx
│   │   ├── device-status.tsx
│   │   └── bluetooth-scanner.tsx
│   └── setup/            # Setup flow components
│       ├── wifi-form.tsx
│       └── stop-selector.tsx
├── lib/
│   ├── supabase.ts       # Supabase client
│   ├── ble/             # Bluetooth BLE service
│   │   ├── ble-manager.ts
│   │   ├── device-discovery.ts
│   │   └── wifi-provisioning.ts
│   └── api/             # API clients
│       ├── device-api.ts
│       └── zet-api.ts
└── services/
    ├── device-service.ts
    └── zet-service.ts
```

---

## Key Features

### 1. Device Discovery (Bluetooth BLE)

**Flow:**
1. User opens app → "Add Device" screen
2. App scans for BLE devices with service UUID: `BUS-STOP-DEVICE`
3. Devices advertise: `device_code`, `firmware_version`, `status`
4. User selects device from list
5. App connects via BLE

**BLE Service UUID:** `0000ff00-0000-1000-8000-00805f9b34fb`

**Characteristics:**
- `0000ff01-0000-1000-8000-00805f9b34fb` - WiFi Configuration (write)
- `0000ff02-0000-1000-8000-00805f9b34fb` - Device Status (notify)
- `0000ff03-0000-1000-8000-00805f9b34fb` - Device Info (read)

### 2. WiFi Provisioning

**Flow:**
1. App connects to device via BLE
2. User enters WiFi credentials in app
3. App sends credentials to device via BLE characteristic
4. Device attempts WiFi connection
5. Device sends status updates via BLE notify
6. Once connected, device closes BLE and starts WiFi polling
7. App shows success and redirects to configuration

**WiFi Configuration Payload:**
```typescript
{
  ssid: string;
  password: string;
  security: 'WPA2' | 'WPA3' | 'OPEN';
}
```

### 3. Device Configuration

**Flow:**
1. After WiFi setup, app opens configuration screen
2. User selects area (or auto-detected from device)
3. App loads stops from Supabase
4. User selects stops on map
5. User selects lines/directions
6. App saves configuration to Supabase
7. Device polls configuration via API

### 4. Device Management

**Features:**
- Device list with status (online/offline)
- Device details (last seen, firmware version, etc.)
- Remote restart capability
- Configuration management
- Troubleshooting guides

---

## API Design

### Device Polling Endpoints

**Base URL:** Supabase Edge Functions or REST endpoints

#### Get Device Configuration
```
GET /api/devices/:deviceId/config
```

**Response:**
```typescript
{
  device: {
    id: string;
    code: string;
    area: string;
    display_name: string | null;
  };
  configurations: Array<{
    id: string;
    stop: {
      id: string;
      name: string;
      external_id: string;
      latitude: number;
      longitude: number;
    };
    line: {
      id: string;
      name: string;
      external_id: string;
      direction: string;
    };
    display_order: number;
  }>;
}
```

#### Get Device Status
```
GET /api/devices/:deviceId/status
```

**Response:**
```typescript
{
  device_id: string;
  is_online: boolean;
  last_seen: string | null;
  firmware_version: string | null;
  wifi_ssid: string | null;
  wifi_connected: boolean;
}
```

#### Device Heartbeat
```
POST /api/devices/:deviceId/heartbeat
```

**Payload:**
```typescript
{
  firmware_version: string;
  wifi_ssid: string;
  wifi_connected: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  timestamp: string;
}
```

#### Get Schedule Data
```
GET /api/devices/:deviceId/schedule
```

**Response:**
```typescript
{
  device_id: string;
  schedules: Array<{
    stop_id: string;
    line_id: string;
    arrivals: Array<{
      arrival_time: string;
      route_name: string;
      headsign: string;
    }>;
  }>;
  cached_at: string;
}
```

---

## Data Flow

### Device Setup Flow

```
User Opens App
  ↓
Scan for BLE Devices
  ↓
Select Device from List
  ↓
Connect via BLE
  ↓
Enter WiFi Credentials
  ↓
Send Credentials via BLE
  ↓
Device Connects to WiFi
  ↓
Device Closes BLE, Starts Polling
  ↓
App Shows Success
  ↓
Configure Stops/Lines
  ↓
Save to Supabase
  ↓
Device Polls Configuration
```

### Device Polling Flow

```
Device (ESP32)
  ↓
Connects to WiFi
  ↓
Polls: GET /api/devices/:deviceId/config
  ↓
Receives Configuration
  ↓
Polls: GET /api/devices/:deviceId/schedule
  ↓
Receives Schedule Data
  ↓
Updates Display
  ↓
Sends Heartbeat: POST /api/devices/:deviceId/heartbeat
  ↓
Repeat every 30-60 seconds
```

---

## State Management

### Server State (TanStack Query)

**Device Queries:**
- `devices` - List of user's devices
- `device-detail` - Single device details
- `device-config` - Device configuration
- `device-status` - Device status

**Setup Queries:**
- `stops-by-area` - Stops for area
- `lines-by-area` - Lines for area
- `stop-incoming-trips` - Real-time arrivals

### Client State (Zustand)

**Bluetooth Store:**
```typescript
interface BluetoothStore {
  isScanning: boolean;
  discoveredDevices: DiscoveredDevice[];
  connectedDevice: Device | null;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
}
```

**Setup Store:**
```typescript
interface SetupStore {
  currentStep: 'discovery' | 'wifi' | 'configure';
  selectedDevice: Device | null;
  wifiCredentials: WifiCredentials | null;
  selectedStops: Stop[];
}
```

---

## Security Considerations

### Device Authentication

**Device Keys:**
- Each device has a unique `code` (displayed on device/QR)
- Device uses `code` to authenticate API requests
- API validates `code` → `device_id` mapping

### BLE Security

**Encryption:**
- BLE connection uses pairing/bonding
- WiFi credentials encrypted in transit
- No sensitive data stored on device

### API Security

**RLS Policies:**
- Devices can only read their own configuration
- Public read for device config (by device_id)
- Authenticated write for configuration changes

---

## Error Handling

### BLE Errors
- Connection timeout → Retry with user feedback
- Device not found → Show troubleshooting guide
- WiFi provisioning failed → Allow retry

### API Errors
- Network errors → Retry with exponential backoff
- Authentication errors → Re-authenticate device
- Configuration errors → Show clear error messages

---

## Performance Considerations

### BLE Scanning
- Scan timeout: 10 seconds
- Scan interval: Optimized for battery
- Filter by service UUID for efficiency

### API Polling (Device Side)
- Poll interval: 30-60 seconds
- Exponential backoff on errors
- Cache configuration locally

### App Performance
- Lazy load screens
- Optimize map rendering
- Cache stop/line data

---

## Future Enhancements

### Phase 2 Features
- Push notifications for device offline
- Device firmware updates via app
- Multi-device management dashboard
- Device analytics and usage stats

### Phase 3 Features
- Offline mode for configuration
- Device grouping and organization
- Custom alert configurations
- Historical data visualization

---

## Development Workflow

### Setup
1. Initialize React Native project (Expo or bare)
2. Install React Native Reusables
3. Configure Supabase client
4. Set up Bluetooth BLE library
5. Configure development environment

### Testing
- Test on real iOS and Android devices
- Test BLE with actual ESP32 devices
- Test WiFi provisioning flow end-to-end
- Test device polling and status updates

---

## Deployment

### iOS
- App Store deployment
- TestFlight for beta testing
- Provisioning profiles and certificates

### Android
- Google Play Store deployment
- Internal testing track
- APK signing

---

## Integration with Web App

### Shared Code
- TypeScript types in `shared/types/`
- Zod schemas in `shared/schemas/`
- API client patterns (Supabase)

### Data Consistency
- Same Supabase database
- Same RLS policies
- Same API endpoints

---

## Conclusion

The mobile app provides a superior user experience for device setup and management, leveraging Bluetooth BLE for seamless WiFi provisioning and real-time device status monitoring. The architecture is designed to scale and integrate seamlessly with the existing web application.
