'use client';

import Link from 'next/link';
import { useState } from 'react';
import WorkspaceHeader from '../components/WorkspaceHeader';
import { jobs } from '../lib/data';

export default function TalentWorkspacePage() {
  const [saved, setSaved] = useState<number[]>([2]);
  return (
    <main className="workspace-page talent-workspace">
      <WorkspaceHeader role="talent" />
      <div className="workspace-shell">
        <section className="workspace-welcome"><div><span>TALENT WORKSPACE / MONDAY, 25 AUG</span><h1>Good morning, Akshaey.</h1><p>Your strongest matches and active project updates are ready.</p></div><Link href="/opportunities">Browse all opportunities <span>→</span></Link></section>
        <section className="workspace-stats"><article><small>NEW MATCHES</small><strong>12</strong><span>4 above 90%</span></article><article><small>ACTIVE PROJECTS</small><strong>02</strong><span>Both on track</span></article><article><small>PROTECTED FUNDS</small><strong>₹74k</strong><span>Across 3 milestones</span></article><article><small>PROFILE STRENGTH</small><strong>92%</strong><span>Excellent visibility</span></article></section>
        <section className="workspace-grid">
          <div className="dashboard-panel matches-panel"><div className="panel-heading"><div><span>RECOMMENDED FOR YOU</span><h2>Fresh opportunities.</h2></div><Link href="/opportunities">View all ↗</Link></div><div className="dashboard-job-list">{jobs.slice(0,3).map(job => <article key={job.id}><div className={`dashboard-company ${job.color}`}>{job.company.slice(0,2)}</div><div><small>{job.company} · {job.category}</small><h3>{job.title}</h3><span>{job.budget} · {job.duration}</span></div><div className="dashboard-match"><strong>{job.match}%</strong><small>MATCH</small></div><button className={saved.includes(job.id) ? 'saved' : ''} onClick={() => setSaved(saved.includes(job.id) ? saved.filter(id => id !== job.id) : [...saved, job.id])} aria-label="Save project">{saved.includes(job.id) ? '♥' : '♡'}</button><Link href={`/opportunities/${job.id}`}>View →</Link></article>)}</div></div>
          <aside className="dashboard-panel activity-panel"><div className="panel-heading"><div><span>ACTIVE MILESTONE</span><h2>Northstar launch</h2></div></div><div className="milestone-ring"><strong>72%</strong><span>COMPLETE</span></div><div className="milestone-details"><div><span>Current stage</span><strong>Launch toolkit</strong></div><div><span>Due date</span><strong>29 Aug</strong></div><div><span>Protected</span><strong>₹24,000</strong></div></div><button>Open project <span>→</span></button></aside>
        </section>
        <section className="workspace-lower" id="projects"><div className="dashboard-panel project-tracker"><div className="panel-heading"><div><span>PROJECT TRACKER</span><h2>Two collaborations in motion.</h2></div></div><div className="tracker-row"><span className="tracker-status active"/><div><small>NORTHSTAR · BRAND SYSTEM</small><strong>Launch toolkit in review</strong></div><span>72%</span><b>₹24,000 protected</b></div><div className="tracker-row"><span className="tracker-status"/><div><small>FLOE LABS · STRATEGY</small><strong>Discovery begins tomorrow</strong></div><span>10%</span><b>₹50,000 protected</b></div></div><aside className="dashboard-panel payout-card" id="payments"><span>NEXT PAYOUT</span><strong>₹24,000</strong><p>Releases after Northstar approves the current milestone.</p><div><i/>Review window ends in 3 days</div></aside></section>
      </div>
    </main>
  );
}
