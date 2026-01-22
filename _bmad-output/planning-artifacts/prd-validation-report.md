---
validationTarget: '_bmad-output/planning-artifacts/prd.md'
validationDate: '2026-01-21'
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
validationStepsCompleted: ['discovery', 'party-mode-analysis']
validationStatus: IN_PROGRESS
---

# PRD Validation Report

**PRD Being Validated:** _bmad-output/planning-artifacts/prd.md
**Validation Date:** 2026-01-21
**Validator:** BMAD Validation System

## Input Documents

**PRD:** prd.md ✓

**Project Documentation (11 files):**
- docs/index.md ✓
- docs/project-overview.md ✓
- docs/architecture.md ✓
- docs/technology-stack.md ✓
- docs/source-tree-analysis.md ✓
- docs/api-contracts.md ✓
- docs/data-models.md ✓
- docs/state-management.md ✓
- docs/ui-components.md ✓
- docs/development-guide.md ✓
- docs/deployment-guide.md ✓

## Validation Findings

### Critical Architecture Change Required

**Status:** 🔴 CRITICAL - PRD describes web-based architecture but actual implementation uses React Native + Bluetooth

**Current PRD State:**
- Describes web app with QR code scanning for device setup
- WLAN configuration through web-based guided workflow
- Device access via QR code or manual device code entry

**Actual Architecture (Per User Confirmation):**
- React Native mobile app for all device interaction
- Bluetooth Low Energy (BLE) for device setup and configuration
- No QR codes required
- No web-based setup workflow

**Rationale:** User confirmed React Native + Bluetooth provides better UX - no password entry, simpler setup process, single app experience. Bluetooth is expected to be available and enabled on modern smartphones.

---

## 1. Missing/Unclear Requirements

### 1.1 Device Key Lifecycle (FR3)

**Issue:** FR3 states "System can generate and store unique device keys" but lacks detail on:
- Key generation method (format, entropy, length)
- Storage location (device, database, both)
- Key rotation or revocation process
- Compromise handling (what happens if key is stolen)

**Recommendation:** Add detailed device key management requirements:
- Key format specification (e.g., UUID v4, 128-bit random)
- Storage requirements (encrypted on device, hashed in database)
- Key lifecycle management (initial generation, rotation policy)
- Security incident response (key revocation process)

### 1.2 Bluetooth Device Discovery and Pairing

**Issue:** PRD describes QR code scanning but actual implementation uses Bluetooth. Missing requirements:
- Bluetooth device discovery process
- Pairing/bonding security model
- Device identification during discovery (how user knows which device)
- Pairing mode activation (how device enters pairing state)

**Recommendation:** Add new functional requirements:
- FR-New1: Users can discover nearby devices via Bluetooth Low Energy (BLE) scanning in React Native app
- FR-New2: System can securely pair/bond app with device via Bluetooth
- FR-New3: App can identify and display device information during discovery (name, signal strength, etc.)
- FR-New4: Device can enter pairing mode for initial setup

### 1.3 WiFi Credential Transfer via Bluetooth

**Issue:** FR2 mentions "WLAN configuration through guided workflow" but doesn't specify:
- How WiFi credentials are transferred to device
- Supported WiFi security protocols (WPA2, WPA3)
- Hidden network support
- Network selection if multiple networks available
- Transfer mechanism (Bluetooth GATT characteristics)

**Recommendation:** Update FR2 and add:
- WiFi credentials sent from app to device via Bluetooth BLE
- Supported protocols: WPA2, WPA3 (WPA3 preferred)
- Hidden network support required
- Network selection UI in app (scan and display available networks)
- Secure credential transfer (encrypted BLE communication)

### 1.4 Data Persistence and Recovery

**Issue:** FR11 states "auto-save configuration changes" but unclear on:
- What happens if app is closed mid-configuration?
- Is configuration stored locally before device sync?
- Can users recover incomplete configurations?
- What if Bluetooth connection drops during configuration?

