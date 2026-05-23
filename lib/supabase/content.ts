import { unstable_cache } from 'next/cache'
import { createClient } from './client'

export interface SiteContent {
  [key: string]: any
}

/**
 * Fetches the entire site content from the Supabase site_content table
 * and transforms it into a unified Key-Value dictionary.
 * Cached using Next.js unstable_cache to keep edge performance high.
 */
export const getCachedSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    try {
      const supabase = await createClient()
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
