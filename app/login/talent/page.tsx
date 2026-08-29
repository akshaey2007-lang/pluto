'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const liveMatches = [
  ['98%', 'Climate-tech identity', '₹55k–₹70k'],
  ['94%', 'Health product dashboard', '₹80k–₹1.1L'],
  ['91%', 'Motion launch film', '₹42k–₹55k'],
];

export default function TalentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;
    window.sessionStorage.setItem('pluto-demo-role', 'talent');
    router.push('/talent');
  };

  return (
    <main className="talent-entry-page">
      <header className="role-entry-nav talent-entry-nav">
        <Link href="/" aria-label="Pluto home"><span className="logo-crop"><img src="/pluto-logo-clean.png" alt="Pluto" /></span></Link>
        <span>INDEPENDENT TALENT PORTAL</span>
        <div><small>Hiring instead?</small><Link href="/login/client">Client login ↗</Link></div>
      </header>
      <section className="talent-entry-shell">
        <div className="talent-entry-story">
          <span className="entry-kicker"><i /> TALENT ACCESS</span>
          <h1>Find work that<br /><em>respects the work.</em></h1>
          <p>Return to a focused workspace for curated opportunities, active milestones, and protected payments—without spending tokens to be seen.</p>
          <div className="talent-proof-row"><div><strong>12</strong><span>fresh matches</span></div><div><strong>₹74k</strong><span>protected now</span></div><div><strong>₹0</strong><span>application fees</span></div></div>
          <div className="live-match-board"><div className="match-board-top"><span>LIVE MATCHES</span><b>UPDATED TODAY</b></div>{liveMatches.map(match => <article key={match[1]}><strong>{match[0]}</strong><div><span>{match[1]}</span><small>Verified client · Ready to start</small></div><b>{match[2]}</b></article>)}</div>
        </div>
        <aside className="talent-login-card">
          <div className="login-role-mark">T</div><span>WELCOME BACK</span><h2>Sign in to your<br />talent workspace.</h2><p>Use the account connected to your independent profile.</p>
          <form onSubmit={signIn}>
            <label htmlFor="talent-email">Work email</label><input id="talent-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@portfolio.com" autoComplete="email" required />
            <div className="entry-password-label"><label htmlFor="talent-password">Password</label><a href="#">Forgot password?</a></div><input id="talent-password" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter password" autoComplete="current-password" required />
            <button type="submit">Open talent workspace <span>→</span></button>
          </form>
          <div className="entry-signup-switch"><span>New to Pluto?</span><Link href="/signup/talent">Create a talent account →</Link></div>
          <div className="entry-demo-note"><i>i</i><p><strong>Portfolio preview</strong>Use any email and password. Details are not stored.</p></div>
          <Link className="entry-back" href="/">← Back to Pluto</Link>
        </aside>
      </section>
    </main>
  );
}
