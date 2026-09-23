import {NextResponse} from 'next/server';

const serviceUrl = process.env.CPS_API_URL ?? 'http://localhost:3000';

export async function POST(request: Request) {
    const upstream = await fetch(`${serviceUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: await request.text(),
        cache: 'no-store'
    });
    const body = await upstream.json();
    if (!upstream.ok) return NextResponse.json(body, {status: upstream.status});
    const response = NextResponse.json(body.data.user);
    response.cookies.set('cps_session', body.data.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/'
    });
    return response;
}
