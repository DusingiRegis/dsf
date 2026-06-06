// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isLoginPage = req.nextUrl.pathname === "/admin/login"
    const isAdminHomepage = req.nextUrl.pathname === "/admin"

    // Redirect /admin homepage to /
    if (isAdminHomepage) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // If logged in and trying to visit login page
    // redirect to dashboard instead
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login"
        const isAdminHomepage = req.nextUrl.pathname === "/admin"
        // Allow login page always, and admin homepage (which redirects anyway)
        // Block everything else without token
        if (isLoginPage || isAdminHomepage) return true
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
