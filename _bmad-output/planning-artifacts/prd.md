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
  projectType: web_app
  domain: transit
  complexity: medium
  projectContext: brownfield
workflowType: 'prd'
---

# Product Requirements Document - bus-stop

**Author:** derjäger  
**Date:** 2026-01-21T21:01:27.313Z

## Success Criteria

### User Success

**Admin Users:**
- Add devices in under 2 minutes from physical device creation
- Generate and store unique device keys automatically
- Troubleshoot connection issues remotely (verification, restart when online)
- Manage multiple devices per account efficiently

**Device Setup Users:**
- Complete setup via QR code scan in under 5 minutes
- Add device to existing account seamlessly (multi-device support)
- Configure WLAN connection with guided assistance
- Add bus stops to device in seconds with auto-save (no manual save button)
- See live preview/demo view of device display while configuring
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
   - QR code scanning from device/box
   - WLAN configuration with guided assistance
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
Sarah receives the package. She removes the thin cover, takes out the device from its hard paper mold, and sees setup instructions with a QR code. She's excited to set up her first bus display.

**Rising Action:**
- Scans QR code with her phone
- Opens setup page/web app
- Sees option: "Set up device" (no account) or "Create account"
- Chooses "Set up device" (no account)
- Guided through WLAN connection
- Sees interactive map of bus stops
- Selects her home stop
- Chooses bus lines/directions
- Sees live preview of the display

**Potential Obstacles:**
- Device appears broken (LEDs not lighting)
- WLAN connection fails
- QR code doesn't scan
- Can't find her stop on the map

**Recovery Paths:**
- Troubleshooting guide in the app
- Device verification/restart when online
- Manual device code entry if QR fails
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
- Scans QR code
- Opens setup page
- Chooses "Create account"
- Sees options: Email/password or "Sign in with Google"
- Chooses Google auth (quick sign-in)
- Account created instantly
- Guided through WLAN connection
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
- Scans QR code, configures WLAN, selects stops
- Each device works independently
- No central management, but simple setup

**Scenario B: Account-Based (With Account)**
- Mike already has an account (from first device or created later)
- Buys a second device for work
- Scans QR code
- Logs in (Google auth or email)
- Sees "Add New Device" option
- Device added to account
- Quick WLAN setup
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
- Opens web app
- If no account: scans device QR or enters device code, configures directly
- If has account: logs in, selects device, adds stop via map
- Auto-saves immediately
- Sees live preview update

**Climax:**
The device shows real-time arrivals for all her important connections.

**Resolution:**
The device becomes part of her daily routine. She can adjust stops easily, with or without an account.

---

### Journey 4: Troubleshooting Journey

**Opening Scene:**
David notices his device stopped updating.

**Rising Action:**
- Opens web app
- If no account: Scans device QR or enters device code to access device directly
- If has account: Logs in, goes to device management
- Sees device status: "Offline" or "Connection Issue"
- Clicks "Verify Connection" or "Restart Device"
- System attempts to reconnect
- If online, device restarts and reconnects
- If still offline, troubleshooting guide appears

**Climax:**
Device comes back online and updates resume.

**Resolution:**
He can manage device issues remotely, whether he has an account or not.

## Web App Specific Requirements

### Project-Type Overview

**Architecture:** React Multi-Page Application (MPA)
- Routing infrastructure exists but currently unused
- Component-based React architecture
- Client-side rendering with server-side data fetching

**Deployment:** Static SPA deployment model
- No server-side rendering required
- Static file hosting (Vercel, Netlify, etc.)
- API integration via Supabase and external APIs

### Technical Architecture Considerations

**Application Structure:**
- React MPA with routing capability (ready for future expansion)
- Component-based architecture with reusable systems (FormBuilder, DataTable)
- State management via TanStack Query for server state
- Form state via React Hook Form

**Browser Support:**
- Support all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browser support (iOS Safari, Chrome Mobile)
- No specific version requirements (target modern browsers)
- Progressive enhancement approach

**Real-Time Data:**
- Bus arrival updates: every 30-60 seconds
- Automatic refresh without manual intervention
- TanStack Query for data fetching and caching
- ZET API integration for transit data
- Supabase real-time subscriptions (if needed)

### Browser Matrix

**Supported Browsers:**
- **Desktop:** Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)
- **Mobile:** iOS Safari (latest), Chrome Mobile (latest), Samsung Internet (latest)
- **Approach:** Modern browser features, graceful degradation for older browsers

**Testing Strategy:**
- Primary focus on mobile browsers (QR code scanning use case)
- Desktop browsers for admin interface
- Cross-browser testing for critical flows (device setup, configuration)

### Responsive Design

**Priority:** High (critical for QR code scanning workflow)

