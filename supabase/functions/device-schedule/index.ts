// Supabase Edge Function: Get Device Schedule Data
// Endpoint: GET /api/devices/:deviceId/schedule
// Purpose: Get cached schedule data for device display

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const deviceId = pathParts[pathParts.length - 1]

    if (!deviceId) {
      return new Response(
        JSON.stringify({ error: 'Device ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify device exists
    const { data: device, error: deviceError } = await supabaseClient
      .from('devices')
      .select('id')
      .eq('id', deviceId)
      .eq('is_deleted', false)
      .single()

    if (deviceError || !device) {
      return new Response(
        JSON.stringify({ error: 'Device not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get schedule cache for device
    const { data: scheduleCache, error: scheduleError } = await supabaseClient
      .from('schedule_cache')
      .select(`
        stop_id,
        line_id,
        arrival_time,
        created_at,
        stop:stops (
          id,
          name,
          external_id
        ),
        line:lines (
          id,
          name,
          external_id,
          direction
        )
      `)
      .eq('device_id', deviceId)
      .order('arrival_time', { ascending: true })

    if (scheduleError) {
      console.error('Error fetching schedule:', scheduleError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch schedule' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Group by stop_id and line_id
    const schedulesMap = new Map<string, any>()
    
    scheduleCache?.forEach((item: any) => {
      const key = `${item.stop_id}-${item.line_id}`
      if (!schedulesMap.has(key)) {
        schedulesMap.set(key, {
          stop_id: item.stop_id,
          line_id: item.line_id,
          stop: item.stop,
          line: item.line,
          arrivals: [],
        })
      }
      schedulesMap.get(key).arrivals.push({
        arrival_time: item.arrival_time,
        route_name: item.line?.name || item.line?.external_id,
        headsign: item.line?.direction,
      })
    })

    const schedules = Array.from(schedulesMap.values())

    const response = {
      device_id: deviceId,
      schedules,
      cached_at: scheduleCache && scheduleCache.length > 0 
        ? scheduleCache[0].created_at 
        : new Date().toISOString(),
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
