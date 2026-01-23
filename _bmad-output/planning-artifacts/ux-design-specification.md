---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-core-experience', 'step-04-emotional-response', 'step-05-inspiration', 'step-06-design-system', 'step-07-defining-experience', 'step-08-visual-foundation', 'step-09-design-directions', 'step-10-user-journeys', 'step-11-component-strategy', 'step-12-ux-patterns', 'step-13-responsive-accessibility', 'step-14-complete']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/project-context.md'
  - 'docs/index.md'
  - 'docs/project-overview.md'
  - 'docs/mobile-app-architecture.md'
  - 'docs/ui-components.md'
---

# UX Design Specification bus-stop

**Author:** derjäger
**Date:** 2026-01-23

---

## Executive Summary

### Project Vision

Bus Stop Display System is a React Native mobile application that enables users to set up and manage physical e-ink display devices for viewing real-time bus arrivals at home. The core value proposition is providing a smooth, intuitive device setup experience via Bluetooth BLE that eliminates the complexity of traditional WiFi configuration methods. Users can discover devices, configure WiFi, select bus stops on an interactive map, and see live previews—all without creating an account in the MVP phase.

### Target Users

**Primary: Device Setup Users**
- First-time users setting up a bus stop display device
- Mixed technical comfort levels (friends/family testing MVP)
- Goal: Complete device setup in under 5 minutes
- Context: At home, unboxing device, following setup instructions
- Success metric: >90% setup completion rate without support

**Secondary: Admin Users**
- Users managing multiple devices
- Goal: Add devices quickly, troubleshoot remotely
- Context: Managing devices across different locations

**Tertiary: End Users (Passengers)**
- People viewing the physical displays
- Goal: See real-time bus arrivals at a glance
- Context: Daily viewing while at home or office

### Key Design Challenges

1. **Bluetooth Pairing Complexity**: Users may not understand BLE scanning, pairing failures need clear recovery paths, and iOS requires location permission for BLE scanning (must explain why).

2. **Mobile-First Setup Flow**: Small screen real estate for map interactions, touch-optimized interactions required, and battery efficiency during BLE scanning operations.

3. **Error Recovery and Guidance**: Bluetooth failures, WiFi connection issues, and device discovery failures need clear troubleshooting guidance with graceful degradation.

4. **Cross-Platform Consistency**: Balancing iOS and Android design patterns while maintaining consistent experience, handling platform-specific permissions appropriately.

5. **Multilingual Support**: Ensuring all user-facing content is properly localized, accommodating different text lengths across languages, and maintaining consistent user experience across languages.

### Design Opportunities

1. **Smooth Setup Experience as Differentiator**: Intuitive flow reduces support needs, live preview builds user confidence, and auto-save removes friction points.

2. **No-Account MVP Approach**: Lowers barrier to entry, faster time-to-value, and users can add account later if desired for multi-device management.

3. **Live Preview via Bluetooth**: Real-time feedback during configuration, users see exactly what device will display, and reduces uncertainty about configuration.

4. **Map-Based Stop Selection**: Visual and intuitive interface, familiar interaction patterns, and superior to text-based selection methods.

## Core User Experience

### Defining Experience

The core user experience centers on **effortless device setup through Bluetooth discovery and intuitive map-based stop selection**. The primary user action is discovering their bus stop display device via Bluetooth on their phone, then configuring it by selecting their bus stops on an interactive map. The map interface is the heart of the experience—users should be able to easily find and select their stops, with bus line numbers displayed as visual points to aid identification. The entire setup flow should feel premium and polished, eliminating the friction of traditional network switching and WiFi configuration methods.

### Platform Strategy

**Primary Platform:** React Native mobile app (iOS + Android)
- Touch-optimized interactions throughout
- Native mobile design patterns for each platform
- Location permission required for BLE scanning (users accept this as necessary)
- Bluetooth BLE for device communication (no network switching needed)
- Offline capability: Configuration state persists locally, can resume after app restart

**Admin Interface:** Supabase dashboard (for now)
- Device viewing and management
- Configuration changes
- No separate admin mobile interface needed in MVP

### Effortless Interactions

1. **Bluetooth Device Discovery**: Opening the app and immediately finding the bus stop device on their phone—this is the first success moment. Discovery should feel automatic and magical.

2. **Map-Based Stop Selection**: The map is the primary interface. Finding the right station should be effortless, with bus line numbers displayed as visual points to help users quickly identify their stops. Pan, zoom, and tap interactions should feel natural and responsive.

3. **WiFi Configuration via Bluetooth**: No network switching, no complex WiFi setup screens. Users select their WiFi network from a list, and credentials are sent seamlessly via Bluetooth—no password entry needed.

4. **Auto-Save Configuration**: No manual save button. Configuration changes are saved automatically as users interact with the map and select stops/lines.

5. **Live Preview**: Real-time preview of device display via Bluetooth during configuration builds confidence and reduces uncertainty.

### Critical Success Moments

1. **First Discovery**: User opens app, taps "Add Device," and immediately sees their bus stop device appear in the Bluetooth scan list—this is the first "wow" moment.

2. **Stop Selection**: User finds their bus stop on the map easily, sees their bus line numbers as visual points, and selects it with confidence—this is where the value becomes clear.

3. **First Configuration**: User successfully adds their bus stop to the device and sees the live preview update in real-time—this confirms the setup is working.

4. **Premium Feel**: Every touchpoint—from Bluetooth discovery to map interaction to configuration—feels polished and premium, not like a technical setup process.

### Experience Principles

1. **Map-First Design**: The map is the primary interface. Stop selection should be visual, intuitive, and effortless. Bus line numbers as visual points help users quickly identify their stops.

2. **Premium Setup Experience**: Every interaction should feel polished and premium. Users should feel confident and delighted, not frustrated by technical complexity.

3. **Bluetooth-First Discovery**: Finding the device on their phone is the first success moment. Discovery should feel automatic and magical, not technical.

4. **Eliminate Network Friction**: No network switching, no complex WiFi setup. Bluetooth handles WiFi provisioning seamlessly—users just select their network.

5. **Visual Clarity**: Bus line numbers displayed as points on the map help users find their stops quickly. The map should be clear, responsive, and easy to navigate.

6. **Progressive Confidence**: Each step builds user confidence—device discovery → WiFi connection → stop selection → live preview → success. Users should never feel lost or uncertain.

## Desired Emotional Response

### Primary Emotional Goals

1. **Premium and Polished**: Users should feel they're interacting with a high-quality, premium product—not a technical setup tool. Every interaction should feel refined and intentional.

2. **Confidence Through Clarity**: Users should feel confident and in control throughout the setup process. Clear feedback, status indicators, and transparent error handling build trust and eliminate uncertainty.

3. **Delight Through Smooth Interactions**: Polished animations, success moments, and seamless transitions create positive micro-experiences that make users want to tell others about the product.

### Emotional Journey Mapping

**First Discovery (Opening App)**
- Emotion: Curiosity and anticipation
- Design: Inviting interface, clear call-to-action, welcoming onboarding

