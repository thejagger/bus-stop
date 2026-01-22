// Supabase Edge Function: Device Heartbeat
// Endpoint: POST /api/devices/:deviceId/heartbeat
// Purpose: Device sends heartbeat to update last_seen timestamp

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

    // Parse request body
    const body = await req.json()
    const { firmware_version, wifi_ssid, wifi_connected } = body

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

    // Update device modified_at (triggers update_modified_at())
    // TODO: Add firmware_version and wifi_ssid columns to devices table
    const { error: updateError } = await supabaseClient
      .from('devices')
      .update({ 
        modified_at: new Date().toISOString(),
        // firmware_version: firmware_version,
        // wifi_ssid: wifi_ssid,
      })
      .eq('id', deviceId)

    if (updateError) {
      console.error('Error updating device:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update device' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
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
