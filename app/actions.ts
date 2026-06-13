'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'
import { logger } from '@/lib/logger'

/**
 * Server Action: Updates a content record in the Supabase site_content table
 * and purges the Next.js cache so updates are instantly reflected on the front page.
 * Protected: requires admin role.
 */
export async function updateSiteContent(key: string, value: any) {
  try {
    const supabase = await createClient()

    // 1. Authenticate + verify admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('Unauthorized. You must be logged in as an administrator to change site content.')
    }

    if (user.app_metadata?.role !== 'admin') {
      throw new Error('Forbidden. Admin role required.')
    }

    // 2. Perform database update
    const { error: updateError } = await supabase
      .from('site_content')
      .update({ value })
      .eq('key', key)

    if (updateError) {
      await logger.error('server-action/updateSiteContent', `Database update failed for key "${key}"`, {
        key,
        error: updateError.message,
      })
      return { success: false, error: updateError.message }
    }

    // 3. Purge Next.js data cache tag instantly
    ;(revalidateTag as any)('site-content')

    // 4. Audit trail
    await logAudit({
      userId: user.id,
      userEmail: user.email || 'unknown',
      action: 'content_update',
      target: `site_content:${key}`,
    })

    return { success: true }
  } catch (e: any) {
    await logger.error('server-action/updateSiteContent', e.message || 'Unexpected error', {
      stack: e.stack,
    })
    return { success: false, error: e.message || 'An unexpected server error occurred.' }
  }
}

/**
 * Server Action: Submits a project lead email from the public contact form.
 * Does NOT require authentication — public visitors can submit.
 * The leads table has a public INSERT RLS policy.
 */
export async function submitLead(email: string, name: string = '', phone: string = '') {
  try {
    const trimmed = (email || '').trim().toLowerCase()

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(trimmed)) {
      return { success: false, error: 'Please provide a valid email address.' }
    }

    // Domain must contain at least one letter (rejects purely numeric domains like 133213.com)
    const domain = trimmed.split('@')[1]
    const domainName = domain.split('.').slice(0, -1).join('.')
    if (!/[a-zA-Z]/.test(domainName)) {
      return { success: false, error: 'Please use a valid email domain.' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('leads')
      .insert({ email: trimmed, name, phone })

    if (error) {
      console.error('Failed to insert lead:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (e: any) {
    console.error('Server Action Error in submitLead:', e)
    return { success: false, error: e.message || 'Failed to submit. Please try again.' }
  }
}

/**
 * Server Action: Updates a lead's status (e.g., new → contacted → archived).
 * Protected: requires admin role.
 */
export async function updateLeadStatus(id: number, status: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('Unauthorized.')
    }

    if (user.app_metadata?.role !== 'admin') {
      throw new Error('Forbidden. Admin role required.')
    }

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)

    if (error) {
      await logger.error('server-action/updateLeadStatus', `Failed to update lead ${id}`, {
        leadId: id,
        status,
        error: error.message,
      })
      return { success: false, error: error.message }
    }

    // Audit trail
    await logAudit({
      userId: user.id,
      userEmail: user.email || 'unknown',
      action: 'lead_status_change',
      target: `lead:${id}`,
      details: { newStatus: status },
    })

    return { success: true }
  } catch (e: any) {
    await logger.error('server-action/updateLeadStatus', e.message || 'Unexpected error')
    return { success: false, error: e.message || 'Failed to update lead.' }
  }
}

/**
 * Server Action: Deletes a lead record permanently.
 * Protected: requires admin role.
 */
export async function deleteLead(id: number) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('Unauthorized.')
    }

    if (user.app_metadata?.role !== 'admin') {
      throw new Error('Forbidden. Admin role required.')
    }

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      await logger.error('server-action/deleteLead', `Failed to delete lead ${id}`, {
        leadId: id,
        error: error.message,
      })
      return { success: false, error: error.message }
    }

    // Audit trail
    await logAudit({
      userId: user.id,
      userEmail: user.email || 'unknown',
      action: 'lead_delete',
      target: `lead:${id}`,
    })

    return { success: true }
  } catch (e: any) {
    await logger.error('server-action/deleteLead', e.message || 'Unexpected error')
    return { success: false, error: e.message || 'Failed to delete lead.' }
  }
}
