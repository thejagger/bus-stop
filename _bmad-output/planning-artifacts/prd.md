---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments:
  - 'docs/index.md'
  - 'docs/project-overview.md'
  - 'docs/architecture.md'
  - 'docs/technology-stack.md'
  - 'docs/source-tree-analysis.md'
  - 'docs/api-contracts.md'
  - 'docs/data-models.md'
  - 'docs/state-management.md'
  - 'docs/ui-components.md'
  - 'docs/development-guide.md'
  - 'docs/deployment-guide.md'
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 11
classification:
  projectType: mobile_app
  domain: transit
  complexity: medium
  projectContext: brownfield
workflowType: 'prd'
---

# Product Requirements Document - bus-stop

**Author:** derjäger  
**Date:** 2026-01-21T21:01:27.313Z
**Last Updated:** 2026-01-21 (Architecture changed from Web App to React Native Mobile App with Bluetooth)

## Success Criteria

### User Success

**Admin Users:**
- Add devices in under 2 minutes from physical device creation
- Generate and store unique device keys automatically
- Troubleshoot connection issues remotely (verification, restart when online)
- Manage multiple devices per account efficiently

**Device Setup Users:**
- Complete setup via Bluetooth discovery in React Native app in under 5 minutes
- Add device to existing account seamlessly (multi-device support)
- Configure WiFi connection by selecting network in app (no password entry needed)
- Add bus stops to device in seconds with auto-save (no manual save button)
- See live preview of device display via Bluetooth while configuring
- Navigate map interface smoothly and intuitively

**End Users (Passengers):**
- View real-time bus arrivals at home
- See all important connections for their location
- Display updates automatically without manual refresh

### Business Success

**Initial Success (MVP):**
- Friends successfully use devices at home
- Sell a few units to validate product-market fit
- Project is personally fulfilling and fun to implement

**Measurable Outcomes:**
- At least 3-5 friends actively using devices
- At least 2-3 paid sales completed
- Positive user feedback on setup experience

### Technical Success

**Core Functionality:**
- Real-time updates working reliably on desk/working place
- Device setup workflow fully functional end-to-end
- System stable enough for daily use

**Performance:**
- Updates refresh automatically (target: every 30-60 seconds)
- Setup process completes without errors
- System handles multiple devices per account

### Measurable Outcomes

**User Adoption:**
- Setup completion rate: >90% of users complete device setup successfully
- Time to first value: Users see bus arrivals within 5 minutes of setup
- Daily active usage: Users check display multiple times per day

**System Reliability:**
- Device connectivity uptime: >95%
- Update accuracy: Real-time data displayed within 60 seconds of API update
- Setup success rate: >90% of devices configured without support

## Product Scope

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP with Experience Focus
- Core value: Enable users to see real-time bus arrivals at home
- Experience focus: Smooth, intuitive device setup workflow
- Validation goal: Friends successfully use devices and want their own

**Resource Requirements:**
- Solo developer or small team
- Focus on core functionality first
- Iterative development approach

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- First-time device setup (no account required)
- Device configuration (stop and line selection)
- Real-time bus arrival display
- Basic device troubleshooting

**Must-Have Capabilities:**

1. **Device Setup Workflow**
   - Bluetooth Low Energy (BLE) device discovery in React Native app
   - WiFi configuration via Bluetooth (select network, send credentials)
   - Device registration with unique keys
   - Individual device configuration (no account required)

2. **Bus Stop Configuration**
   - Interactive map interface for stop selection
   - Line/direction selection
   - Auto-save functionality (no manual save button)
   - Live preview/demo view during configuration

3. **Real-Time Display**
   - Bus arrival updates on device display
   - Automatic refresh (every 30-60 seconds)
   - Multiple line display
   - Reliable data refresh

4. **Basic Device Management**
   - Device status monitoring
   - Remote verification
   - Remote restart capability
   - Basic troubleshooting guides

