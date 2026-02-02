/**
 * Edge Function: daily ZET sync.
 * Fetches routes, stops, news from ZET API and upserts into Supabase.
 * Schedule via Supabase Dashboard (e.g. cron once per day).
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const ZET_BASE = "https://api.zet.hr";
const TIMETABLE_URL = `${ZET_BASE}/TimetableService.Api/api/gtfs`;
const NEWS_URL = `${ZET_BASE}/NewsProxyService.Api/api/newsfeed`;

const ZET_HEADERS: Record<string, string> = {
  accept: "application/json, text/plain, */*",
  appuid: "ZET.Mobile",
  "Content-Type": "application/json",
  language: "hr",
  "User-Agent": "okhttp/4.9.2",
  "x-tenant": "KingICT_ZET_Public",
};

async function zetGet(base: string, path: string): Promise<unknown> {
  const url = base.replace(/\/$/, "") + path;
  const res = await fetch(url, { headers: ZET_HEADERS });
  if (!res.ok) throw new Error(`ZET API ${res.status}: ${url}`);
  return res.json();
}

Deno.serve(async (req: Request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const result = {
    routes: { upserted: 0, errors: 0 },
    stops: { upserted: 0, errors: 0 },
    stop_routes: { upserted: 0, errors: 0 },
    routes_news_text: { updated: 0, errors: 0 },
  };

  // 1. Routes (first: stops reference routes via stop_routes)
  try {
    const data = await zetGet(TIMETABLE_URL, "/routes");
    const routes = Array.isArray(data) ? data : [];
    const rows = routes
      .filter((r: { id?: unknown; longName?: unknown }) => r.id != null && r.longName != null)
      .map(
        (r: {
          id: number;
          longName: string;
          shortName?: string;
          routeType?: number | null;
          departureHeadsign?: string | null;
          destinationHeadsign?: string | null;
          normalizedSearchName?: string | null;
        }) => ({
          id: Number(r.id),
          name: r.longName,
          short_name: r.shortName ?? null,
          route_type: r.routeType ?? null,
          departure_headsign: r.departureHeadsign ?? null,
          destination_headsign: r.destinationHeadsign ?? null,
          normalized_search_name: r.normalizedSearchName ?? null,
        })
      );
    if (rows.length > 0) {
      const { error } = await supabase.from("routes").upsert(rows, { onConflict: "id" });
      if (error) result.routes.errors += 1;
      else result.routes.upserted = rows.length;
    }
  } catch (e) {
    result.routes.errors += 1;
    console.error("sync-zet routes:", e);
  }

  // 2. Stops
  try {
    const data = await zetGet(TIMETABLE_URL, "/stops");
    const stops = Array.isArray(data) ? data : [];
    const rows = stops
      .filter((s: { id?: unknown; name?: unknown; stopLat?: unknown; stopLong?: unknown }) =>
        s.id != null && s.name != null && s.stopLat != null && s.stopLong != null
      )
      .map(
        (s: {
          id: string;
          name: string;
          stopLat: number;
          stopLong: number;
          parentStopId?: string | null;
          routeType?: number | null;
          normalizedSearchName?: string | null;
          isForDisabledPeople?: boolean;
          projectNo?: string | null;
          trips?: Array<{ routeCode: string; tripHeadsigns?: string[] }>;
        }) => ({
          id: String(s.id),
          name: s.name,
          lat: Number(s.stopLat),
          lng: Number(s.stopLong),
          parent_stop_id: s.parentStopId ?? null,
          route_type: s.routeType ?? null,
          normalized_search_name: s.normalizedSearchName ?? null,
          is_for_disabled_people: Boolean(s.isForDisabledPeople),
          project_no: s.projectNo ?? null,
          trips: Array.isArray(s.trips) ? s.trips : [],
        })
      );
    if (rows.length > 0) {
      const { error } = await supabase.from("stops").upsert(rows, { onConflict: "id" });
      if (error) result.stops.errors += 1;
      else result.stops.upserted = rows.length;
    }

    // 2b. Populate stop_routes from each stop's trips (routeCode -> route id)
    try {
      const { data: routesInDb } = await supabase.from("routes").select("id, short_name");
      const routeByCode = new Map<string, number>();
      for (const r of routesInDb ?? []) {
        if (r.short_name != null) routeByCode.set(String(r.short_name).trim(), r.id);
        routeByCode.set(String(r.id), r.id);
      }
      const stopRouteRows: { stop_id: string; route_id: number }[] = [];
      const seen = new Set<string>();
      for (const s of stops) {
        const stopId = String(s.id);
        const trips = Array.isArray(s.trips) ? s.trips : [];
        for (const t of trips) {
          const code = t?.routeCode != null ? String(t.routeCode).trim() : null;
          if (!code) continue;
          const routeId = routeByCode.get(code);
          if (routeId == null) continue;
          const key = `${stopId}:${routeId}`;
          if (seen.has(key)) continue;
          seen.add(key);
          stopRouteRows.push({ stop_id: stopId, route_id: routeId });
        }
      }
      if (stopRouteRows.length > 0) {
        await supabase.from("stop_routes").delete().neq("stop_id", "");
        const { error: insErr } = await supabase.from("stop_routes").insert(stopRouteRows);
        if (!insErr) result.stop_routes.upserted = stopRouteRows.length;
        else result.stop_routes.errors += 1;
      }
    } catch (e) {
      result.stop_routes.errors += 1;
      console.error("sync-zet stop_routes:", e);
    }
  } catch (e) {
    result.stops.errors += 1;
    console.error("sync-zet stops:", e);
  }

  // 3. Newsfeed: fetch from ZET, build news_text per route (no table)
  try {
    const data = await zetGet(NEWS_URL, "");
    const news = Array.isArray(data) ? data : [];
    const now = new Date().toISOString();
    const routeNews = new Map<number, string[]>();
    for (const n of news) {
      if (n.description == null || n.validFrom == null || n.validTo == null) continue;
      const text = String(n.description).trim() || "";
      if (!text) continue;
      if (n.validFrom > now || n.validTo < now) continue;
      const lineIds = Array.isArray(n.lines) ? n.lines.map((x: unknown) => Number(x)).filter(Number.isInteger) : [];
      for (const routeId of lineIds) {
        const list = routeNews.get(routeId) ?? [];
        if (!list.includes(text)) list.push(text);
        routeNews.set(routeId, list);
      }
    }
    const { data: routesInDb } = await supabase.from("routes").select("id");
    const routeIds = (routesInDb ?? []).map((r: { id: number }) => r.id);
    const idsWithNews = Array.from(routeNews.keys()).filter((id) => routeIds.includes(id));
    const idsWithoutNews = routeIds.filter((id) => !routeNews.has(id));
    let updated = 0;
    for (const routeId of idsWithNews) {
      const texts = routeNews.get(routeId)!;
      const newsText = texts.join(" - ");
      const { error: upErr } = await supabase.from("routes").update({ news_text: newsText }).eq("id", routeId);
      if (!upErr) updated += 1;
    }
    if (idsWithoutNews.length > 0) {
      const { error: clearErr } = await supabase.from("routes").update({ news_text: null }).in("id", idsWithoutNews);
      if (!clearErr) updated += idsWithoutNews.length;
    }
    result.routes_news_text.updated = updated;
  } catch (e) {
    result.routes_news_text.errors += 1;
    console.error("sync-zet news_text:", e);
  }

  return new Response(JSON.stringify({ ok: true, result }), {
    headers: { "Content-Type": "application/json" },
  });
});
