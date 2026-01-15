// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin-secret-key')) {
    // Check for admin access code in session/local storage
    // Since we can't directly access localStorage from server, we'll use a cookie approach
    const adminAccess = request.cookies.get('admin-access')
    
    // For the secret admin panel, we'll check if user has valid session
    const userSession = request.cookies.get('user-session')
    
    if (!adminAccess || adminAccess.value !== 'granted') {
      // Check if user is logged in and is admin
      if (userSession) {
        try {
          // In a real implementation, you'd decode and verify the session
          // For now, we'll just redirect to login
          return NextResponse.redirect(new URL('/auth/login', request.url))
        } catch (e) {
          return NextResponse.redirect(new URL('/auth/login', request.url))
        }
      }
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  // Protect other routes that require authentication
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const userSession = request.cookies.get('user-session')
    if (!userSession) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin-secret-key/:path*',
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/api/dashboard/:path*'
  ]
}
