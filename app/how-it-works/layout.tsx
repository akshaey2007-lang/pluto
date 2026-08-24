import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Pluto Works — Pluto',
  description: 'See how Pluto handles matching, clear milestones, protected funding, review, and payment release.',
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
