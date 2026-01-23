---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
requirementsExtracted:
  functionalRequirements: 52
  nonFunctionalRequirements: 47
  additionalRequirements: 60+
epicsDesigned: 7
mvpEpics: 5
postMvpEpics: 2
storiesCreated: 24
validationStatus: complete
workflowStatus: complete
readyForDevelopment: true
---

# bus-stop - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bus-stop, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can discover nearby devices via Bluetooth Low Energy (BLE) scanning in React Native app
FR2: Users can configure device WiFi connection by selecting network in app and sending credentials to device via Bluetooth BLE
FR3: System can generate and store unique device keys
FR4: Users can set up device without creating an account
FR5: System can register devices with unique identifiers
FR6: Users can access device configuration via Bluetooth pairing in React Native app
FR7: Users can view interactive map of bus stops
FR8: Users can select bus stops from map interface
FR9: Users can select bus lines and directions for selected stops
FR10: Users can see live preview of device display via Bluetooth connection during configuration
FR11: System can auto-save configuration changes without manual save action
FR12: Users can configure multiple stops per device (maximum: 10 stops)
FR13: Users can configure multiple lines per stop (maximum: 5 lines per stop)
FR14: System can fetch real-time bus arrival data from transit API
FR15: Device display can show bus arrival times for configured stops and lines
FR16: System can automatically refresh arrival data at regular intervals (every 30-60 seconds)
FR17: Device display can show multiple lines simultaneously
FR18: System can handle API errors gracefully and display appropriate fallback
FR19: Users can view device status (online/offline)
FR20: Users can verify device connection remotely
FR21: Users can restart device remotely when device is online
FR22: Users can access device configuration directly via Bluetooth connection in React Native app
FR23: System can provide troubleshooting guidance for common issues
FR24: Users can modify device configuration after initial setup
FR25: Users can create account using email/password (Post-MVP - Phase 2)
FR26: Users can create account using Google authentication (Post-MVP - Phase 2)
FR27: Users can add multiple devices to single account (Post-MVP - Phase 2)
FR28: Users can view all devices in account dashboard (Post-MVP - Phase 2)
FR29: Users can manage multiple devices from single interface (Post-MVP - Phase 2)
FR30: Users can switch between devices in account (Post-MVP - Phase 2)
FR31: React Native app provides native mobile interface optimized for iOS and Android
FR32: Users can navigate setup workflow intuitively
FR33: System can provide clear error messages and recovery guidance
FR34: Users can access device configuration from React Native mobile app
FR35: Map interface supports native touch interactions (pan, zoom, tap)
FR36: System can securely pair/bond React Native app with device via Bluetooth BLE
FR37: App can identify and display device information during Bluetooth discovery (device name, signal strength, pairing status)
FR38: Device can enter pairing mode for initial setup (automatic on first boot, manual via hardware button)
FR39: App can send bus stop and line configuration to device via Bluetooth BLE
FR40: App can receive device status and display state via Bluetooth BLE for live preview
FR41: Configuration state persists locally in app and can be resumed after app restart
FR42: App handles Bluetooth connection failures gracefully with clear error messages and recovery guidance
FR43: App can configure device even when device is not connected to WiFi (configuration stored on device, activated when WiFi connected)
FR44: Display order prioritizes bus arrivals by arrival time (soonest arrivals shown first)
FR45: Display updates within 60 seconds regardless of number of configured stops/lines (performance requirement)

### NonFunctional Requirements

NFR1: Map interface loads and becomes interactive within 3 seconds on mobile devices
NFR2: Bus stops load progressively based on viewport (only visible stops loaded)
NFR3: Stop clustering/aggregation when zoomed out for performance
NFR4: Map panning and zooming remain smooth without lag
NFR5: Setup workflow interactions feel responsive and smooth
NFR6: Bus arrival data refreshes every 30-60 seconds without blocking UI
NFR7: Update process is non-blocking and doesn't interrupt user interactions
NFR8: Data fetching optimized to minimize battery impact on mobile devices
NFR9: Page load time: < 3 seconds on 4G mobile connection
NFR10: Time to interactive: < 5 seconds
NFR11: Setup flow completion feels smooth without noticeable delays
NFR12: App launch time: < 2 seconds
NFR13: Bluetooth device discovery: < 5 seconds
NFR14: Map interface loads and becomes interactive: < 3 seconds
NFR15: Setup flow completion: Smooth, no lag during interactions
NFR16: Bluetooth data transfer: Efficient, minimal battery impact
NFR17: User authentication handled via Supabase Auth (email/password or Google OAuth)
NFR18: Supabase security standards are sufficient for this product
NFR19: No additional authentication requirements beyond Supabase capabilities
NFR20: System validates device keys are valid before allowing device access
NFR21: Invalid keys are rejected with appropriate error messaging
NFR22: Device key validation occurs on all device access attempts
NFR23: Standard Supabase security practices apply
NFR24: No special encryption or security requirements beyond Supabase defaults
NFR25: System provides clear, user-friendly error messages
NFR26: Error states are clearly communicated to users
NFR27: System generates error codes for support/debugging purposes
NFR28: Users can see what's happening during operations (loading states, progress indicators)
NFR29: System handles transit API failures gracefully
NFR30: Appropriate fallback behavior when external API is unavailable
NFR31: Error recovery mechanisms for transient failures
NFR32: Users informed when data is unavailable or stale
NFR33: System remains functional for core operations
NFR34: Device setup workflow available when needed
NFR35: Real-time updates resume automatically after temporary failures
NFR36: Basic accessibility practices (leverage existing component accessibility features)
NFR37: Accessibility should not compromise design quality or user experience
NFR38: Leverage existing React Native Reusables accessibility features where available
NFR39: Design quality takes priority over strict accessibility compliance
NFR40: ZET API integration must handle rate limits and errors gracefully
NFR41: Supabase integration follows standard patterns
NFR42: Integration failures don't break core functionality
NFR43: Clear error communication when integrations fail
NFR44: Touch target size (minimum 44x44 points for usability, not strict accessibility)
NFR45: Clear error messages and feedback
NFR46: Design should feel premium and polished (primary focus)
NFR47: Visual design quality prioritized over accessibility compliance

### Additional Requirements

**From Architecture:**

