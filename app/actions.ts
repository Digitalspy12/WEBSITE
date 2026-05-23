'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Server Action: Updates a content record in the Supabase site_content table
 * and purges the Next.js cache so updates are instantly reflected on the front page.
 */
export async function updateSiteContent(key: string, value: any) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user request inside the Server Action
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('Unauthorized. You must be logged in as an administrator to change site content.')
    }

    // 2. Perform database update
    const { error: updateError } = await supabase
      .from('site_content')
      .update({ value })
      .eq('key', key)

    if (updateError) {
      console.error(`Database update failed for key "${key}":`, updateError)
      return { success: false, error: updateError.message }
    }

    // 3. Purge Next.js data cache tag instantly
    revalidateTag('site-content')

    return { success: true }
  } catch (e: any) {
    console.error('Server Action Error in updateSiteContent:', e)
    return { success: false, error: e.message || 'An unexpected server error occurred.' }
  }
}