**Core Experience (Bluetooth Discovery, Map Interaction)**
- Emotion: Confidence and control
- Design: Smooth animations, clear status indicators, intuitive interactions

**After Completion (Successful Setup)**
- Emotion: Accomplishment and satisfaction
- Design: Success animations, clear confirmation, rewarding completion state

**When Errors Occur**
- Emotion: Trust and reassurance
- Design: Clear error messages, transparent recovery paths, never leave users guessing

**Returning to Use Again**
- Emotion: Familiarity and efficiency
- Design: Smooth re-entry, remembered preferences, quick access to common actions

### Micro-Emotions

**Critical Emotional States:**
- **Confidence** (not confusion): Clear feedback and status indicators at every step
- **Trust** (not skepticism): Transparent error handling and recovery paths
- **Delight** (not just satisfaction): Success animations and smooth micro-interactions
- **Accomplishment** (not frustration): Setup feels rewarding and successful

### Design Implications

**Premium Feel → UX Choices:**
- Polished animations throughout
- Bottom sheet pattern for switching between map and plan (not page navigation)
- Quick transitions between map and plan views
- Map remains usable while bottom sheet is open (minimize to header only)
- Smooth, intentional micro-interactions
- Multilingual support enhances accessibility and user experience

**Confidence → UX Choices:**
- Clear error messages with specific recovery steps
- Status indicators showing exactly what's happening
- Progress feedback during Bluetooth discovery and WiFi configuration
- Transparent state communication (never leave users guessing)
- Error handling with clear recovery paths

**Delight → UX Choices:**
- Success animations when adding stops
- Smooth micro-interactions during map interactions
- Polished transitions between states
- Potential easter eggs (to be explored)

**Trust → UX Choices:**
- Always show what's happening (loading states, progress indicators)
- Clear error messages with actionable recovery steps
- Transparent Bluetooth and WiFi connection status
- Never hide errors or leave users in uncertain states

### Emotional Design Principles

1. **Premium Polish**: Every interaction should feel refined and intentional—polished animations, smooth transitions, high-quality visuals.

2. **Transparent Communication**: Always show users what's happening. Clear status indicators, progress feedback, and error messages build confidence.

3. **Delightful Moments**: Success animations and smooth micro-interactions create positive experiences that users remember and share.

4. **Confidence Through Clarity**: Users should never feel lost or uncertain. Clear feedback, status indicators, and error recovery paths maintain confidence throughout.

5. **Smooth Transitions**: Bottom sheet patterns, quick map switching, and seamless state changes create a fluid, premium experience.

6. **Error as Opportunity**: When things go wrong, clear error messages and recovery paths actually build trust and confidence rather than frustration.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Google Maps**
- **Core Problem Solved**: Navigating and discovering places with map-first interface
- **Onboarding Experience**: Minimal onboarding, immediate value—users can start using the map right away
- **Navigation & Hierarchy**: Map-first design with bottom sheet overlays for details. Users can switch between map view and route/place information without leaving the main map context
- **Innovative Interactions**: Smooth transitions between map and plan views, gesture-based interactions, bottom sheet that can be minimized to header only while keeping map accessible
- **Visual Design**: Clear markers, labels, and visual hierarchy. Fun and engaging animations that make the experience delightful
- **Error Handling**: Clear error states, helpful recovery suggestions, never leaves users stuck

**Key Learnings:**
- Map-first approach keeps users oriented and in control
- Bottom sheet pattern allows information access without losing map context
- Smooth transitions create premium, polished feel
- Fun interactions make the experience engaging, not just functional

### Transferable UX Patterns

**Navigation Patterns:**
- **Bottom Sheet Overlay**: Map remains visible while stop/line details appear in bottom sheet—perfect for switching between map and plan views without navigation
- **Minimize to Header**: Bottom sheet can minimize to header-only view, keeping map fully accessible while maintaining quick access to information
- **Context Preservation**: Users never lose their place on the map when accessing details or switching views

**Interaction Patterns:**
- **Map-First Design**: Map is always the primary interface; information overlays enhance rather than replace it
- **Smooth Transitions**: Polished animations when switching between map and plan views create premium feel
- **Gesture-Based Interactions**: Pan, zoom, tap interactions feel natural and responsive
- **Visual Markers**: Clear, identifiable markers (bus line numbers as points) help users quickly find what they need

**Visual Patterns:**
- **Clear Visual Hierarchy**: Map elements, markers, and overlays have clear visual distinction
- **Engaging Animations**: Fun, polished animations make interactions delightful
- **Information Discovery**: Users can find details directly from map without navigating away

### Anti-Patterns to Avoid

**Navigation Anti-Patterns:**
- **Page Navigation for Map/Plan Switch**: Don't navigate to new pages when switching between map and plan—use bottom sheet overlay instead
- **Blocking Map Access**: Don't cover the entire map with modals or full-screen overlays—keep map accessible
- **Losing Map Context**: Don't navigate away from map when accessing details—preserve user's location and zoom level

**Interaction Anti-Patterns:**
- **Complex Navigation Flows**: Don't create deep navigation hierarchies—keep everything accessible from map
- **Hidden Information**: Don't hide important details behind multiple taps—make information discoverable
- **Jarring Transitions**: Don't use abrupt page transitions—use smooth, polished animations

**Visual Anti-Patterns:**
- **Cluttered Map**: Don't overload map with too many markers or information—keep it clean and scannable
- **Inconsistent Visual Language**: Don't mix different visual styles—maintain consistent design language
- **Poor Contrast**: Don't use low-contrast markers or labels—ensure clear visibility

### Design Inspiration Strategy

**What to Adopt:**
- **Bottom Sheet Pattern**: Adopt Google Maps' bottom sheet approach for switching between map and plan views—keeps map accessible while providing information
- **Map-First Design**: Adopt map-first approach where map is always the primary interface—information overlays enhance rather than replace it
- **Smooth Transitions**: Adopt polished animations for state changes—creates premium, engaging experience
- **Context Preservation**: Adopt pattern of preserving map context when accessing details—users never lose their place

**What to Adapt:**
- **Bottom Sheet Minimization**: Adapt bottom sheet pattern to minimize to header-only view while keeping map fully accessible—perfect for our use case
- **Visual Markers**: Adapt marker system to show bus line numbers as visual points—helps users quickly identify stops
- **Information Discovery**: Adapt information discovery pattern to show stop/line details directly from map—no navigation required

**What to Avoid:**
- **Page Navigation for View Switching**: Avoid navigating to new pages when switching between map and plan—conflicts with map-first approach
- **Blocking Map Access**: Avoid full-screen modals or overlays that block map access—conflicts with context preservation
- **Complex Navigation**: Avoid deep navigation hierarchies—conflicts with effortless interaction goals

## Design System Foundation

### Design System Choice

**React Native Reusables (shadcn/ui for React Native)**

