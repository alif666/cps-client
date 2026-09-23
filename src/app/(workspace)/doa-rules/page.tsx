'use client';

import {FormEvent, useEffect, useState} from 'react';
import {Loader2, Plus, X} from 'lucide-react';
import {createDoaRule, listDoaRules, listRoles} from '@/lib/api/queries';
import type {DoaRule, Role} from '@/lib/types';
import {PageHeading} from '@/components/ui/page-heading';
import {EmptyState, Panel} from '@/components/ui/panel';
import {StatusPill} from '@/components/ui/status-pill';

export default function DoaRulesPage() {
    const [rules, setRules] = useState<DoaRule[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        Promise.all([listDoaRules(), listRoles()]).then(([nextRules, nextRoles]) => {
            setRules(nextRules);
            setRoles(nextRoles);
        }).catch((e) => setError(e.message)).finally(() => setLoading(false));
    }, []);
    return <div><PageHeading eyebrow="Governance / Approval policy" title="DOA rules"
                             description="Configure value-based approval routing without hard-coding the procurement hierarchy."
                             action={{label: 'Add DOA rule', onClick: () => setOpen(true)}}/>{error &&
        <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<Panel>
        <div className="border-b border-slate-100 px-6 py-5"><h3 className="font-semibold text-ink">Delegation of
            Authority matrix</h3><p className="mt-1 text-sm text-slate">Rules are effective-dated and evaluated by the
            service layer.</p></div>
        {loading ? <div className="flex justify-center p-14"><Loader2 className="h-6 w-6 animate-spin text-brand"/>
        </div> : rules.length === 0 ? <EmptyState title="No DOA rules yet"
                                                  description="Add the first approval rule to make the policy configurable."/> :
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-cloud text-xs uppercase tracking-wider text-slate">
                    <tr>
                        <th className="px-6 py-3 font-semibold">Transaction</th>
                        <th className="px-6 py-3 font-semibold">Value range</th>
                        <th className="px-6 py-3 font-semibold">Approver</th>
                        <th className="px-6 py-3 font-semibold">Sequence</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">{rules.map((rule) => <tr key={rule.id}
                                                                                          className="hover:bg-cloud/70">
                        <td className="px-6 py-4"><p className="font-semibold text-ink">{rule.transactionType}</p><p
                            className="mt-1 text-xs text-slate">Effective {rule.effectiveFrom}</p></td>
                        <td className="px-6 py-4 font-mono text-xs text-brand">{rule.minValue ?? '0'} — {rule.maxValue ?? '∞'}</td>
                        <td className="px-6 py-4">{roles.find((role) => role.id === rule.approverRoleId)?.name ?? rule.approverRoleId}</td>
                        <td className="px-6 py-4">Step {rule.sequenceNo}{rule.isParallel && <span
                            className="ml-2 rounded-full bg-violet-50 px-2 py-1 text-xs text-violet-700">Parallel</span>}</td>
                        <td className="px-6 py-4"><StatusPill active={rule.isActive}/></td>
                    </tr>)}</tbody>
                </table>
            </div>}</Panel>{open && <DoaForm roles={roles} onClose={() => setOpen(false)} onCreated={(rule) => {
        setRules((current) => [rule, ...current]);
        setOpen(false);
    }}/>}</div>;
}

