import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/dashboard/login" || path === "/dashboard/registration";
    const token = request.cookies.get("token")?.value || "";

    // Redirect authenticated users away from auth pages to dashboard root
    if (isPublicPath && token) {
         return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect authenticated users from landing page to dashboard
    if (path === "/" && token) {
         return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect unauthenticated users trying to access protected paths to login
    const isProtectedPath = path === "/" || path === "/dashboard" || path.startsWith("/dashboard/");
    if (!isPublicPath && isProtectedPath && !token) {
        return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }

    return NextResponse.next();
}
 
export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
  ],
}