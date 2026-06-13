import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export interface SiteContent {
  [key: string]: any
}

/**
 * Creates a lightweight Supabase client for build-time/ISR content fetching.
 * Does NOT use cookies (incompatible with unstable_cache).
 * Uses the anon key which is fine since site_content has a public SELECT policy.
 */
function createCacheClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  )
}

/**
 * Fetches the entire site content from the Supabase site_content table
 * and transforms it into a unified Key-Value dictionary.
 * Cached using Next.js unstable_cache with tag-based revalidation.
 *
 * - Uses a cookie-free Supabase client (required by unstable_cache)
 * - site_content table has public SELECT RLS policy, so anon key works
 * - Cache is invalidated when admin saves content via revalidateTag('site-content')
 * - ISR revalidate=3600 on homepage provides stale-while-revalidate if Supabase is down
 */
export const getCachedSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    try {
      const supabase = createCacheClient()
      const { data, error } = await supabase
        .from('site_content')
        .select('key, value')

      if (error) {
        console.error('Error fetching site content records:', error)
        return {}
      }

      if (!data) {
        return {}
      }

      // Re-map the flat array of records into a single key-value dictionary
      const contentMap: SiteContent = {}
      data.forEach((row) => {
        contentMap[row.key] = row.value
      })

      return contentMap
    } catch (e) {
      console.error('Database connection failed in getCachedSiteContent:', e)
      return {}
    }
  },
  ['site-content-cache'],
  { tags: ['site-content'] }
)