- Initialize project using Expo CLI with TypeScript template: `npx create-expo-app BusStopApp --template blank-typescript`
- Use Expo Router v6.0.21 for file-based routing
- Use Zustand v5.0.10 for client state management
- Use TanStack Query v5 for server state management
- Use react-native-ble-plx v3.5.0 for Bluetooth BLE communication
- Use JSON over BLE characteristics for communication protocol
- Use UUID v4 for device key generation
- Use EAS Build free tier for CI/CD (15 Android + 15 iOS builds/month)
- Use Expo environment variables with `EXPO_PUBLIC_` prefix
- Implement feature-based organization structure (`app/features/`)
- Follow naming conventions: snake_case (database), camelCase (TypeScript), PascalCase (components)
- Use AsyncStorage with namespaced keys (`@busstop:{feature}:{resource}`)
- Implement centralized error handling with toast notifications
- Use Leaflet.js via react-native-webview for map functionality
- Use OpenStreetMap tiles for map data
- Implement development builds for Bluetooth BLE support (EAS Build)
- Follow BaseModel pattern for all database operations
- Use Zod schemas for all data validation
- Implement REST API pattern for Edge Functions
- Use Supabase Edge Functions for backend API endpoints
- Follow BLE message format: `{ type, payload, timestamp?, requestId? }`
- Implement TanStack Query array-based keys: `['devices', deviceId, 'config']`
- Use feature-based Zustand stores for client state
- Implement error response format: `{ error: { code, message, details? }, success: false }`
- Support iOS 13.0+ and Android 6.0+ (API level 23+)
- Location permission required for BLE scanning (both platforms)
- Implement offline configuration capability (AsyncStorage persistence)
- Configuration can be resumed after app restart

**From UX Design:**

