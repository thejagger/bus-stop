#include "Arduino.h"
#include "TFT_eSPI.h" /* Please use the TFT library provided in the library. */
#include "img_logo.h"
#include "pin_config.h"
#include <qrcode_espi.h>
#include <DNSServer.h>
#include <WiFiManager.h>
#include <Preferences.h>
#include <HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

DNSServer dnsServer;
TFT_eSPI tft = TFT_eSPI();
WiFiManager wm;

QRcode_eSPI qrcode (&tft);

// Device state management
Preferences preferences;
String deviceMac = "";
String deviceSecret = "";
String supabaseAnonKey = ""; // Supabase anon key (required for Edge Function authentication)
bool deviceConfigured = false;
unsigned long lastCheckTime = 0;
const unsigned long CHECK_INTERVAL = 30000; // 30 seconds

// Arrivals data structures
struct TripData {
    String routeShortName;
    String headsign;
    String arrivalTimeString;
    int arrivalTime;
};

TripData trips[4]; // Max 4 trips to display
int tripCount = 0;
uint16_t defaultColor = 65504; // Default color (0xFFE0)
unsigned long lastFetchTime = 0;
const unsigned long FETCH_INTERVAL = 30000; // 30 seconds
bool dataFetched = false;

// Supabase configuration - can be changed via Preferences if needed
String supabaseHost = "10.0.0.108";
int supabasePort = 54321;
String appUrl = "10.0.0.108";

// Supabase anon key - set this if you want to hardcode it (otherwise it will be loaded from Preferences)
// Leave empty to use Preferences storage instead

