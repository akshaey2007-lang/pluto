'use client';

import Link from 'next/link';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { jobs } from './lib/data';

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><i /> A FAIRER FREELANCE MARKETPLACE</div>
          <h1>Independent work,<br /><em>built on</em> <span>trust.</span></h1>
          <p className="hero-intro">Verified clients, relevant opportunities, protected milestones, and no paid tokens just to apply.</p>
          <div className="hero-actions">
            <Link className="primary link-button" href="/login/talent">Talent login <span>→</span></Link>
            <Link className="text-button link-button" href="/login/client">Client login <span className="play">↗</span></Link>
          </div>
          <div className="proof-row"><div className="faces" aria-hidden="true"><span>AR</span><span>MK</span><span>JL</span></div><p><strong>1,240+ professionals</strong><br />in the verified network</p></div>
        </div>

        <div className="orbit-stage access-stage" aria-label="Choose a Pluto workspace">
          <section className="access-window">
            <div className="access-topbar"><span className="logo-crop small"><img src="/pluto-logo-clean.png" alt="Pluto" /></span><small>SELECT YOUR WORKSPACE</small><i /></div>
            <div className="access-intro"><span>WELCOME BACK</span><h2>Where are you<br />heading today?</h2><p>Talent and clients use dedicated, role-specific workspaces.</p></div>
            <div className="access-options">
              <Link className="talent-access" href="/login/talent"><span className="access-icon">T</span><small>FOR INDEPENDENTS</small><h3>Talent login</h3><p>Discover work, manage milestones, and track protected payments.</p><b>Enter talent workspace →</b></Link>
              <Link className="client-access" href="/login/client"><span className="access-icon">C</span><small>FOR TEAMS</small><h3>Client login</h3><p>Post clear briefs, review matches, and manage funded projects.</p><b>Enter client workspace ↗</b></Link>
            </div>
            <div className="access-footer"><i /> Separate access. One protected workflow.</div>
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

      <section className="final-cta"><div className="cta-orbit one"/><div className="cta-orbit two"/><div className="cta-planet">P</div><div className="shell"><span>CHOOSE YOUR WORKSPACE</span><h2>One marketplace.<br /><em>Two clear paths.</em></h2><p>Enter the workspace designed for your side of the collaboration.</p><div><Link href="/login/talent">Talent login <span>→</span></Link><Link href="/login/client">Client login <span>↗</span></Link></div></div></section>
      <SiteFooter />
    </main>
  );
}