React Native Reusables provides a clean, modern design system that aligns with the existing web app's Shadcn UI approach. The system offers high-quality, accessible components with a premium aesthetic that supports the polished, refined feel required for the bus-stop mobile app.

### Rationale for Selection

1. **Design Consistency**: React Native Reusables maintains visual consistency with the existing web app's Shadcn UI, creating a cohesive experience across platforms.

2. **Clean Aesthetic**: The clean, modern look aligns with the premium, polished brand requirements and supports the effortless, delightful user experience goals.

3. **Customization Flexibility**: Highly customizable and themeable, allowing for brand-specific adaptations while maintaining proven component patterns.

4. **Component Quality**: High-quality, accessible components reduce development time and ensure consistent UX patterns.

5. **Developer Experience**: Familiar patterns for developers already using Shadcn UI on web, reducing learning curve and maintenance overhead.

6. **Extensibility**: Foundation for creating custom components when needed, ensuring flexibility for unique requirements like map interactions and Bluetooth device discovery.

### Implementation Approach

**Base System:**
- React Native Reusables as primary component library
- Leverage existing components for common UI patterns (buttons, inputs, cards, bottom sheets, etc.)
- Use Reusables' theming system for consistent design tokens

**Custom Components:**
- Create custom components using Reusables primitives when needed
- Examples: Bluetooth device discovery UI, map overlay components, live preview components
- Maintain design consistency by using Reusables design tokens and patterns

**Design Tokens:**
- Colors, typography, spacing, and animation tokens from Reusables
- Customize tokens to match premium brand aesthetic
- Ensure consistency across all custom components

### Customization Strategy

**Visual Customization:**
- Customize color palette to match premium brand requirements
- Adjust typography scale for optimal readability on mobile
- Refine spacing and sizing for touch-optimized interactions

**Component Customization:**
- Use Reusables primitives as building blocks for custom components
- Maintain consistent visual language across custom and base components
- Ensure accessibility standards are preserved in custom components

**Animation Customization:**
- Leverage Reusables animation patterns for smooth transitions
- Add custom animations for success states and micro-interactions
- Ensure animations support premium, polished feel

**Platform-Specific Adaptations:**
- Use Reusables' platform-aware components where available
- Customize for iOS and Android platform conventions while maintaining consistency
- Ensure native feel on both platforms

## 2. Core User Experience

### 2.1 Defining Experience

**"Set up your beautiful bus display device in minutes—discover it on your phone, pick your stops on a map, and enjoy real-time arrivals at home or work."**

The core experience is transforming a physical device into a beautiful, functional display that users are excited to show off. Unlike competitors who use confusing dropdown menus, users discover their device via Bluetooth, then visually select their bus stops on an interactive map. The entire process should feel fun, engaging, and premium—not like a technical setup task. The device itself should be aesthetic and gift-worthy, something users want to display at home or office and show to friends.

