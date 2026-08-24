'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const faqs = [
  ['When is a milestone funded?', 'Before the freelancer begins that stage of work. Pluto confirms the funds are in place and both sides can see the milestone status.'],
  ['What if the client does not respond?', 'Every delivery has a stated review window. If no revision or dispute is raised, the funded milestone is released automatically.'],
  ['How are disagreements handled?', 'Pluto reviews the agreed scope, messages, files, and delivery evidence. The goal is a fair resolution based on what both sides accepted.'],
];

export default function ProtectPage() {
  const [budget, setBudget] = useState(50000);
  const [open, setOpen] = useState(0);
  const fee = Math.round(budget * .07);

  return (
    <main className="protect-page">
      <SiteHeader />
      <section className="page-hero shell protect-hero"><div><span className="page-kicker">PLUTO PROTECT</span><h1>Commit clearly.<br /><em>Deliver confidently.</em></h1></div><p>Protection is not a vague promise. It is a visible workflow for funding, delivery, review, and payment release.</p></section>
      <section className="protect-flow shell"><div className="flow-line" />{[['01','AGREE','Scope, timing, revisions, and acceptance are recorded.'],['02','FUND','The client funds the milestone before work starts.'],['03','DELIVER','Files and notes are delivered inside the shared workspace.'],['04','RELEASE','Approval—or the completed review window—releases payment.']].map(item => <article key={item[0]}><span>{item[0]}</span><i /><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</section>
      <section className="protect-calculator-section"><div className="shell protect-calc-grid"><div><span>TRANSPARENT PRICING</span><h2>The freelancer receives<br />their full quote.</h2><p>Pluto’s protection fee is paid by the client and shown before the project is funded. No surprise deduction appears after delivery.</p><ul><li><span>✓</span> No freelancer platform fee</li><li><span>✓</span> One visible client protection fee</li><li><span>✓</span> Processing and tax shown separately</li></ul></div><div className="fee-calculator"><div className="calc-top"><span>CLIENT FEE CALCULATOR</span><b>7% PROTECTION FEE</b></div><label htmlFor="protect-budget">Project budget <strong>₹{budget.toLocaleString('en-IN')}</strong></label><input id="protect-budget" type="range" min="10000" max="200000" step="5000" value={budget} onChange={event => setBudget(Number(event.target.value))} style={{ '--progress': `${((budget - 10000) / 190000) * 100}%` } as React.CSSProperties}/><div className="range-labels"><span>₹10k</span><span>₹2L</span></div><div className="receipt"><div><span>Freelancer receives</span><strong>₹{budget.toLocaleString('en-IN')}</strong></div><div><span>Pluto protection fee</span><strong>₹{fee.toLocaleString('en-IN')}</strong></div><div className="receipt-total"><span>Client pays</span><strong>₹{(budget + fee).toLocaleString('en-IN')}</strong></div></div></div></div></section>
      <section className="protect-faq shell" id="questions"><div><span>COMMON QUESTIONS</span><h2>Protection should<br />be understandable.</h2><Link href="/how-it-works">View the full workflow →</Link></div><div className="faq-list">{faqs.map((faq,index) => <button className={open === index ? 'open' : ''} onClick={() => setOpen(open === index ? -1 : index)} key={faq[0]}><span>0{index + 1}</span><div><strong>{faq[0]}</strong>{open === index && <p>{faq[1]}</p>}</div><b>{open === index ? '−' : '+'}</b></button>)}</div></section>
      <SiteFooter />
    </main>
  );
}
