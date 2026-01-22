// Supabase Edge Function: Get Device Status
// Endpoint: GET /api/devices/:deviceId/status
// Purpose: Get device online status and last seen timestamp

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

    // Get device
    const { data: device, error: deviceError } = await supabaseClient
      .from('devices')
      .select('id, code, area, display_name, is_active, modified_at')
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

    // Check if device is online (last heartbeat within 2 minutes)
    const lastSeen = device.modified_at ? new Date(device.modified_at) : null
    const now = new Date()
    const isOnline = lastSeen 
      ? (now.getTime() - lastSeen.getTime()) < 120000 // 2 minutes
      : false

    const response = {
      device_id: device.id,
      is_online: isOnline,
      last_seen: lastSeen?.toISOString() || null,
      firmware_version: null, // TODO: Add firmware_version to devices table
      wifi_ssid: null, // TODO: Add wifi_ssid to devices table
      wifi_connected: isOnline,
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
