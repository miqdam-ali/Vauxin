import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Initialize Supabase Server Client inside Middleware
  const supabase = createServerClient(
     process.env.SUPABASE_URL,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Refresh / Fetch session user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname

  // 3. RULE A: If user IS LOGGED IN and tries to access auth pages (/login, /signup, /)
  if (user && (path === '/login' || path === '/signup' || path === '/')) {
    url.pathname = '/Home' // Change to your actual Home route (e.g. /home or /dashboard)
    return NextResponse.redirect(url)
  }

  // 4. RULE B: If user IS NOT LOGGED IN and tries to access protected pages (/Home, /profile)
  if (!user && (path.startsWith('/Home') || path.startsWith('/profile'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}

// 5. Matcher configuration (Exclude static files, images, icons, etc.)
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (.svg, .png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}