**Key Differentiators:**
- **Visual Map Selection** vs. confusing dropdown menus (competitor's weakness)
- **Premium, Polished Experience** vs. unpolished competitor
- **Fun and Engaging** vs. frustrating technical setup
- **Aesthetic Device** that users want to show off vs. purely functional

### 2.2 User Mental Model

**Current Problem (Competitor):**
- Hard to configure with simple dropdowns for stations and directions
- Misleading and confusing interface
- Not polished or premium feeling
- Feels like a technical chore, not a delightful experience

**User Expectation:**
- Setting up should feel like configuring a premium smart device (like Apple HomeKit, Nest)
- Visual, intuitive process—users should understand what they're doing
- Fun and engaging, not frustrating or technical
- Device should be beautiful and something they're excited to show others
- Gift-worthy or office-friendly aesthetic

**Mental Model:**
- Users expect modern, visual interfaces (like Google Maps) not old dropdown menus
- They want the device to be a conversation piece, not just functional
- Setup should feel rewarding and delightful, not like work
- The device should enhance their space aesthetically, not just functionally

### 2.3 Success Criteria

**User Success Indicators:**
- Users say "this is beautiful" and want to show it to friends
- Setup feels fun and engaging, not like a technical task
- Configuration is visual and intuitive—users understand what they're selecting
- Device becomes a conversation piece at home or office
- Users want to gift it to others or use it in shared spaces

**Functional Success:**
- Device discovered on phone within seconds
- Bus stops selected visually on map (not confusing dropdowns)
- Configuration completed in under 5 minutes
- Live preview confirms setup is working
- Device displays real-time arrivals accurately

**Emotional Success:**
- Users feel accomplished and delighted after setup
- Device feels premium and polished, not cheap or technical
- Users are excited to show it off to others
- Setup process feels rewarding, not frustrating

### 2.4 Novel UX Patterns

**Established Patterns We're Using:**
- **Map-First Interface**: Familiar from Google Maps—users understand map interactions
- **Bottom Sheet Overlays**: Proven pattern for accessing details without losing context
- **Bluetooth Device Discovery**: Standard IoT device setup pattern
- **Visual Selection**: Intuitive tap-to-select on map markers

**Our Innovation:**
- **Combining Map Selection with Device Setup**: Unlike competitors using dropdowns, we use visual map selection for bus stop configuration
- **Aesthetic Device Focus**: Emphasizing beauty and show-off value, not just functionality
- **Fun Setup Experience**: Making device configuration delightful and engaging, not technical
- **Social/Office Use Case**: Positioning device as gift-worthy and office-friendly, not just home utility

**What Makes This Novel:**
- Competitors focus on functionality; we focus on aesthetic appeal and user delight
- Visual map selection replaces confusing dropdown menus
- Premium, polished experience throughout, not just at the end
- Device becomes a conversation piece, not just a utility

### 2.5 Experience Mechanics

**1. Initiation:**
- User opens app and sees welcoming interface
- Clear call-to-action: "Add Device" or "Set Up New Device"
- App immediately starts Bluetooth scanning
- User sees their device appear in scan list (first success moment)

**2. Interaction:**
- **Device Discovery**: Device appears in Bluetooth scan list with clear identification
- **Pairing**: Smooth pairing process with clear status indicators
- **WiFi Configuration**: Select WiFi network from list (no password entry)
- **Map Selection**: Interactive map appears with bus stops visible
- **Stop Selection**: Tap stops on map to select them
- **Line Selection**: Bus line numbers displayed as visual points on map
- **Live Preview**: Real-time preview of device display via Bluetooth

**3. Feedback:**
- **Discovery**: Device appears in scan list with signal strength indicator
- **Pairing**: Clear status messages ("Connecting...", "Connected")
- **WiFi**: Connection status shown clearly
- **Map Selection**: Selected stops highlighted visually
- **Configuration**: Auto-save confirmation (no manual save needed)
- **Live Preview**: Real-time display preview shows exactly what device will show
- **Success**: Success animation when setup complete

**4. Completion:**
- Clear success state with confirmation
- Device shows real-time bus arrivals
- User feels accomplished and excited to show it off
- Option to add more stops or configure additional settings
- Device becomes part of their daily routine and conversation piece

## Visual Design Foundation

### Color System

**Brand Inspiration:**
- **Physical Device**: Metal grey aesthetic inspired by Zagreb street bus stops
- **Display Design**: Black background with yellow font (matching actual street displays)
- **Premium Feel**: Modern, sophisticated color palette that reflects the aesthetic device

**Color Palette:**

**Primary Colors:**
- **Grey Scale**: Metal grey tones (inspired by street bus stop aesthetic)
  - Light grey: Backgrounds, subtle surfaces
  - Medium grey: Cards, elevated surfaces
  - Dark grey: Text, primary elements
- **Black**: Primary backgrounds (matching display aesthetic)
- **Yellow**: Accent color (matching display font, used for highlights, CTAs, important information)

**Semantic Color Mapping:**
- **Primary**: Grey tones (metal aesthetic)
- **Background**: Black (display-inspired) with light grey variants
- **Accent**: Yellow (display font color) for highlights, success states, important actions
- **Text**: Light text on dark backgrounds (matching display), dark text on light surfaces
- **Success**: Yellow/green variants
- **Warning**: Yellow/orange variants
- **Error**: Red (subtle, not harsh)
- **Info**: Blue-grey tones

**Accessibility:**
- High contrast ratios for text readability (WCAG AA minimum, AAA preferred)
- Yellow accent meets contrast requirements for accessibility
- Dark mode optimized (primary design direction)
- Color-blind friendly: Don't rely solely on color for information

**Color Usage:**
- Black backgrounds create premium, display-like aesthetic
- Yellow accents draw attention to important actions and information
- Grey tones provide sophisticated, metal-inspired foundation
- Spacious white space (light grey) creates premium, airy feel

### Typography System

**Typeface Strategy:**
- **Primary**: System fonts (San Francisco on iOS, Roboto on Android) or React Native Reusables default
- **Rationale**: Native feel, excellent readability, optimized for mobile screens
- **Alternative**: Modern sans-serif if custom font needed (Inter, SF Pro Display)

**Type Scale (Mobile-First):**
- **H1**: Large, bold headings (device names, main titles)
- **H2**: Section headings (setup steps, major sections)
- **H3**: Subsection headings (card titles, list headers)
- **Body**: Primary text (descriptions, instructions)
- **Small**: Secondary text (captions, hints, metadata)
- **Label**: Form labels, button text

**Typography Principles:**
- **Readability First**: Clear, legible fonts optimized for mobile screens
- **Premium Feel**: Generous line heights, appropriate letter spacing
- **Hierarchy**: Clear visual hierarchy through size and weight
- **Mobile Optimization**: Touch-friendly sizes, appropriate contrast

**Text Content:**
- Primarily headings and short labels
- Minimal long-form content
- Clear, concise instructions
- Emphasis on visual communication over text

**Multilingual Typography Considerations:**
- **Font Support**: System fonts support Croatian and English characters natively
- **Text Length**: Layout adapts to longer/shorter translations (Croatian text may be longer than English)
- **RTL Support**: Not required for initial languages (Croatian, English are LTR)
- **Character Sets**: Ensure proper rendering of Croatian characters (č, ć, đ, š, ž)
- **Dynamic Text**: Support for Dynamic Type (iOS) and Font Scaling (Android) in all languages

### Spacing & Layout Foundation

**Spacing System:**
- **Base Unit**: 8px (standard mobile spacing unit)
- **Spacing Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- **Rationale**: 8px base provides flexibility while maintaining consistency

**Layout Principles:**
- **Spacious & Premium**: Generous white space creates premium, airy feel
- **Mobile-First**: Touch-optimized spacing, appropriate tap targets (minimum 44x44pt)
- **Visual Hierarchy**: Clear spacing relationships between elements
- **Breathing Room**: Elements don't feel cramped or crowded

**Grid System:**
- **Mobile-First Approach**: Single column layout for mobile
- **Padding**: Consistent padding (16px-24px) on screen edges
- **Component Spacing**: Generous spacing between components (24px-32px)
- **Content Density**: Balanced—not too dense, not too sparse

**Component Spacing:**
- **Cards**: 16px-24px padding internally, 24px spacing between cards
- **Form Elements**: 16px spacing between form fields
- **Buttons**: 12px-16px padding, 16px spacing between button groups
- **Map Interface**: Generous padding around map, clear spacing for controls
- **Bottom Sheets**: Appropriate padding for content, comfortable touch targets

**Layout Structure:**
- **Full-Screen Map**: Map takes full screen when primary focus
- **Bottom Sheet Overlays**: Generous padding, spacious content area
- **Navigation**: Clear spacing, premium feel
- **Status Indicators**: Appropriate spacing for visibility without clutter

### Accessibility Considerations

**Color Contrast:**
- All text meets WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text)
- Yellow accent color tested for contrast on black backgrounds
- High contrast mode support considered

**Touch Targets:**
- Minimum 44x44pt touch targets (iOS/Android guidelines)
- Generous spacing between interactive elements
- Clear visual feedback for touch interactions

**Typography:**
- Minimum font size: 16px for body text (prevents zoom on iOS)
- Scalable text support (Dynamic Type on iOS, Font Scaling on Android)
- Clear visual hierarchy for screen readers

**Visual Feedback:**
- Clear focus states for accessibility navigation
- High contrast for important information
- Color not sole indicator of state (use icons, labels, patterns)

## Design Direction Decision

### Design Directions Explored

**Primary Direction: Zagreb-Inspired Premium Aesthetic**

Based on our established visual foundation and brand requirements, we've chosen a single, cohesive design direction that aligns perfectly with the physical device aesthetic and premium positioning goals.

**Key Visual Characteristics:**
- **Color Palette**: Black backgrounds (matching display), yellow accents (matching display font), metal grey tones (matching street bus stop aesthetic)
- **Layout**: Spacious, premium feel with generous white space
- **Interface Style**: Map-first with bottom sheet overlays (Google Maps-inspired)
- **Component Foundation**: React Native Reusables with custom Zagreb-inspired theme
- **Visual Weight**: Balanced—not too dense, not too sparse

### Chosen Direction

**Zagreb-Inspired Premium Aesthetic**

This direction perfectly captures:
- The physical device's connection to Zagreb street bus stops (metal grey, black display, yellow font)
- Premium, gift-worthy positioning (spacious layout, polished feel)
- Modern, engaging user experience (map-first, visual selection)
- Brand consistency (colors match actual street displays)

**Visual Identity:**
- **Primary Background**: Black (matching street display aesthetic)
- **Accent Color**: Yellow (matching display font, used for highlights and CTAs)
- **Supporting Colors**: Metal grey tones (cards, surfaces, text)
- **Layout**: Spacious, premium feel with generous spacing
- **Components**: Clean, modern React Native Reusables components

### Design Rationale

**Why This Direction Works:**

1. **Brand Connection**: Colors directly match the physical device and street displays, creating visual consistency between digital and physical experiences

