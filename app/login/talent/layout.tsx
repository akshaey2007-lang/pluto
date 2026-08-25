import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talent Login — Pluto',
  description: 'Sign in to the Pluto talent workspace to discover work and manage protected projects.',
};

export default function TalentLoginLayout({ children }: { children: React.ReactNode }) { return children; }
