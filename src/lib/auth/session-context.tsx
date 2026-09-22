'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../types';

type SessionContextValue = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<User>; logout: () => Promise<void>; };
const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/auth/session', { credentials: 'include' }).then(async (response) => { if (!response.ok) throw new Error('Not authenticated'); const body = await response.json(); return body.data as User; }).then(setUser).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const value = useMemo<SessionContextValue>(() => ({
    user, loading,
    login: async (email, password) => { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email, password }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error ?? 'Unable to sign in'); const next = body as User; setUser(next); return next; },
    logout: async () => { await fetch('/api/auth/logout', { method: 'POST' }); setUser(null); window.location.href = '/login'; },
  }), [loading, user]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() { const context = useContext(SessionContext); if (!context) throw new Error('useSession must be used inside SessionProvider'); return context; }
