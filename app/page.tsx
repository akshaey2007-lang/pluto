'use client';

import { useState } from 'react';

const opportunities = [
  { title: 'Brand system for an AI studio', budget: '₹48k', match: '96%', tag: 'Brand' },
  { title: 'Fintech dashboard redesign', budget: '₹72k', match: '92%', tag: 'Product' },
  { title: 'Motion launch campaign', budget: '₹36k', match: '88%', tag: 'Motion' },
];

type Job = {
  id: number;
  title: string;
  company: string;
  category: string;
  budget: string;
  duration: string;
  skills: string[];
  match: number;
  color: string;
};

const jobs: Job[] = [
  { id: 1, title: 'Shape a new identity for climate tech', company: 'FLOE LABS', category: 'Brand', budget: '₹55k–₹70k', duration: '3 weeks', skills: ['Brand strategy', 'Identity'], match: 98, color: 'violet' },
  { id: 2, title: 'Design the calmest health dashboard', company: 'MEND HEALTH', category: 'Product', budget: '₹80k–₹1.1L', duration: '4–6 weeks', skills: ['Product design', 'Figma'], match: 94, color: 'lime' },
  { id: 3, title: 'Tell our launch story in sixty seconds', company: 'NORTHSTAR', category: 'Motion', budget: '₹42k–₹55k', duration: '2 weeks', skills: ['Motion', 'Storyboards'], match: 91, color: 'orange' },
  { id: 4, title: 'Build a playful commerce experience', company: 'MELLOW GOODS', category: 'Development', budget: '₹1.2L–₹1.6L', duration: '6 weeks', skills: ['Next.js', 'Interaction'], match: 89, color: 'blue' },
];

const faqs = [
  ['Does Pluto charge freelancers?', 'No. Freelancers apply, work, and withdraw their quoted earnings without a Pluto platform fee. Optional instant-payout charges may apply later.'],
  ['What happens if a client disappears?', 'Once work is delivered, the client has a clear review window. If they take no action, the funded milestone is automatically released.'],
  ['How does Pluto prevent proposal spam?', 'Applications are limited by availability and reliability—not by paid tokens. Curated matching keeps each opportunity focused.'],
];

