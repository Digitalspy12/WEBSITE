import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/require-admin'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * PROTECTED logs endpoint.
 * GET: Query app_logs for admin panel display
 * POST: Insert a new log entry (server-side only)
 *
 * Both operations require admin authentication via requireAdmin().
 */

// GET /api/logs?level=error&category=system&limit=50&offset=0&hours=24
export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const category = searchParams.get('category')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const offset = parseInt(searchParams.get('offset') || '0')
    const hours = parseInt(searchParams.get('hours') || '24')

    const supabase = await createClient()

    let query = supabase
      .from('app_logs')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    // Apply filters
    if (level) {
      query = query.eq('level', level)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (hours) {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
      query = query.gte('timestamp', since)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      logs: data || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}

// POST /api/logs — Insert a structured log entry
export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { level, category, source, message, metadata } = body

    if (!source || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: source, message' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.from('app_logs').insert({
      level: level || 'info',
      category: category || 'system',
      source,
      message,
      metadata: metadata || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Failed to insert log' },
      { status: 500 }
    )
  }
}
