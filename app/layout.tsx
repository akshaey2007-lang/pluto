import type { Metadata } from 'next';
import { DM_Sans, Space_Mono } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ variable: '--font-dm', subsets: ['latin'] });
const spaceMono = Space_Mono({ variable: '--font-mono', weight: ['400', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pluto — Fair work, in orbit',
  description: 'A freelancer-first marketplace with no paid bids, no talent fees, and protected milestones.',
  openGraph: {
    title: 'Pluto — Fair work, in orbit',
    description: 'Great work should cost talent, not tokens.',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Pluto — Great work should cost talent, not tokens.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pluto — Fair work, in orbit',
    description: 'Great work should cost talent, not tokens.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${dmSans.variable} ${spaceMono.variable}`}>{children}</body></html>;
}
