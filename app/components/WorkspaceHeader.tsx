import Link from 'next/link';

export default function WorkspaceHeader({ role }: { role: 'talent' | 'client' }) {
  const isTalent = role === 'talent';
  return (
    <header className="workspace-header">
      <Link href="/" className="workspace-logo"><span className="logo-crop small"><img src="/pluto-logo-clean.png" alt="Pluto" /></span></Link>
      <nav aria-label={`${role} workspace navigation`}>
        {isTalent ? <><Link href="/talent">Overview</Link><Link href="/opportunities">Opportunities</Link><Link href="/talent#projects">Projects</Link><Link href="/talent#payments">Payments</Link></> : <><Link href="/client">Overview</Link><Link href="/hire">New brief</Link><Link href="/client#projects">Projects</Link><Link href="/protect">Protection</Link></>}
      </nav>
      <div className="workspace-account"><span>{isTalent ? 'TALENT' : 'CLIENT'}</span><div>{isTalent ? 'AK' : 'PL'}</div><Link href={`/login/${role}`}>Sign out</Link></div>
    </header>
  );
}
