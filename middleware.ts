import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/login" || pathname === "/signup";

  const isDashboard = pathname.startsWith("/dashboard");

  /**
   * ---------------------------
   * 1. Protect dashboard routes
   * ---------------------------
   */
  if (isDashboard && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /**
   * ---------------------------
   * 2. Prevent logged-in users
   *    from visiting auth pages
   * ---------------------------
   */
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};