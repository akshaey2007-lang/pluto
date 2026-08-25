import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Client Workspace — Pluto', description: 'Pluto’s dedicated workspace for clients and project teams.' };
export default function ClientLayout({ children }: { children: React.ReactNode }) { return children; }
