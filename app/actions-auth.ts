'use server'

import { logAudit } from '@/lib/audit'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

/**
 * Server Action: Track login attempts from the client side.
 * Logs failures to app_logs as 'warn' level.
 * Logs successes to admin_audit_log.
 */
export async function trackLoginAttempt(email: string, success: boolean, errorMessage?: string) {
  try {
    const supabase = await createClient()

    if (success) {
      // For success, we need the user ID. The client just successfully logged in,
      // so the server should now have the session cookie.
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await logAudit({
          userId: user.id,
          userEmail: user.email || email,
          action: 'admin_login',
          target: 'system',
          details: { method: 'password' },
        })
      }
    } else {
      // Failed login attempt
      await logger.warn('auth/login', `Failed login attempt for email: ${email}`, {
        email,
        error: errorMessage,
      })
    }
    return { success: true }
  } catch (e: any) {
    // Failsafe: don't crash the login process if logging fails
    console.error('Failed to log login attempt:', e)
    return { success: false }
  }
}
