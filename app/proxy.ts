import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Initialize Supabase SSR client inside edge middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({ name, value }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // 2. Safely retrieve the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Security Route Protection
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    // If attempting to access CMS panels unauthorized, route directly to Login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (path.startsWith('/login')) {
    // If logged in, block accessing login and route to CMS home dashboard
    if (user) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
