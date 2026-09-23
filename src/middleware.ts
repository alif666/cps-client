import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
    const hasSession = Boolean(request.cookies.get('cps_session')?.value);
    const path = request.nextUrl.pathname;
    if (path === '/login' && hasSession) return NextResponse.redirect(new URL('/dashboard', request.url));
    if (!hasSession && path !== '/login' && !path.startsWith('/api/')) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
}

export const config = {matcher: ['/login', '/dashboard/:path*', '/organizations/:path*', '/access/:path*', '/doa-rules/:path*']};
