import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Lightweight admin guard based on a browser cookie that is set
  // after a successful Supabase admin login in the client.
  const adminCookie = request.cookies.get('hc_admin')?.value

  if (!adminCookie || adminCookie !== '1') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/services/:path*',
    '/admin/menu/:path*',
    '/admin/bookings/:path*',
    '/admin/gallery/:path*',
    '/admin/schedule/:path*'
  ]
}
