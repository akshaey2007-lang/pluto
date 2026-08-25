'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  ['How it works', '/how-it-works'],
  ['Find work', '/opportunities'],
  ['Pluto Protect', '/protect'],
  ['Talent login', '/login/talent'],
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="nav shell site-header">
      <Link className="brand" href="/" aria-label="Pluto home" onClick={() => setOpen(false)}>
        <span className="logo-crop"><img src="/pluto-logo-clean.png" alt="Pluto" /></span>
      </Link>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><span /><span /></button>
      <nav className={`nav-links page-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
        {links.map(([label, href]) => <Link className={pathname.startsWith(href) ? 'active' : ''} href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
      </nav>
      <Link className="nav-cta" href="/login/client">Client login <span>↗</span></Link>
    </header>
  );
}
