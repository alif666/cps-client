import {Plus} from 'lucide-react';

export function PageHeading({eyebrow, title, description, action}: {
    eyebrow: string;
    title: string;
    description: string;
    action?: { label: string; onClick: () => void }
}) {
    return <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p><h2
            className="mt-2 text-3xl font-semibold tracking-tight text-ink">{title}</h2><p
            className="mt-2 max-w-2xl text-sm leading-6 text-slate">{description}</p></div>
        {action && <button className="button-primary shrink-0" onClick={action.onClick}><Plus
            className="h-4 w-4"/>{action.label}</button>}</div>;
}