function DoaForm({roles, onClose, onCreated}: {
    roles: Role[];
    onClose: () => void;
    onCreated: (rule: DoaRule) => void
}) {
    const [form, setForm] = useState({
        transactionType: 'PR',
        procurementCategory: 'INDIRECT',
        minValue: '',
        maxValue: '',
        approverRoleId: '',
        sequenceNo: '1',
        isParallel: false,
        effectiveFrom: new Date().toISOString().slice(0, 10)
    });
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');

    async function submit(event: FormEvent) {
        event.preventDefault();
        setPending(true);
        try {
            const next = await createDoaRule({
                ...form,
                sequenceNo: Number(form.sequenceNo),
                minValue: form.minValue || undefined,
                maxValue: form.maxValue || undefined
            });
            onCreated(next);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to create DOA rule');
        } finally {
            setPending(false);
        }
    }

    return <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 sm:items-center">
        <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
                <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Approval policy</p><h3
                    className="mt-2 text-xl font-semibold text-ink">Add DOA rule</h3></div>
                <button onClick={onClose} aria-label="Close dialog"
                        className="rounded-lg p-2 text-slate hover:bg-cloud"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
                <div><label htmlFor="doa-transaction" className="text-sm font-semibold">Transaction type</label><select
                    id="doa-transaction" className="field" value={form.transactionType}
                    onChange={(e) => setForm({...form, transactionType: e.target.value})}>
                    <option>PR</option>
                    <option>PO</option>
                    <option>STORE_REQUISITION</option>
                    <option>INVENTORY_ADJUSTMENT</option>
                </select></div>
                <div><label htmlFor="doa-category" className="text-sm font-semibold">Procurement category</label><select
                    id="doa-category" className="field" value={form.procurementCategory}
                    onChange={(e) => setForm({...form, procurementCategory: e.target.value})}>
                    <option>INDIRECT</option>
                    <option>CAPEX</option>
                    <option>ANY</option>
                </select></div>
                <div><label htmlFor="doa-min" className="text-sm font-semibold">Minimum value</label><input id="doa-min"
                                                                                                            type="number"
                                                                                                            min="0"
                                                                                                            className="field"
                                                                                                            value={form.minValue}
                                                                                                            onChange={(e) => setForm({
                                                                                                                ...form,
                                                                                                                minValue: e.target.value
                                                                                                            })}
                                                                                                            placeholder="0"/>
                </div>
                <div><label htmlFor="doa-max" className="text-sm font-semibold">Maximum value</label><input id="doa-max"
                                                                                                            type="number"
                                                                                                            min="0"
                                                                                                            className="field"
                                                                                                            value={form.maxValue}
                                                                                                            onChange={(e) => setForm({
                                                                                                                ...form,
                                                                                                                maxValue: e.target.value
                                                                                                            })}
                                                                                                            placeholder="No upper limit"/>
                </div>
                <div><label htmlFor="doa-role" className="text-sm font-semibold">Approver role</label><select
                    id="doa-role" className="field" value={form.approverRoleId}
                    onChange={(e) => setForm({...form, approverRoleId: e.target.value})} required>
                    <option value="">Select role</option>
                    {roles.filter((role) => role.isActive).map((role) => <option key={role.id}
                                                                                 value={role.id}>{role.name}</option>)}
                </select></div>
                <div><label htmlFor="doa-sequence" className="text-sm font-semibold">Approval sequence</label><input
                    id="doa-sequence" type="number" min="1" className="field" value={form.sequenceNo}
                    onChange={(e) => setForm({...form, sequenceNo: e.target.value})} required/></div>
                <div><label htmlFor="doa-date" className="text-sm font-semibold">Effective from</label><input
                    id="doa-date" type="date" className="field" value={form.effectiveFrom}
                    onChange={(e) => setForm({...form, effectiveFrom: e.target.value})} required/></div>
                <label className="flex items-center gap-3 self-end text-sm font-medium"><input type="checkbox"
                                                                                               checked={form.isParallel}
                                                                                               onChange={(e) => setForm({
                                                                                                   ...form,
                                                                                                   isParallel: e.target.checked
                                                                                               })}
                                                                                               className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"/>Parallel
                    approval step</label>{error &&
                <p role="alert" className="sm:col-span-2 text-sm text-red-600">{error}</p>}
                <div className="flex justify-end gap-3 sm:col-span-2">
                    <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
                    <button className="button-primary" disabled={pending}>{pending ?
                        <Loader2 className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4"/>}Save DOA rule
                    </button>
                </div>
            </form>
        </div>
    </div>;
}
