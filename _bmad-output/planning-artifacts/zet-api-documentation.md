# ZET API Documentation

**Package:** @tranzithr/zet-api  
**Version:** 1.0.3  
**NPM:** https://www.npmjs.com/package/@tranzithr/zet-api  
**Purpose:** Zagreb Electric Tram (ZET) transit data API integration

---

## Overview

The ZET API provides real-time and static transit data for Zagreb's public transportation system (buses, trams). This package wraps the ZET API with caching and authentication management.

---

## Package Details

**Library:** @tranzithr/zet-api v1.0.3  
**Main Class:** `ZetManager`  
**Authentication:** Email/password based (requires manual registration at ZET website)  
**Caching:** Built-in caching for static data (routes, stops) - configurable cache duration

---

## Key Features

### Authentication
- Email/password login via `authManager.login()`
- Registration NOT available via API (returns "Method Not Allowed")
- Users must register manually at ZET website first
- Session management handled by library

### Data Caching
- Static data (stops, routes) cached for configurable duration
- Default cache: 5 minutes (300,000ms)
- Cache refresh and clear methods available
- Reduces API calls for frequently accessed data

### Available Methods

**Stops:**
- `getStops()` - Get all stops
- `searchStops({query, limit})` - Search stops by name
- `getStopById(stopId)` - Get specific stop
- `getStopIncomingTrips({stopId})` - Get real-time arrivals for a stop

**Routes:**
- `getRoutes()` - Get all routes
- `getRouteById(routeId)` - Get specific route
- `getRouteTrips({routeId, daysFromToday})` - Get trips for a route

**Cache Management:**
- `refreshCache()` - Refresh cached data
- `clearCache()` - Clear all cached data

---

## Implementation in Project

**Service Location:** `src/services/zet-api.ts`

**Initialization:**
```typescript
const zetManager = new ZetManager(5 * 60 * 1000); // 5 minute cache
```

**Environment Variables Required:**
- `VITE_ZET_API_EMAIL` - ZET API account email
- `VITE_ZET_API_PASSWORD` - ZET API account password

**Usage Pattern:**
1. Login with credentials from environment variables
2. Use cached methods for static data (stops, routes)
3. Use real-time methods for dynamic data (arrivals)
4. Handle errors gracefully (authentication, network, API errors)

---

## Data Types

**Stop:**
- `id: string`
- `name: string`
- `latitude: number`
- `longitude: number`
- `external_id?: string`

**Route:**
- `id: number`
- Additional route properties (from package types)

**StopIncomingTrip:**
- Trip information with arrival dates/times
- Includes route and stop details

---

## Error Handling

**Common Errors:**
- "Method Not Allowed" - Registration/login endpoint unavailable
- "Unauthorized" / "Invalid credentials" - Wrong email/password
- Network errors - API unavailable or connection issues

**Error Handling Strategy:**
- Provide user-friendly error messages
- Guide users to manual registration if needed
- Log errors for debugging
- Graceful degradation when API unavailable

---

## Integration Notes

**Backend Integration:**
- Backend fetches from ZET API (per PRD thin device architecture)
- Backend caches responses to reduce API calls
- Backend handles rate limiting and error recovery
- Device receives pre-rendered data from backend

**Rate Limiting:**
- ZET API may have rate limits (not documented in package)
- Backend should implement rate limiting and caching
- Cache static data (stops, routes) aggressively
- Poll real-time data (arrivals) every 30-60 seconds

---

## Architecture Decision Impact

**Thin Device Model:**
- Device does NOT call ZET API directly
- Backend handles all ZET API communication
- Backend formats data for device display
- Device only renders pre-formatted data

**Backend Responsibilities:**
- ZET API authentication and session management
- Data fetching and caching
- Rate limiting and error handling
- Data formatting for device display
- API response transformation
