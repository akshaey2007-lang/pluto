import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verified Opportunities — Pluto',
  description: 'Browse curated, payment-verified freelance opportunities without application tokens or talent fees.',
};

export default function OpportunitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
