import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_PATHS = ["/signin", "/signup", "/callback", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path is public
  const isPublicPath = PUBLIC_PATHS.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Check session cookie
  const sessionCookie = getSessionCookie(request);
  
  if (!sessionCookie) {
    // No session, redirect to signin
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
