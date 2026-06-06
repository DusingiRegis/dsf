// middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // ✅ ALLOW login page — always accessible
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // ❌ BLOCK everything else under /admin
  if (pathname.startsWith("/admin")) {
    // Check if user has a valid session
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Not logged in — redirect to homepage
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Logged in — allow through
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Apply middleware to all admin routes
export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
