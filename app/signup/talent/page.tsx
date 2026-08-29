'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function TalentSignupPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const createAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accepted) return;
    window.sessionStorage.setItem('pluto-demo-role', 'talent');
    router.push('/talent');
  };

  return (
    <main className="talent-signup-page">
      <header className="role-entry-nav talent-entry-nav">
        <Link href="/" aria-label="Pluto home"><span className="logo-crop"><img src="/pluto-logo-clean.png" alt="Pluto" /></span></Link>
        <span>TALENT PROFILE CREATION</span>
        <div><small>Already have an account?</small><Link href="/login/talent">Talent login →</Link></div>
      </header>
      <section className="talent-signup-shell">
        <div className="signup-story talent-signup-story">
          <span className="entry-kicker"><i /> JOIN AS TALENT</span><h1>Your craft deserves<br /><em>a serious profile.</em></h1><p>Build a verified presence that helps relevant clients understand your skills, availability, and working style.</p>
          <div className="signup-steps"><article className="active"><span>01</span><div><strong>Create your account</strong><small>Basic identity and secure access</small></div><b>NOW</b></article><article><span>02</span><div><strong>Shape your profile</strong><small>Skills, portfolio, rates, and availability</small></div></article><article><span>03</span><div><strong>Verify and match</strong><small>Quality review before opportunities arrive</small></div></article></div>
          <div className="talent-signup-promise"><span>PLUTO PROMISE</span><strong>Never pay to apply.</strong><p>Your profile earns access through relevance and reliability—not purchased tokens.</p></div>
        </div>
        <div className="signup-form-card talent-signup-form">
          <div className="signup-form-head"><span>STEP 01 / ACCOUNT</span><Link href="/signup/client">Joining as a client? ↗</Link></div><h2>Create your<br />talent account.</h2><p>Start with the essentials. You can build your full professional profile next.</p>
          <form onSubmit={createAccount}>
            <div className="signup-field-grid"><label>Full name<input type="text" placeholder="Your name" autoComplete="name" required /></label><label>Work email<input type="email" placeholder="you@portfolio.com" autoComplete="email" required /></label></div>
            <label>Primary specialty<select defaultValue=""><option value="" disabled>Choose your main skill</option><option>Brand design</option><option>Product design</option><option>Development</option><option>Motion & video</option><option>Writing & strategy</option></select></label>
            <label>Create password<input type="password" placeholder="At least 8 characters" minLength={8} autoComplete="new-password" required /></label>
            <label className="signup-consent"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} required /><span>I agree to Pluto’s terms and understand this portfolio preview does not create a real account.</span></label>
            <button type="submit">Create talent profile <span>→</span></button>
          </form>
          <div className="signup-safety"><i>✓</i><p><strong>Portfolio preview</strong>No personal details are stored or submitted.</p></div>
        </div>
      </section>
    </main>
  );
}
