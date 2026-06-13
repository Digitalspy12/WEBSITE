import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({ name, value }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Helper to correctly preserve session refresh cookies on redirect
  const redirectWithCookies = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, { ...cookie })
    })
    return redirectResponse
  }

  if (path.startsWith('/admin')) {
    if (!user) {
      return redirectWithCookies(new URL('/login', request.url))
    }

    const role = user.app_metadata?.role
    if (role !== 'admin') {
      return redirectWithCookies(new URL('/', request.url))
    }
  }

  if (path.startsWith('/login')) {
    // Only redirect GET requests. We don't want to intercept POST Server Actions
    if (request.method === 'GET' && user && user.app_metadata?.role === 'admin') {
      return redirectWithCookies(new URL('/admin', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
