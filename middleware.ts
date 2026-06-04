import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // Not logged in → block dashboard
  if (!accessToken && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in → block auth pages
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}