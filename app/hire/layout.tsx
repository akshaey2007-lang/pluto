import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hire Independent Talent — Pluto',
  description: 'Create a clear project brief and meet a curated shortlist of verified independent professionals.',
};

export default function HireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
