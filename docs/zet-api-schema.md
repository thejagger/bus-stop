# ZET API Schema & Supabase Integration

Reference: [TransitHR/zet-api-client](https://github.com/TransitHR/zet-api-client).

This doc defines the data we need from ZET (stops, routes, newsfeed), how we store it in Supabase, and how the device gets realtime arrivals **without** using the `zet-api` npm package—using two simple functions instead.

---

## 1. Data schemas (from ZET API / zet-api-client)

### 1.1 Stops

What we get from ZET (e.g. `getStops()` / `searchStops()`):

| Field        | Type     | Description |
|-------------|----------|-------------|
| `id`        | string   | Stop ID (e.g. `"189_1"`, platform-specific). |
| `name`      | string   | Display name (e.g. "Aleja javora"). |
| `stopLat`   | number   | Latitude (WGS84). |
| `stopLong`  | number   | Longitude (WGS84). |
| `parentStopId` | string \| null | Optional parent stop ID for grouping platforms. |
| `routeType` | number   | Route type (e.g. 0). |
| `trips`     | array    | List of trip/route info: `{ routeCode: string, tripHeadsigns: string[] }`. |
| `normalizedSearchName` | string | Normalized name for search. |
| `isForDisabledPeople` | boolean | Accessibility flag. |
| `projectNo` | string   | Project identifier. |

We store **id, name, lat/lng (from stopLat/stopLong), parent_stop_id, route_type, normalized_search_name, is_for_disabled_people, project_no, trips** for the map, device config, and search bar.

---

### 1.2 Routes

What we get from ZET (e.g. `getRoutes()` / `getRouteById()`):

| Field        | Type     | Description |
|-------------|----------|-------------|
| `id`        | number   | Route ID (e.g. 1, 6, 11). |
| `shortName` | string  | Short label (e.g. "1", "6"). |
| `longName`  | string  | Full name (e.g. "Zapadni kolodvor - Borongaj"). |
| `routeType` | number  | Route type (e.g. 0). |
| `departureHeadsign` | string | Departure headsign (e.g. "Z. kolodvor"). |
| `destinationHeadsign` | string | Destination headsign (e.g. "Borongaj"). |
| `normalizedSearchName` | string | Normalized name for search. |
| `color`     | string  | Hex color (e.g. "#FFCC00"). |
| `direction` | number \| null | Direction indicator if applicable (0 = outbound, 1 = inbound). |

We store **id, name (longName), short_name, direction, color, route_type, departure_headsign, destination_headsign, normalized_search_name** for the dashboard, device config, and search bar.

---

### 1.3 ZET Newsfeed

What we get from ZET (e.g. `getNewsfeed()`):

| Field       | Type     | Description |
|------------|----------|-------------|
| `id`       | string \| number | Unique news item ID. |
| `title`    | string   | Headline. |
| `body`     | string   | Full text (optional). |
| `lines`    | string[] | Affected lines (e.g. ["1", "6"]); empty = all. |
| `validFrom`| string (ISO) or Date | Start of validity. |
| `validTo`  | string (ISO) or Date | End of validity. |

We store all of these for the ticker and for filtering “active” news by date.

---

## 2. Supabase tables (storage)

### 2.1 `stops`

Static stop data for the Leaflet map, device setup, and search.

| Column   | Type    | Constraints | Description |
|----------|---------|-------------|-------------|
| `id`     | text    | PRIMARY KEY | ZET stop ID (e.g. `317_1`). |
| `name`   | text    | NOT NULL    | Display name. |
| `lat`    | double precision | NOT NULL | Latitude. |
| `lng`    | double precision | NOT NULL | Longitude. |
| `parent_stop_id` | text | nullable, FK → `stops(id)` | Parent stop for platforms. |
| `route_type` | integer | nullable | Route type (e.g. 0). |
| `normalized_search_name` | text | nullable | For search bar. |
| `is_for_disabled_people` | boolean | default false | Accessibility. |
| `project_no` | text | nullable | Project identifier. |
| `trips`  | jsonb   | default '[]' | `{ routeCode, tripHeadsigns }[]` at this stop. |
| `updated_at` | timestamptz | default now() | Last sync time. |

### 2.2 `routes`

Static route data for the map, device config, and search.

| Column     | Type    | Constraints | Description |
|------------|---------|-------------|-------------|
| `id`       | integer | PRIMARY KEY | ZET route ID. |
| `name`     | text    | NOT NULL    | Long name. |
| `short_name` | text  | nullable    | Short label. |
| `direction` | integer | nullable  | 0 = outbound, 1 = inbound. |
| `color`    | text    | nullable    | Hex color. |
| `route_type` | integer | nullable | Route type (e.g. 0). |
| `departure_headsign` | text | nullable | Departure headsign. |
| `destination_headsign` | text | nullable | Destination headsign. |
| `normalized_search_name` | text | nullable | For search bar. |
| `updated_at` | timestamptz | default now() | Last sync time. |

### 2.3 `stop_routes`

Junction table (many-to-many stops ↔ routes) for Supabase relations. Populated during sync from each stop’s `trips` array (routeCode → route id).

| Column   | Type    | Constraints | Description |
|----------|---------|-------------|-------------|
| `stop_id`  | text    | NOT NULL, FK → `stops(id)` ON DELETE CASCADE | Stop ID. |
| `route_id` | integer | NOT NULL, FK → `routes(id)` ON DELETE CASCADE | Route ID. |
| PRIMARY KEY | (stop_id, route_id) | | |

### 2.4 `zet_news`

Newsfeed items for the ticker and “active updates” logic.

| Column      | Type         | Constraints | Description |
|-------------|--------------|-------------|-------------|
| `id`        | text         | PRIMARY KEY | ZET news ID (stringify if number). |
| `title`     | text         | NOT NULL    | Headline. |
| `body`      | text         | nullable    | Full text. |
| `lines`     | jsonb        | default '[]'| Affected lines array. |
| `valid_from`| timestamptz  | NOT NULL    | Valid from. |
| `valid_to`  | timestamptz   | NOT NULL    | Valid to. |
| `updated_at`| timestamptz  | default now() | Last sync time. |

### 2.5 `devices`

Device identity and config (for realtime arrivals).

| Column   | Type    | Constraints | Description |
|----------|---------|-------------|-------------|
| `mac`    | text    | PRIMARY KEY | Hardware MAC. |
| `secret` | text    | NOT NULL    | 16-char secret (from device). |
| `config` | jsonb   | default '{}' | `{ "stopId": "317_1", "routeId": 1 }`. |
| `updated_at` | timestamptz | default now() | Last update. |

---

## 3. Daily sync (cron / function)

**Goal:** Keep `stops`, `routes`, and `zet_news` up to date without calling the ZET API on every request.

- **What:** One Edge Function **`sync-zet`** that:
  1. Fetches **routes** from ZET (first: stops reference routes via stop_routes).
  2. Fetches **stops** from ZET (timetable service).
  3. Populates **stop_routes** from each stop’s `trips` array (routeCode → route id).
  4. Fetches **newsfeed** from ZET (news proxy service).
  5. Upserts into Supabase `routes`, `stops`, `stop_routes`, `zet_news` (by primary key).

- **When:** Run once per day (e.g. cron at 3:00 AM). Schedule the Edge Function in Supabase Dashboard (e.g. Cron trigger).

- **Implementation:** Supabase Edge Function **`sync-zet`** uses `fetch()` to ZET API (no `zet-api` package). ZET URLs and headers are hardcoded in the function.

- **Env:** Edge Functions receive `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Supabase. Optional secrets (e.g. ZET proxy) are set in Supabase Dashboard.

---

## 4. Realtime updates for the device

**Goal:** Device calls one endpoint with MAC + Secret and receives the next 2 trips for its stop/route plus news for the ticker.

- **Flow:**
  1. Device sends **MAC** and **Secret** (e.g. in body or query).
  2. Backend validates against `devices` table.
  3. Backend reads `config.stopId` and `config.routeId` from the device row.
  4. Backend fetches **incoming trips** for that stop (ZET “getStopIncomingTrips” equivalent via `fetch`).
  5. Backend filters by `routeId` and returns only the **next 2 trips**.
  6. Backend fetches **newsfeed**, filters to “active” (now between validFrom and validTo), optionally by line, and returns a single string for the ticker.
  7. Backend returns `{ trips: [...], news: "...", color: "#FFCC00" }` (color from route or “Christmas mode” logic).

- **Implementation:** Supabase Edge Function **`arrivals`** – callable at `https://<project-ref>.supabase.co/functions/v1/arrivals` with `GET` (query `mac`, `secret`) or `POST` (body `{ mac, secret }`). It does not use the `zet-api` package; uses `fetch()` to ZET for incoming trips; reads device config and active news from Supabase; returns `{ trips, news, color }`.

---

## 5. Summary

| Need                 | Solution |
|----------------------|----------|
| Schema for stops     | Section 1.1 → Supabase `stops` (Section 2.1). |
| Schema for routes    | Section 1.2 → Supabase `routes` (Section 2.2). |
| Schema for newsfeed  | Section 1.3 → Supabase `zet_news` (Section 2.3). |
| Daily sync           | One sync function (cron) that fetches ZET and upserts to Supabase; no `zet-api` in main app. |
| Realtime for device  | One function callable by device (MAC + Secret) returning next 2 trips + news + color. |

All of this can be implemented with **two functions** (sync + realtime) and **fetch** only; no need to include the zet-api JS package in the project.

---

## 6. Implementation (this repo)

| What | Where |
|------|--------|
| **Sync (daily)** | Supabase Edge Function **`sync-zet`**. Schedule via Supabase Dashboard (e.g. cron once per day). Fetches ZET routes, stops, news and upserts into Supabase. |
| **Realtime (device)** | Supabase Edge Function **`arrivals`**. Device calls **`https://<project-ref>.supabase.co/functions/v1/arrivals`** with `mac` + `secret` (query or JSON body). Returns `{ trips, news, color }`. |
| **ZET API config** | URLs and headers (from [TransitHR/zet-api-client](https://github.com/TransitHR/zet-api-client)) are hardcoded inside the Edge Functions: base `https://api.zet.hr`, timetable `TimetableService.Api/api/gtfs`, news `NewsProxyService.Api/api/newsfeed`, headers `appuid: ZET.Mobile`, `x-tenant: KingICT_ZET_Public`, etc. |
| **Env** | `.env.example`: `SUPABASE_SERVICE_ROLE_KEY` for server-side dashboard. Edge Function secrets (e.g. for a ZET proxy) are set in Supabase Dashboard. |

**Device URL:** Replace `<project-ref>` with your Supabase project reference. Example: `GET https://abcdefgh.supabase.co/functions/v1/arrivals?mac=AA:BB:CC&secret=xyz` or `POST` with body `{ "mac": "AA:BB:CC", "secret": "xyz" }`.