**MVP Exclusions (Post-MVP):**
- Account creation and management
- Multi-device dashboard
- Advanced troubleshooting tools
- Device analytics
- Google authentication

### Post-MVP Features

**Phase 2 (Post-MVP - Growth):**

**Account & Multi-Device Support:**
- Optional account creation (email/password or Google auth)
- Multi-device account management
- Device dashboard for account holders
- Device grouping and organization

**Enhanced Features:**
- Advanced troubleshooting tools and diagnostics
- Device analytics and usage monitoring
- Custom alert configurations
- Enhanced map features and search
- Historical data and arrival patterns

**Phase 3 (Expansion - Vision):**

**Platform Features:**
- Mobile app for device management on-the-go
- Public API for third-party integrations
- Advanced scheduling and route optimization
- Community features and connection sharing

**Integration & Scale:**
- Integration with smart home systems
- Voice alerts and notifications
- Multi-language support
- Enterprise/wholesale features

### Risk Mitigation Strategy

**Technical Risks:**

**Risk:** Device connectivity and reliability
- **Mitigation:** Robust error handling, retry mechanisms, device verification
- **Fallback:** Manual troubleshooting guides, device restart capability

**Risk:** Real-time data accuracy and availability
- **Mitigation:** Efficient API integration, caching strategy, error handling
- **Fallback:** Graceful degradation, cached data display

**Risk:** Mobile performance during setup
- **Mitigation:** Mobile-first design, performance optimization, testing on real devices
- **Fallback:** Simplified setup flow, progressive enhancement

**Market Risks:**

**Risk:** User adoption and setup complexity
- **Mitigation:** Intuitive setup flow, clear instructions, live preview
- **Validation:** Test with friends, gather feedback, iterate on setup experience

**Risk:** Product-market fit validation
- **Mitigation:** MVP focus on core value, early user testing
- **Learning:** Track setup completion rates, user satisfaction, usage patterns

**Resource Risks:**

**Risk:** Scope creep and feature bloat
- **Mitigation:** Strict MVP boundaries, phased development approach
- **Contingency:** Prioritize must-haves, defer nice-to-haves to Phase 2

**Risk:** Development timeline
- **Mitigation:** Focus on MVP first, iterative development
- **Contingency:** Reduce MVP scope if needed, ensure core functionality works

## User Journeys

### Journey 1: First-Time Device Setup User (No Account)

**Opening Scene:**
Sarah receives the package. She removes the thin cover, takes out the device from its hard paper mold, and sees setup instructions directing her to download the React Native app. She's excited to set up her first bus display.

**Rising Action:**
- Downloads React Native app from App Store/Google Play
- Opens app and taps "Add Device"
- App scans for nearby Bluetooth devices
- Selects her device from the discovered list
- Pairs with device via Bluetooth
- Configures WiFi by selecting network from list (no password entry needed)
- Sees interactive map of bus stops
- Selects her home stop
- Chooses bus lines/directions
- Sees live preview of device display via Bluetooth

**Potential Obstacles:**
- Device appears broken (LEDs not lighting)
- WiFi connection fails
- Bluetooth not enabled on phone
- Device not in pairing mode
- Bluetooth pairing fails
- Can't find her stop on the map

**Recovery Paths:**
- Troubleshooting guide in the app
- Enable Bluetooth guidance
- Device pairing mode instructions
- Bluetooth troubleshooting guide
- Device verification/restart when online
- Map search and location assistance

**Climax:**
She sees her bus line on the screen, checks the real-time arrival, and confirms it matches the actual bus schedule. The display updates automatically.

**Resolution:**
The device works independently. She can configure it without an account and add more devices later (individually or by creating an account).

---

### Journey 1b: First-Time Device Setup User (With Account)

**Opening Scene:**
Tom receives the package and wants to manage multiple devices from one place.

**Rising Action:**
- Downloads React Native app (if not already installed)
- Opens app and taps "Add Device"
- Chooses "Create account" option
- Sees options: Email/password or "Sign in with Google"
- Chooses Google auth (quick sign-in)
- Account created instantly
- App scans for Bluetooth devices
- Selects device and pairs via Bluetooth
- Configures WiFi by selecting network
- Configures device (same as no-account path)
- Device automatically linked to account

