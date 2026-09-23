'use client';

import {FormEvent, useEffect, useState} from 'react';
import {Building2, Loader2, Plus, Warehouse} from 'lucide-react';
import {
    createBusinessUnit,
    createDepartment,
    createStore,
    listBusinessUnits,
    listDepartments,
    listOrganizations,
    listStores
} from '@/lib/api/queries';
import type {AccessEntity, Organization} from '@/lib/types';
import {PageHeading} from '@/components/ui/page-heading';
import {EmptyState, Panel} from '@/components/ui/panel';

export default function StructurePage() {
    const [companies, setCompanies] = useState<Organization[]>([]);
    const [companyId, setCompanyId] = useState('');
    const [units, setUnits] = useState<AccessEntity[]>([]);
    const [departments, setDepartments] = useState<AccessEntity[]>([]);
    const [stores, setStores] = useState<AccessEntity[]>([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const reload = async (nextCompanyId: string) => {
        setCompanyId(nextCompanyId);
        setSelectedUnit('');
        if (!nextCompanyId) return;
        try {
            const [nextUnits, nextStores] = await Promise.all([listBusinessUnits(nextCompanyId), listStores(nextCompanyId)]);
            setUnits(nextUnits);
            setStores(nextStores);
            setDepartments([]);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to load structure');
        }
    };
    useEffect(() => {
        listOrganizations().then((next) => {
            setCompanies(next);
            const first = next.find((item) => item.isActive);
            if (first) void reload(first.id);
        }).catch((e) => setError(e.message)).finally(() => setLoading(false));
    }, []);
    useEffect(() => {
        if (selectedUnit) listDepartments(selectedUnit).then(setDepartments).catch((e) => setError(e.message));
    }, [selectedUnit]);

    async function addUnit(body: { code: string; name: string }) {
        const next = await createBusinessUnit({companyId, ...body});
        setUnits((current) => [next, ...current]);
    }

    async function addDepartment(body: { code: string; name: string }) {
        const next = await createDepartment({businessUnitId: selectedUnit, ...body});
        setDepartments((current) => [next, ...current]);
    }

    async function addStore(body: { code: string; name: string; location?: string }) {
        const next = await createStore({companyId, businessUnitId: selectedUnit || undefined, ...body});
        setStores((current) => [next, ...current]);
    }

    return <div><PageHeading eyebrow="Access / Organization" title="Organization structure"
                             description="Configure business units, departments, and stores beneath the group company master."/>
        <div
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-brand/10 bg-brand-soft p-5 sm:flex-row sm:items-center">
            <Building2 className="h-5 w-5 text-brand"/><label htmlFor="structure-company"
                                                              className="text-sm font-semibold text-ink">Working
            company</label><select id="structure-company" className="field mt-0 max-w-md" value={companyId}
                                   onChange={(e) => void reload(e.target.value)}>
            <option value="">Select company</option>
            {companies.filter((company) => company.isActive).map((company) => <option key={company.id}
                                                                                      value={company.id}>{company.name}</option>)}
        </select></div>
        {error &&
            <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{loading ?
            <div className="flex justify-center p-14"><Loader2 className="h-6 w-6 animate-spin text-brand"/>
            </div> : !companyId ? <Panel><EmptyState title="Select a company"
                                                     description="Choose an active company to configure its structure."/></Panel> :
                <div className="grid gap-6 xl:grid-cols-3"><StructurePanel title="Business units"
                                                                           icon={<Building2 className="h-5 w-5"/>}
                                                                           items={units}
                                                                           empty="No business units configured."
                                                                           onCreate={addUnit}/><StructurePanel
                    title="Departments" icon={<Building2 className="h-5 w-5"/>} items={departments}
                    empty={selectedUnit ? 'No departments configured.' : 'Select a business unit below.'}
                    onCreate={selectedUnit ? addDepartment : undefined} selector={units} selected={selectedUnit}
                    onSelect={(id) => setSelectedUnit(id)}/><StructurePanel title="Stores"
                                                                            icon={<Warehouse className="h-5 w-5"/>}
                                                                            items={stores} empty="No stores configured."
                                                                            onCreate={addStore}/></div>}</div>;
}

function StructurePanel({title, icon, items, empty, onCreate, selector, selected, onSelect}: {
    title: string;
    icon: React.ReactNode;
    items: AccessEntity[];
    empty: string;
    onCreate?: (body: { code: string; name: string; location?: string }) => Promise<void>;
    selector?: AccessEntity[];
    selected?: string;
    onSelect?: (value: string) => void
}) {
    const [open, setOpen] = useState(false);
    return <Panel>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3"><span
                className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">{icon}</span><h3
                className="font-semibold text-ink">{title}</h3></div>
            {onCreate && <button className="rounded-lg p-2 text-brand hover:bg-brand-soft" onClick={() => setOpen(true)}
                                 aria-label={`Add ${title}`}><Plus className="h-4 w-4"/></button>}</div>
        {selector && <div className="border-b border-slate-100 p-4"><label htmlFor={`${title}-selector`}
                                                                           className="text-xs font-semibold uppercase tracking-wider text-slate">Business
            unit</label><select id={`${title}-selector`} className="field" value={selected}
                                onChange={(e) => onSelect?.(e.target.value)}>
            <option value="">Select unit</option>
            {selector.filter((item) => item.isActive).map((item) => <option key={item.id}
                                                                            value={item.id}>{item.name}</option>)}
        </select></div>}{items.length === 0 ? <EmptyState title="Nothing here yet" description={empty}/> :
        <div className="divide-y divide-slate-100">{items.map((item) => <div key={item.id}
                                                                             className="flex items-center justify-between px-5 py-3">
            <div><p className="text-sm font-semibold text-ink">{item.name}</p><p
                className="font-mono text-xs text-slate">{item.code}</p></div>
            <span className="h-2 w-2 rounded-full bg-emerald-500"/></div>)}</div>}{open &&
        <MiniForm title={`Add ${title.slice(0, -1)}`} includeLocation={title === 'Stores'}
                  onClose={() => setOpen(false)} onSubmit={async (body) => {
            await onCreate?.(body);
            setOpen(false);
        }}/>}</Panel>;
}

function MiniForm({title, includeLocation, onClose, onSubmit}: {
    title: string;
    includeLocation?: boolean;
    onClose: () => void;
    onSubmit: (body: { code: string; name: string; location?: string }) => Promise<void>
}) {
    const [form, setForm] = useState({code: '', name: '', location: ''});
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');

    async function submit(event: FormEvent) {
        event.preventDefault();
        setPending(true);
        try {
            await onSubmit({code: form.code, name: form.name, location: includeLocation ? form.location : undefined});
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to save');
        } finally {
            setPending(false);
        }
    }

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4">
        <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between"><h3
                className="text-xl font-semibold text-ink">{title}</h3>
                <button type="button" onClick={onClose} className="text-slate">×</button>
            </div>
            <div className="mt-6 space-y-4">
                <div><label className="text-sm font-semibold">Code</label><input className="field font-mono"
                                                                                 value={form.code}
                                                                                 onChange={(e) => setForm({
                                                                                     ...form,
                                                                                     code: e.target.value
                                                                                 })} required/></div>
                <div><label className="text-sm font-semibold">Name</label><input className="field" value={form.name}
                                                                                 onChange={(e) => setForm({
                                                                                     ...form,
                                                                                     name: e.target.value
                                                                                 })} required/></div>
                {includeLocation &&
                    <div><label className="text-sm font-semibold">Location</label><input className="field"
                                                                                         value={form.location}
                                                                                         onChange={(e) => setForm({
                                                                                             ...form,
                                                                                             location: e.target.value
                                                                                         })}/></div>}</div>
            {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
                <button className="button-primary" disabled={pending}>{pending &&
                    <Loader2 className="h-4 w-4 animate-spin"/>}Save
                </button>
            </div>
        </form>
    </div>;
}
