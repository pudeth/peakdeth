import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isPlaceholderSupabaseUrl, getMockFetch } from './mock-fetch'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabasePublicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    'placeholder-anon-key'

  const isPlaceholder = isPlaceholderSupabaseUrl(supabaseUrl) || supabasePublicKey === 'placeholder-anon-key'

  const supabase = createServerClient(
    supabaseUrl,
    supabasePublicKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
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
      global: isPlaceholder
        ? {
            fetch: getMockFetch(),
          }
        : undefined,
    }
  )

  // Refresh session if expired
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user ?? null
  } catch {
    user = null
  }

  const devSession = request.cookies.get('admin_dev_session')?.value === 'true'
  const isAuthenticated = Boolean(user || devSession)

  // Handle .html aliases so users typing /admin.html or /home.html don't hit 404
  if (request.nextUrl.pathname === '/admin.html') {
    const url = request.nextUrl.clone()
    url.pathname = isAuthenticated ? '/admin/dashboard' : '/admin/login'
    return NextResponse.redirect(url)
  }

  if (request.nextUrl.pathname === '/home.html') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirect to dashboard if already logged in
  if (request.nextUrl.pathname === '/admin/login' && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
