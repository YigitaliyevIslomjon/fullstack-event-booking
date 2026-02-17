import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;

    // Public routes
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Protected routes
    const protectedRoutes = ['/events', '/bookings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Redirect authenticated users away from auth pages
    if (isPublicRoute && accessToken) {
        return NextResponse.redirect(new URL('/events', request.url));
    }

    // Redirect unauthenticated users to login
    if (isProtectedRoute && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
