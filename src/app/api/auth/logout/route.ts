import {NextResponse} from 'next/server';

export async function POST() {
    const response = NextResponse.json({data: true});
    response.cookies.set('cps_session', '', {httpOnly: true, expires: new Date(0), path: '/'});
    return response;
}
