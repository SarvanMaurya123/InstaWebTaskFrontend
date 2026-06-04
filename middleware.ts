import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthPage =
    pathname === "/login" || pathname === "/signup";

  const isProtectedRoute = pathname.startsWith("/dashboard");

  /**
   * -----------------------------------
   * 1. Protect dashboard routes (soft check)
   * -----------------------------------
   * NOTE:
   * Middleware cookie check is NOT fully reliable in cross-domain setups,
   * so we only do "soft protection" here.
   */
  if (isProtectedRoute) {
    // If cookie is missing → allow request to continue
    // (frontend will handle real auth check via /me API)

    if (!accessToken) {
      // optional: you can redirect OR let page handle it
      return NextResponse.next();
    }
  }

  /**
   * -----------------------------------
   * 2. Prevent logged-in users from auth pages
   * (this part is safe and reliable)
   * -----------------------------------
   */
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};