// middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const isLoginPage  = pathname === "/admin/login"
  const isAdminRoute = pathname.startsWith("/admin")

  // Get session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // LOGIN PAGE
  if (isLoginPage && !token) {
    return NextResponse.next()
  }

  if (isLoginPage && token) {
    const role = token.role as string
    if (role === "admin" || role === "super_admin") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return NextResponse.redirect(new URL("/", req.url))
  }

  // ALL OTHER ADMIN ROUTES
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    const role = token.role as string
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