**Climax:**
Device is configured and linked to his account. He can see it in his dashboard.

**Resolution:**
He can add more devices later, all managed from one account.

---

### Journey 2: Returning User - Multiple Devices

**Scenario A: Individual Configuration (No Account)**
- Mike sets up a second device individually
- Opens app, discovers device via Bluetooth, pairs, configures WiFi, selects stops
- Each device works independently
- No central management, but simple setup

**Scenario B: Account-Based (With Account)**
- Mike already has an account (from first device or created later)
- Buys a second device for work
- Opens app and logs in (Google auth or email)
- Sees "Add New Device" option
- App scans for Bluetooth devices
- Selects new device and pairs via Bluetooth
- Device added to account
- Quick WiFi setup (selects network)
- Configures work stop (different from home)
- Both devices appear in dashboard

**Climax:**
Both devices show different stops (home vs work) and are managed from one account.

**Resolution:**
He can manage both devices together, see their status, and add more devices easily.

---

### Journey 3: Device Manager/Viewer (Daily Use)

**Opening Scene:**
Emma glances at her device while working from home.

**Rising Action:**
- Checks display for next bus arrivals
- Sees multiple lines
- Later wants to add a new stop
- Opens React Native app
- If no account: discovers device via Bluetooth, pairs, configures directly
- If has account: logs in, selects device from list, connects via Bluetooth, adds stop via map
- Auto-saves immediately
- Sees live preview update via Bluetooth

**Climax:**
The device shows real-time arrivals for all her important connections.

**Resolution:**
The device becomes part of her daily routine. She can adjust stops easily, with or without an account.

---

### Journey 4: Troubleshooting Journey

**Opening Scene:**
David notices his device stopped updating.

**Rising Action:**
- Opens React Native app
- If no account: Discovers device via Bluetooth, pairs to access device directly
- If has account: Logs in, goes to device management, selects device
- Connects to device via Bluetooth
- Sees device status: "Offline" or "Connection Issue"
- Taps "Verify Connection" or "Restart Device"
- System attempts to reconnect
- If online, device restarts and reconnects
- If still offline, troubleshooting guide appears

**Climax:**
Device comes back online and updates resume.

**Resolution:**
He can manage device issues remotely, whether he has an account or not.

## React Native Mobile App Requirements

### Project-Type Overview

**Architecture:** React Native Mobile Application
- Cross-platform mobile app (iOS and Android)
- Native mobile interface optimized for both platforms
- Bluetooth Low Energy (BLE) integration for device communication
- Backend API integration via Supabase and external APIs

**Deployment:** Native Mobile App Distribution
- iOS: App Store distribution
- Android: Google Play Store distribution
- Version management and synchronization across platforms

### React Native App Architecture

**Platform Support:**
- **iOS:** iOS 13.0+ (iPhone and iPad)
- **Android:** Android 6.0+ (API level 23+)
- Native performance with platform-specific optimizations

**Application Structure:**
- React Native with TypeScript
- Component-based architecture
- State management via React Context / Zustand for client state
- TanStack Query for server state and API integration
- React Hook Form for form state management

**Bluetooth Integration:**
- Bluetooth library: react-native-ble-plx (recommended) or react-native-bluetooth-classic
- BLE scanning and device discovery
- Secure pairing and bonding
- GATT service/characteristic communication
- Platform-specific Bluetooth APIs handled by library

**Platform-Specific Permissions:**
- **iOS:** Location permission required for BLE scanning (inform users why)
- **Android:** Location permission required for BLE scanning (Android 6.0+)
- Bluetooth permission handling
- Network permission for WiFi scanning (if needed)

### Device Hardware Requirements

