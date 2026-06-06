// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Only redirect /admin (exact path)
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // If logged in and on login page → go to activity
    if (pathname === "/admin/login" && token) {
      return NextResponse.redirect(new URL("/admin/activity", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        // Allow /admin and /admin/login always
        if (pathname === "/admin" || pathname === "/admin/login") {
          return true
        }
        // Require token for all other admin routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
