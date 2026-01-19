-- Test data for bus stop device setup system
-- Only devices are seeded here - stops and lines come from ZET API

-- Insert test devices
INSERT INTO devices (code, area, display_name, is_active, is_deleted)
VALUES 
  ('TEST123', 'zagreb', 'Test Device - Main Square', true, false),
  ('DEMO456', 'zagreb', 'Demo Device - Train Station', true, false)
ON CONFLICT (code) DO NOTHING;