**Recommendation:** Add requirements:
- Configuration state persisted locally in app (React Native AsyncStorage or similar)
- Configuration can be resumed after app restart
- Partial configuration recovery (save progress incrementally)
- Error handling for Bluetooth disconnection during configuration

### 1.5 Device-to-Cloud Communication Architecture

**Issue:** FR14-FR18 describe data fetching but unclear on:
- How physical device communicates with backend?
- Push vs pull architecture?
- Device's role in data flow?
- Network requirements (WiFi only? Cellular fallback?)

**Recommendation:** Clarify architecture model:
- **Model A (Thin Device):** Device receives pre-rendered display data from backend
- **Model B (Smart Device):** Device fetches directly from ZET API
- Specify which model applies
- Define device network requirements (WiFi required, no cellular)
- Define backend role in data flow

### 1.6 Multi-Device Conflict Resolution

**Issue:** FR27-FR30 mention account management but unclear on:
- Can same stop be configured on multiple devices?
- What if two devices try to update same configuration simultaneously?
- Device naming/organization strategy?
- Configuration sync between devices?

**Recommendation:** Add requirements:
- Multiple devices can have same stop configuration (no conflict)
- Configuration changes are device-specific (no shared state)
- Device naming/organization in account dashboard
- Independent device operation (no cross-device dependencies)

### 1.7 Configuration Limits and Prioritization

**Issue:** FR12-FR13 state "multiple stops/lines" but missing:
- Maximum number of stops per device
- Maximum number of lines per stop
- Display prioritization/ordering logic
- Performance impact of many stops/lines

**Recommendation:** Add measurable requirements:
- Maximum stops per device: [specify number, e.g., 10]
- Maximum lines per stop: [specify number, e.g., 5]
- Display order: [specify logic - arrival time, user-defined priority, etc.]
- Performance requirement: Display updates within [X] seconds regardless of stop/line count

### 1.8 Device Provisioning and First-Boot

**Issue:** Missing requirements for:
- Factory reset process
- First-boot experience
- How device knows it's "new" vs "reconfigured"
- Bulk provisioning capability (if needed)

**Recommendation:** Add requirements:
- Device first-boot enters pairing mode automatically
- Factory reset capability (hardware button or app command)
- Device state tracking (new, configured, needs setup)
- Clear visual/audio indicators for device state

### 1.9 Live Preview Implementation

**Issue:** FR10 states "live preview of device display" but unclear:
- Is this actual device display or simulated?
- How real-time is "live"? (instant, 1-second delay?)
- What if device is offline during preview?
- Preview via Bluetooth or WiFi?

**Recommendation:** Clarify:
- Live preview shows actual device display state
- Preview updates in real-time via Bluetooth connection
- Preview available even if device not connected to WiFi
- Fallback to simulated preview if Bluetooth unavailable

### 1.10 Error Recovery in Setup Flow

**Issue:** User journeys mention obstacles but FRs don't cover:
- What if user scans QR code but device isn't powered on?
- What if user is in location with poor mobile signal during setup?
- Can users pause and resume setup later?
- What if Bluetooth pairing fails?

**Recommendation:** Add error recovery requirements:
- App detects if device is not powered on (no Bluetooth signal)
- Clear error messages for pairing failures
- Setup can be paused and resumed
- Offline capability for configuration (store locally, sync when online)
- Troubleshooting guidance for common Bluetooth issues

---

## 2. Technical Feasibility Concerns

### 2.1 Device Hardware Requirements Not Specified

**Issue:** PRD assumes device capabilities but doesn't specify:
- Device hardware platform (ESP32, Raspberry Pi, custom?)
- Minimum hardware requirements
- BLE chip requirement (now confirmed needed)
- Display type and capabilities
- Compute/storage requirements