**Required Device Capabilities:**
- **BLE Chip:** Bluetooth 4.0+ / Bluetooth Low Energy required
- **WiFi:** 802.11n minimum (802.11ac preferred)
- **Display:** Wide format e-ink display (monochrome, 2.9" or 4.2" recommended, exact size TBD - optimized for horizontal text display)
- **Compute:** ESP32 (with integrated BLE + WiFi)
- **Storage:** 4MB minimum flash storage (sufficient for firmware + configuration data)

**Device State Management:**
- First-boot enters pairing mode automatically
- Factory reset capability (hardware button or app command)
- Device state tracking (new, configured, needs setup)
- Clear visual/audio indicators for device state

### Device-to-Cloud Architecture Model

**Architecture:** Thin Device Model

**Device Role:**
- Device receives pre-rendered display data from backend
- Device polls backend every 30-60 seconds for updated display data
- Device renders received data on e-ink display
- Device stores configuration locally (WiFi credentials, stop/line settings)

**Backend Role:**
- Backend fetches real-time bus arrival data from ZET API
- Backend formats data for device display (pre-rendered layout)
- Backend caches ZET API responses to reduce API calls
- Backend handles rate limiting and error recovery
- Backend manages device configuration and status

**Data Flow:**
1. Device polls backend via WiFi every 30-60 seconds
2. Backend fetches from ZET API (if cache expired) or serves cached data
3. Backend formats data for device display format
4. Device receives pre-rendered display data
5. Device updates e-ink display with new data
6. Device displays cached data if backend unavailable

**Network Requirements:**
- Device requires WiFi connection (no cellular fallback)
- Device must have internet connectivity for data updates
- Configuration can be done via Bluetooth even if WiFi not connected (stored locally, activated when WiFi available)

**Benefits:**
- Simpler device firmware (rendering only, no API integration)
- Centralized logic and easier updates
- Lower device cost (ESP32 sufficient)
- Better error handling and caching at backend
- Easier to scale (backend handles API rate limits)

### Bluetooth Communication Protocol

**BLE Service Architecture:**
- Custom BLE service for device communication
- GATT characteristics for:
  - WiFi credential transfer
  - Bus stop/line configuration
  - Device status and display state
  - Device control commands (restart, verify)

**Pairing Security Model:**
- Secure pairing/bonding process
- Encrypted BLE communication
- Device authentication via unique device keys
- Pairing mode activation (automatic on first boot, manual via hardware button)

**Data Transfer Format:**
- JSON format for configuration data
- Binary format for display data (if needed)
- Error handling and retry mechanisms
- Connection state management

### Platform Support

**iOS Requirements:**
- iOS 13.0+ support
- Location permission for BLE scanning
- App Store distribution and approval process
- TestFlight for beta testing

**Android Requirements:**
- Android 6.0+ (API level 23+) support
- Location permission for BLE scanning
- Google Play Store distribution
- Internal testing track for beta

**Version Management:**
- Synchronized version numbers across platforms
- Feature parity between iOS and Android
- Platform-specific optimizations where needed

### Performance Targets

**Primary Concern:** Mobile app performance and battery efficiency

**Performance Goals:**
- App launch time: < 2 seconds
- Bluetooth device discovery: < 5 seconds
- Map interface loads and becomes interactive: < 3 seconds
- Setup flow completion: Smooth, no lag during interactions
- Bluetooth data transfer: Efficient, minimal battery impact

**Optimization Strategies:**
- Code splitting and lazy loading
- Image optimization and caching
- Efficient Bluetooth communication (minimize connection time)
- Background task optimization
- Battery-efficient BLE scanning

**Monitoring:**
- App performance metrics (launch time, frame rate)
- Bluetooth connection success rate
- Setup flow completion times
- Battery usage impact

### Native Mobile Design

**Design Approach:**
- Native iOS and Android design patterns
- Platform-specific UI components where appropriate
- Consistent user experience across platforms
- Touch-optimized interactions (large tap targets)

**Critical Mobile Flows:**
- Bluetooth device discovery and pairing
- WiFi network selection and credential transfer
- Map-based stop selection
- Device configuration and live preview
- Error recovery and troubleshooting

