import {Sidebar} from './sidebar';
import {Topbar} from './topbar';
import {AccessBoundary} from './access-boundary';

export function AppShell({children, title, eyebrow}: { children: React.ReactNode; title: string; eyebrow: string }) {
    return <div className="flex min-h-screen bg-cloud"><Sidebar/>
        <div className="min-w-0 flex-1"><Topbar title={title} eyebrow={eyebrow}/>
            <main className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
                <AccessBoundary>{children}</AccessBoundary></main>
        </div>
    </div>;
}