**Recommendation:** Add "Device Hardware Requirements" section:
- BLE chip required (Bluetooth 4.0+ / BLE)
- WiFi capability (802.11n minimum)
- Display: [specify type - e.g., e-ink, LED matrix, LCD]
- Minimum compute: [specify - e.g., ESP32, Raspberry Pi Zero W]
- Storage: [specify minimum for firmware + configuration]

### 2.2 Architecture Model Ambiguity

**Issue:** Unclear whether device is "thin" (just display) or "smart" (local processing)

**Current State:** PRD implies thin device model but doesn't explicitly state it.

**Recommendation:** Explicitly define architecture:
- **Recommended:** Thin device model
  - Device receives pre-rendered display data from backend
  - Backend fetches from ZET API, formats for device
  - Device just renders received data
  - Simpler device firmware, centralized logic
- **Alternative:** Smart device model
  - Device fetches directly from ZET API
  - Device processes and displays locally
  - Backend only for configuration management
  - More complex firmware, distributed logic

### 2.3 Real-Time Data Refresh Architecture

**Issue:** FR16 states "refresh every 30-60 seconds" but unclear:
- Who initiates refresh? (Device polling? Server push?)
- What if device offline during refresh window?
- How many concurrent devices can backend handle?
- Rate limiting strategy for ZET API calls?

**Recommendation:** Specify architecture:
- Device polls backend every [30-60] seconds
- Backend caches ZET API responses (reduce API calls)
- Backend handles rate limiting and error recovery
- Device displays cached data if backend unavailable
- Backend scalability: Support [X] concurrent devices

### 2.4 Map Library Selection and Cost

**Issue:** NFR mentions "3 seconds load time" for map but doesn't specify:
- Which map library? (Google Maps, Mapbox, Leaflet, OpenStreetMap)
- Cost implications of map API usage
- Offline map capability needed?
- Data usage impact for users on limited mobile plans

**Recommendation:** Specify map requirements:
- Map library: [specify - consider cost vs features]
- Offline map capability: [required/optional]
- Data usage optimization: [tile caching, progressive loading]
- Cost budget: [specify acceptable monthly cost per user]

### 2.5 React Native Platform Considerations

**Issue:** React Native introduces platform-specific concerns:
- iOS and Android builds required
- App store approval process
- Version management across platforms
- Platform-specific Bluetooth APIs
- iOS location permission requirement for BLE scanning

**Recommendation:** Add project-type requirements:
- React Native app for iOS and Android
- Bluetooth library: react-native-ble-plx or react-native-bluetooth-classic
- iOS: Location permission required for BLE scanning (inform users)
- Android: Location permission required for BLE scanning (Android 6.0+)
- App distribution: App Store + Google Play Store
- Version synchronization across platforms

---

## 3. Required PRD Updates

### 3.1 Functional Requirements to Update

**FR1 - Replace:** "Users can scan QR code from device/box to initiate setup"
**With:** "Users can discover nearby devices via Bluetooth Low Energy (BLE) scanning in React Native app"

**FR2 - Replace:** "Users can configure device WLAN connection through guided workflow"
**With:** "Users can configure device WiFi connection by selecting network in app and sending credentials to device via Bluetooth BLE"

**FR6 - Replace:** "Users can access device setup via QR code or manual device code entry"
**With:** "Users can access device configuration via Bluetooth pairing in React Native app"

**FR22 - Replace:** "Users can access device configuration directly via QR code or device code"
**With:** "Users can access device configuration directly via Bluetooth connection in React Native app"

**FR31 - Update:** "System can provide responsive interface optimized for mobile devices"
**With:** "React Native app provides native mobile interface optimized for iOS and Android"

**FR34 - Update:** "Users can access device configuration from mobile browser"
**With:** "Users can access device configuration from React Native mobile app"

**FR35 - Remove or Update:** "Map interface can support touch interactions" (now native app, touch is standard)

### 3.2 New Functional Requirements Needed

**FR-New1:** Users can discover nearby devices via Bluetooth Low Energy (BLE) scanning in React Native app

