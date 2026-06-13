import { createClient } from '@/lib/supabase/server'

interface AuditEntry {
  userId: string
  userEmail: string
  action: string
  target?: string
  details?: Record<string, any>
}

/**
 * Append-only admin audit trail.
 * Logs admin actions to admin_audit_log table.
 * This table has NO update/delete RLS policies — entries are permanent.
 * Fails silently — audit logging should never crash admin operations.
 */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.from('admin_audit_log').insert({
      user_id: entry.userId,
      user_email: entry.userEmail,
      action: entry.action,
      target: entry.target || null,
      details: entry.details || null,
    })
  } catch (e) {
    // Audit logging must never crash the application
    console.error('[audit] Failed to write admin_audit_log:', e)
  }
}
