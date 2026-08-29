'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function ClientSignupPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const createAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accepted) return;
    window.sessionStorage.setItem('pluto-demo-role', 'client');
    router.push('/client');
  };

  return (
    <main className="client-signup-page">
      <header className="role-entry-nav client-entry-nav">
        <Link href="/" aria-label="Pluto home"><span className="logo-crop"><img src="/pluto-logo-clean.png" alt="Pluto" /></span></Link>
        <span>CLIENT ACCOUNT SETUP</span>
        <div><small>Already working with Pluto?</small><Link href="/login/client">Client login →</Link></div>
      </header>
      <section className="client-signup-shell">
        <div className="signup-form-card client-signup-form">
          <div className="signup-form-head"><span>SET UP YOUR TEAM</span><Link href="/signup/talent">Joining as talent? ↗</Link></div><h1>Build your Pluto<br />client account.</h1><p>Create the team profile that will own briefs, funded milestones, and project approvals.</p>
          <form onSubmit={createAccount}>
            <div className="signup-field-grid"><label>Your name<input type="text" placeholder="Full name" autoComplete="name" required /></label><label>Company email<input type="email" placeholder="you@company.com" autoComplete="email" required /></label></div>
            <div className="signup-field-grid"><label>Company or team<input type="text" placeholder="Company name" autoComplete="organization" required /></label><label>Team size<select defaultValue=""><option value="" disabled>Select size</option><option>Just me</option><option>2–10</option><option>11–50</option><option>51–200</option><option>200+</option></select></label></div>
            <label>Create password<input type="password" placeholder="At least 8 characters" minLength={8} autoComplete="new-password" required /></label>
            <label className="signup-consent"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} required /><span>I agree to Pluto’s terms and understand this portfolio preview does not create a real account.</span></label>
            <button type="submit">Create client account <span>↗</span></button>
          </form>
          <div className="signup-safety"><i>✓</i><p><strong>Portfolio preview</strong>No company or personal details are stored.</p></div>
        </div>
        <div className="client-signup-story">
          <span>BUILT FOR CLEAR COLLABORATION</span><h2>From the first brief<br />to the final release.</h2><p>Pluto gives your team one professional workflow for finding talent and managing delivery.</p>
          <div className="client-setup-map"><article className="complete"><span>01</span><div><strong>Team account</strong><small>Identity and workspace ownership</small></div><b>NOW</b></article><article><span>02</span><div><strong>Project brief</strong><small>Scope, budget, timeline, and outcomes</small></div></article><article><span>03</span><div><strong>Curated shortlist</strong><small>Relevant professionals ready to begin</small></div></article><article><span>04</span><div><strong>Fund and collaborate</strong><small>Clear milestones with protected payment</small></div></article></div>
          <div className="client-signup-metric"><div><strong>48h</strong><span>typical first shortlist</span></div><div><strong>4.9/5</strong><span>client collaboration rating</span></div><div><strong>7%</strong><span>transparent protection fee</span></div></div>
        </div>
      </section>
    </main>
  );
}
