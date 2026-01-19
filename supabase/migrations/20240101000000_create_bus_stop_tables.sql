-- Create devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  area TEXT NOT NULL,
  display_name TEXT,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  modified_at TIMESTAMPTZ DEFAULT now()
);

-- Create stops table
CREATE TABLE stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area TEXT NOT NULL,
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  modified_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(area, external_id)
);

-- Create lines table
CREATE TABLE lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area TEXT NOT NULL,
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  direction TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  modified_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(area, external_id, direction)
);

-- Create device_stop_lines table
CREATE TABLE device_stop_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  stop_id UUID NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  line_id UUID NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  modified_at TIMESTAMPTZ DEFAULT now()
);

-- Create schedule_cache table
CREATE TABLE schedule_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  stop_id UUID NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  line_id UUID NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
  arrival_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_devices_code ON devices(code) WHERE is_deleted = false;
CREATE INDEX idx_devices_area ON devices(area) WHERE is_deleted = false;
CREATE INDEX idx_stops_area ON stops(area) WHERE is_deleted = false;
CREATE INDEX idx_stops_external_id ON stops(external_id);
CREATE INDEX idx_lines_area ON lines(area) WHERE is_deleted = false;
CREATE INDEX idx_lines_external_id ON lines(external_id);
CREATE INDEX idx_device_stop_lines_device_id ON device_stop_lines(device_id) WHERE is_deleted = false;
CREATE INDEX idx_device_stop_lines_stop_id ON device_stop_lines(stop_id) WHERE is_deleted = false;
CREATE INDEX idx_device_stop_lines_line_id ON device_stop_lines(line_id) WHERE is_deleted = false;
CREATE INDEX idx_schedule_cache_device_id ON schedule_cache(device_id);
CREATE INDEX idx_schedule_cache_stop_line ON schedule_cache(stop_id, line_id);

-- Enable Row Level Security
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_stop_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for devices
-- Public read by code (for setup page)
CREATE POLICY "devices_read_by_code" ON devices
  FOR SELECT
  USING (is_deleted = false);

-- Authenticated users can write
CREATE POLICY "devices_write_authenticated" ON devices
  FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS Policies for stops
-- Public read for area
CREATE POLICY "stops_read_by_area" ON stops
  FOR SELECT
  USING (is_deleted = false);

-- Authenticated users can write
CREATE POLICY "stops_write_authenticated" ON stops
  FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS Policies for lines
-- Public read for area
CREATE POLICY "lines_read_by_area" ON lines
  FOR SELECT
  USING (is_deleted = false);

-- Authenticated users can write
CREATE POLICY "lines_write_authenticated" ON lines
  FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS Policies for device_stop_lines
-- Public read for device_id (for device polling)
CREATE POLICY "device_stop_lines_read_by_device" ON device_stop_lines
  FOR SELECT
  USING (is_deleted = false);

-- Authenticated users can write
CREATE POLICY "device_stop_lines_write_authenticated" ON device_stop_lines
  FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS Policies for schedule_cache
-- Public read for device_id (for device polling)
CREATE POLICY "schedule_cache_read_by_device" ON schedule_cache
  FOR SELECT
  USING (true);

-- Authenticated users can write
CREATE POLICY "schedule_cache_write_authenticated" ON schedule_cache
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create function to update modified_at timestamp
CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for modified_at
CREATE TRIGGER update_devices_modified_at
  BEFORE UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER update_stops_modified_at
  BEFORE UPDATE ON stops
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER update_lines_modified_at
  BEFORE UPDATE ON lines
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER update_device_stop_lines_modified_at
  BEFORE UPDATE ON device_stop_lines
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_at();