- Implement premium, polished design aesthetic (focus on visual quality and user delight)
- Use React Native Reusables (shadcn/ui for React Native) as design system foundation
- Design should feel premium and gift-worthy (not just functional)
- Implement map-first design pattern (map always primary interface)
- Implement bottom sheet overlays for stop details (not page navigation)
- Bottom sheet can minimize to header-only view while keeping map accessible
- Implement smooth transitions between map and plan views (not page navigation)
- Preserve map context when accessing details (never navigate away from map)
- Implement auto-save pattern (no manual save button)
- Implement live preview via Bluetooth during configuration
- Implement success animations for completed actions
- Implement polished animations throughout (premium feel)
- Implement clear status indicators at every step
- Implement clear error messages with recovery steps
- Implement visual feedback for all interactions
- Implement spacious layout with generous white space (8px base unit)
- Implement touch-optimized interactions (minimum 44x44pt targets for usability)
- Design quality prioritized over accessibility compliance
- Leverage existing component accessibility features where available (don't add extra accessibility work)
- Implement responsive design for small phones, standard phones, large phones, and tablets
- Use React Native Dimensions API for responsive sizing
- Implement progressive loading for map tiles
- Implement stop clustering/aggregation when zoomed out
- Implement visual markers showing bus line numbers as points on map
- Implement gesture-based interactions (pan, zoom, tap)
- Implement clear visual hierarchy through spacing and typography
- Implement loading states for all async operations
- Implement empty states with clear CTAs
- Implement error recovery patterns with retry options
- Implement troubleshooting guides for common issues
- Implement platform-specific design patterns (iOS vs Android)
- Maintain consistent premium experience across platforms
- Focus on design polish and user delight over accessibility requirements

### FR Coverage Map

FR1: Epic 2 - Device Discovery & Initial Setup
FR2: Epic 2 - Device Discovery & Initial Setup
FR3: Epic 2 - Device Discovery & Initial Setup
FR4: Epic 2 - Device Discovery & Initial Setup
FR5: Epic 2 - Device Discovery & Initial Setup
FR6: Epic 2 - Device Discovery & Initial Setup
FR7: Epic 3 - Bus Stop & Line Configuration
FR8: Epic 3 - Bus Stop & Line Configuration
FR9: Epic 3 - Bus Stop & Line Configuration
FR10: Epic 3 - Bus Stop & Line Configuration
FR11: Epic 3 - Bus Stop & Line Configuration
FR12: Epic 3 - Bus Stop & Line Configuration
FR13: Epic 3 - Bus Stop & Line Configuration
FR14: Epic 4 - Real-Time Bus Arrival Display
FR15: Epic 4 - Real-Time Bus Arrival Display
FR16: Epic 4 - Real-Time Bus Arrival Display
FR17: Epic 4 - Real-Time Bus Arrival Display
FR18: Epic 4 - Real-Time Bus Arrival Display
FR19: Epic 5 - Device Management & Troubleshooting
FR20: Epic 5 - Device Management & Troubleshooting
FR21: Epic 5 - Device Management & Troubleshooting
FR22: Epic 3 - Bus Stop & Line Configuration
FR23: Epic 5 - Device Management & Troubleshooting
FR24: Epic 3 - Bus Stop & Line Configuration
FR25: Epic 6 - Account Management & Multi-Device Support (Post-MVP)
FR26: Epic 6 - Account Management & Multi-Device Support (Post-MVP)
FR27: Epic 6 - Account Management & Multi-Device Support (Post-MVP)
FR28: Epic 6 - Account Management & Multi-Device Support (Post-MVP)
FR29: Epic 6 - Account Management & Multi-Device Support (Post-MVP)
FR30: Epic 6 - Account Management & Multi-Device Support (Post-MVP)
FR31: Epic 2, Epic 3, Epic 4, Epic 5 - Native mobile interface (integrated across all feature epics)
FR32: Epic 2, Epic 3 - Intuitive navigation (integrated into setup and configuration flows)
FR33: Epic 2, Epic 3, Epic 4, Epic 5 - Clear error messages (integrated across all feature epics)
FR34: Epic 3 - Bus Stop & Line Configuration
FR35: Epic 3 - Bus Stop & Line Configuration
FR36: Epic 2 - Device Discovery & Initial Setup
FR37: Epic 2 - Device Discovery & Initial Setup
FR38: Epic 2 - Device Discovery & Initial Setup
FR39: Epic 3 - Bus Stop & Line Configuration
FR40: Epic 3 - Bus Stop & Line Configuration
FR41: Epic 3 - Bus Stop & Line Configuration
FR42: Epic 2 - Device Discovery & Initial Setup
FR43: Epic 2 - Device Discovery & Initial Setup
FR44: Epic 4 - Real-Time Bus Arrival Display
FR45: Epic 4 - Real-Time Bus Arrival Display
FR46: Epic 7 - Internationalization & Localization
FR47: Epic 7 - Internationalization & Localization
FR48: Epic 7 - Internationalization & Localization
FR49: Epic 7 - Internationalization & Localization
FR50: Epic 7 - Internationalization & Localization
FR51: Epic 7 - Internationalization & Localization
FR52: Epic 7 - Internationalization & Localization

## Epic List

### Epic 1: Project Foundation & Infrastructure

Users have a fully initialized React Native project with core infrastructure, development environment, and architectural foundations ready for feature development.

**FRs covered:** Infrastructure requirements from Architecture (project initialization, Expo setup, core libraries, development environment)

**User Outcome:** Foundation is ready for feature development

**Implementation Notes:**
- Initialize Expo CLI project with TypeScript template
- Set up Expo Router, Zustand, TanStack Query, Supabase client
- Configure development builds for Bluetooth BLE support
- Set up error handling infrastructure
- Configure environment variables and build pipeline
- Establish project structure and naming conventions

### Epic 2: Device Discovery & Initial Setup

Users can discover their bus stop device via Bluetooth, complete WiFi configuration, and register the device—all with a polished, intuitive mobile interface and clear error handling.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR31, FR32, FR33, FR36, FR37, FR38, FR42, FR43

**User Outcome:** Users can discover their device via Bluetooth and complete initial WiFi setup with a premium, polished experience

**Implementation Notes:**
- BLE device discovery with polished UI
- WiFi network selection and credential transfer via Bluetooth
- Device registration with unique keys
- Secure pairing/bonding process
- Native mobile interface optimized for iOS and Android
- Intuitive navigation through setup workflow
- Clear error messages and recovery guidance
- Premium design polish throughout

### Epic 3: Bus Stop & Line Configuration

Users can visually select bus stops and lines on an interactive map interface, see live previews, and have changes auto-saved—all with a premium, polished mobile experience.

**FRs covered:** FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR22, FR24, FR31, FR32, FR33, FR34, FR35, FR39, FR40, FR41

**User Outcome:** Users can visually select bus stops and lines on an interactive map with a polished, intuitive experience

**Implementation Notes:**
- Interactive map interface with native touch interactions
- Map-based stop selection with visual markers
- Line and direction selection
- Auto-save functionality (no manual save button)
- Live preview via Bluetooth during configuration
- Configuration state persistence (resume after app restart)
- Premium design polish and smooth animations
- Intuitive navigation and clear error handling

### Epic 4: Real-Time Bus Arrival Display

Device displays real-time bus arrival information automatically with graceful error handling, all while maintaining a polished user experience.

**FRs covered:** FR14, FR15, FR16, FR17, FR18, FR31, FR33, FR44, FR45

**User Outcome:** Device displays real-time bus arrival information automatically

**Implementation Notes:**
- ZET API integration via backend Edge Functions
- Automatic refresh every 30-60 seconds
- Display prioritization by arrival time
- Graceful error handling and fallback behavior
- Performance optimization (updates within 60 seconds)
- Premium UI polish for status indicators and error states

### Epic 5: Device Management & Troubleshooting

Users can monitor device status, verify connections, restart devices remotely, and access troubleshooting guidance—all with clear, polished interfaces.

**FRs covered:** FR19, FR20, FR21, FR23, FR31, FR33

**User Outcome:** Users can monitor device status and resolve issues remotely with clear guidance

**Implementation Notes:**
- Device status monitoring (online/offline indicators)
- Remote verification and restart capabilities
- Troubleshooting guides and error recovery
- Premium UI for status displays and management actions
- Clear error messages and recovery paths

### Epic 6: Account Management & Multi-Device Support (Post-MVP)

Users can create accounts, authenticate, and manage multiple devices from a single dashboard interface.

**FRs covered:** FR25, FR26, FR27, FR28, FR29, FR30

**User Outcome:** Users can manage multiple devices from a single account

**Implementation Notes:**
- Email/password and Google authentication
- Multi-device account management
- Device dashboard for account holders
- Device switching and organization
- Post-MVP feature (not required for MVP)

### Epic 7: Internationalization & Localization

Users can use the app in their preferred language, with all user-facing text, error messages, and interface elements properly localized.

**FRs covered:** FR46, FR47, FR48, FR49, FR50, FR51, FR52

**User Outcome:** Users can use the app in their preferred language with fully localized interface

**Implementation Notes:**
- Multi-language support infrastructure (i18n library integration)
- Language selection in app settings
- All user-facing text translatable (UI labels, buttons, messages, error messages)
- Device language detection and default language setting
- Language preference persistence across sessions
- Localized map interface and bus stop names
- Localized error messages and troubleshooting guides
- Initial languages: Croatian (primary), English (secondary)
- MVP or Early Post-MVP priority (important feature)

## Epic 1: Project Foundation & Infrastructure

Users have a fully initialized React Native project with core infrastructure, development environment, and architectural foundations ready for feature development.

### Story 1.1: Initialize Expo Project with TypeScript

As a developer,
I want to initialize a new Expo project with TypeScript template,
So that I have a solid foundation for building the React Native mobile app.

**Acceptance Criteria:**

**Given** I have Node.js and npm/yarn installed
**When** I run `npx create-expo-app BusStopApp --template blank-typescript`
**Then** A new Expo project is created with TypeScript configuration
**And** The project structure follows Expo conventions (`app/` directory for Expo Router)
**And** TypeScript is configured with strict mode enabled
**And** Basic project files are created (`package.json`, `tsconfig.json`, `app.config.ts`)
**And** The project can be started with `expo start`

### Story 1.2: Configure Core Dependencies and Libraries

As a developer,
I want to install and configure core dependencies (Expo Router, Zustand, TanStack Query, Supabase),
So that I have the foundational libraries ready for feature development.

**Acceptance Criteria:**

**Given** The Expo project is initialized
**When** I install required dependencies:
- `expo-router` v6.0.21
- `zustand` v5.0.10
- `@tanstack/react-query` v5
- `@supabase/supabase-js` v2.58.0
- `react-native-ble-plx` v3.5.0
- `zod` v4
- `@react-native-async-storage/async-storage`
**Then** All dependencies are installed successfully
**And** Expo Router is configured in `app/_layout.tsx` with file-based routing
**And** TanStack Query provider is set up in root layout
**And** Supabase client is initialized in `app/lib/supabase/client.ts`
**And** Zustand stores structure is established (`app/features/*/stores/`)
**And** Project compiles without errors

### Story 1.3: Set Up Development Environment and Build Configuration

As a developer,
I want to configure EAS Build, environment variables, and development builds for Bluetooth BLE support,
So that I can build and test the app with native modules on physical devices.

**Acceptance Criteria:**

**Given** Core dependencies are installed
**When** I configure the development environment:
- Create `.env.development`, `.env.staging`, `.env.production` files (gitignored)
- Create `.env.example` file (committed) with required variables
- Configure `app.config.ts` with `EXPO_PUBLIC_` prefixed environment variables
- Set up `eas.json` for EAS Build configuration
- Configure development build profile for Bluetooth BLE support
**Then** Environment variables are properly configured with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
**And** EAS Build configuration includes development and production profiles
**And** Development build profile is configured for custom native modules (Bluetooth BLE)
**And** `.env` files are properly gitignored
**And** Environment configuration is type-safe and accessible in the app

### Story 1.4: Establish Project Structure and Error Handling Infrastructure

As a developer,
I want to create the feature-based project structure and error handling infrastructure,
So that I have a consistent foundation for organizing code and handling errors across the app.

**Acceptance Criteria:**

**Given** Core dependencies and environment are configured
**When** I establish the project structure:
- Create feature-based directory structure (`app/features/device-setup/`, `app/features/device-config/`, etc.)
- Create shared libraries directory (`app/lib/supabase/`, `app/lib/ble/`, `app/lib/errors/`, `app/lib/utils/`)
- Create shared components directory (`app/components/`)
- Set up error handling infrastructure (`app/lib/errors/errorHandler.ts`, `app/lib/errors/errorCodes.ts`)
- Create BaseModel pattern structure (`app/lib/supabase/models/`)
- Set up AsyncStorage key constants (`app/lib/storage/storageKeys.ts`)
**Then** Project structure follows feature-based organization pattern
**And** Error handling utility provides centralized error handling with toast notifications
**And** Error codes follow naming convention (`BLE_*`, `DEVICE_*`, `NETWORK_*`, etc.)
**And** Error response format follows architecture specification: `{ error: { code, message, details? }, success: false }`
**And** Project structure is ready for feature development
**And** All TypeScript paths resolve correctly

## Epic 2: Device Discovery & Initial Setup

Users can discover their bus stop device via Bluetooth, complete WiFi configuration, and register the device—all with a polished, intuitive mobile interface and clear error handling.

### Story 2.1: Bluetooth BLE Discovery UI and Device Scanning

As a first-time user,
I want to discover nearby bus stop devices via Bluetooth on my phone,
So that I can see available devices and select mine for setup.

**Acceptance Criteria:**

**Given** I have opened the app and tapped "Add Device"
**When** The app requests Bluetooth and location permissions (required for BLE scanning)
**Then** Permission requests explain why location permission is needed for BLE scanning
**And** If permissions are granted, BLE scanning starts automatically
**And** A polished scanning UI shows "Scanning for devices..." with animated indicator
**When** A bus stop device is discovered within range
**Then** The device appears in a list with:
- Device name/identifier
- Signal strength indicator
- Pairing status indicator
**And** The UI updates in real-time as devices are discovered
**And** Scanning completes within 5 seconds (NFR13)
**And** If no devices are found, an empty state shows troubleshooting guidance with retry option
**And** The UI feels polished and premium (premium design requirement)

### Story 2.2: Device Pairing and Connection Management

As a user,
I want to securely pair my phone with the bus stop device via Bluetooth,
So that I can communicate with the device for configuration.

**Acceptance Criteria:**

**Given** I have discovered a device in the scanning list
**When** I tap on a device to select it
**Then** The app initiates secure pairing/bonding process
**And** A polished connection UI shows "Connecting..." with status indicator
**When** Pairing is successful
**Then** The device is connected and ready for communication
**And** Connection status is clearly displayed
**And** The app can communicate with the device via BLE GATT characteristics
**When** Pairing fails
**Then** A clear error message is displayed with specific error code (`BLE_CONNECTION_FAILED`, etc.)
**And** Recovery guidance is provided (check device power, ensure device is in pairing mode, retry)
**And** A retry button is available
**And** Error handling follows centralized error format with user-friendly messages
**And** The pairing process feels smooth and polished (premium UX requirement)

### Story 2.3: WiFi Network Selection and Configuration

As a user,
I want to configure the device's WiFi connection by selecting my network from a list,
So that the device can connect to the internet without me entering passwords manually.

**Acceptance Criteria:**

**Given** I have successfully paired with the device
**When** The WiFi configuration screen appears
**Then** The app scans for available WiFi networks
**And** Networks are displayed in a polished list with:
- Network name (SSID)
- Signal strength indicator
- Security type indicator (WPA2, WPA3, Open)
**When** I select a WiFi network
**Then** If the network requires a password, I can enter it (or use saved credentials if available)
**When** I confirm the WiFi selection
**Then** WiFi credentials are sent to the device via Bluetooth BLE using JSON message format:
```json
{
  "type": "wifi_config",
  "payload": {
    "ssid": "...",
    "password": "...",
    "security": "WPA2"
  },
  "timestamp": 1234567890
}
```
**And** Connection progress is shown with status indicator
**When** WiFi configuration is successful
**Then** Device connects to WiFi network
**And** Success state is shown with clear confirmation
**When** WiFi configuration fails
**Then** Clear error message is displayed with recovery steps
**And** Retry option is available
**And** Configuration can be stored on device even if WiFi not yet connected (FR43)
**And** The WiFi selection UI feels polished and intuitive (premium UX requirement)

### Story 2.4: Device Registration and Key Generation

As a user,
I want my device to be registered in the system with a unique identifier,
So that I can manage it later and the system can track device status.

**Acceptance Criteria:**

**Given** I have successfully configured WiFi on the device
**When** Device registration process begins
**Then** A unique device key (UUID v4) is generated in the app
**And** Device information is registered in Supabase `device` table with:
- Unique device ID (UUID v4)
- Device name/identifier
- Registration timestamp
- Initial status (configured, needs_setup)
**When** Device registration is successful
**Then** Device ID is stored locally in AsyncStorage (`@busstop:device:${deviceId}:info`)
**And** Device is ready for configuration
**And** Registration can happen without creating an account (FR4)
**When** Registration fails
**Then** Clear error message is displayed
**And** Retry option is available
**And** Error follows centralized error handling format
**And** Device key validation is set up for future access attempts (NFR20, NFR21, NFR22)

### Story 2.5: Error Handling and Recovery for Setup Flow

As a user,
I want clear error messages and recovery guidance when something goes wrong during device setup,
So that I can resolve issues without frustration.

**Acceptance Criteria:**

**Given** I am going through the device setup flow
**When** Any error occurs (Bluetooth not enabled, pairing fails, WiFi fails, registration fails)
**Then** Error messages are displayed using centralized error handler
**And** Error messages are user-friendly and specific (not technical jargon)
**And** Error codes are generated for debugging (`BLE_DEVICE_NOT_FOUND`, `WIFI_CONNECTION_FAILED`, etc.)
**And** Recovery steps are provided for each error type:
- Bluetooth not enabled → Guide to enable Bluetooth
- Location permission denied → Explain why needed, link to settings
- Device not found → Troubleshooting guide, retry option
- Pairing fails → Check device power, ensure pairing mode, retry
- WiFi fails → Check network, retry connection
**When** I encounter an error
**Then** I can retry the failed operation
**And** I can access troubleshooting guides from error screens
**And** Error states don't leave me stuck (always provide next steps)
**And** Error handling feels polished and builds confidence (premium UX requirement)
**And** All errors follow the standardized format: `{ error: { code, message, details? }, success: false }`

## Epic 3: Bus Stop & Line Configuration

Users can visually select bus stops and lines on an interactive map interface, see live previews, and have changes auto-saved—all with a premium, polished mobile experience.

### Story 3.1: Interactive Map Interface with Bus Stop Markers

As a user,
I want to see an interactive map with bus stops displayed as markers,
So that I can visually find and select my bus stops.

**Acceptance Criteria:**

**Given** I have completed device setup and WiFi configuration
**When** The map interface loads
**Then** Map tiles load from OpenStreetMap via Leaflet.js (embedded in WebView)
**And** Map becomes interactive within 3 seconds (NFR1, NFR14)
**And** Bus stops are displayed as markers on the map
**And** Bus line numbers are shown as visual points on the map (UX requirement)
**When** I interact with the map
**Then** I can pan the map smoothly (no lag) (NFR4)
**And** I can zoom in/out with pinch gestures
**And** I can tap on stop markers to select them
**And** Map interactions feel native and responsive (FR35)
**When** I zoom out
**Then** Stop clustering/aggregation is applied for performance (NFR3)
**And** Only visible stops are loaded progressively (NFR2)
**And** Map panning and zooming remain smooth without lag (NFR4)
**And** The map interface feels polished and premium (premium UX requirement)

### Story 3.2: Bus Stop Selection and Details Bottom Sheet

As a user,
I want to select a bus stop on the map and see its details in a bottom sheet overlay,
So that I can view stop information without leaving the map context.

**Acceptance Criteria:**

**Given** I am viewing the interactive map with bus stops
**When** I tap on a bus stop marker
**Then** A bottom sheet slides up from the bottom with stop details
**And** The bottom sheet shows:
- Stop name/identifier
- Stop location information
- Available bus lines at this stop
**And** The map remains visible and accessible (map-first design pattern)
**When** I want to minimize the bottom sheet
**Then** I can swipe down to minimize it to header-only view
**And** The map becomes fully accessible while bottom sheet is minimized
**And** I can tap the header to expand the bottom sheet again
**When** I select a stop
**Then** The stop is visually highlighted on the map
**And** Selected stops are tracked in the app state
**And** The bottom sheet interaction feels smooth and polished (premium UX requirement)
**And** Navigation follows map-first pattern (no page navigation, context preserved) (FR32)

### Story 3.3: Bus Line Selection and Configuration

As a user,
I want to select bus lines and directions for my selected stops,
So that my device displays arrivals for the lines I care about.

**Acceptance Criteria:**

**Given** I have selected a bus stop and the bottom sheet is open
**When** I view available bus lines for the stop
**Then** Bus lines are displayed in the bottom sheet with:
- Line number/identifier
- Direction information
- Line status
**When** I select bus lines
**Then** I can select multiple lines per stop (up to 5 lines per stop) (FR13)
**And** Selected lines are visually indicated (checkmarks, highlights)
**And** Line selection updates immediately in the UI
**When** I configure multiple stops
**Then** I can configure up to 10 stops per device (FR12)
**And** Each stop can have its own set of selected lines
**And** Selected stops and lines are tracked in app state
**And** The line selection UI feels intuitive and polished (premium UX requirement)

### Story 3.4: Auto-Save Configuration and State Persistence

As a user,
I want my configuration changes to be saved automatically,
So that I don't need to remember to press a save button.

**Acceptance Criteria:**

**Given** I have selected stops and lines
**When** I make any configuration change (select stop, select line, deselect line)
**Then** Configuration is automatically saved without manual save action (FR11)
**And** A subtle success indicator shows briefly ("Saved" or checkmark animation)
**And** Configuration is persisted to AsyncStorage (`@busstop:device:${deviceId}:config`)
**And** Configuration is also sent to device via Bluetooth BLE (if connected)
**When** I close and reopen the app
**Then** Configuration state is restored from AsyncStorage (FR41)
**And** I can resume configuration where I left off
**And** Selected stops and lines are displayed correctly
**When** Configuration is saved
**Then** It's stored in Supabase `device_stop_line` table (via backend)
**And** Auto-save happens seamlessly without interrupting my workflow
**And** The auto-save pattern feels polished and builds confidence (premium UX requirement)

### Story 3.5: Live Preview via Bluetooth

As a user,
I want to see a live preview of what the device will display while I configure it,
So that I can confirm my configuration is correct before finishing setup.

**Acceptance Criteria:**

**Given** I have paired with the device and am configuring stops/lines
**When** I make configuration changes
**Then** Configuration is sent to device via Bluetooth BLE using JSON message format:
```json
{
  "type": "device_config",
  "payload": {
    "stops": [
      {
        "stopId": "...",
        "lineIds": ["...", "..."]
      }
    ],
    "refreshInterval": 60
  },
  "timestamp": 1234567890
}
```
**When** Device receives configuration
**Then** Device sends back display state via BLE:
```json
{
  "type": "live_preview",
  "payload": {
    "stops": [
      {
        "stopId": "...",
        "stopName": "...",
        "arrivals": [
          {
            "lineId": "...",
            "lineName": "...",
            "arrivalTime": 120
          }
        ]
      }
    ]
  },
  "timestamp": 1234567890
}
```
**When** Live preview data is received
**Then** Preview component displays what device will show
**And** Preview updates in real-time as configuration changes
**And** Preview shows bus arrivals for configured stops/lines
**When** Bluetooth connection is lost during preview
**Then** Connection status is shown clearly
**And** Preview gracefully handles disconnection
**And** Reconnection option is available
**And** Live preview builds confidence in the setup process (premium UX requirement)

### Story 3.6: Modify Existing Configuration

As a user,
I want to modify my device configuration after initial setup,
So that I can add new stops, remove stops, or change line selections.

**Acceptance Criteria:**

**Given** I have a configured device
**When** I access the device configuration screen (via Bluetooth discovery or device list)
**Then** Current configuration is loaded and displayed:
- Currently selected stops highlighted on map
- Selected lines shown in bottom sheet
**When** I add a new stop
**Then** I can select it from the map
**And** It's added to my configuration
**And** Configuration auto-saves
**When** I remove a stop
**Then** I can deselect it from the map or bottom sheet
**And** It's removed from configuration
**And** Configuration auto-saves
**When** I change line selections for a stop
**Then** I can modify selected lines in the bottom sheet
**And** Changes are saved automatically
**When** Configuration is updated
**Then** Changes are sent to device via Bluetooth BLE
**And** Device updates its display accordingly
**And** Live preview reflects the changes
**And** Configuration modification feels intuitive and polished (premium UX requirement)

## Epic 4: Real-Time Bus Arrival Display

Device displays real-time bus arrival information automatically with graceful error handling, all while maintaining a polished user experience.

### Story 4.1: Backend ZET API Integration and Data Fetching

As a system,
I want to fetch real-time bus arrival data from the ZET API via backend Edge Functions,
So that devices can display up-to-date arrival information.

**Acceptance Criteria:**

**Given** A device is configured with stops and lines
**When** Device polls the backend for schedule data
**Then** Backend Edge Function (`/functions/v1/device-schedule`) receives the request
**And** Edge Function authenticates with ZET API using stored credentials
**When** ZET API data is fetched
**Then** Backend uses `@tranzithr/zet-api` wrapper library
**And** Backend fetches real-time trip information for configured stops/lines
**When** API response is received
**Then** Backend formats data for device display format (pre-rendered layout)
**And** Backend caches API responses (TTL-based caching, 30-60 seconds)
**And** Cached data is served if cache is still valid
**When** API rate limit is encountered
**Then** Backend handles rate limiting gracefully
**And** Cached data is served if available
**And** Error is logged for monitoring
**When** API request fails
**Then** Backend returns appropriate error response
**And** Fallback behavior is triggered (serve cached data if available)
**And** Error follows standardized format: `{ error: { code, message, details? }, success: false }`

### Story 4.2: Device Polling and Display Update Mechanism

As a device,
I want to poll the backend for updated arrival data at regular intervals,
So that I can display current bus arrival times to users.

**Acceptance Criteria:**

**Given** Device is configured and connected to WiFi
**When** Device starts polling for updates
**Then** Device polls backend Edge Function (`/functions/v1/device-schedule`) every 30-60 seconds (FR16)
**And** Device sends device ID and configuration in request
**When** Backend responds with schedule data
**Then** Device receives pre-rendered display data
**And** Device updates e-ink display with new arrival information
**And** Display shows bus arrival times for configured stops and lines (FR15)
**When** Multiple lines are configured
**Then** Device displays multiple lines simultaneously (FR17)
**And** Display updates within 60 seconds regardless of number of configured stops/lines (FR45)
**When** Backend is unavailable
**Then** Device displays cached data if available
**And** Device continues polling and updates when backend becomes available
**And** Update process is non-blocking and doesn't interrupt device operation (NFR7)

### Story 4.3: Display Prioritization and Multiple Line Display

As an end user viewing the device,
I want to see bus arrivals prioritized by arrival time with multiple lines displayed,
So that I can quickly see which buses are arriving soonest.

**Acceptance Criteria:**

**Given** Device is displaying bus arrival information
**When** Multiple arrivals are available for different lines
**Then** Arrivals are displayed prioritized by arrival time (soonest arrivals shown first) (FR44)
**And** Multiple lines are displayed simultaneously (FR17)
**And** Each line shows:
- Line number/identifier
- Arrival time (minutes until arrival or scheduled time)
- Stop name (if multiple stops configured)
**When** Arrival times update
**Then** Display refreshes automatically every 30-60 seconds (FR16)
**And** Prioritization is recalculated based on new arrival times
**And** Display remains readable and organized
**And** Update process doesn't cause flickering or display glitches
**And** Display format matches the live preview shown during configuration

### Story 4.4: Error Handling and Fallback Behavior

As a system,
I want to handle API errors gracefully and provide fallback behavior,
So that users always see useful information even when external services fail.

**Acceptance Criteria:**

**Given** Device is polling backend for arrival data
**When** ZET API is unavailable or returns an error
**Then** Backend handles the error gracefully (FR18)
**And** Backend attempts to serve cached data if available (within TTL)
**When** Cached data is available
**Then** Device receives cached data with appropriate staleness indicator
**And** Device displays cached data with clear indication it may be outdated
**When** No cached data is available
**Then** Backend returns error response with appropriate error code (`API_UNAVAILABLE`, `API_RATE_LIMIT_EXCEEDED`, etc.)
**And** Device displays appropriate fallback message
**And** Device continues polling and will update when API becomes available
**When** Transit API failures occur
**Then** System handles errors gracefully (NFR29)
**And** Appropriate fallback behavior is provided (NFR30)
**And** Error recovery mechanisms are triggered (NFR31)
**When** Data is unavailable or stale
**Then** Users are informed clearly (NFR32)
**And** Error messages are user-friendly and clear (NFR25, NFR33)
**And** Error handling maintains polished user experience (premium UX requirement)
**And** System remains functional for core operations (NFR33)

## Epic 5: Device Management & Troubleshooting

Users can monitor device status, verify connections, restart devices remotely, and access troubleshooting guidance—all with clear, polished interfaces.

### Story 5.1: Device Status Monitoring and Display

As a user,
I want to view my device's online/offline status,
So that I can see if my device is connected and functioning properly.

**Acceptance Criteria:**

**Given** I have a configured device
**When** I access the device management screen (via Bluetooth or device list)
**Then** Device status is displayed clearly:
- Online status: Green indicator with "Online" label
- Offline status: Grey indicator with "Offline" label
- Connecting status: Animated indicator with "Connecting..." label
- Error status: Red indicator with error message
**When** Device is online
**Then** Status shows last update time
**And** Status shows connection quality if available
**When** Device is offline
**Then** Status shows last seen time
**And** Status indicates when device was last online
**When** Status updates
**Then** Status indicator updates in real-time
**And** Status display feels polished and clear (premium UX requirement)
**And** Status information is accurate and up-to-date (FR19)

### Story 5.2: Remote Device Verification

As a user,
I want to verify my device connection remotely,
So that I can check if the device is responding and configured correctly.

**Acceptance Criteria:**

**Given** I am viewing device status
**When** I tap "Verify Connection" button
**Then** Verification process starts
**And** Status indicator shows "Verifying..." with loading animation
**When** Device is online and responding
**Then** Verification succeeds
**And** Success message is displayed ("Device is online and responding")
**And** Device configuration is verified (stops, lines, WiFi status)
**When** Device is offline or not responding
**Then** Verification fails
**And** Clear error message is displayed ("Device is offline" or "Device not responding")
**And** Troubleshooting guidance is provided
**When** Verification completes
**Then** Status is updated accordingly
**And** Verification can be retried if needed
**And** Verification process feels polished and builds confidence (premium UX requirement)
**And** Remote verification works without requiring Bluetooth connection (FR20)

### Story 5.3: Remote Device Restart

As a user,
I want to restart my device remotely when it's online,
So that I can resolve issues without physically accessing the device.

**Acceptance Criteria:**

**Given** I am viewing device management screen
**When** Device is online
**Then** "Restart Device" button is available
**When** I tap "Restart Device"
**Then** Confirmation dialog appears ("Are you sure you want to restart the device?")
**And** I can confirm or cancel the restart
**When** I confirm restart
**Then** Restart command is sent to device via backend Edge Function (`/functions/v1/device-status`)
**And** Status indicator shows "Restarting..." with loading animation
**When** Device receives restart command
**Then** Device restarts and reconnects
**And** Status updates to show device is back online
**When** Restart is successful
**Then** Success message is displayed ("Device restarted successfully")
**And** Device status shows as online after restart
**When** Restart fails or device doesn't come back online
**Then** Error message is displayed with troubleshooting guidance
**And** Retry option is available
**When** Device is offline
**Then** "Restart Device" button is disabled or shows "Device must be online"
**And** Clear message explains why restart is unavailable
**And** Remote restart only works when device is online (FR21)
**And** Restart process feels polished and reliable (premium UX requirement)

### Story 5.4: Troubleshooting Guides and Error Recovery

As a user,
I want to access troubleshooting guidance when my device has issues,
So that I can resolve problems without needing support.

**Acceptance Criteria:**

**Given** I am experiencing a device issue (offline, not updating, connection problems)
**When** I access troubleshooting section
**Then** Troubleshooting guides are available for common issues:
- Device offline → Check WiFi connection, check device power, verify network
- Device not updating → Check backend connection, verify configuration, restart device
- Bluetooth connection issues → Enable Bluetooth, check device pairing mode, retry connection
- WiFi configuration issues → Check network credentials, verify network availability, retry setup
**When** I select a troubleshooting guide
**Then** Step-by-step instructions are displayed
**And** Instructions are clear and actionable
**And** Visual indicators or icons help explain steps
**When** Troubleshooting steps don't resolve the issue
**Then** Additional help options are provided
**And** Support contact information is available
**When** Common errors occur
**Then** Troubleshooting guidance is automatically suggested
**And** Recovery paths are clearly presented
**And** Users are never left stuck without next steps
**And** Troubleshooting guides feel helpful and build confidence (premium UX requirement)
**And** System provides troubleshooting guidance for common issues (FR23)

## Epic 6: Account Management & Multi-Device Support (Post-MVP)

Users can create accounts, authenticate, and manage multiple devices from a single dashboard interface.

**Note:** This epic is Post-MVP and not required for initial MVP release.

### Story 6.1: User Account Creation with Email/Password

As a user,
I want to create an account using email and password,
So that I can manage multiple devices from one place.

**Acceptance Criteria:**

**Given** I am a new user who wants to create an account
**When** I tap "Create Account" or "Sign Up"
**Then** Account creation form is displayed with:
- Email input field
- Password input field
- Password confirmation field
- Terms of service acceptance checkbox
**When** I enter valid email and password
**Then** Email format is validated
**And** Password meets security requirements (minimum length, complexity)
**When** I submit the form
**Then** Account is created via Supabase Auth (FR25)
**And** User is authenticated automatically
**And** Success message is displayed
**When** Email already exists
**Then** Error message is displayed ("Email already registered")
**And** I can sign in instead or use different email
**When** Account creation is successful
**Then** User is redirected to device dashboard
**And** Account is linked to Supabase user profile
**And** Account creation uses Supabase Auth email/password authentication (NFR17)

### Story 6.2: Google Authentication Integration

As a user,
I want to sign in with my Google account,
So that I can quickly create an account without entering email and password.

**Acceptance Criteria:**

**Given** I am on the account creation or sign-in screen
**When** I tap "Sign in with Google"
**Then** Google OAuth flow is initiated via Supabase Auth
**And** I am redirected to Google sign-in page
**When** I authenticate with Google
**Then** Google OAuth callback is handled by Supabase Auth
**And** Account is created automatically if it doesn't exist
**And** User is authenticated and signed in
**When** Authentication is successful
**Then** User is redirected to device dashboard
**And** Account is linked to Google account
**And** Google authentication uses Supabase Auth Google OAuth (FR26, NFR17)
**When** Authentication fails
**Then** Clear error message is displayed
**And** I can retry or use email/password instead

### Story 6.3: Multi-Device Dashboard

As a user with an account,
I want to view all my devices in a dashboard,
So that I can see all my devices in one place.

**Acceptance Criteria:**

**Given** I am signed in to my account
**When** I access the device dashboard
**Then** All devices linked to my account are displayed
**And** Each device shows:
- Device name/identifier
- Status (online/offline)
- Last update time
- Location/name if configured
**When** I have multiple devices
**Then** Devices are displayed in a list or grid layout
**And** I can see all devices at once
**When** I have no devices yet
**Then** Empty state is shown with "Add Device" CTA
**And** Empty state guides me to add my first device
**When** Device status updates
**Then** Dashboard refreshes to show current status
**And** Status indicators update in real-time
**And** Dashboard provides quick access to device management (FR28)
**And** Multi-device dashboard is accessible from account interface (FR29)

### Story 6.4: Device Management from Account

As a user with multiple devices,
I want to manage all my devices from a single interface,
So that I can configure, monitor, and troubleshoot all devices efficiently.

**Acceptance Criteria:**

**Given** I am viewing my device dashboard
**When** I select a device
**Then** Device detail screen opens showing:
- Device configuration (stops, lines)
- Device status and management options
- Recent activity or updates
**When** I want to configure a device
**Then** I can access device configuration (same as Epic 3 functionality)
**And** Configuration changes are saved to the device
**When** I want to manage device status
**Then** I can verify connection, restart device (same as Epic 5 functionality)
**And** Management actions work for any device in my account
**When** I have multiple devices
**Then** I can switch between devices easily
**And** Each device maintains its own configuration
**And** All devices can be managed from the same interface (FR29)
**And** Device management feels consistent and polished across all devices

### Story 6.5: Device Switching and Organization

As a user with multiple devices,
I want to switch between devices and organize them,
So that I can easily access and manage each device.

**Acceptance Criteria:**

**Given** I have multiple devices in my account
**When** I want to switch to a different device
**Then** I can select device from dashboard
**And** Device detail screen opens for selected device
**And** I can navigate back to dashboard to select another device
**When** I want to organize devices
**Then** I can:
- Rename devices with custom names
- Group devices by location (home, office, etc.) if grouping feature exists
- Set device favorites or priorities
**When** I add a new device
**Then** New device is automatically added to my account (FR27)
**And** Device appears in dashboard immediately
**And** I can configure it right away
**When** I switch between devices
**Then** Device context is preserved
**And** Configuration and status load correctly for each device
**And** Switching feels smooth and intuitive (FR30)
**And** Device organization features enhance usability without complexity

## Epic 7: Internationalization & Localization

Users can use the app in their preferred language, with all user-facing text, error messages, and interface elements properly localized.

### Story 7.1: Internationalization Infrastructure Setup

As a developer,
I want to set up internationalization infrastructure in the React Native app,
So that all user-facing text can be translated and displayed in multiple languages.

**Acceptance Criteria:**

**Given** The React Native app is initialized
**When** I set up internationalization infrastructure
**Then** i18n library is integrated (react-i18next or similar React Native i18n solution)
**And** Translation file structure is established (`locales/[lang]/[namespace].json`)
**And** Language detection mechanism is implemented (device language detection)
**And** Default language fallback is configured (Croatian or English)
**And** Language context/provider is set up in app root
**And** Translation hook (`useTranslation`) is available throughout the app
**And** Initial languages are configured: Croatian (hr), English (en)

### Story 7.2: Language Selection and Persistence

As a user,
I want to select my preferred language in app settings,
So that the app displays in a language I understand.

**Acceptance Criteria:**

**Given** I am using the app
**When** I access app settings
**Then** Language selection option is available
**And** Available languages are displayed (Croatian, English, and any additional languages)
**When** I select a language
**Then** App interface immediately updates to selected language
**And** Language preference is saved to AsyncStorage
**And** Selected language persists across app restarts (FR50)
**When** I reopen the app
**Then** App displays in my previously selected language
**And** Language preference is restored from storage

### Story 7.3: Device Language Detection and Default Setting

As a user,
I want the app to automatically detect my device language and set it as default,
So that I don't have to manually configure the language if it matches my device.

**Acceptance Criteria:**

**Given** I am opening the app for the first time
**When** App initializes
**Then** App detects device language using React Native localization APIs
**And** If device language is Croatian (hr), app defaults to Croatian (FR49)
**And** If device language is English (en), app defaults to English
**And** If device language is not supported, app defaults to English (fallback)
**When** Device language is detected
**Then** App displays in detected language automatically
**And** User can still change language manually in settings
**And** Manual language selection overrides device language detection

### Story 7.4: UI Text Localization

As a user,
I want all UI elements (buttons, labels, messages) to be displayed in my selected language,
So that I can understand and use the app effectively.

**Acceptance Criteria:**

**Given** I have selected a language (Croatian or English)
**When** I view any screen in the app
**Then** All UI text is displayed in selected language:
- Button labels (Add Device, Connect, Save, Cancel, etc.)
- Screen titles and headings
- Form labels and placeholders
- Navigation labels
- Status messages
- Empty state messages
**And** Text is properly formatted for the language (date formats, number formats)
**And** Text length accommodates different language string lengths
**And** Layout adapts to longer/shorter translations without breaking
**And** All user-facing text is translatable (FR48)

### Story 7.5: Error Messages and Troubleshooting Guides Localization

As a user,
I want error messages and troubleshooting guides to be available in my language,
So that I can understand issues and resolve them effectively.

**Acceptance Criteria:**

**Given** I have selected a language
**When** An error occurs (Bluetooth connection fails, WiFi error, device not found, etc.)
**Then** Error messages are displayed in my selected language (FR52)
**And** Error messages are clear and user-friendly (not technical jargon)
**And** Troubleshooting guides are available in my selected language
**When** I access troubleshooting section
**Then** All troubleshooting content is displayed in my selected language:
- Step-by-step instructions
- Error recovery guidance
- Common issue resolutions
**And** Troubleshooting content is culturally appropriate and clear
**And** Error codes remain consistent across languages (for support purposes)

### Story 7.6: Map Interface and Bus Stop Information Localization

As a user,
I want map interface elements and bus stop information to be localized,
So that I can navigate and understand stop information in my language.

**Acceptance Criteria:**

**Given** I have selected a language
**When** I view the map interface
**Then** Map controls and labels are displayed in my selected language:
- Map control buttons
- Zoom controls
- Location search labels
- Stop marker labels
**When** I view bus stop information
**Then** Stop names and information are displayed appropriately:
- Stop names from transit API (if available in multiple languages)
- Stop information labels
- Line information labels
**And** Map interface supports localization (FR51)
**And** Date and time formats match language conventions
**When** I search for stops
**Then** Search interface is localized
**And** Search results display in appropriate language

### Story 7.7: Translation Management and Quality

As a developer,
I want to manage translations efficiently and ensure quality,
So that the app provides a consistent, high-quality multilingual experience.

**Acceptance Criteria:**

**Given** Translation infrastructure is set up
**When** I add or update translations
**Then** Translation files follow consistent structure (`locales/[lang]/[namespace].json`)
**And** Translation keys follow naming convention (`feature.component.element`)
**And** Missing translations are detected and logged
**And** Fallback to default language (English) when translation missing
**When** Translations are reviewed
**Then** Translations are reviewed by native speakers for accuracy
**And** Cultural appropriateness is verified
**And** Technical terminology is consistent
**When** New features are added
**Then** All new user-facing text is added to translation files
**And** Translation completeness is verified before release
**And** Translation files are version controlled and maintained
