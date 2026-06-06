// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Block EVERY admin route permanently
  if (pathname.startsWith("/admin")) {
    // Send them to homepage — no explanation, no login page
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

// Apply to ALL admin routes
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
}
