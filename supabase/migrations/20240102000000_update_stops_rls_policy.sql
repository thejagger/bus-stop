-- Update RLS policies for stops table
-- Allow public inserts (for syncing from public API)
-- Keep authenticated requirement for updates/deletes

-- Drop existing write policy
DROP POLICY IF EXISTS "stops_write_authenticated" ON stops;

-- Allow public inserts (for syncing stops from ZET API)
CREATE POLICY "stops_insert_public" ON stops
  FOR INSERT
  WITH CHECK (true);

-- Authenticated users can update/delete
CREATE POLICY "stops_update_delete_authenticated" ON stops
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "stops_delete_authenticated" ON stops
  FOR DELETE
  USING (auth.role() = 'authenticated');
