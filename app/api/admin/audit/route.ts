import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/require-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const auth = await requireAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const supabase = await createClient()

    const { data, error, count } = await supabase
      .from('admin_audit_log')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ logs: data || [], total: count || 0 })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
