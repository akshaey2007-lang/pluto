'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;
    window.sessionStorage.setItem('pluto-demo-role', 'client');
    router.push('/client');
  };

  return (
    <main className="client-entry-page">
      <header className="role-entry-nav client-entry-nav">
        <Link href="/" aria-label="Pluto home"><span className="logo-crop"><img src="/pluto-logo-clean.png" alt="Pluto" /></span></Link>
        <span>CLIENT PROJECT CONTROL</span>
        <div><small>Working independently?</small><Link href="/login/talent">Talent login ↗</Link></div>
      </header>
      <section className="client-entry-shell">
        <div className="client-form-zone">
          <span className="entry-kicker">CLIENT ACCESS / VERIFIED TEAMS</span><h1>Bring the right<br />people into focus.</h1><p>Sign in to manage briefs, talent shortlists, funded milestones, and project approvals.</p>
          <form onSubmit={signIn}>
            <label htmlFor="client-email">Company email</label><input id="client-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="email" required />
            <div className="entry-password-label"><label htmlFor="client-password">Password</label><a href="#">Forgot password?</a></div><input id="client-password" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter password" autoComplete="current-password" required />
            <button type="submit">Enter client workspace <span>↗</span></button>
          </form>
          <div className="entry-demo-note client-demo-note"><i>i</i><p><strong>Portfolio preview</strong>Use any email and password. Details are not stored.</p></div>
          <div className="client-entry-support"><span>NEW TO PLUTO?</span><Link href="/signup/client">Create a client account →</Link></div>
        </div>
        <div className="client-control-preview">
          <div className="control-preview-top"><span>PLUTO LABS / OVERVIEW</span><b><i /> ALL SYSTEMS CLEAR</b></div>
          <div className="control-copy"><span>CLIENT WORKSPACE</span><h2>Projects move when<br />decisions stay clear.</h2><p>A single view of scope, people, money, and momentum.</p></div>
          <div className="control-stats"><article><small>ACTIVE PROJECTS</small><strong>04</strong><span>3 on track</span></article><article><small>FUNDS PROTECTED</small><strong>₹2.4L</strong><span>7 milestones</span></article><article><small>MATCHES READY</small><strong>18</strong><span>Curated today</span></article></div>
          <div className="control-project"><div><small>PROJECT 04 · BRAND IDENTITY</small><strong>Northstar launch system</strong><span>Nina Shah · Delivery in 4 days</span></div><b>72%</b><div className="control-progress"><i /></div><p>Milestone 3 of 4 <span>₹24,000 protected</span></p></div>
          <div className="control-talent"><span>NS</span><div><small>TOP PLUTO MATCH</small><strong>Nina Shah · Brand designer</strong></div><b>98% MATCH</b></div>
        </div>
      </section>
    </main>
  );
}
