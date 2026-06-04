import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  console.log(
    "PATH:",
    request.nextUrl.pathname,
    "TOKEN:",
    !!accessToken
  );

  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  const isDashboard =
    request.nextUrl.pathname.startsWith("/dashboard");

  if (!accessToken && isDashboard) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (accessToken && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};