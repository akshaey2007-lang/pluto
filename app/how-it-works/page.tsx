'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const steps = [
  { number: '01', title: 'Get matched, not buried', text: 'Pluto creates a small shortlist using skills, availability, budget fit, and verified work history.' },
  { number: '02', title: 'Agree on clear milestones', text: 'Scope, timing, revisions, ownership, and acceptance are recorded before delivery begins.' },
  { number: '03', title: 'Work with protected funding', text: 'The client funds each milestone first. Both sides can see what is due and when.' },
  { number: '04', title: 'Review and release', text: 'Approval releases the payment. A clear review window prevents completed work from waiting forever.' },
];

export default function HowItWorksPage() {
  const [active, setActive] = useState(0);
  return (
    <main className="how-page">
      <SiteHeader />
      <section className="page-hero shell how-hero"><div><span className="page-kicker">HOW PLUTO WORKS</span><h1>A clearer path from<br /><em>brief to payment.</em></h1></div><p>Pluto replaces pay-to-apply bidding with a professional workflow designed around relevance, accountability, and funded commitments.</p></section>
      <section className="process-shell shell">
        <div className="process-tabs">{steps.map((step, index) => <button className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={step.number}><span>{step.number}</span><div><strong>{step.title}</strong><p>{step.text}</p></div><b>{active === index ? '−' : '+'}</b></button>)}</div>
        <div className="process-stage"><span>WORKFLOW / {steps[active].number}</span><div className="process-card"><small>PLUTO PROJECT</small><h2>{steps[active].title}</h2><p>{steps[active].text}</p><div className="process-progress">{steps.map((step, index) => <i className={index <= active ? 'complete' : ''} key={step.number} />)}</div><strong>{active + 1} of {steps.length}</strong></div></div>
      </section>
      <section className="role-section"><div className="shell role-grid"><div><span>FOR TALENT</span><h2>You bring the craft.<br />Pluto clears the path.</h2><ul><li>No application fees</li><li>Relevant briefs, not open bidding</li><li>100% of your quoted project price</li></ul><Link href="/opportunities">Find your next project →</Link></div><div><span>FOR CLIENTS</span><h2>Commitment begins<br />with a funded brief.</h2><ul><li>Verified independent professionals</li><li>Clear milestones and review windows</li><li>One transparent protection fee</li></ul><Link href="/hire">Create a project brief →</Link></div></div></section>
      <section className="fee-principle shell" id="fees"><span>THE FEE PRINCIPLE</span><div><h2>Talent keeps the quote.</h2><strong>100%</strong></div><p>Pluto charges the client a visible protection fee. It never charges freelancers merely for access to an opportunity.</p><Link href="/protect">See how funds are protected →</Link></section>
      <SiteFooter />
    </main>
  );
}
