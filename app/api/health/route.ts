import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * PUBLIC health check endpoint.
 * Used by:
 *   - cron-job.org keep-alive (prevents Supabase free tier pausing after 7 days)
 *   - Admin panel System Health tab
 *   - External uptime monitoring
 *
 * No authentication required — must stay public for cron access.
 */
export async function GET() {
  const start = Date.now()

  try {
    const supabase = await createClient()

    // Ping the database with a lightweight query
    const { error } = await supabase
      .from('site_content')
      .select('key')
      .limit(1)
      .single()

    const latencyMs = Date.now() - start

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = "no rows" which is fine for a health check
      return NextResponse.json(
        {
          status: 'degraded',
          supabase: 'error',
          latencyMs,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      supabase: 'connected',
      latencyMs,
      timestamp: new Date().toISOString(),
    })
  } catch (e: any) {
    const latencyMs = Date.now() - start
    return NextResponse.json(
      {
        status: 'down',
        supabase: 'unreachable',
        latencyMs,
        error: e.message || 'Connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
