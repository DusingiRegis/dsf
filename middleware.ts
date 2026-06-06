// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isLoginPage = req.nextUrl.pathname === "/admin/login"

    // If trying to access any /admin page without being logged in
    if (isAdminRoute && !isLoginPage && !token) {
      // Redirect completely away — back to homepage
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
        // Allow login page always
        // Block everything else without token
        if (isLoginPage) return true
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