// Generate a 16-character random alphanumeric secret
String generateSecret() {
    String secret = "";
    const char charset[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    randomSeed(ESP.getEfuseMac());
    for (int i = 0; i < 16; i++) {
        secret += charset[random(0, 62)];
    }
    return secret;
}

// Format MAC address as hex string (12 characters, no colons)
String getMacAddress() {
    uint64_t chipid = ESP.getEfuseMac();
    char macStr[13];
    sprintf(macStr, "%02X%02X%02X%02X%02X%02X", 
        (uint8_t)(chipid>>40), (uint8_t)(chipid>>32), (uint8_t)(chipid>>24),
        (uint8_t)(chipid>>16), (uint8_t)(chipid>>8), (uint8_t)chipid);
    return String(macStr);
}

// Parse arrivals JSON response
bool parseArrivalsJson(String json) {
    // Reset trip count
    tripCount = 0;
    
    // Parse JSON
    StaticJsonDocument<2048> doc;
    DeserializationError error = deserializeJson(doc, json);
    
    if (error) {
        Serial.print("JSON parsing failed: ");
        Serial.println(error.c_str());
        return false;
    }
    
    // Extract DEFAULT_COLOR (already in RGB565 format)
    if (doc.containsKey("DEFAULT_COLOR")) {
        defaultColor = doc["DEFAULT_COLOR"].as<uint16_t>();
        Serial.print("Parsed color: ");
        Serial.println(defaultColor);
    }
    
    // Extract trips array
    if (!doc.containsKey("trips") || !doc["trips"].is<JsonArray>()) {
        Serial.println("No trips array found in JSON");
        return false;
    }
    
    JsonArray tripsArray = doc["trips"].as<JsonArray>();
    
    // Process up to 4 trips (already sorted by API)
    int tripIdx = 0;
    for (JsonObject tripObj : tripsArray) {
        if (tripIdx >= 4) break; // Max 4 trips to display
        
        // Get required fields
        if (!tripObj.containsKey("routeShortName") || 
            !tripObj.containsKey("headsign") || 
            !tripObj.containsKey("arrivalTimeString")) {
            continue;
        }
        
        trips[tripIdx].routeShortName = tripObj["routeShortName"].as<String>();
        trips[tripIdx].headsign = tripObj["headsign"].as<String>();
        trips[tripIdx].arrivalTimeString = tripObj["arrivalTimeString"].as<String>();
        
        // Get arrivalTime if available (optional)
        if (tripObj.containsKey("arrivalTime")) {
            trips[tripIdx].arrivalTime = tripObj["arrivalTime"].as<int>();
        } else {
            trips[tripIdx].arrivalTime = 0;
        }
        
        tripIdx++;
    }
    
    tripCount = tripIdx;
    
    Serial.print("Parsed ");
    Serial.print(tripCount);
    Serial.println(" trips");
    
    return (tripCount > 0);
}

// Save Supabase anon key to Preferences
void saveSupabaseAnonKey(String key) {
    preferences.begin("zet_device", false);
    preferences.putString("supabase_anon_key", key);
    preferences.end();
    supabaseAnonKey = key;
    Serial.println("Supabase anon key saved to Preferences");
}

// Load Supabase anon key from Preferences or hardcoded value
void loadSupabaseAnonKey() {
    // Check if hardcoded key is set (non-empty)
    String hardcodedKey = String(SUPABASE_ANON_KEY_HARDCODED);
    if (hardcodedKey.length() > 0) {
        supabaseAnonKey = hardcodedKey;
        Serial.println("Using hardcoded Supabase anon key");
        return;
    }
    
    // Otherwise load from Preferences
    preferences.begin("zet_device", false);
    supabaseAnonKey = preferences.getString("supabase_anon_key", "");
    preferences.end();
    
    if (supabaseAnonKey.length() > 0) {
        Serial.println("Supabase anon key loaded from Preferences");
    } else {
        Serial.println("WARNING: No Supabase anon key found!");
        Serial.println("Set SUPABASE_ANON_KEY_HARDCODED or configure via setup.");
        Serial.println("Edge Function requests will fail without authentication.");
    }
}

// Add Authorization header to HTTP client if anon key is available
void addAuthHeader(HTTPClient& http) {
    if (supabaseAnonKey.length() > 0) {
        http.addHeader("Authorization", "Bearer " + supabaseAnonKey);
        Serial.println("Added Supabase anon key to Authorization header");
    } else {
        Serial.println("WARNING: No Supabase anon key configured - request may fail!");
    }
}

// Fetch arrivals data from API
bool fetchArrivalsData() {
    // Check WiFi connection first
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected for arrivals fetch!");
        return false;
    }
    
    HTTPClient http;
    WiFiClient client;
    
    // Build URL with configurable host/port
    String url = "http://" + supabaseHost + ":" + String(supabasePort) + "/functions/v1/arrivals?mac=" + deviceMac + "&secret=" + deviceSecret;
    
    Serial.print("Fetching arrivals from: ");
    Serial.println(url);
    
    if (!http.begin(client, url)) {
        Serial.println("HTTP begin failed!");
        return false;
    }
    
    // Add Authorization header
    addAuthHeader(http);
    
    http.setTimeout(10000); // 10 second timeout
    http.setConnectTimeout(5000); // 5 second connect timeout
    
    int httpCode = http.GET();
    
    bool success = false;
    if (httpCode == 200) {
        String payload = http.getString();
        Serial.print("Received payload length: ");
        Serial.println(payload.length());
        
        // Parse JSON
        if (parseArrivalsJson(payload)) {
            success = true;
            dataFetched = true;
            Serial.println("Successfully fetched and parsed arrivals data");
        } else {
            Serial.println("Failed to parse arrivals JSON");
        }
    } else {
        Serial.print("HTTP GET failed, error code: ");
        Serial.print(httpCode);
        Serial.print(" - ");
        Serial.println(http.errorToString(httpCode));
    }
    
    http.end();
    return success;
}

void drawGrid(int spacing = 10) {
  for (int x = 0; x < tft.width(); x += spacing) {
    tft.drawLine(x, 0, x, tft.height(), TFT_SILVER);
  }
  for (int y = 0; y < tft.height(); y += spacing) {
    tft.drawLine(0, y, tft.width(), y, TFT_SILVER);
  }
}

