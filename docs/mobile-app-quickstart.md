# Mobile App Quick Start Guide

## Overview

This guide helps you get started with the React Native mobile app for device setup and management.

---

## Architecture Summary

### Key Components

1. **Device Polling API** (Supabase Edge Functions)
   - `device-config` - Get device configuration
   - `device-status` - Get device status
   - `device-heartbeat` - Device heartbeat
   - `device-schedule` - Get schedule data

2. **Bluetooth BLE Service**
   - Device discovery via BLE scanning
   - WiFi provisioning via BLE characteristics
   - Real-time status updates

3. **Mobile App** (React Native)
   - Device setup flow
   - Device management dashboard
   - Configuration interface

---

## Next Steps

### 1. Deploy Supabase Edge Functions

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy device-config
supabase functions deploy device-status
supabase functions deploy device-heartbeat
supabase functions deploy device-schedule
```

### 2. Run Database Migration

```bash
# Apply migration for device status fields
supabase db push
```

Or apply manually via Supabase Dashboard:
- Run migration: `supabase/migrations/20240103000000_add_device_status_fields.sql`

### 3. Initialize React Native App

```bash
# Create Expo app (recommended)
npx create-expo-app mobile --template blank-typescript

# Or use React Native CLI
npx react-native init mobile --template react-native-template-typescript
```

### 4. Install Dependencies

```bash
cd mobile

# Core dependencies
npm install @supabase/supabase-js
npm install @tanstack/react-query
npm install zustand
npm install react-hook-form
npm install zod

# React Native Reusables
npx shadcn-ui@latest init

# Bluetooth BLE
npm install react-native-ble-plx

# Additional dependencies
npm install react-native-maps
npm install react-native-qrcode-scanner
npm install @react-native-async-storage/async-storage
npm install date-fns
```

### 5. Set Up Project Structure

Create the following directories:

```
mobile/
├── app/                    # Expo Router routes
│   ├── (auth)/
│   ├── (tabs)/
│   └── device/
├── components/
│   ├── ui/                # React Native Reusables
│   ├── device/
│   └── setup/
├── lib/
│   ├── supabase.ts
│   └── ble/
├── services/
└── hooks/
```

### 6. Configure Supabase Client

Create `mobile/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
})
```

### 7. Create Bluetooth BLE Service

Create `mobile/lib/ble/ble-manager.ts`:

```typescript
import { BleManager } from 'react-native-ble-plx'

export const bleManager = new BleManager()

// Service UUID
export const DEVICE_SERVICE_UUID = '0000ff00-0000-1000-8000-00805f9b34fb'

// Characteristics
export const WIFI_CONFIG_CHAR = '0000ff01-0000-1000-8000-00805f9b34fb'
export const DEVICE_STATUS_CHAR = '0000ff02-0000-1000-8000-00805f9b34fb'
export const DEVICE_INFO_CHAR = '0000ff03-0000-1000-8000-00805f9b34fb'
```

---

## ESP32 Firmware Requirements

### BLE Service Setup

Your ESP32 firmware must:

1. **Advertise BLE Service**
   - Service UUID: `0000ff00-0000-1000-8000-00805f9b34fb`
   - Include device code in advertisement data

2. **Implement Characteristics**
   - WiFi Config (write) - Receive WiFi credentials
   - Device Status (notify) - Send connection status
   - Device Info (read) - Return device information

3. **WiFi Provisioning Flow**
   - Receive WiFi credentials via BLE
   - Attempt WiFi connection
   - Send status updates via notify
   - Close BLE once WiFi connected
   - Start polling API endpoints

### API Polling Flow

Once WiFi connected:

1. Poll `GET /device-config/:deviceId` every 30-60 seconds
2. Poll `GET /device-schedule/:deviceId` every 30-60 seconds
3. Send `POST /device-heartbeat/:deviceId` every 30-60 seconds

---

## Testing Checklist

### API Endpoints
- [ ] Deploy all Edge Functions
- [ ] Test device-config endpoint
- [ ] Test device-status endpoint
- [ ] Test device-heartbeat endpoint
- [ ] Test device-schedule endpoint

### Database
- [ ] Run migration for device status fields
- [ ] Verify firmware_version column exists
- [ ] Verify wifi_ssid column exists

### Mobile App
- [ ] Set up React Native project
- [ ] Install all dependencies
- [ ] Configure Supabase client
- [ ] Test BLE scanning
- [ ] Test device connection
- [ ] Test WiFi provisioning flow
- [ ] Test device configuration

### ESP32 Firmware
- [ ] Implement BLE advertising
- [ ] Implement WiFi config characteristic
- [ ] Implement device status characteristic
- [ ] Implement WiFi provisioning logic
- [ ] Implement API polling logic

---

## Resources

- [Mobile App Architecture](./mobile-app-architecture.md)
- [API Contracts](./api-contracts.md)
- [React Native Reusables](https://www.reactnativereusables.com/)
- [react-native-ble-plx Docs](https://github.com/dotintent/react-native-ble-plx)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

## Support

For questions or issues:
1. Check the architecture document
2. Review API contracts
3. Check Supabase Edge Function logs
4. Review ESP32 firmware implementation
