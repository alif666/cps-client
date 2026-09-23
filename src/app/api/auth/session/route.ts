import {decodeJwt} from 'jose';
import {NextResponse} from 'next/server';
import type {User} from '@/lib/types';

export async function GET(request: Request) {
    const token = request.headers.get('cookie')?.match(/(?:^|; )cps_session=([^;]+)/)?.[1];
    if (!token) return NextResponse.json({error: 'Not authenticated'}, {status: 401});
    try {
        const claims = decodeJwt(token) as {
            sub: string;
            email: string;
            roles?: User['roles'];
            permissions?: string[]
        };
        const user: User = {
            id: claims.sub,
            fullName: claims.email,
            email: claims.email,
            roles: claims.roles ?? [],
            permissions: claims.permissions ?? []
        };
        return NextResponse.json({data: user});
    } catch {
        return NextResponse.json({error: 'Invalid session'}, {status: 401});
    }
}
