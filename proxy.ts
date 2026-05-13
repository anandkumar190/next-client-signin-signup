import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    const path=request.nextUrl.pathname;
    const isPublicPath=path==="/dashboard/login"||path==="/dashboard/registration";

    const token =request.cookies.get("token")?.value||"";
    if (isPublicPath && token) {
         return NextResponse.redirect(new URL('/dashboard/profile', request.url))
        
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }

  //return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
  matcher: [
    "/",
    "/dashboard/login",
    "/dashboard/registration",
    "/dashboard/profile"
  ],
}