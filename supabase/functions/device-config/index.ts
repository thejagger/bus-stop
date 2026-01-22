// Supabase Edge Function: Get Device Configuration
// Endpoint: GET /api/devices/:deviceId/config
// Purpose: Device polling endpoint for ESP32 devices

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get deviceId from URL path
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

    // Initialize Supabase client
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
      .select('id, code, area, display_name, is_active')
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

    // Get device configurations with relations
    const { data: configurations, error: configError } = await supabaseClient
      .from('device_stop_lines')
      .select(`
        id,
        display_order,
        stop:stops (
          id,
          name,
          external_id,
          latitude,
          longitude
        ),
        line:lines (
          id,
          name,
          external_id,
          direction
        )
      `)
      .eq('device_id', deviceId)
      .eq('is_deleted', false)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (configError) {
      console.error('Error fetching configurations:', configError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch configurations' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Format response
    const response = {
      device: {
        id: device.id,
        code: device.code,
        area: device.area,
        display_name: device.display_name,
      },
      configurations: (configurations || []).map((config: any) => ({
        id: config.id,
        stop: config.stop,
        line: config.line,
        display_order: config.display_order,
      })),
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
