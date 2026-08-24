import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pluto Protect — Pluto',
  description: 'Understand Pluto’s funded milestones, review windows, transparent client fee, and payment-release process.',
};

export default function ProtectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
