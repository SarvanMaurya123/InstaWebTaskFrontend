import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  const isDashboard =
    request.nextUrl.pathname.startsWith("/dashboard");

  // ⚠️ DO NOT RELY FULLY ON COOKIE HERE
  if (isAuthPage && request.cookies.has("accessToken")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};