import { createClient } from '@/lib/supabase/server'

/**
 * Shared admin auth guard for API routes.
 * Middleware only protects /admin/* page routes — API routes need this.
 *
 * Usage in API route:
 *   const auth = await requireAdmin()
 *   if ('error' in auth) {
 *     return NextResponse.json({ error: auth.error }, { status: auth.status })
 *   }
 *   const { user } = auth
 */
export async function requireAdmin(): Promise<
  { user: { id: string; email?: string; app_metadata: Record<string, any> } } |
  { error: string; status: 401 | 403 }
> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return { error: 'Unauthorized', status: 401 }
    }

    if (user.app_metadata?.role !== 'admin') {
      return { error: 'Forbidden', status: 403 }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        app_metadata: user.app_metadata,
      },
    }
  } catch {
    return { error: 'Unauthorized', status: 401 }
  }
}
