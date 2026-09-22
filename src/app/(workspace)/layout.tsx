import { AppShell } from '@/components/app/app-shell';
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) { return <AppShell eyebrow="ABC Group / Workspace" title="CPS command center">{children}</AppShell>; }
