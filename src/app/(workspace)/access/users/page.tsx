'use client';

import {FormEvent, useEffect, useState} from 'react';
import {Loader2, UserPlus, X} from 'lucide-react';
import {
    createAssignment,
    createUser,
    listBusinessUnits,
    listOrganizations,
    listRoles,
    listUsers
} from '@/lib/api/queries';
import type {AccessEntity, Organization, Role, User} from '@/lib/types';
import {PageHeading} from '@/components/ui/page-heading';
import {EmptyState, Panel} from '@/components/ui/panel';
import {StatusPill} from '@/components/ui/status-pill';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [companies, setCompanies] = useState<Organization[]>([]);
    const [units, setUnits] = useState<AccessEntity[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const refresh = () => Promise.all([listUsers(), listRoles(), listOrganizations()]).then(([nextUsers, nextRoles, nextCompanies]) => {
        setUsers(nextUsers);
        setRoles(nextRoles);
        setCompanies(nextCompanies);
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
    useEffect(() => {
        void refresh();
    }, []);
    const loadUnits = (companyId: string) => {
        if (!companyId) {
            setUnits([]);
            return;
        }
        listBusinessUnits(companyId).then(setUnits).catch((e) => setError(e.message));
    };
    return <div><PageHeading eyebrow="Access / People" title="Users"
                             description="Manage user identities and place people in the correct organization scope."
                             action={{label: 'Add user', onClick: () => setShowForm(true)}}/>{error && <div role="alert"
                                                                                                            className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}
        <button onClick={() => setError('')} className="float-right" aria-label="Dismiss error"><X className="h-4 w-4"/>
        </button>
    </div>}<Panel>
        <div className="border-b border-slate-100 px-6 py-5"><h3 className="font-semibold text-ink">User directory</h3>
            <p className="mt-1 text-sm text-slate">Roles and organizational assignments are managed alongside each
                identity.</p></div>
        {loading ? <div className="flex justify-center p-14"><Loader2 className="h-6 w-6 animate-spin text-brand"/>
        </div> : users.length === 0 ? <EmptyState title="No users yet"
                                                  description="Create an administrator or requester to start building the access model."/> :
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-cloud text-xs uppercase tracking-wider text-slate">
                    <tr>
                        <th className="px-6 py-3 font-semibold">User</th>
                        <th className="px-6 py-3 font-semibold">Employee code</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 text-right font-semibold">Access</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">{users.map((user) => <tr key={user.id}
                                                                                          className="hover:bg-cloud/70">
                        <td className="px-6 py-4"><p className="font-semibold text-ink">{user.fullName}</p><p
                            className="mt-1 text-xs text-slate">{user.email}</p></td>
                        <td className="px-6 py-4 font-mono text-xs text-brand">{user.employeeCode}</td>
                        <td className="px-6 py-4"><StatusPill active={user.isActive ?? true}/></td>
                        <td className="px-6 py-4 text-right"><span
                            className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">{user.roles?.length ?? 0} roles</span>
                        </td>
                    </tr>)}</tbody>
                </table>
            </div>}</Panel>{showForm &&
        <UserForm roles={roles} companies={companies} units={units} onCompanyChange={loadUnits}
                  onClose={() => setShowForm(false)} onCreated={(user) => {
            setUsers((current) => [user, ...current]);
            setShowForm(false);
        }}/>}</div>;
}

function UserForm({roles, companies, units, onCompanyChange, onClose, onCreated}: {
    roles: Role[];
    companies: Organization[];
    units: AccessEntity[];
    onCompanyChange: (id: string) => void;
    onClose: () => void;
    onCreated: (user: User) => void
}) {
    const [form, setForm] = useState({
        employeeCode: '',
        fullName: '',
        email: '',
        password: '',
        companyId: '',
        businessUnitId: '',
        roleId: ''
    });
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const update = (key: keyof typeof form, value: string) => setForm((current) => ({...current, [key]: value}));

    async function submit(event: FormEvent) {
        event.preventDefault();
        setPending(true);
        setError('');
        try {
            const user = await createUser({
                employeeCode: form.employeeCode,
                fullName: form.fullName,
                email: form.email,
                password: form.password
            });
            await createAssignment({
                userId: user.id,
                companyId: form.companyId,
                businessUnitId: form.businessUnitId || undefined,
                roleId: form.roleId
            });
            onCreated(user);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to create user');
        } finally {
            setPending(false);
        }
    }

    return <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 sm:items-center">
        <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
                <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Access configuration</p>
                    <h3 className="mt-2 text-xl font-semibold text-ink">Create user and assign access</h3></div>
                <button onClick={onClose} className="rounded-lg p-2 text-slate hover:bg-cloud"
                        aria-label="Close dialog"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
                <div><label htmlFor="employee-code" className="text-sm font-semibold">Employee code</label><input
                    id="employee-code" className="field font-mono" value={form.employeeCode}
                    onChange={(e) => update('employeeCode', e.target.value)} required/></div>
                <div><label htmlFor="full-name" className="text-sm font-semibold">Full name</label><input id="full-name"
                                                                                                          className="field"
                                                                                                          value={form.fullName}
                                                                                                          onChange={(e) => update('fullName', e.target.value)}
                                                                                                          required/>
                </div>
                <div><label htmlFor="user-email" className="text-sm font-semibold">Email</label><input id="user-email"
                                                                                                       type="email"
                                                                                                       className="field"
                                                                                                       value={form.email}
                                                                                                       onChange={(e) => update('email', e.target.value)}
                                                                                                       required/></div>
                <div><label htmlFor="user-password" className="text-sm font-semibold">Temporary password</label><input
                    id="user-password" type="password" minLength={12} className="field" value={form.password}
                    onChange={(e) => update('password', e.target.value)} required/></div>
                <div><label htmlFor="user-company" className="text-sm font-semibold">Company</label><select
                    id="user-company" className="field" value={form.companyId} onChange={(e) => {
                    update('companyId', e.target.value);
                    update('businessUnitId', '');
                    onCompanyChange(e.target.value);
                }} required>
                    <option value="">Select company</option>
                    {companies.filter((company) => company.isActive).map((company) => <option key={company.id}
                                                                                              value={company.id}>{company.name}</option>)}
                </select></div>
                <div><label htmlFor="user-unit" className="text-sm font-semibold">Business unit</label><select
                    id="user-unit" className="field" value={form.businessUnitId}
                    onChange={(e) => update('businessUnitId', e.target.value)}>
                    <option value="">All company scope</option>
                    {units.filter((unit) => unit.isActive).map((unit) => <option key={unit.id}
                                                                                 value={unit.id}>{unit.name}</option>)}
                </select></div>
                <div className="sm:col-span-2"><label htmlFor="user-role" className="text-sm font-semibold">Role</label><select
                    id="user-role" className="field" value={form.roleId}
                    onChange={(e) => update('roleId', e.target.value)} required>
                    <option value="">Select role</option>
                    {roles.filter((role) => role.isActive).map((role) => <option key={role.id}
                                                                                 value={role.id}>{role.name} ({role.code})</option>)}
                </select></div>
                {error && <p role="alert" className="sm:col-span-2 text-sm text-red-600">{error}</p>}
                <div className="flex justify-end gap-3 sm:col-span-2">
                    <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
                    <button className="button-primary" disabled={pending}>{pending ?
                        <Loader2 className="h-4 w-4 animate-spin"/> :
                        <UserPlus className="h-4 w-4"/>}{pending ? 'Creating…' : 'Create user'}</button>
                </div>
            </form>
        </div>
    </div>;
}