// Display arrivals data on screen
void displayArrivals() {
    // Clear screen with black background
    tft.fillScreen(TFT_BLACK);
    
    // drawGrid();

    if (tripCount == 0) {
        // No data available
        tft.setTextColor(defaultColor);
        tft.drawCentreString("No arrivals", 160, 75, 2);
        return;
    }
    
    // Display up to 4 trips
    // Row height: ~42 pixels (170 / 4 = ~42px)
    // Row 1: y = 0-42, Row 2: y = 42-84, Row 3: y = 84-126, Row 4: y = 126-168
    const int rowHeight = 42;
    const int startY[4] = {2, 44, 86, 128};
    
    // Fixed positions
    const int routeX = 2; // Start of route number
    const int routeFont = 4;
    // Calculate route width: font 4 is approximately 24 pixels per character
    // Max 3 digits = 3 * 24 = 72 pixels, add padding for safety
    const int routeWidth = 72; // Safe width for max 3 digits with font 4
    const int timeX = 318; // Right-aligned time
    const int headsignX = routeX + routeWidth + 2; // Start of headsign (right after route with spacing)
    const int headsignWidth = timeX - headsignX - 10; // Width available (leave space for time on right)
    

    for (int i = 0; i < tripCount && i < 4; i++) {
        int y = startY[i] + (rowHeight / 2); // Center vertically in row
        
        // Set text color (use defaultColor from API, fallback to TFT_YELLOW)
        tft.setTextColor(defaultColor);
        
        // Left: routeShortName (fixed width, max 3 digits, font 4)
        tft.setTextDatum(ML_DATUM); // Top-left alignment
        tft.drawString(trips[i].routeShortName, routeX, y, routeFont);

        tft.setTextDatum(ML_DATUM); // Top-left alignment
        tft.drawString(trips[i].headsign, headsignX, y, routeFont);
        
        // Right: arrivalTimeString (font 4)
        tft.setTextDatum(MR_DATUM); // Top-right alignment
        tft.drawString(trips[i].arrivalTimeString, timeX, y, routeFont);
    }
}

// Display setup QR code with MAC and Secret
void showSetupQR(String mac, String secret) {
    // Clear screen to white background
    tft.fillScreen(TFT_WHITE);
    
    // Generate QR code URL
    String qrData = "http://" + appUrl + ":3000/setup?mac=" + mac + "&id=" + secret;
    
    // Render QR code (centered, takes up ~116x116 area)
    qrcode.init();
    qrcode.create(qrData);
    
    // Draw left panel (Branding)
    tft.setTextColor(TFT_BLACK);
    tft.drawString("ZET", 15, 70, 4);
    tft.setTextColor(0x73AE); // Zinc-500 Gray
    tft.drawString("v1.0.4", 15, 100, 2);
    
    // Draw right panel (Instructions)
    tft.setTextColor(TFT_BLACK);
    tft.drawString("Setup", 235, 50, 2);
    
    tft.setTextColor(0x73AE); // Zinc-500 Gray
    tft.drawString("Scan QR:", 235, 75, 1);
    
    tft.setTextColor(TFT_BLACK);
    tft.drawString("to configure", 235, 90, 1);
    
    // Draw bottom bar (subtle accent)
    tft.fillRect(0, 165, 320, 5, 0x18C3); // Zinc-900
}

void configModeCallback(WiFiManager *myWM) {
    // 1. Clear screen to White (Shadcn Light Base)
    tft.fillScreen(TFT_WHITE); 

    // 2. Render QR First (It will take up the center 116x116 area)
    String qrData = "WIFI:S:" + myWM->getConfigPortalSSID() + ";T:nopass;;";
    qrcode.init();
    qrcode.create(qrData);

    // 3. DRAW LEFT PANEL (Branding)
    tft.setTextColor(TFT_BLACK);
    tft.drawString("ZET", 15, 70, 4); // Large Brand Name
    tft.setTextColor(0x73AE); // Zinc-500 Gray (5-6-5 color)
    tft.drawString("v1.0.4", 15, 100, 2);

    // 4. DRAW RIGHT PANEL (Instructions)
    // We start drawing at x=235 to stay clear of the QR code
    tft.setTextColor(TFT_BLACK);
    tft.drawString("Setup", 235, 50, 2);
    
    tft.setTextColor(0x73AE); // Zinc-500 Gray
    tft.drawString("Join Wi-Fi:", 235, 75, 1);
    
    tft.setTextColor(TFT_BLACK);
    // Use a smaller font for SSID if it's long to prevent screen bleed
    tft.drawString(myWM->getConfigPortalSSID().substring(0, 10), 235, 90, 2); 
    
    // 5. DRAW BOTTOM BAR (Subtle accent)
    tft.fillRect(0, 165, 320, 5, 0x18C3); // Zinc-900 (Very dark gray)
}

