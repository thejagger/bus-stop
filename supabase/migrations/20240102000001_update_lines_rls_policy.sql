-- Update RLS policies for lines table
-- Allow public inserts (for syncing from public API)
-- Keep authenticated requirement for updates/deletes

-- Drop existing write policy
DROP POLICY IF EXISTS "lines_write_authenticated" ON lines;

-- Allow public inserts (for syncing lines from ZET API)
CREATE POLICY "lines_insert_public" ON lines
  FOR INSERT
  WITH CHECK (true);

-- Authenticated users can update/delete
CREATE POLICY "lines_update_delete_authenticated" ON lines
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "lines_delete_authenticated" ON lines
  FOR DELETE
  USING (auth.role() = 'authenticated');