export default function Home() {
  const [view, setView] = useState<'talent' | 'client'>('talent');
  const [category, setCategory] = useState('All');
  const [saved, setSaved] = useState<number[]>([2]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [budget, setBudget] = useState(50000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [toast, setToast] = useState('');

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const visibleJobs = category === 'All' ? jobs : jobs.filter((job) => job.category === category);

  return (
    <main>
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Pluto home">
          <span className="brand-mark"><span /></span>
          PLUTO
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#opportunities">Opportunities</a>
          <a href="#safety">Pluto Protect</a>
        </div>
        <button className="nav-cta" onClick={() => setView(view === 'talent' ? 'client' : 'talent')}>
          {view === 'talent' ? 'I’m hiring' : 'Find work'} <span>↗</span>
        </button>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><i /> FAIR WORK, IN ORBIT</div>
          <h1>Great work<br />should cost <em>talent,</em><br /><span>not tokens.</span></h1>
          <p className="hero-intro">
            Pluto connects serious clients with independent talent. No paid bids. No hidden cuts.
            Just protected work and your full quoted price.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore opportunities <span>→</span>
            </button>
            <button className="text-button" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
              See how Pluto works <span className="play">▶</span>
            </button>
          </div>
          <div className="proof-row">
            <div className="faces" aria-hidden="true"><span>AR</span><span>MK</span><span>JL</span></div>
            <p><strong>1,240+ creatives</strong><br />already in our orbit</p>
          </div>
        </div>

        <div className="orbit-stage" aria-label="Interactive Pluto marketplace preview">
          <div className="orbit-line orbit-one" />
          <div className="orbit-line orbit-two" />
          <div className="tiny-moon moon-one" />
          <div className="tiny-moon moon-two" />
          <div className="planet"><span>0%</span><small>talent fee</small></div>

          <section className="app-window">
            <div className="app-topbar">
              <div className="mini-brand"><span className="brand-mark small"><span /></span> PLUTO</div>
              <div className="window-tabs">
                <button className={view === 'talent' ? 'active' : ''} onClick={() => setView('talent')}>Talent view</button>
                <button className={view === 'client' ? 'active' : ''} onClick={() => setView('client')}>Client view</button>
              </div>
              <span className="avatar">AK</span>
            </div>
            <div className="app-body">
              <aside>
                <span className="side-label">WORKSPACE</span>
                <button className="selected">⌁ <span>{view === 'talent' ? 'Discover' : 'Overview'}</span></button>
                <button>◫ <span>Projects</span></button>
                <button>◌ <span>Messages</span><b>3</b></button>
                <button>◇ <span>Payments</span></button>
                <div className="side-footer"><i /> All systems clear</div>
              </aside>
              <div className="app-content">
                {view === 'talent' ? (
                  <>
                    <div className="app-heading"><div><span>GOOD MORNING, AKSHAEY</span><h2>Your next mission.</h2></div><button>Filters <b>2</b></button></div>
                    <div className="match-banner"><span>✦</span><div><strong>Fresh matches are ready</strong><small>Curated from your skills and availability</small></div><b>12</b></div>
                    <div className="project-list">
                      {opportunities.map((item, index) => (
                        <article key={item.title} className={index === 0 ? 'featured' : ''}>
                          <span className="project-icon">{index === 0 ? 'A' : index === 1 ? 'F' : 'M'}</span>
                          <div className="project-main"><small>{item.tag} · Posted today</small><strong>{item.title}</strong><span>Fixed price · 2–3 weeks</span></div>
                          <div className="project-meta"><b>{item.budget}</b><span>{item.match} match</span></div>
                        </article>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="app-heading"><div><span>CLIENT COMMAND</span><h2>Build your crew.</h2></div><button>Post a brief +</button></div>
                    <div className="client-stats"><div><small>ACTIVE PROJECTS</small><strong>04</strong><span>2 on track</span></div><div><small>TALENT MATCHES</small><strong>18</strong><span>Ready to review</span></div><div><small>PROTECTED</small><strong>₹2.4L</strong><span>Across milestones</span></div></div>
                    <div className="client-project"><div className="project-progress"><span>BRAND IDENTITY · MISSION 04</span><strong>Northstar launch system</strong><div><i style={{ width: '72%' }} /></div><small>Milestone 3 of 4 · Delivery in 4 days</small></div><button>Open workspace →</button></div>
                    <div className="talent-strip"><span className="avatar purple">NS</span><div><small>YOUR PLUTO MATCH</small><strong>Nina Shah · Brand designer</strong></div><b>98% match</b></div>
                  </>
                )}
              </div>
            </div>
          </section>
          <div className="secure-chip"><span>✓</span><p><strong>Milestone protected</strong><small>₹24,000 safely funded</small></p></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Pluto commitments">
        <div className="shell"><span>NO PAID BIDS</span><i /> <span>100% OF YOUR QUOTE</span><i /> <span>VERIFIED CLIENTS</span><i /> <span>PROTECTED MILESTONES</span></div>
      </section>

      <section className="way-section shell" id="how">
        <div className="section-kicker"><span>01 / THE PLUTO WAY</span><p>Commitment without the toll booth.</p></div>
        <div className="way-intro"><h2>A better freelance<br />economy is <em>landing.</em></h2><p>Pluto replaces pay-to-play bidding with a fair system built around fit, funded milestones, and a reputation you actually earn.</p></div>
        <div className="steps-layout">
          <div className="step-tabs">
            {[
              ['01', 'Get matched, not buried', 'A small, relevant shortlist replaces hundreds of noisy proposals.'],
              ['02', 'Work inside clear milestones', 'Scope, timing, revisions, and acceptance live in one shared workspace.'],
              ['03', 'Keep your full quote', 'The client funds the work and pays Pluto’s transparent protection fee.'],
            ].map((step, index) => (
              <button key={step[0]} className={activeStep === index ? 'active' : ''} onClick={() => setActiveStep(index)}>
                <span>{step[0]}</span><div><strong>{step[1]}</strong><p>{step[2]}</p></div><b>{activeStep === index ? '−' : '+'}</b>
              </button>
            ))}
          </div>
          <div className={`step-visual visual-${activeStep}`}>
            <div className="visual-label">LIVE PRODUCT PREVIEW · 0{activeStep + 1}</div>
            {activeStep === 0 && <div className="match-stack"><div className="match-card back"><span>89%</span></div><div className="match-card middle"><span>94%</span></div><div className="match-card front"><div className="match-avatar">NS</div><span>98% MATCH</span><h3>Nina Shah</h3><p>Brand systems · Bengaluru</p><div className="skill-dots"><i /><i /><i /><small>12 verified projects</small></div></div></div>}
            {activeStep === 1 && <div className="milestone-board"><div className="board-top"><span>PROJECT NORTHSTAR</span><b>72% complete</b></div>{['Discovery & direction', 'Identity system', 'Launch toolkit', 'Final handoff'].map((item,index)=><div className="milestone-row" key={item}><span className={index < 2 ? 'done' : index === 2 ? 'current' : ''}>{index < 2 ? '✓' : index + 1}</span><div><strong>{item}</strong><small>{index < 2 ? 'Approved & paid' : index === 2 ? 'In review · 4 days left' : 'Starts Sep 12'}</small></div><b>{index === 2 ? '₹24,000' : index < 2 ? 'PAID' : '₹18,000'}</b></div>)}</div>}
            {activeStep === 2 && <div className="payout-visual"><span className="visual-orbit"/><div className="payout-total"><small>YOUR QUOTED PRICE</small><strong>₹50,000</strong><span>Arriving in your account</span></div><div className="payout-line"><i/><span>PLUTO TALENT FEE</span><b>₹0</b></div><div className="payout-badge">100% YOURS</div></div>}
          </div>
        </div>
      </section>

      <section className="opportunities-section" id="opportunities">
        <div className="shell">
          <div className="section-kicker light"><span>02 / OPEN MISSIONS</span><p>Curated, clear, ready to start.</p></div>
          <div className="jobs-heading"><h2>Work worth<br /><em>showing up for.</em></h2><div><p>Every brief is payment-verified before it reaches you.</p><span className="live-dot"><i /> 24 missions live now</span></div></div>
          <div className="category-filter" role="group" aria-label="Filter opportunities">
            {['All', 'Brand', 'Product', 'Motion', 'Development'].map((item) => <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}
          </div>
          <div className="jobs-list">
            {visibleJobs.map((job) => (
              <article className="job-row" key={job.id}>
                <div className={`company-tile ${job.color}`}><span>{job.company.split(' ')[0][0]}{job.company.split(' ')[1]?.[0] || ''}</span><small>{job.company}</small></div>
                <div className="job-title"><span>{job.category.toUpperCase()} · VERIFIED CLIENT</span><h3>{job.title}</h3><div>{job.skills.map(skill => <small key={skill}>{skill}</small>)}</div></div>
                <div className="job-numbers"><div><small>BUDGET</small><strong>{job.budget}</strong></div><div><small>TIMELINE</small><strong>{job.duration}</strong></div></div>
                <div className="job-actions"><span>{job.match}% match</span><button className={saved.includes(job.id) ? 'saved' : ''} aria-label={saved.includes(job.id) ? 'Remove saved job' : 'Save job'} onClick={() => setSaved(saved.includes(job.id) ? saved.filter(id => id !== job.id) : [...saved, job.id])}>{saved.includes(job.id) ? '♥' : '♡'}</button><button onClick={() => setSelectedJob(job)}>View mission →</button></div>
              </article>
            ))}
          </div>
          <button className="all-missions" onClick={() => notify('You’re viewing every live mission.')}>View all 24 missions <span>↗</span></button>
        </div>
      </section>

      <section className="protect-section shell" id="safety">
        <div className="section-kicker"><span>03 / PLUTO PROTECT</span><p>Confidence on both sides.</p></div>
        <div className="protect-grid">
          <div className="protect-copy"><h2>Work delivered.<br /><em>Payment, secured.</em></h2><p>Clients fund each milestone before work starts. Pluto releases it when the work is approved—or automatically after the review window.</p><ul><li><span>✓</span> Payment method verified before matching</li><li><span>✓</span> Scope and revisions agreed up front</li><li><span>✓</span> Evidence-based dispute assistance</li></ul><button className="dark-button" onClick={() => notify('Pluto Protect guide opened.')}>Explore Pluto Protect <span>→</span></button></div>
          <div className="fee-calculator">
            <div className="calc-top"><span>CLIENT FEE CALCULATOR</span><b>Transparent. Always.</b></div>
            <label htmlFor="budget">Project budget <strong>₹{budget.toLocaleString('en-IN')}</strong></label>
            <input id="budget" type="range" min="10000" max="200000" step="5000" value={budget} onChange={event => setBudget(Number(event.target.value))} style={{ '--progress': `${((budget - 10000) / 190000) * 100}%` } as React.CSSProperties} />
            <div className="range-labels"><span>₹10k</span><span>₹2L</span></div>
            <div className="receipt"><div><span>Freelancer receives</span><strong>₹{budget.toLocaleString('en-IN')}</strong></div><div><span>Pluto protection fee <small>7%</small></span><strong>₹{Math.round(budget * .07).toLocaleString('en-IN')}</strong></div><div className="receipt-total"><span>Client pays</span><strong>₹{Math.round(budget * 1.07).toLocaleString('en-IN')}</strong></div></div>
            <p><span>i</span> Payment processing and applicable taxes are shown separately at checkout.</p>
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="shell">
          <span className="quote-mark">“</span>
          <blockquote>Pluto treats freelancers like the <em>businesses</em> they are—not leads to be monetized.</blockquote>
          <div className="quote-person"><span>RS</span><p><strong>Rhea Sen</strong><small>Independent product designer · 6 Pluto missions</small></p><div>★★★★★</div></div>
        </div>
      </section>

      <section className="faq-section shell">
        <div><span>04 / QUESTIONS</span><h2>Before you<br /><em>take off.</em></h2><p>Clear answers are part of fair work.</p></div>
        <div className="faq-list">{faqs.map((faq,index)=><button key={faq[0]} className={openFaq === index ? 'open' : ''} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>0{index+1}</span><div><strong>{faq[0]}</strong>{openFaq === index && <p>{faq[1]}</p>}</div><b>{openFaq === index ? '−' : '+'}</b></button>)}</div>
      </section>

      <section className="final-cta">
        <div className="cta-orbit one"/><div className="cta-orbit two"/><div className="cta-planet">P</div>
        <div className="shell"><span>YOUR NEXT MISSION IS OUT THERE</span><h2>Ready to enter<br /><em>Pluto’s orbit?</em></h2><p>Join a marketplace where your skills open doors—not your wallet.</p><div><button onClick={() => notify('Welcome aboard! Your talent profile is ready to begin.')}>Join as talent <span>→</span></button><button onClick={() => { setView('client'); notify('Client workspace selected. Let’s build your brief.'); window.scrollTo({top:0,behavior:'smooth'}); }}>Hire on Pluto <span>↗</span></button></div></div>
      </section>

      <footer>
        <div className="shell footer-grid"><div><a className="brand footer-brand" href="#top"><span className="brand-mark"><span /></span>PLUTO</a><p>Fair work, in orbit.</p></div><div><span>PLATFORM</span><a href="#opportunities">Find work</a><a href="#top">Hire talent</a><a href="#safety">Pluto Protect</a></div><div><span>COMPANY</span><a href="#how">About</a><a href="#how">Manifesto</a><a href="#opportunities">Careers</a></div><div><span>FOLLOW</span><a href="#">LinkedIn ↗</a><a href="#">Instagram ↗</a><a href="#">X / Twitter ↗</a></div></div>
        <div className="shell footer-bottom"><span>© 2026 PLUTO MARKETPLACE</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Accessibility</a></div><span>MADE FOR INDEPENDENTS</span></div>
      </footer>

      {selectedJob && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedJob(null)}><section className="job-modal" role="dialog" aria-modal="true" aria-labelledby="mission-title" onMouseDown={event => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedJob(null)} aria-label="Close mission">×</button><span>{selectedJob.company} · {selectedJob.match}% MATCH</span><h2 id="mission-title">{selectedJob.title}</h2><p>We’re looking for a thoughtful independent specialist to shape a focused, high-quality launch. You’ll work directly with the founding team inside a clearly funded Pluto milestone.</p><div className="modal-details"><div><small>BUDGET</small><strong>{selectedJob.budget}</strong></div><div><small>TIMELINE</small><strong>{selectedJob.duration}</strong></div><div><small>PLUTO FEE</small><strong>₹0 for talent</strong></div></div><div className="modal-skills">{selectedJob.skills.map(skill => <span key={skill}>{skill}</span>)}</div><button className="primary modal-apply" onClick={() => {setSelectedJob(null);notify('Application started — no tokens required.')}}>Start application <span>→</span></button><small>No tokens. About 4 minutes.</small></section></div>}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