void setup()
{
    pinMode(PIN_POWER_ON, OUTPUT);
    digitalWrite(PIN_POWER_ON, HIGH);

    Serial.begin(115200);
    Serial.println("Hello T-Display-S3");

    tft.begin();

    tft.setRotation(3);
    // setSwapBytes(true) swaps byte order - needed for images but causes color inversion for text
    // Since we're not using images currently, keep it false for correct text colors
    tft.setSwapBytes(false);
    // If you need to display images later, set swapBytes(true) before pushImage, then set back to false
    // tft.setSwapBytes(true);
    // tft.pushImage(0, 0, 320, 170, (uint16_t *)img_logo);
    // tft.setSwapBytes(false);
    // delay(2000);

    #if ESP_IDF_VERSION < ESP_IDF_VERSION_VAL(5,0,0)
        ledcSetup(0, 2000, 8);
        ledcAttachPin(PIN_LCD_BL, 0);
        ledcWrite(0, 255);
    #else
        ledcAttach(PIN_LCD_BL, 200, 8);
        ledcWrite(PIN_LCD_BL, 255);
    #endif

    // 1. Setup the "Anti-Smart-Switch" environment
    // Use 10.0.1.1 to signal a "Public" network to the phone
    wm.setAPStaticIPConfig(IPAddress(10, 0, 1, 1), IPAddress(10, 0, 1, 1), IPAddress(255, 255, 255, 0));
    wm.setCaptivePortalEnable(true);
    wm.setAPCallback(configModeCallback);
    wm.setConfigPortalTimeout(180);

    // 2. Wipe settings if Button 0 is held
    pinMode(0, INPUT_PULLUP); 
    if (digitalRead(0) == LOW) {
        tft.fillScreen(TFT_RED);
        tft.drawString("RESETTING WIFI...", 80, 75, 4);
        wm.resetSettings();
        delay(3000);
        ESP.restart();
    }
    
    // 3. Start Portal
    String portalSSID = "ZET_Setup_" + String((uint32_t)ESP.getEfuseMac(), HEX).substring(0, 4);
    
    tft.fillScreen(TFT_BLACK);
    tft.setTextColor(TFT_YELLOW);
    tft.drawCentreString("Join WiFi: " + portalSSID, 160, 10, 2);

    const char* custom_html_head = 
    "<style>"
    "body { background-color: #09090b; color: #fafafa; font-family: -apple-system, system-ui, sans-serif;}"
    "h1 { font-size: 24px; font-weight: 600; letter-spacing: -0.025em; margin-bottom: 8px; color: #ffffff; }"
    "div, form { background: #09090b; border: 1px solid #27272a; padding: 24px; border-radius: 8px; margin: auto; }"
    "input { background: #09090b; border: 1px solid #27272a; color: #fff; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; width: 100%; box-sizing: border-box; font-size: 14px; }"
    "input:focus { border-color: #a1a1aa; outline: none; }"
    "button { background: #fafafa; color: #18181b; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 500; font-size: 14px; cursor: pointer; width: 100%; margin-top: 8px; }"
    "button:hover { background: #f4f4f5; }"
    "button[style*='background-color:#000000'] { background: #09090b !important; color: #fafafa !important; border: 1px solid #27272a !important; }" 
    "table { width: 100%; margin-top: 10px; }"
    "td { padding: 12px 0; border-bottom: 1px solid #27272a; font-size: 14px; }"
    ".q { color: #71717a; text-decoration: none; font-size: 12px; display: block; margin-top: 20px; text-align: center; }"
    "</style>"
    "<meta name='viewport' content='width=device-width, initial-scale=1'>";

    wm.setCustomHeadElement(custom_html_head);

    // No password passed here = Open Network (triggers portal pop-up better)
    if (!wm.autoConnect(portalSSID.c_str())) {
        Serial.println("Failed to connect");
        ESP.restart();
    }

    tft.fillScreen(TFT_BLACK);
    tft.setTextColor(TFT_YELLOW);
    tft.drawCentreString("CONNECTED!", 160, 75, 4);
    
    // Wait for WiFi to stabilize
    delay(2000);
    
    // Verify WiFi connection
    Serial.print("WiFi SSID: ");
    Serial.println(WiFi.SSID());
    Serial.print("WiFi IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("WiFi RSSI: ");
    Serial.println(WiFi.RSSI());

    // Initialize Preferences and get/retrieve device secret
    preferences.begin("zet_device", false);
    
    // Get MAC address
    deviceMac = getMacAddress();
    Serial.print("Device MAC: ");
    Serial.println(deviceMac);
    
    // Get or generate secret
    deviceSecret = preferences.getString("secret", "");
    if (deviceSecret.length() == 0) {
        // Generate new secret on first boot
        deviceSecret = generateSecret();
        preferences.putString("secret", deviceSecret);
        Serial.print("Generated new secret: ");
        Serial.println(deviceSecret);
    } else {
        Serial.print("Retrieved secret: ");
        Serial.println(deviceSecret);
    }
    
    // Load Supabase anon key if available
    loadSupabaseAnonKey();
    
    // Check if device is configured in Supabase by fetching arrivals data
    Serial.println("Checking device registration...");
    if (fetchArrivalsData()) {
        deviceConfigured = true;
        Serial.println("Device is configured!");
        displayArrivals();
    } else {
        deviceConfigured = false;
        Serial.println("Device not found, showing setup QR...");
        showSetupQR(deviceMac, deviceSecret);
    }
    
    lastCheckTime = millis();
}

void loop()
{
    unsigned long currentTime = millis();
    
    // If device is not configured, check periodically
    if (!deviceConfigured) {
        // Check every CHECK_INTERVAL (30 seconds)
        if (currentTime - lastCheckTime >= CHECK_INTERVAL) {
            Serial.println("Re-checking device registration...");
            
            if (fetchArrivalsData()) {
                deviceConfigured = true;
                Serial.println("Device is now configured!");
                
                // Initialize timers for arrivals display
                lastFetchTime = currentTime;
                
                // Display arrivals immediately
                displayArrivals();
            } else {
                Serial.println("Device still not configured, keeping QR code displayed.");
            }
            
            lastCheckTime = currentTime;
        }
    } else {
        // Device is configured - handle arrivals display
        
        // Fetch new data every FETCH_INTERVAL (30 seconds)
        if (currentTime - lastFetchTime >= FETCH_INTERVAL) {
            Serial.println("Fetching new arrivals data...");
            if (fetchArrivalsData()) {
                displayArrivals();
            }
            lastFetchTime = currentTime;
        }
    }
}


// TFT Pin check
#if PIN_LCD_WR  != TFT_WR || \
    PIN_LCD_RD  != TFT_RD || \
    PIN_LCD_CS    != TFT_CS   || \
    PIN_LCD_DC    != TFT_DC   || \
    PIN_LCD_RES   != TFT_RST  || \
    PIN_LCD_D0   != TFT_D0  || \
    PIN_LCD_D1   != TFT_D1  || \
    PIN_LCD_D2   != TFT_D2  || \
    PIN_LCD_D3   != TFT_D3  || \
    PIN_LCD_D4   != TFT_D4  || \
    PIN_LCD_D5   != TFT_D5  || \
    PIN_LCD_D6   != TFT_D6  || \
    PIN_LCD_D7   != TFT_D7  || \
    PIN_LCD_BL   != TFT_BL  || \
    TFT_BACKLIGHT_ON   != HIGH  || \
    170   != TFT_WIDTH  || \
    320   != TFT_HEIGHT
#error  "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#error  "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#error  "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#error  "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#endif

#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5,0,0)
#error  "The current version is not supported for the time being, please use a version below Arduino ESP32 3.0"
#endif