**FR-New2:** System can securely pair/bond React Native app with device via Bluetooth BLE

**FR-New3:** App can identify and display device information during Bluetooth discovery (device name, signal strength, pairing status)

**FR-New4:** Device can enter pairing mode for initial setup (automatic on first boot, manual via hardware button)

**FR-New5:** App can send WiFi network credentials to device securely via Bluetooth BLE

**FR-New6:** App can send bus stop and line configuration to device via Bluetooth BLE

**FR-New7:** App can receive device status and display state via Bluetooth BLE for live preview

**FR-New8:** Configuration state persists locally in app and can be resumed after app restart

**FR-New9:** App handles Bluetooth connection failures gracefully with clear error messages and recovery guidance

**FR-New10:** App can configure device even when device is not connected to WiFi (configuration stored on device, activated when WiFi connected)

### 3.3 User Journey Updates Required

**Journey 1 - Update Opening Scene:**
- Remove: "sees setup instructions with a QR code"
- Add: "sees setup instructions directing to download React Native app"

**Journey 1 - Update Rising Action:**
- Remove: "Scans QR code with her phone → Opens setup page/web app"
- Add: "Opens React Native app → Taps 'Add Device' → App scans for Bluetooth devices → Selects her device from list → Pairs via Bluetooth → Configures WiFi by selecting network → Adds stops via map interface"

**Journey 1 - Update Potential Obstacles:**
- Remove: "QR code doesn't scan"
- Add: "Bluetooth not enabled on phone", "Device not in pairing mode", "Bluetooth pairing fails"

**Journey 1 - Update Recovery Paths:**
- Remove: "Manual device code entry if QR fails"
- Add: "Enable Bluetooth guidance", "Device pairing mode instructions", "Bluetooth troubleshooting guide"

### 3.4 New Sections Needed

**Section: Device Hardware Requirements**
- BLE chip specification
- WiFi capability
- Display type
- Compute requirements
- Storage requirements

**Section: React Native App Architecture**
- Platform support (iOS, Android)
- Bluetooth library selection
- Platform-specific permissions
- App distribution strategy

**Section: Bluetooth Communication Protocol**
- BLE service/characteristic definitions
- Pairing security model
- Data transfer format
- Error handling

### 3.5 Project-Type Requirements Update

**Current:** "Web App Specific Requirements"
**Update to:** "React Native Mobile App Requirements"

**Update sections:**
- Browser Support → Platform Support (iOS, Android)
- Responsive Design → Native Mobile Design
- Performance Targets → Mobile App Performance
- Remove SEO Strategy (not applicable to mobile app)

---

## 4. Recommendations

### Priority 1 (Critical - Blocks Implementation)

1. **Update architecture description** to reflect React Native + Bluetooth model
2. **Add device hardware requirements** section specifying BLE capability
3. **Replace all QR code references** with Bluetooth discovery/pairing
4. **Update user journeys** to reflect React Native app flow
5. **Clarify device-to-cloud architecture** (thin device vs smart device model)

### Priority 2 (High - Affects Design)

6. **Add Bluetooth communication protocol** specifications
7. **Define WiFi credential transfer** mechanism via Bluetooth
8. **Specify configuration limits** (max stops, max lines per stop)
9. **Add error recovery requirements** for Bluetooth failures
10. **Define data persistence** and recovery mechanisms

### Priority 3 (Medium - Improves Clarity)

11. **Add device key lifecycle** management details
12. **Specify live preview** implementation details
13. **Define multi-device conflict** resolution approach
14. **Add device provisioning** and first-boot requirements
15. **Clarify map library** selection and cost considerations

---

## Next Steps

1. Review this validation report with stakeholders
2. Update PRD with React Native + Bluetooth architecture
3. Add missing requirements identified above
4. Clarify technical feasibility concerns
5. Re-validate PRD after updates

**Validation Status:** IN_PROGRESS - Critical architecture changes identified, PRD update required before proceeding to implementation.
