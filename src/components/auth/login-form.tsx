'use client';

import {FormEvent, useState} from 'react';
import {AlertCircle, ArrowRight, Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useSession} from '@/lib/auth/session-context';

export function LoginForm() {
    const router = useRouter();
    const {login} = useSession();
    const [email, setEmail] = useState('admin@cps.local');
    const [password, setPassword] = useState('ChangeMe123!');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    async function submit(event: FormEvent) {
        event.preventDefault();
        setError('');
        setPending(true);
        try {
            await login(email, password);
            router.replace('/dashboard');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to sign in');
        } finally {
            setPending(false);
        }
    }

    return <form onSubmit={submit} className="space-y-5">
        <div><label htmlFor="email" className="text-sm font-semibold text-ink">Email address</label><input id="email"
                                                                                                           type="email"
                                                                                                           autoComplete="email"
                                                                                                           value={email}
                                                                                                           onChange={(e) => setEmail(e.target.value)}
                                                                                                           className="field"
                                                                                                           required/>
        </div>
        <div>
            <div className="flex items-center justify-between"><label htmlFor="password"
                                                                      className="text-sm font-semibold text-ink">Password</label><span
                className="text-xs text-slate">Authorized users only</span></div>
            <input id="password" type="password" autoComplete="current-password" value={password}
                   onChange={(e) => setPassword(e.target.value)} className="field" required/></div>
        {error && <div role="alert"
                       className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0"/>{error}</div>}
        <button className="button-primary w-full" disabled={pending}>{pending ?
            <Loader2 className="h-4 w-4 animate-spin"/> :
            <ArrowRight className="h-4 w-4"/>}{pending ? 'Signing in…' : 'Continue to workspace'}</button>
    </form>;
}