### Accessibility

**Target:** WCAG standard compliance (mobile app accessibility)

**Key Requirements:**
- Screen reader compatibility (VoiceOver on iOS, TalkBack on Android)
- Dynamic type support (iOS) / Font scaling (Android)
- Color contrast compliance
- Touch target size (minimum 44x44 points)
- Clear error messages and feedback

**Priority Areas:**
- Device setup flow (critical user path)
- Map interface (stop selection)
- Error messages and recovery guidance
- Bluetooth pairing process

### Implementation Considerations

**Mobile-First Development:**
- Test Bluetooth functionality on actual iOS and Android devices
- Optimize map performance on mobile
- Ensure smooth touch interactions
- Validate setup flow on various phone sizes and models

**Map Library:**
- **Library:** Leaflet.js with react-leaflet (React wrapper for Leaflet)
- **Implementation:** 
  - For React Native: Use react-native-webview to embed Leaflet map (web-based Leaflet in WebView)
  - Alternative: Use react-native-maps with Leaflet-style OpenStreetMap tiles if native performance is critical
- **Map Source:** OpenStreetMap (free, open-source, no API costs)
- **Tile Provider:** OpenStreetMap tiles directly or compatible providers (MapTiler, Stadia Maps)
- **Benefits:** 
  - Mature, well-documented library
  - Extensive plugin ecosystem (marker clustering, geocoding, etc.)
  - Excellent OpenStreetMap integration
  - Free, no usage limits
  - Already used in existing codebase (react-leaflet)
- **Features:** Interactive map, stop selection, pan/zoom, location search, marker clustering, custom markers
- **Considerations:** 
  - WebView approach has some performance overhead but acceptable for map interactions
  - Tile caching recommended for offline capability
  - Ensure good tile loading performance on mobile networks

**Real-Time Update Strategy:**
- Backend API polling for bus arrival data (every 30-60 seconds)
- Efficient data fetching to minimize battery impact
- Background updates without blocking UI
- Error handling for failed API calls

**Bluetooth Connection Management:**
- Efficient BLE scanning (scan intervals, duration)
- Connection pooling and reuse
- Automatic reconnection on failure
- Connection state indicators in UI

**Offline Capability:**
- Configuration state persisted locally (AsyncStorage or similar)
- Resume configuration after app restart
- Partial configuration recovery
- Offline mode for configuration (store locally, sync when online)

## Functional Requirements

### Device Setup & Onboarding

- FR1: Users can discover nearby devices via Bluetooth Low Energy (BLE) scanning in React Native app
- FR2: Users can configure device WiFi connection by selecting network in app and sending credentials to device via Bluetooth BLE
- FR3: System can generate and store unique device keys
- FR4: Users can set up device without creating an account
- FR5: System can register devices with unique identifiers
- FR6: Users can access device configuration via Bluetooth pairing in React Native app
- FR36: System can securely pair/bond React Native app with device via Bluetooth BLE
- FR37: App can identify and display device information during Bluetooth discovery (device name, signal strength, pairing status)
- FR38: Device can enter pairing mode for initial setup (automatic on first boot, manual via hardware button)

### Device Configuration

- FR7: Users can view interactive map of bus stops
- FR8: Users can select bus stops from map interface
- FR9: Users can select bus lines and directions for selected stops
- FR10: Users can see live preview of device display via Bluetooth connection during configuration
- FR11: System can auto-save configuration changes without manual save action
- FR12: Users can configure multiple stops per device (maximum: 10 stops)
- FR13: Users can configure multiple lines per stop (maximum: 5 lines per stop)
- FR39: App can send bus stop and line configuration to device via Bluetooth BLE
- FR40: App can receive device status and display state via Bluetooth BLE for live preview
- FR41: Configuration state persists locally in app and can be resumed after app restart

### Real-Time Data Display

