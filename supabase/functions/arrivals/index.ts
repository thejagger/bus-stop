/**
 * Edge Function: device arrivals.
 * Call from device with mac + secret (query or JSON body).
 * Returns next 2 trips for device's stop/route, active news string, and route color.
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const ZET_BASE = "https://api.zet.hr";
const TIMETABLE_URL = `${ZET_BASE}/TimetableService.Api/api/gtfs`;
const DEFAULT_COLOR = "#FFCC00";

const ZET_HEADERS: Record<string, string> = {
  accept: "application/json, text/plain, */*",
  appuid: "ZET.Mobile",
  "Content-Type": "application/json",
  language: "hr",
  "User-Agent": "okhttp/4.9.2",
  "x-tenant": "KingICT_ZET_Public",
};

function corsHeaders(origin?: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(
  body: unknown,
  status: number,
  origin?: string | null
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

async function fetchIncomingTrips(stopId: string): Promise<unknown[]> {
  const url = `${TIMETABLE_URL.replace(/\/$/, "")}/stopIncomingTrips?stopId=${encodeURIComponent(stopId)}&isMapView=false`;
  const res = await fetch(url, { headers: {...ZET_HEADERS, 
    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJWaVlQSUM2aFQwVHd6SWVpUlZfaGFhZEczMXNRZGNsbUF0MnFtUTRIOHB3In0.eyJleHAiOjE3NzAzOTQwNzYsImlhdCI6MTc3MDM5MzE3NiwianRpIjoiYjgwZGMxN2ItZDQxYi00YTM2LWFhNWItZDZmYzExNmZhOTY5IiwiaXNzIjoiaHR0cHM6Ly9pYW0uemV0LmxvY2FsL3JlYWxtcy9LaW5nSUNUX1pFVF9QdWJsaWMiLCJzdWIiOiI0ZjU5NWU3Mi1mYmFkLTQ3ZTUtYWZjOC1kMDRjYWY2ZGE3NmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJLaW5nSUNULlpFVC5Nb2JpbGUiLCJzZXNzaW9uX3N0YXRlIjoiMTFiMTQ1YzctNTBhMi00MTYyLWJmMzctZDAxOWFkZWQ2MTBjIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1raW5naWN0LnpldC5wdWJsaWMiXX0sInNjb3BlIjoib3BlbmlkIGNsaWVudF9pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiMTFiMTQ1YzctNTBhMi00MTYyLWJmMzctZDAxOWFkZWQ2MTBjIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InhlamlyYXIyNDgyNDQyMjM1MDYiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJlbWFpbCI6InhlamlyYXIyNDhAZG5zY2xpY2suY29tIn0.IhqpuoL0Y8ovscpN5oXGosQyvWBYVvTVCf4NTH0THrRgh3lOcy1xf1SlvZpkLNze4SlJCFfY_NayCzUrB3e3eEZyhQxlKE_4SIMIwWaMQ7Cl2bvtk2pwS_ATYoKxhieIoRRtszFmuUwaHfHvhpg3bFdvqjxSQ4ei69cHtr7e_iQ2S90M7SEBPbzLRTYXSjh76K_csoRSi6mJLtwSeRBkTwZGCIGEPyBRN34b4XH-K7M5NSRFiKeIjkRW4nP01qhKMU6bfIxcsbmbE_OSOzBEw1fABq1UYResCk56n_9CKotSmKL_XVo784RU_ENtvWtyQh70JTqzMgq_PvOj_CmDGA` }});
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  let mac: string | null = null;
  let secret: string | null = null;

  if (req.method === "GET") {
    const url = new URL(req.url);
    mac = url.searchParams.get("mac");
    secret = url.searchParams.get("secret");
  } else if (req.method === "POST") {
    try {
      const body = await req.json();
      mac = body?.mac ?? null;
      secret = body?.secret ?? null;
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, origin);
    }
  } else {
    return jsonResponse({ error: "Method not allowed" }, 405, origin);
  }

  if (!mac || !secret) {
    return jsonResponse({ error: "mac and secret are required" }, 400, origin);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: device, error: deviceError } = await supabase
    .from("devices")
    .select("secret, config")
    .eq("mac", mac)
    .single();

  if (deviceError || !device) {
    return jsonResponse({ error: "Device not found" }, 404, origin);
  }
  if (device.secret !== secret) {
    return jsonResponse({ error: "Invalid secret" }, 401, origin);
  }

  const config = device.config as { stopId?: string; routeId?: number } | null;
  const stopId = config?.stopId;
  const routeId = config?.routeId;

  if (!stopId || routeId == null) {
    return jsonResponse(
      { error: "Device config missing stopId or routeId" },
      400,
      origin
    );
  }

  let trips: Array<{
    tripId: string;
    routeId?: number;
    routeCode?: string;
    headsign?: string;
    nextStop?: string;
    expectedAt?: string;
  }> = [];

  try {
    const incoming = await fetchIncomingTrips(stopId);
    const forRoute = incoming.filter(
      (t: { routeId?: number; routeCode?: string }) =>
        t.routeId === routeId || t.routeCode === String(routeId)
    );
    const nextTwo = forRoute.slice(0, 2);
    trips = nextTwo.map((t: { id: string; routeId?: number; routeCode?: string; headsign?: string; stopTimes?: Array<{ stopName?: string; expectedArrivalDateTime?: string; isArrived?: boolean }> }) => {
      const nextStop = t.stopTimes?.find((s: { isArrived?: boolean }) => !s.isArrived);
      return {
        tripId: t.id,
        routeId: t.routeId,
        routeCode: t.routeCode,
        headsign: t.headsign,
        nextStop: nextStop?.stopName,
        expectedAt: nextStop?.expectedArrivalDateTime,
      };
    });
  } catch (e) {
    console.error("arrivals fetchIncomingTrips:", e);
  }

  let color = DEFAULT_COLOR;
  let newsText: string | null = null;
  const { data: route } = await supabase
    .from("routes")
    .select("color, news_text")
    .eq("id", routeId)
    .single();
  if (route?.color) color = route.color;
  if (route?.news_text) newsText = route.news_text;

  return jsonResponse({ trips, color, news_text: newsText ?? undefined }, 200, origin);
});
