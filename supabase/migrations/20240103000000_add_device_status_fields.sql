-- Add firmware_version and wifi_ssid to devices table for device status tracking

ALTER TABLE devices
  ADD COLUMN firmware_version TEXT,
  ADD COLUMN wifi_ssid TEXT;

-- Add index for firmware_version (useful for filtering/updates)
CREATE INDEX idx_devices_firmware_version ON devices(firmware_version) WHERE firmware_version IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN devices.firmware_version IS 'Device firmware version (reported by device)';
COMMENT ON COLUMN devices.wifi_ssid IS 'WiFi SSID device is connected to (reported by device)';