- FR14: System can fetch real-time bus arrival data from transit API
- FR15: Device display can show bus arrival times for configured stops and lines
- FR16: System can automatically refresh arrival data at regular intervals (every 30-60 seconds)
- FR17: Device display can show multiple lines simultaneously
- FR18: System can handle API errors gracefully and display appropriate fallback
- FR44: Display order prioritizes bus arrivals by arrival time (soonest arrivals shown first)
- FR45: Display updates within 60 seconds regardless of number of configured stops/lines (performance requirement)

### Device Management

- FR19: Users can view device status (online/offline)
- FR20: Users can verify device connection remotely
- FR21: Users can restart device remotely when device is online
- FR22: Users can access device configuration directly via Bluetooth connection in React Native app
- FR23: System can provide troubleshooting guidance for common issues
- FR24: Users can modify device configuration after initial setup
- FR42: App handles Bluetooth connection failures gracefully with clear error messages and recovery guidance
- FR43: App can configure device even when device is not connected to WiFi (configuration stored on device, activated when WiFi connected)

### Account Management (Post-MVP - Phase 2)

- FR25: Users can create account using email/password
- FR26: Users can create account using Google authentication
- FR27: Users can add multiple devices to single account
- FR28: Users can view all devices in account dashboard
- FR29: Users can manage multiple devices from single interface
- FR30: Users can switch between devices in account

### User Interface

- FR31: React Native app provides native mobile interface optimized for iOS and Android
- FR32: Users can navigate setup workflow intuitively
- FR33: System can provide clear error messages and recovery guidance
- FR34: Users can access device configuration from React Native mobile app
- FR35: Map interface supports native touch interactions (pan, zoom, tap)

## Non-Functional Requirements

### Performance

**Map Performance:**
- Map interface loads and becomes interactive within 3 seconds on mobile devices
- Bus stops load progressively based on viewport (only visible stops loaded)
- Stop clustering/aggregation when zoomed out for performance
- Map panning and zooming remain smooth without lag
- Setup workflow interactions feel responsive and smooth

**Real-Time Updates:**
- Bus arrival data refreshes every 30-60 seconds without blocking UI
- Update process is non-blocking and doesn't interrupt user interactions
- Data fetching optimized to minimize battery impact on mobile devices

**General Performance:**
- Page load time: < 3 seconds on 4G mobile connection
- Time to interactive: < 5 seconds
- Setup flow completion feels smooth without noticeable delays

### Security

**Authentication:**
- User authentication handled via Supabase Auth (email/password or Google OAuth)
- Supabase security standards are sufficient for this product
- No additional authentication requirements beyond Supabase capabilities

**Device Keys:**
- System validates device keys are valid before allowing device access
- Invalid keys are rejected with appropriate error messaging
- Device key validation occurs on all device access attempts

**Data Protection:**
- Standard Supabase security practices apply
- No special encryption or security requirements beyond Supabase defaults

### Reliability

**Error Handling:**
- System provides clear, user-friendly error messages
- Error states are clearly communicated to users
- System generates error codes for support/debugging purposes
- Users can see what's happening during operations (loading states, progress indicators)

**API Integration:**
- System handles transit API failures gracefully
- Appropriate fallback behavior when external API is unavailable
- Error recovery mechanisms for transient failures
- Users informed when data is unavailable or stale

**System Availability:**
- System remains functional for core operations
- Device setup workflow available when needed
- Real-time updates resume automatically after temporary failures

### Accessibility

**Approach:**
- Standard web accessibility practices (WCAG baseline)
- Accessibility improvements should not remove functionality
- Leverage existing Shadcn/Radix UI accessibility features
- No strict WCAG compliance requirements that would limit features

**Priority Areas:**
- Keyboard navigation for critical flows (device setup)
- Basic screen reader compatibility
- Focus management in forms
- No accessibility requirements that compromise core functionality

### Integration

**External API Integration:**
- ZET API integration must handle rate limits and errors gracefully
- Supabase integration follows standard patterns
- Integration failures don't break core functionality
- Clear error communication when integrations fail
