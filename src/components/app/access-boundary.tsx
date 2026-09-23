'use client';

import {ShieldX} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {useSession} from '@/lib/auth/session-context';
import {can} from '@/lib/permissions';

export const requiredPermissionForPath = (pathname: string) => pathname.startsWith('/organizations') ? 'organization.manage' : pathname.startsWith('/access') ? 'access.manage' : pathname.startsWith('/doa-rules') ? 'doa.manage' : undefined;

export function AccessBoundary({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const {user, loading} = useSession();
    const permission = requiredPermissionForPath(pathname);
    if (loading) return <div className="grid min-h-[50vh] place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent"/>
    </div>;
    if (permission && !can(user, permission)) return <div
        className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600"><ShieldX
            className="h-7 w-7"/></div>
        <h2 className="mt-5 text-xl font-semibold text-ink">Access restricted</h2><p
        className="mt-2 text-sm leading-6 text-slate">Your current role does not include permission to manage this
        area.</p></div>;
    return <>{children}</>;
}
