// middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Check if user has a valid session/token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isLoginPage = pathname === "/admin/login"
  const isAdminRoute = pathname.startsWith("/admin")

  // ✅ If on login page and NOT logged in — allow through
  if (isLoginPage && !token) {
    return NextResponse.next()
  }

  // ✅ If on login page and ALREADY logged in
  // skip login page and go straight to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  // ❌ If on any admin page and NOT logged in
  // send to login page first
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  // ✅ Logged in and on admin page — allow through
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