**Key Considerations:**
- Mobile-first approach for device setup flow
- Responsive map interface for stop selection
- Touch-friendly interactions (large tap targets)
- Optimized layout for phone screens during setup
- Desktop-optimized admin interface

**Breakpoints:**
- Mobile: < 768px (primary focus)
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Critical Mobile Flows:**
- QR code scanning and setup initiation
- WLAN configuration
- Map-based stop selection
- Device configuration and preview

### Performance Targets

**Primary Concern:** Mobile device performance

**Performance Goals:**
- Initial page load: < 3 seconds on 4G
- Time to interactive: < 5 seconds
- Setup flow completion: Smooth, no lag during interactions
- Map rendering: Responsive, smooth pan/zoom
- Real-time updates: Non-blocking, seamless refresh

**Optimization Strategies:**
- Code splitting for routes
- Lazy loading for map components
- Image optimization
- Efficient data fetching (only load what's needed)
- TanStack Query caching to reduce API calls

**Monitoring:**
- Focus on mobile performance metrics
- Monitor setup flow completion times
- Track real-time update performance

### SEO Strategy

**Approach:** Not required for this project

**Rationale:**
- Public-facing product page is separate project
- Application is behind authentication/device setup
- No public content requiring search indexing
- Focus on functionality over SEO

**Future Considerations:**
- If public pages added later, implement SEO best practices
- Meta tags and structured data for product page (separate project)

### Accessibility Level

**Target:** WCAG standard compliance

**Current Foundation:**
- React + Shadcn UI provides good accessibility baseline
- Radix UI primitives are accessible by default
- Semantic HTML structure

**Key Requirements:**
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA labels where needed
- Color contrast compliance
- Form validation accessibility

**Priority Areas:**
- Device setup flow (critical user path)
- Form interactions (FormBuilder system)
- Map interface (stop selection)
- Error messages and feedback

**Enhancement Approach:**
- Leverage Shadcn/Radix accessibility features
- Add ARIA labels where needed
- Ensure keyboard navigation works throughout
- Test with screen readers for critical flows

### Implementation Considerations

**Mobile-First Development:**
- Test QR code scanning flow on actual mobile devices
- Optimize map performance on mobile
- Ensure touch interactions are smooth
- Validate setup flow on various phone sizes

**Real-Time Update Strategy:**
- Polling every 30-60 seconds for bus arrivals
- Efficient data fetching to minimize battery impact
- Background updates without blocking UI
- Error handling for failed updates

**Routing Strategy:**
- Routing infrastructure ready for future expansion
- Current focus on core functionality
- Plan for route-based code splitting when routing is activated

**Progressive Web App:**
- **Not Required:** No offline functionality needed
- **Not Required:** No install prompt needed
- Standard web app experience is sufficient

## Functional Requirements

### Device Setup & Onboarding

- FR1: Users can scan QR code from device/box to initiate setup
- FR2: Users can configure device WLAN connection through guided workflow
- FR3: System can generate and store unique device keys
- FR4: Users can set up device without creating an account
- FR5: System can register devices with unique identifiers
- FR6: Users can access device setup via QR code or manual device code entry

### Device Configuration

- FR7: Users can view interactive map of bus stops
- FR8: Users can select bus stops from map interface
- FR9: Users can select bus lines and directions for selected stops
- FR10: Users can see live preview of device display during configuration
- FR11: System can auto-save configuration changes without manual save action
- FR12: Users can configure multiple stops per device
- FR13: Users can configure multiple lines per stop

### Real-Time Data Display

- FR14: System can fetch real-time bus arrival data from transit API
- FR15: Device display can show bus arrival times for configured stops and lines
- FR16: System can automatically refresh arrival data at regular intervals
- FR17: Device display can show multiple lines simultaneously
- FR18: System can handle API errors gracefully and display appropriate fallback

### Device Management

- FR19: Users can view device status (online/offline)
- FR20: Users can verify device connection remotely
- FR21: Users can restart device remotely when device is online
- FR22: Users can access device configuration directly via QR code or device code
- FR23: System can provide troubleshooting guidance for common issues
- FR24: Users can modify device configuration after initial setup

### Account Management (Post-MVP - Phase 2)

- FR25: Users can create account using email/password
- FR26: Users can create account using Google authentication
- FR27: Users can add multiple devices to single account
- FR28: Users can view all devices in account dashboard
- FR29: Users can manage multiple devices from single interface
- FR30: Users can switch between devices in account

### User Interface

- FR31: System can provide responsive interface optimized for mobile devices
- FR32: Users can navigate setup workflow intuitively
- FR33: System can provide clear error messages and recovery guidance
- FR34: Users can access device configuration from mobile browser
- FR35: Map interface can support touch interactions (pan, zoom, tap)

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
