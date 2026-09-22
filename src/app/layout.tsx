import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/lib/auth/session-context';

export const metadata: Metadata = { title: 'ABC Group CPS', description: 'Central Procurement System' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><SessionProvider>{children}</SessionProvider></body></html>; }
