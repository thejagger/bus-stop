#include "Arduino.h"
#include "TFT_eSPI.h" /* Please use the TFT library provided in the library. */
#include "img_logo.h"
#include "pin_config.h"
#include <qrcode_espi.h>
#include <DNSServer.h>
#include <WiFiManager.h>

/* The product now has two screens, and the initialization code needs a small change in the new version. The LCD_MODULE_CMD_1 is used to define the
 * switch macro. */
#define LCD_MODULE_CMD_1

DNSServer dnsServer;
TFT_eSPI tft = TFT_eSPI();
WiFiManager wm;

QRcode_eSPI qrcode (&tft);

#if defined(LCD_MODULE_CMD_1)
    typedef struct {
        uint8_t cmd;
        uint8_t data[14];
        uint8_t len;
    } lcd_cmd_t;

    lcd_cmd_t lcd_st7789v[] = {
        {0x11, {0}, 0 | 0x80},
        {0x3A, {0X05}, 1},
        {0xB2, {0X0B, 0X0B, 0X00, 0X33, 0X33}, 5},
        {0xB7, {0X75}, 1},
        {0xBB, {0X28}, 1},
        {0xC0, {0X2C}, 1},
        {0xC2, {0X01}, 1},
        {0xC3, {0X1F}, 1},
        {0xC6, {0X13}, 1},
        {0xD0, {0XA7}, 1},
        {0xD0, {0XA4, 0XA1}, 2},
        {0xD6, {0XA1}, 1},
        {0xE0, {0XF0, 0X05, 0X0A, 0X06, 0X06, 0X03, 0X2B, 0X32, 0X43, 0X36, 0X11, 0X10, 0X2B, 0X32}, 14},
        {0xE1, {0XF0, 0X08, 0X0C, 0X0B, 0X09, 0X24, 0X2B, 0X22, 0X43, 0X38, 0X15, 0X16, 0X2F, 0X37}, 14},
    };
#endif

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

    #if defined(LCD_MODULE_CMD_1)
        for (uint8_t i = 0; i < (sizeof(lcd_st7789v) / sizeof(lcd_cmd_t)); i++) {
            tft.writecommand(lcd_st7789v[i].cmd);
            for (int j = 0; j < (lcd_st7789v[i].len & 0x7f); j++) {
                tft.writedata(lcd_st7789v[i].data[j]);
            }

            if (lcd_st7789v[i].len & 0x80) {
                delay(120);
            }
        }
    #endif

    tft.setRotation(3);
    tft.setSwapBytes(true);
    tft.pushImage(0, 0, 320, 170, (uint16_t *)img_logo);
    delay(2000);

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
    tft.setTextColor(TFT_GREEN);
    tft.drawCentreString("CONNECTED!", 160, 75, 4);
}

void loop()
{

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