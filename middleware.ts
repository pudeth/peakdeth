import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Check admin authentication from session cookies
  const devSession = request.cookies.get('admin_dev_session')?.value === 'true'
  const hasSbAuth = request.cookies.getAll().some(
    (c) => (c.name.startsWith('sb-') || c.name.includes('auth-token') || c.name.includes('supabase')) && Boolean(c.value)
  )
  const isAuthenticated = Boolean(devSession || hasSbAuth)

  // 2. Handle legacy .html aliases
  if (pathname === '/admin.html') {
    const url = request.nextUrl.clone()
    url.pathname = isAuthenticated ? '/admin/dashboard' : '/admin/login'
    return NextResponse.redirect(url)
  }

  if (pathname === '/home.html') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // 3. Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isAuthenticated) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  // 4. Redirect to dashboard if authenticated user visits /admin/login
  if (pathname === '/admin/login' && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/admin/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  // 5. Default response with performance headers
  const response = NextResponse.next()
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  if (pathname === '/') {
    response.headers.set(
      'Link',
      '</gallery>; rel=prefetch, </about>; rel=prefetch, </contact>; rel=prefetch'
    )
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
}
