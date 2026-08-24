'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { jobs } from './lib/data';

const recommendations = [
  { title: 'Brand system for an AI studio', budget: '₹48k', match: '96%', tag: 'Brand' },
  { title: 'Fintech dashboard redesign', budget: '₹72k', match: '92%', tag: 'Product' },
  { title: 'Motion launch campaign', budget: '₹36k', match: '88%', tag: 'Motion' },
];

export default function Home() {
  const [view, setView] = useState<'talent' | 'client'>('talent');

  return (
    <main>
      <SiteHeader />
      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><i /> A FAIRER FREELANCE MARKETPLACE</div>
          <h1>Independent work,<br /><em>built on</em> <span>trust.</span></h1>
          <p className="hero-intro">Verified clients, relevant opportunities, protected milestones, and no paid tokens just to apply.</p>
          <div className="hero-actions">
            <Link className="primary link-button" href="/opportunities">Find verified work <span>→</span></Link>
            <Link className="text-button link-button" href="/how-it-works">See how Pluto works <span className="play">→</span></Link>
          </div>
          <div className="proof-row"><div className="faces" aria-hidden="true"><span>AR</span><span>MK</span><span>JL</span></div><p><strong>1,240+ professionals</strong><br />in the verified network</p></div>
        </div>

        <div className="orbit-stage" aria-label="Interactive Pluto marketplace preview">
          <section className="app-window">
            <div className="app-topbar">
              <div className="mini-brand"><span className="logo-crop small"><img src="/pluto-logo-clean.png" alt="Pluto" /></span></div>
              <div className="window-tabs"><button className={view === 'talent' ? 'active' : ''} onClick={() => setView('talent')}>Talent view</button><button className={view === 'client' ? 'active' : ''} onClick={() => setView('client')}>Client view</button></div>
              <span className="avatar">AK</span>
            </div>
            <div className="app-body">
              <aside><span className="side-label">WORKSPACE</span><button className="selected">⌁ <span>{view === 'talent' ? 'Discover' : 'Overview'}</span></button><button>◫ <span>Projects</span></button><button>◌ <span>Messages</span><b>3</b></button><button>◇ <span>Payments</span></button><div className="side-footer"><i /> All systems clear</div></aside>
              <div className="app-content">
                {view === 'talent' ? <>
                  <div className="app-heading"><div><span>GOOD MORNING, AKSHAEY</span><h2>Recommended opportunities.</h2></div><button>Filters <b>2</b></button></div>
                  <div className="match-banner"><span>✦</span><div><strong>Fresh matches are ready</strong><small>Curated from your skills and availability</small></div><b>12</b></div>
                  <div className="project-list">{recommendations.map((item, index) => <article key={item.title} className={index === 0 ? 'featured' : ''}><span className="project-icon">{item.tag[0]}</span><div className="project-main"><small>{item.tag} · Posted today</small><strong>{item.title}</strong><span>Fixed price · 2–3 weeks</span></div><div className="project-meta"><b>{item.budget}</b><span>{item.match} match</span></div></article>)}</div>
                </> : <>
                  <div className="app-heading"><div><span>CLIENT WORKSPACE</span><h2>Build your project team.</h2></div><button>Post a brief +</button></div>
                  <div className="client-stats"><div><small>ACTIVE PROJECTS</small><strong>04</strong><span>2 on track</span></div><div><small>TALENT MATCHES</small><strong>18</strong><span>Ready to review</span></div><div><small>PROTECTED</small><strong>₹2.4L</strong><span>Across milestones</span></div></div>
                  <div className="client-project"><div className="project-progress"><span>BRAND IDENTITY · PROJECT 04</span><strong>Northstar launch system</strong><div><i style={{ width: '72%' }} /></div><small>Milestone 3 of 4 · Delivery in 4 days</small></div><button>Open workspace →</button></div>
                  <div className="talent-strip"><span className="avatar purple">NS</span><div><small>YOUR PLUTO MATCH</small><strong>Nina Shah · Brand designer</strong></div><b>98% match</b></div>
                </>}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="trust-strip"><div className="shell"><span>NO APPLICATION FEES</span><i /><span>FREELANCERS KEEP 100%</span><i /><span>VERIFIED CLIENTS</span><i /><span>FUNDED MILESTONES</span></div></section>

      <section className="route-section shell">
        <div className="route-heading"><span>EXPLORE PLUTO</span><h2>One platform.<br /><em>Clear paths.</em></h2><p>Every part of the experience has a focused home—whether you are finding work, hiring talent, or reviewing payment protection.</p></div>
        <div className="route-grid">
          <Link href="/opportunities"><span>01</span><small>FOR TALENT</small><h3>Find verified work</h3><p>Browse relevant, funded opportunities without buying application tokens.</p><b>Explore opportunities →</b></Link>
          <Link href="/hire"><span>02</span><small>FOR CLIENTS</small><h3>Build your project team</h3><p>Create a clear brief, understand your fee, and meet matched professionals.</p><b>Start a brief →</b></Link>
          <Link href="/protect"><span>03</span><small>FOR BOTH SIDES</small><h3>Understand protection</h3><p>See exactly how funding, review windows, disputes, and releases work.</p><b>View Pluto Protect →</b></Link>
        </div>
      </section>

      <section className="home-opportunities">
        <div className="shell">
          <div className="home-section-head"><div><span>FEATURED THIS WEEK</span><h2>Clear projects,<br /><em>ready to begin.</em></h2></div><Link href="/opportunities">View every opportunity ↗</Link></div>
          <div className="home-job-grid">{jobs.slice(0, 3).map(job => <Link href={`/opportunities/${job.id}`} key={job.id}><div className={`company-tile ${job.color}`}><span>{job.company.slice(0,2)}</span><small>{job.company}</small></div><small>{job.category} · {job.match}% MATCH</small><h3>{job.title}</h3><div><span>{job.budget}</span><span>{job.duration}</span></div><b>View project →</b></Link>)}</div>
        </div>
      </section>

      <section className="final-cta"><div className="cta-orbit one"/><div className="cta-orbit two"/><div className="cta-planet">P</div><div className="shell"><span>START WITH CLEAR TERMS</span><h2>Better work begins<br /><em>with trust.</em></h2><p>Choose your path and enter a professional marketplace built for focused collaboration.</p><div><Link href="/opportunities">Join as talent <span>→</span></Link><Link href="/hire">Hire on Pluto <span>↗</span></Link></div></div></section>
      <SiteFooter />
    </main>
  );
}
