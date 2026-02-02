-- ZET static data and devices (see docs/zet-api-schema.md)

-- Stops: for Leaflet map and device config
CREATE TABLE IF NOT EXISTS public.stops (
    id          text PRIMARY KEY,
    name        text NOT NULL,
    lat         double precision NOT NULL,
    lng         double precision NOT NULL,
    parent_stop_id text,
    route_type  integer,
    normalized_search_name text,
    is_for_disabled_people boolean DEFAULT false,
    project_no  text,
    trips       jsonb DEFAULT '[]'::jsonb,
    updated_at  timestamptz DEFAULT now() NOT NULL
);

-- Routes: for map and device config (news_text = concatenated news for device subtext)
CREATE TABLE IF NOT EXISTS public.routes (
    id          integer PRIMARY KEY,
    name        text NOT NULL,
    short_name  text,
    route_type  integer,
    departure_headsign text,
    destination_headsign text,
    normalized_search_name text,
    news_text   text,
    updated_at  timestamptz DEFAULT now() NOT NULL
);

-- Junction: many-to-many stops <-> routes (for Supabase relations)
CREATE TABLE IF NOT EXISTS public.stop_routes (
    stop_id     text NOT NULL REFERENCES public.stops(id) ON DELETE CASCADE,
    route_id    integer NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    PRIMARY KEY (stop_id, route_id)
);

-- Devices: MAC + secret + config (stopId, routeId)
CREATE TABLE IF NOT EXISTS public.devices (
    mac         text PRIMARY KEY,
    secret      text NOT NULL,
    config      jsonb DEFAULT '{}'::jsonb,
    updated_at  timestamptz DEFAULT now() NOT NULL
);

-- Indexes for common lookups and search
CREATE INDEX IF NOT EXISTS idx_stops_normalized_search ON public.stops(normalized_search_name);
CREATE INDEX IF NOT EXISTS idx_routes_normalized_search ON public.routes(normalized_search_name);
-- RLS: allow anon/service role for app and cron (adjust policies as needed for auth)
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stop_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Allow read for anon (map, setup); devices table used by API with secret
CREATE POLICY "Allow read stops" ON public.stops FOR SELECT USING (true);
CREATE POLICY "Allow read routes" ON public.routes FOR SELECT USING (true);
CREATE POLICY "Allow read stop_routes" ON public.stop_routes FOR SELECT USING (true);
-- Devices: only service role (cron, device API, dashboard server) can access
CREATE POLICY "Service role read devices" ON public.devices FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role insert devices" ON public.devices FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role update devices" ON public.devices FOR UPDATE USING (auth.role() = 'service_role');
