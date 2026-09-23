'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Building2, ChevronRight, ClipboardCheck, LayoutDashboard, LogOut, ShieldCheck, UsersRound} from 'lucide-react';
import {useSession} from '@/lib/auth/session-context';
import {can} from '@/lib/permissions';

const nav = [{href: '/dashboard', label: 'Overview', icon: LayoutDashboard}, {
    href: '/organizations',
    label: 'Organizations',
    icon: Building2,
    permission: 'organization.manage'
}, {
    href: '/access/structure',
    label: 'Organization structure',
    icon: Building2,
    permission: 'access.manage'
}, {href: '/access/users', label: 'Users', icon: UsersRound, permission: 'access.manage'}, {
    href: '/access/roles',
    label: 'Roles & permissions',
    icon: ShieldCheck,
    permission: 'access.manage'
}, {href: '/doa-rules', label: 'DOA rules', icon: ClipboardCheck, permission: 'doa.manage'}];

export function Sidebar() {
    const pathname = usePathname();
    const {user, logout} = useSession();
    return <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-ink text-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-7">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand font-bold">C</div>
            <div><p className="font-semibold">ABC Group CPS</p><p className="text-xs text-slate-300">Central
                procurement</p></div>
        </div>
        <nav
            className="flex-1 space-y-1 px-4 py-7">{nav.filter((item) => !item.permission || can(user, item.permission)).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <Link key={item.href} href={item.href}
                         className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition ${active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}><span
                className="flex items-center gap-3"><Icon
                className={`h-4 w-4 ${active ? 'text-cyan-200' : 'text-slate-400 group-hover:text-cyan-200'}`}/>{item.label}</span>{active &&
                <ChevronRight className="h-4 w-4 text-cyan-200"/>}</Link>;
        })}</nav>
        <div className="border-t border-white/10 p-4">
            <div className="mb-3 rounded-xl bg-white/5 p-3"><p
                className="truncate text-sm font-semibold">{user?.fullName ?? 'Loading session'}</p><p
                className="truncate text-xs text-slate-400">{user?.email}</p></div>
            <button onClick={() => void logout()}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
                <LogOut className="h-4 w-4"/>Sign out
            </button>
        </div>
    </aside>;
}
