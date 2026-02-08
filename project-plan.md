📑 Project Plan: "ZET BusStation S3"
1. Device Architecture (ESP32-S3)
Objective: Create a standalone, self-configuring display that identifies itself uniquely.

Unique Identity: * Retrieve the hardware MAC Address.

On first boot, generate a Unique Secret ID (16-char string).

Store both in LittleFS (Flash Memory).

WiFi & Onboarding:

WiFiManager: If no WiFi is found, open a Captive Portal.

QR Workflow: Display a QR code for WiFi setup, followed by a "Pairing QR" that links to your-site.com/setup?mac=MAC&id=SECRET.

Display Logic:

Dual-Trip Rotation: Fetch the next 2 trips. Display Trip A for 10s, then Trip B for 10s.

The "Ticker": Dedicate the bottom 20-30 pixels of the screen to a scrolling "Newsfeed" for service updates (parsed from the ZET newsfeed).

Color Conversion: Use a Hex-to-RGB565 function so the backend can remotely trigger "Christmas Mode" (Red/Green) or "Standard Mode" (Yellow).

2. Web Dashboard (sveltekit + Leaflet)
Objective: A "Premium" configuration map where users manage their hardware "Wallet."

Leaflet Integration:

Render all stops/routes cached from Supabase.

Use a high-end Dark Mode tile provider (e.g., Mapbox or Stadia).

User Selection Flow:

User clicks a stop on the map.

sveltekit displays the specific Routes passing through that stop (Route IDs already include direction).

User selects their preferred Route.

State Management:

Store the MAC/Secret pairs in localStorage for guest access.

Sync selections to Supabase devices table using the jsonb config column.

3. Backend & API Middleware (Supabase)
Objective: Securely fetch and thin out data from the @tranzithr/zet-api.

Static Data Storage:

Stops Table: id, name, lat, lng.

Routes Table: id, name, direction, color.

Update these once a year via a script.

Edge Function (get-arrivals):

Validation: Accepts MAC and Secret.

Fetch: Calls zet.getStopIncomingTrips({ stopId }).

Filter: Only return the next 2 trips for the specific routeId saved in the device's config.

Newsfeed: Fetch the ZET newsfeed and return relevant alerts as a string for the ticker.

Payload: Return a tiny JSON (e.g., {"trips": [...], "news": "...", "color": "#FFCC00"}).

4. Operational Roadmap (The "Step-by-Step")
Step 1: Data Scrubbing
Download the ZET routes and stops. Upload them to Supabase so your Leaflet map has data to show without hitting the live API constantly.

Step 2: The Hardware "Shell"
Program the T-Display S3 to handle WiFi, store the Secret ID, and show a dummy "Bus Arrival" screen. Implement the Physical Reset Button logic (GPIO 0).

Step 3: The Middleware Function
Deploy a Supabase Edge Function that successfully talks to the ZET API and returns a "Hello World" arrival to your device.

Step 4: The Map Dashboard
Build the sveltekit frontend. Implement the "Setup" URL listener that grabs the MAC/Secret and lets you pick a stop from the Leaflet map.

Step 5: The "Live" Connection
Connect the dots. Save the Stop/Route ID from the map to Supabase. Make the T-Display S3 fetch that specific data every 60 seconds.

Step 6: Polish & Special Events
Add the scrolling newsfeed at the bottom. Implement the "Christmas Mode" logic in the Edge Function to override colors based on the date.

Pro Tip: For the newsfeed, since the S3 screen is small, make the text scroll very slowly. If there is no news, you can use that space to show the "Last Updated" time or the current weather.