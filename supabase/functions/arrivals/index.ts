/**
 * Edge Function: device arrivals.
 * Call from device with mac + secret (query or JSON body).
 * Returns next 2 trips for device's stop/route, active news string, and route color.
 */

import {createClient} from "npm:@supabase/supabase-js@2";

const ZET_BASE = "https://api.zet.hr";
const TIMETABLE_URL = `${ZET_BASE}/TimetableService.Api/api/gtfs`;
const AUTH_URL = `${ZET_BASE}/AuthService.Api/api/auth/login`;
const DEFAULT_COLOR = "#FFCC00";

const ZET_HEADERS: Record<string, string> = {
    accept: "application/json, text/plain, */*",
    appuid: "ZET.Mobile",
    "Content-Type": "application/json",
    language: "hr",
    "User-Agent": "okhttp/4.9.2",
    "x-tenant": "KingICT_ZET_Public",
};

async function zetLogin(): Promise<string | null> {
    const username = Deno.env.get("ZET_API_USERNAME");
    const password = Deno.env.get("ZET_API_PASSWORD");

    if (!username || !password) {
        console.error("ZET_API_USERNAME or ZET_API_PASSWORD not set");
        return null;
    }

    try {
        const res = await fetch(AUTH_URL, {
            method: "POST",
            headers: ZET_HEADERS,
            body: JSON.stringify({username, password}),
        });

        if (!res.ok) {
            console.error(`ZET login failed: ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();
        // The token might be in different fields depending on the API response
        // Common fields: access_token, token, accessToken
        return data.access_token || data.token || data.accessToken || null;
    } catch (e) {
        console.error("ZET login error:", e);
        return null;
    }
}

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
        headers: {"Content-Type": "application/json", ...corsHeaders(origin)},
    });
}

async function fetchIncomingTrips(stopId: string): Promise<Array<{
    tripId: string;
    routeShortName: string;
    headsign: string;
    expectedArrivalDateTime: string;
    hasLiveTracking: boolean;
    daysFromToday: number;
}>> {
    const token = await zetLogin();
    if (!token) {
        console.error("Failed to obtain ZET authentication token");
        return [];
    }

    const url = `${TIMETABLE_URL.replace(/\/$/, "")}/stopIncomingTrips?stopId=${encodeURIComponent(stopId)}&isMapView=false`;
    const res = await fetch(url, {
        headers: {
            ...ZET_HEADERS,
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

Deno.serve(async (req: Request) => {
    const origin = req.headers.get("Origin");

    if (req.method === "OPTIONS") {
        return new Response(null, {headers: corsHeaders(origin)});
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
            return jsonResponse({error: "Invalid JSON body"}, 400, origin);
        }
    } else {
        return jsonResponse({error: "Method not allowed"}, 405, origin);
    }

    if (!mac || !secret) {
        return jsonResponse({error: "mac and secret are required"}, 400, origin);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {data: device, error: deviceError} = await supabase
        .from("devices")
        .select("secret, config")
        .eq("mac", mac)
        .single();

    if (deviceError || !device) {
        return jsonResponse({error: "Device not found"}, 404, origin);
    }
    if (device.secret !== secret) {
        return jsonResponse({error: "Invalid secret"}, 401, origin);
    }

    const config = device.config as { stopId?: string; routeId?: number }[] | null;

    let trips: Array<{
        routeShortName: string;
        trips: Array<{
            headsign: string;
            arrivalTimeMinutes: number;
        }>
    }> = [];

    if (config && config?.length > 0) {
        for (const configEntry of config) {
            const stopId = configEntry.stopId;
            const routeId = configEntry.routeId;

            if (!stopId || routeId == null) {
                continue;
            }

            try {
                const incoming = await fetchIncomingTrips(stopId);

                const forRoute = incoming.filter(
                    (t: { routeShortName?: string }) =>
                        t.routeShortName === String(routeId)
                );
                const nextTwo = forRoute.slice(0, 2);

                trips.push({
                    routeShortName: String(String(routeId)),
                    trips: nextTwo.map((t) => {
                        const expectedArrivalDateTime = new Date(t.expectedArrivalDateTime);
                        const now = new Date();

                        console.log(t.expectedArrivalDateTime);

                        return {
                            headsign: t.headsign,
                            arrivalTimeMinutes: Math.floor(Math.abs((expectedArrivalDateTime.getTime() - now.getTime()) / 60000)),
                        }
                    })
                })
            } catch (e) {
                console.error("arrivals fetchIncomingTrips:", e);
            }
        }
    }

    return jsonResponse({trips, DEFAULT_COLOR}, 200, origin);
});