2. **Premium Positioning**: Spacious layout and polished aesthetic support the gift-worthy, office-friendly positioning

3. **User Experience**: Map-first interface with bottom sheet overlays provides intuitive, engaging interaction (unlike competitor's dropdown menus)

4. **Emotional Goals**: Black/yellow color scheme creates premium, modern feel that users want to show off

5. **Technical Foundation**: React Native Reusables provides solid component base with customization flexibility

6. **Accessibility**: High contrast black/yellow combination meets WCAG standards while maintaining brand identity

### Implementation Approach

**Component Customization:**
- Customize React Native Reusables theme with Zagreb-inspired color palette
- Black backgrounds as primary surface
- Yellow accents for CTAs, highlights, and important information
- Grey tones for cards, elevated surfaces, and text

**Layout Implementation:**
- Spacious spacing system (8px base unit, generous component spacing)
- Map-first interface (full-screen map when primary focus)
- Bottom sheet overlays (for stop/line details, configuration)
- Generous padding and white space throughout

**Visual Hierarchy:**
- Yellow accents draw attention to important actions
- Black backgrounds create premium, display-like aesthetic
- Grey tones provide sophisticated foundation
- Clear spacing relationships guide user attention

**Interaction Patterns:**
- Smooth transitions between map and plan views
- Bottom sheet can minimize to header-only view
- Map remains accessible during configuration
- Visual feedback for all interactions

## User Journey Flows

### Journey 1: First-Time Device Setup (No Account)

**Goal**: User sets up device for the first time without creating an account

**Entry Point**: User opens app and taps "Add Device"

**Key Interactions**:
- **Bluetooth Discovery**: Automatic scan with clear status indicators
- **Device Selection**: Visual list with signal strength
- **WiFi Configuration**: Network list selection (no password entry)
- **Map Selection**: Tap-to-select stops, bottom sheet for details
- **Live Preview**: Real-time device display preview via Bluetooth
- **Auto-Save**: No manual save button, automatic configuration saving

**Error Recovery**:
- Bluetooth not enabled → Clear enable guide
- Location permission denied → Explain why needed
- Device not found → Troubleshooting guide, retry option
- Pairing fails → Error message with retry
- WiFi fails → Retry option, clear error message

**Flow Steps**:
1. User opens app → Welcome screen
2. Tap "Add Device" → Check Bluetooth enabled
3. If Bluetooth off → Show enable guide
4. Check location permission → Request if needed (explain why)
5. Start BLE scan → Show scanning indicator
6. Device found → Show device list with signal strength
7. User selects device → Pairing process
8. Pairing successful → WiFi configuration screen
9. User selects WiFi network → Send credentials via BLE
10. WiFi connected → Show interactive map
11. User taps stop on map → Bottom sheet with stop details
12. User selects bus lines → Auto-save configuration
13. Live preview updates → Show device display state
14. Add more stops or complete → Setup complete with success animation

### Journey 2: Daily Use / Adding Stops

**Goal**: User adds a new stop to existing device configuration

**Entry Point**: User opens app, selects device (or discovers via Bluetooth)

**Key Interactions**:
- **Quick Access**: Fast device connection (account or Bluetooth)
- **Visual Context**: Current stops highlighted on map
- **Bottom Sheet**: Stop details without leaving map
- **Auto-Save**: Instant configuration save
- **Live Preview**: Real-time display update

**Flow Steps**:
1. User opens app → Check if has account
2. If no account → Discover device via Bluetooth
3. If has account → Show device list, select device
4. Connect via BLE → Show connection status
5. Show map → Current stops highlighted
6. User taps new stop → Bottom sheet with stop details
7. User selects lines → Auto-save with success animation
8. Live preview updates → Configuration complete

### Journey 3: Troubleshooting

**Goal**: User resolves device connection or configuration issues

**Entry Point**: User notices device stopped updating or has issues

**Key Interactions**:
- **Status Check**: Clear device status indicators
- **Troubleshooting Guide**: Step-by-step recovery instructions
- **Remote Restart**: Restart device when online
- **Error Recovery**: Clear error messages with recovery steps

**Flow Steps**:
1. User opens app → Access device (Bluetooth or account)
2. Connect via BLE → Check device status
3. If offline → Show troubleshooting guide
4. If error → Show error details with recovery steps
5. If online but not updating → Verify configuration
6. Restart device if needed → Show restart status
7. Check status again → Confirm resolution
8. If still issues → Show additional help/support

### Journey Patterns

**Navigation Patterns**:
- **Map-First**: Map always accessible, information in bottom sheets
- **Bottom Sheet Minimization**: Can minimize to header while keeping map accessible
- **Progressive Disclosure**: Information revealed as needed, not all at once
- **Context Preservation**: User never loses map context

**Decision Patterns**:
- **Clear Choices**: Binary decisions with clear options
- **Visual Feedback**: Status indicators show current state
- **Error Recovery**: Always provide retry or recovery options
- **Confirmation**: Success animations confirm actions

**Feedback Patterns**:
- **Status Indicators**: Clear status at every step (scanning, connecting, configuring)
- **Progress Feedback**: Show what's happening during operations
- **Success Animations**: Delightful animations for completed actions
- **Error Messages**: Clear, actionable error messages with recovery paths

### Flow Optimization Principles

**Efficiency**:
- **Minimize Steps**: Reduce steps to value (setup in under 5 minutes)
- **Auto-Save**: No manual save buttons, automatic configuration saving
- **Quick Access**: Fast device connection (Bluetooth or account-based)
- **Visual Selection**: Map-based selection faster than dropdowns

**Delight**:
- **Success Animations**: Celebrate completed actions
- **Live Preview**: Real-time feedback builds confidence
- **Smooth Transitions**: Polished animations between states
- **Premium Feel**: Spacious layout, polished interactions

**Error Handling**:
- **Clear Messages**: Specific error messages with recovery steps
- **Retry Options**: Always provide retry for failed operations
- **Troubleshooting Guides**: Step-by-step recovery instructions
- **Never Leave Users Stuck**: Always provide next steps

## Component Strategy

### Design System Components

**React Native Reusables Foundation:**
- **Buttons**: Primary actions, secondary actions, CTAs (yellow accent)
- **Cards**: Device cards, status cards, information cards
- **Bottom Sheets**: Stop details, configuration panels, device info
- **Inputs**: WiFi network selection, search fields
- **Status Indicators**: Connection status, device status, progress indicators
- **Dialogs**: Error messages, confirmations, troubleshooting guides
- **Progress Indicators**: Bluetooth scanning, WiFi configuration, pairing status
- **Badges**: Device status badges, signal strength indicators
- **Lists**: Device lists, network lists, stop lists

**Usage Strategy:**
- Use Reusables components as base for all standard UI patterns
- Customize with Zagreb-inspired theme (black backgrounds, yellow accents, grey tones)
- Maintain consistency with design system patterns
- Ensure accessibility standards are met

### Custom Components

#### Bluetooth Device Scanner

**Purpose**: Discover and display nearby Bluetooth devices during setup

**Usage**: Primary component for device discovery flow

**States**:
- **Scanning**: Animated scanning indicator, "Scanning for devices..."
- **Devices Found**: List of discovered devices
- **No Devices**: Empty state with troubleshooting guide
- **Error**: Error message with retry option
- **Connecting**: Status indicator showing connection progress

**Accessibility**: Screen reader labels for device names, clear status announcements, keyboard navigation

**Interaction Behavior**: Auto-start scan on mount, show scanning animation, update device list as devices discovered, tap device to initiate pairing

#### Map Interface Component

**Purpose**: Interactive map for bus stop selection

**Usage**: Primary interface for stop selection and configuration

**States**:
- **Loading**: Map tiles loading indicator
- **Loaded**: Interactive map with stops visible
- **Stop Selected**: Bottom sheet opens with stop details
- **Error**: Error state with retry option

**Variants**: Full-screen (primary use), Minimized (when bottom sheet open)

**Accessibility**: Map controls accessible via keyboard, stop markers have ARIA labels, screen reader support

**Interaction Behavior**: Pan and zoom gestures, tap stop marker to select, tap line point to see line details

#### Stop Details Bottom Sheet

**Purpose**: Display stop information and allow line selection

**Usage**: Appears when user taps stop on map

**States**:
- **Default**: Stop details visible, lines selectable
- **Minimized**: Header only, map fully accessible
- **Saving**: Loading indicator during auto-save
- **Saved**: Success animation

**Interaction Behavior**: Swipe down to minimize, tap lines to select/deselect, auto-save on selection change, live preview updates automatically

#### Live Preview Component

**Purpose**: Show real-time preview of device display via Bluetooth

**Usage**: Display during configuration to show what device will display

**States**:
- **Connecting**: Connection status indicator
- **Connected**: Live preview updating
- **Disconnected**: Connection lost indicator
- **Error**: Error state with retry

**Interaction Behavior**: Auto-connect when device paired, update preview in real-time, show connection status, handle disconnection gracefully

#### WiFi Network Selector

**Purpose**: Allow users to select WiFi network for device configuration

**Usage**: During device setup, after Bluetooth pairing

**States**:
- **Scanning**: Scanning for networks indicator
- **Networks Found**: List of available networks
- **No Networks**: Empty state
- **Connecting**: Connection status indicator
- **Connected**: Success state
- **Error**: Error message with retry

**Interaction Behavior**: Auto-scan on mount, tap network to select, send credentials via Bluetooth, show connection progress

#### Device Status Card

**Purpose**: Display device status and allow management actions

**Usage**: Device list, device detail screens

**States**:
- **Online**: Green status indicator
- **Offline**: Grey status indicator
- **Error**: Red status indicator
- **Connecting**: Animated status indicator

**Variants**: List item (compact), Detail card (expanded)

**Interaction Behavior**: Tap to view details, swipe actions for quick actions, long press for additional options

### Component Implementation Strategy

**Foundation Components** (from React Native Reusables):
- Buttons, Cards, Bottom Sheets, Inputs, Dialogs, Progress Indicators, Badges, Lists

**Custom Components** (designed above):
- Bluetooth Device Scanner, Map Interface Component, Stop Details Bottom Sheet, Live Preview Component, WiFi Network Selector, Device Status Card

**Implementation Approach**:
- Build custom components using Reusables design tokens
- Ensure consistency with established patterns
- Follow accessibility best practices
- Create reusable patterns for common use cases
- Use React Native Reusables primitives as building blocks

**Design Token Usage**:
- Colors: Black backgrounds, yellow accents, grey tones
- Spacing: 8px base unit, generous spacing
- Typography: System fonts, clear hierarchy
- Animations: Smooth transitions, success animations

### Implementation Roadmap

**Phase 1 - Core Components** (MVP Critical):
- **Bluetooth Device Scanner** - Needed for device discovery flow
- **Map Interface Component** - Needed for stop selection (core experience)
- **Stop Details Bottom Sheet** - Needed for stop configuration
- **WiFi Network Selector** - Needed for device setup

**Phase 2 - Supporting Components**:
- **Live Preview Component** - Enhances user confidence during setup
- **Device Status Card** - Supports device management

**Phase 3 - Enhancement Components**:
- Advanced device management components
- Analytics and usage components
- Additional configuration options

## UX Consistency Patterns

### Button Hierarchy

**When to Use:**
- **Primary Actions** (Yellow accent): Main actions like "Add Device", "Connect", "Save Configuration"
- **Secondary Actions** (Grey): Supporting actions like "Cancel", "Back", "Skip"
- **Tertiary Actions** (Text links): Less critical actions like "Learn More", "View Details"

**Visual Design:**
- Primary: Yellow background on black, high contrast, prominent
- Secondary: Grey background, less prominent
- Tertiary: Text links, minimal visual weight

**Behavior:**
- Primary buttons trigger main user goals
- Secondary buttons provide alternatives or cancel actions
- Tertiary actions provide additional information or options

**Accessibility:**
- Minimum 44x44pt touch targets
- Clear focus states
- Screen reader labels
- High contrast for all button types

**Mobile Considerations:**
- Generous spacing between buttons
- Full-width buttons for primary actions on mobile
- Clear visual hierarchy for thumb-friendly interaction

### Feedback Patterns

**Success Feedback:**
- **When to Use**: Completed actions, successful configuration, device connected
- **Visual Design**: Success animation (checkmark, fade-in), yellow/green accent
- **Behavior**: Brief animation (1-2 seconds), auto-dismiss or user dismiss
- **Examples**: "Device connected successfully", "Stop added", "Configuration saved"

**Error Feedback:**
- **When to Use**: Failed operations, connection errors, validation errors
- **Visual Design**: Error message in dialog or inline, red accent, clear icon
- **Behavior**: Persistent until resolved, clear recovery steps, retry option
- **Examples**: "Bluetooth connection failed", "WiFi configuration error", "Device not found"

**Warning Feedback:**
- **When to Use**: Potential issues, confirmations, important notices
- **Visual Design**: Warning message with yellow/orange accent, warning icon
- **Behavior**: User acknowledgment required, clear action options
- **Examples**: "Device will disconnect", "Unsaved changes", "Low battery"

**Info Feedback:**
- **When to Use**: Status updates, helpful tips, progress information
- **Visual Design**: Info message with blue-grey accent, info icon
- **Behavior**: Non-blocking, can dismiss, helpful context
- **Examples**: "Scanning for devices...", "Connecting to device...", "Configuration saved automatically"

**Loading States:**
- **When to Use**: During operations, data fetching, device communication
- **Visual Design**: Animated spinner or progress indicator, status text
- **Behavior**: Show what's happening, provide progress when possible
- **Examples**: "Scanning for devices...", "Connecting...", "Saving configuration..."

### Form Patterns

**Input Fields:**
- **When to Use**: WiFi network selection, search, device naming
- **Visual Design**: Clear labels, placeholder text, error states, success states
- **Behavior**: Auto-focus when appropriate, clear validation feedback, auto-save where applicable
- **Accessibility**: Labels associated with inputs, error messages announced, keyboard navigation

**Selection Patterns:**
- **Map Selection**: Tap-to-select stops, visual feedback, bottom sheet for details
- **List Selection**: Checkboxes for multiple selection, radio buttons for single selection
- **Network Selection**: List with signal strength, security indicators, selected state highlighted

**Validation:**
- **Real-time Validation**: Show errors as user types (when possible)
- **Submit Validation**: Show errors on submit/action
- **Error Messages**: Clear, specific, actionable
- **Success Indicators**: Visual confirmation when valid

**Auto-Save Pattern:**
- **When to Use**: Configuration changes, stop/line selection
- **Visual Design**: Subtle success indicator, no manual save button
- **Behavior**: Save automatically on change, show brief confirmation
- **Accessibility**: Screen reader announces save status

### Navigation Patterns

**Map-First Navigation:**
- **When to Use**: Primary interface for stop selection
- **Visual Design**: Full-screen map, bottom sheet overlays
- **Behavior**: Map always accessible, information in overlays, context preserved
- **Accessibility**: Map controls accessible, clear navigation structure

**Bottom Sheet Navigation:**
- **When to Use**: Stop details, configuration panels, device info
- **Visual Design**: Slides up from bottom, can minimize to header
- **Behavior**: Swipe down to dismiss/minimize, map remains accessible
- **Accessibility**: Focus management, keyboard navigation, screen reader support

**Tab Navigation** (if account-based):
- **When to Use**: Main app sections (Devices, Settings, etc.)
- **Visual Design**: Bottom tab bar, clear icons and labels
- **Behavior**: Tap to switch sections, maintain state
- **Accessibility**: Clear labels, focus indicators

**Back Navigation:**
- **When to Use**: Return to previous screen, cancel actions
- **Visual Design**: Back button (platform-specific), swipe gesture
- **Behavior**: Return to previous state, preserve context
- **Accessibility**: Clear back button labels, gesture alternatives

### Empty States

**No Devices Found:**
- **When to Use**: First-time user, no devices configured
- **Visual Design**: Illustration or icon, clear message, CTA button
- **Content**: "No devices yet", "Add your first device" button
- **Behavior**: Guide user to next action

**No Stops Selected:**
- **When to Use**: Device configured but no stops added
- **Visual Design**: Map view with prompt, clear instructions
- **Content**: "Tap on a stop to add it", visual indicator
- **Behavior**: Guide user to select stops

**Scanning Empty State:**
- **When to Use**: Bluetooth scan finds no devices
- **Visual Design**: Scanning indicator, troubleshooting guide
- **Content**: "No devices found", troubleshooting steps, retry button
- **Behavior**: Provide recovery options

### Loading States

**Bluetooth Scanning:**
- **Visual Design**: Animated scanning indicator, "Scanning for devices..."
- **Behavior**: Show progress, update as devices found
- **Duration**: 10-15 seconds timeout

**Device Connection:**
- **Visual Design**: Connection status indicator, "Connecting..."
- **Behavior**: Show progress, clear status updates
- **Duration**: 5-10 seconds typical

**Map Loading:**
- **Visual Design**: Map tiles loading indicator, skeleton screen
- **Behavior**: Show loading state, progressive tile loading
- **Duration**: 2-3 seconds typical

**Configuration Saving:**
- **Visual Design**: Subtle loading indicator, "Saving..."
- **Behavior**: Brief indicator, success confirmation
- **Duration**: <1 second typical

### Error Recovery Patterns

**Bluetooth Errors:**
- **Error Message**: Clear, specific error description
- **Recovery Steps**: Step-by-step troubleshooting guide
- **Retry Option**: Always provide retry button
- **Alternative Paths**: Manual device code entry (if applicable)

**WiFi Errors:**
- **Error Message**: Specific WiFi error (wrong password, network unavailable)
- **Recovery Steps**: Check network, retry connection
- **Retry Option**: Retry button, return to network selection
- **Alternative Paths**: Skip WiFi setup (if possible)

**Map Errors:**
- **Error Message**: Map loading failed, network error
- **Recovery Steps**: Check connection, retry loading
- **Retry Option**: Retry button, refresh map
- **Alternative Paths**: Offline mode, cached data

**Device Connection Errors:**
- **Error Message**: Device offline, connection lost
- **Recovery Steps**: Troubleshooting guide, check device power
- **Retry Option**: Retry connection, restart device
- **Alternative Paths**: Manual troubleshooting, support contact

## Responsive Design & Accessibility

### Responsive Strategy

**Mobile-First Approach:**
- **Primary Platform**: React Native mobile app (iOS + Android)
- **Design Philosophy**: Mobile-first, optimized for touch interactions
- **Screen Sizes**: iPhone (small to large), Android phones (various sizes), tablets (iPad, Android tablets)

**Device Considerations:**

**Small Phones** (iPhone SE, small Android):
- Single column layouts
- Full-width buttons for primary actions
- Compact spacing while maintaining touch targets
- Bottom sheet minimizes to header for map access
- Essential information prioritized

**Standard Phones** (iPhone 12-15, standard Android):
- Optimal layout (primary target)
- Spacious design with generous white space
- Full map interface with bottom sheet overlays
- Comfortable touch targets (44x44pt minimum)

**Large Phones** (iPhone Pro Max, large Android):
- Utilize extra space for better information density
- Larger map viewport
- More comfortable spacing
- Enhanced visual hierarchy

**Tablets** (iPad, Android tablets):
- Optimized layouts for larger screens
- Multi-column layouts where appropriate
- Enhanced map interface
- Better use of screen real estate
- Touch-optimized (not desktop mouse interactions)

**Responsive Adaptations:**
- **Layout**: Single column on all devices, spacing adjusts based on screen size
- **Typography**: Scales appropriately for readability
- **Touch Targets**: Minimum 44x44pt maintained across all devices
- **Map Interface**: Full-screen on phones, optimized viewport on tablets
- **Bottom Sheets**: Adjust height based on screen size, always accessible

### Breakpoint Strategy

**Mobile Breakpoints:**
- **Small Mobile**: < 375px width (iPhone SE, small Android)
- **Standard Mobile**: 375px - 428px width (iPhone 12-15, standard Android)
- **Large Mobile**: > 428px width (iPhone Pro Max, large Android)
- **Tablet**: > 768px width (iPad, Android tablets)

**Implementation Approach:**
- Use React Native's Dimensions API for responsive sizing
- Relative units (percentage, flex) over fixed pixels
- Platform-specific optimizations (iOS vs Android)
- Test on actual devices, not just simulators

**Key Breakpoints:**
- **375px**: Standard iPhone width - primary target
- **428px**: Large iPhone width - enhanced spacing
- **768px**: Tablet width - multi-column layouts

### Internationalization Strategy

**Multilingual Support:**

**Supported Languages (MVP/Early Post-MVP):**
- **Croatian (hr)**: Primary language for target market
- **English (en)**: Secondary language for broader accessibility

**Language Selection:**
- Language selection available in app settings
- Device language detection on first launch
- Language preference persists across app sessions
- Manual language override available

**Localization Scope:**
- All UI text (buttons, labels, headings, messages)
- Error messages and error recovery guidance
- Troubleshooting guides and help content
- Map interface controls and labels
- Bus stop information (where available from transit API)
- Date and time formats (language-appropriate)

**Implementation Approach:**
- React Native i18n library (react-i18next or similar)
- Translation file structure: `locales/[lang]/[namespace].json`
- Translation keys follow naming convention: `feature.component.element`
- Fallback to English when translation missing
- Layout adapts to different text lengths
- Native language detection and default setting

**Design Considerations:**
- **Text Length**: Croatian text may be longer than English - ensure UI accommodates
- **Layout Flexibility**: Use flexible layouts that adapt to text length
- **Character Support**: Proper rendering of Croatian characters (č, ć, đ, š, ž)
- **Cultural Appropriateness**: Translations reviewed by native speakers
- **Consistency**: Technical terminology consistent across languages

**Future Expansion:**
- Additional languages can be added based on market needs
- Translation management process established for easy expansion
- Community contributions for translations (future consideration)

### Accessibility Strategy

**WCAG Compliance Level: WCAG AA (Recommended)**

**Rationale:**
- Industry standard for good UX
- Legal compliance in many jurisdictions
- Ensures product is usable by people with disabilities
- Supports premium, inclusive product positioning

**Key Accessibility Requirements:**

**Color Contrast:**
- **Normal Text**: Minimum 4.5:1 contrast ratio (WCAG AA)
- **Large Text**: Minimum 3:1 contrast ratio (WCAG AA)
- **Yellow on Black**: Tested and meets contrast requirements
- **Interactive Elements**: High contrast for visibility

**Touch Targets:**
- **Minimum Size**: 44x44pt (iOS/Android guidelines)
- **Spacing**: Generous spacing between interactive elements
- **Visual Feedback**: Clear feedback for all touch interactions

**Screen Reader Support:**
- **iOS**: VoiceOver compatibility
- **Android**: TalkBack compatibility
- **Labels**: All interactive elements have descriptive labels
- **Status Announcements**: Screen reader announces status changes
- **Navigation**: Logical reading order

**Keyboard Navigation:**
- **Focus Management**: Clear focus indicators
- **Navigation**: Logical tab order
- **Shortcuts**: Platform-specific keyboard shortcuts where applicable

**Dynamic Type Support:**
- **iOS**: Support Dynamic Type scaling
- **Android**: Support font scaling
- **Layout**: Adapts to larger text sizes
- **Readability**: Text remains readable at all sizes

**Visual Accessibility:**
- **Color Independence**: Don't rely solely on color for information
- **Icons**: Use icons with labels for clarity
- **Focus Indicators**: Clear focus states for all interactive elements
- **Error States**: Clear visual and text-based error indicators

**Platform-Specific Accessibility:**
- **iOS**: VoiceOver, Dynamic Type, Switch Control support
- **Android**: TalkBack, font scaling, accessibility services support
- **Platform APIs**: Use native accessibility APIs

### Testing Strategy

**Responsive Testing:**
- **Real Device Testing**: Test on actual iOS and Android devices
- **Screen Size Testing**: Test across iPhone sizes (SE to Pro Max)
- **Android Testing**: Test across various Android device sizes
- **Tablet Testing**: Test on iPad and Android tablets
- **Orientation**: Test portrait and landscape orientations
- **Network Conditions**: Test on various network speeds (4G, WiFi, slow connections)

**Accessibility Testing:**
- **Automated Testing**: Use accessibility testing tools (axe, Lighthouse)
- **Screen Reader Testing**: 
  - iOS: VoiceOver testing on iPhone/iPad
  - Android: TalkBack testing on Android devices
- **Keyboard Navigation**: Test all flows with keyboard only
- **Color Blindness**: Test with color blindness simulators
- **Dynamic Type**: Test with maximum text size scaling
- **Touch Target Testing**: Verify all targets meet 44x44pt minimum

**User Testing:**
- **Inclusive Testing**: Include users with disabilities in testing
- **Assistive Technology**: Test with various assistive technologies
- **Diverse Devices**: Test on diverse device types and sizes
- **Real-World Conditions**: Test in actual usage scenarios

**Testing Checklist:**
- [ ] All interactive elements have labels
- [ ] All touch targets meet 44x44pt minimum
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announces all status changes
- [ ] Keyboard navigation works for all flows
- [ ] Dynamic Type scaling doesn't break layouts
- [ ] Error messages are clear and actionable
- [ ] Focus indicators are visible
- [ ] Color is not sole indicator of state
- [ ] All languages display correctly (Croatian, English)
- [ ] Text length variations don't break layouts
- [ ] Language selection persists across sessions
- [ ] Device language detection works correctly
- [ ] All user-facing text is translated
- [ ] Error messages are localized

### Implementation Guidelines

**Responsive Development:**

**React Native Best Practices:**
- Use `Dimensions` API for screen size detection
- Use `useWindowDimensions` hook for responsive layouts
- Use Flexbox for flexible layouts
- Use percentage and flex values over fixed pixels
- Test on actual devices, not just simulators

**Layout Patterns:**
- **Single Column**: Primary layout pattern for mobile
- **Flexible Spacing**: Use flex and percentage for spacing
- **Conditional Rendering**: Show/hide elements based on screen size
- **Platform-Specific**: Use Platform.select for iOS/Android differences

**Map Interface:**
- **Full-Screen**: Map takes full screen on phones
- **Responsive Controls**: Map controls adapt to screen size
- **Bottom Sheet**: Height adjusts based on screen size
- **Touch Optimization**: Large touch targets for map controls

**Accessibility Development:**

**React Native Accessibility:**
- Use `accessibilityLabel` for all interactive elements
- Use `accessibilityRole` for semantic meaning
- Use `accessibilityHint` for additional context
- Use `accessibilityState` for state information
- Use `accessibilityValue` for dynamic values

**Component Accessibility:**
- **Buttons**: Clear labels, proper roles
- **Inputs**: Associated labels, error messages
- **Lists**: Proper list semantics
- **Cards**: Clear structure and labels
- **Maps**: Accessible map controls, stop markers have labels

**Focus Management:**
- **Focus Indicators**: Clear visual focus states
- **Focus Order**: Logical focus order
- **Focus Trapping**: Trap focus in modals/dialogs
- **Skip Links**: Skip to main content where applicable

**Dynamic Type Support:**
- Use system font scaling
- Test with maximum text size
- Ensure layouts adapt to larger text
- Maintain readability at all sizes

**Color and Contrast:**
- Test all color combinations for contrast
- Use high contrast for important information
- Don't rely solely on color for state
- Provide alternative indicators (icons, labels, patterns)
