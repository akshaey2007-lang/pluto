import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Login — Pluto',
  description: 'Sign in to the Pluto client workspace to manage talent matches, milestones, and approvals.',
};

export default function ClientLoginLayout({ children }: { children: React.ReactNode }) { return children; }
