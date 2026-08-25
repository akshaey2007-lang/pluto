'use client';

import Link from 'next/link';
import { useState } from 'react';
import WorkspaceHeader from '../components/WorkspaceHeader';

const candidates = [
  { initials:'NS', name:'Nina Shah', role:'Brand designer', match:98, projects:12 },
  { initials:'RM', name:'Rohan Mehta', role:'Creative director', match:95, projects:18 },
  { initials:'IC', name:'Ira Chawla', role:'Identity designer', match:92, projects:9 },
];

export default function ClientWorkspacePage() {
  const [shortlisted, setShortlisted] = useState<string[]>(['Nina Shah']);
  return (
    <main className="workspace-page client-workspace">
      <WorkspaceHeader role="client" />
      <div className="workspace-shell">
        <section className="workspace-welcome"><div><span>CLIENT WORKSPACE / MONDAY, 25 AUG</span><h1>Good morning, Pluto Labs.</h1><p>Your projects, talent shortlist, and funded milestones are in one place.</p></div><Link href="/hire">Create new brief <span>+</span></Link></section>
        <section className="workspace-stats"><article><small>ACTIVE PROJECTS</small><strong>04</strong><span>3 on track</span></article><article><small>TALENT MATCHES</small><strong>18</strong><span>Ready to review</span></article><article><small>FUNDS PROTECTED</small><strong>₹2.4L</strong><span>Across 7 milestones</span></article><article><small>PENDING REVIEWS</small><strong>02</strong><span>Due this week</span></article></section>
        <section className="workspace-grid client-grid">
          <div className="dashboard-panel" id="projects"><div className="panel-heading"><div><span>ACTIVE PROJECTS</span><h2>Work in progress.</h2></div><Link href="/hire">New brief +</Link></div><div className="client-project-list"><article><div><small>PROJECT 04 · BRAND IDENTITY</small><h3>Northstar launch system</h3><span>Nina Shah · Delivery in 4 days</span></div><strong>72%</strong><div className="client-progress"><i style={{width:'72%'}}/></div><b>Milestone 3 of 4 · ₹24,000 protected</b><button>Review workspace →</button></article><article><div><small>PROJECT 07 · PRODUCT DESIGN</small><h3>Mend clinician dashboard</h3><span>Arun Rao · Discovery approved</span></div><strong>34%</strong><div className="client-progress"><i style={{width:'34%'}}/></div><b>Milestone 1 of 3 · ₹36,000 protected</b><button>Open workspace →</button></article></div></div>
          <aside className="dashboard-panel client-funds"><div className="panel-heading"><div><span>PROTECTED FUNDS</span><h2>₹2,40,000</h2></div></div><div className="fund-chart"><i style={{height:'64%'}}/><i style={{height:'82%'}}/><i style={{height:'45%'}}/><i style={{height:'92%'}}/><i style={{height:'70%'}}/><i style={{height:'55%'}}/></div><div className="fund-legend"><span><i/>Funded</span><span><i/>Released</span></div><p>Seven milestones across four active projects.</p><Link href="/protect">View protection details →</Link></aside>
        </section>
        <section className="dashboard-panel talent-review"><div className="panel-heading"><div><span>CURATED FOR PROJECT 09</span><h2>Brand talent shortlist.</h2></div><span>3 of 8 reviewed</span></div><div className="candidate-grid">{candidates.map(candidate => <article key={candidate.name}><span>{candidate.initials}</span><small>{candidate.match}% MATCH</small><h3>{candidate.name}</h3><p>{candidate.role} · {candidate.projects} verified projects</p><button className={shortlisted.includes(candidate.name) ? 'selected' : ''} onClick={() => setShortlisted(shortlisted.includes(candidate.name) ? shortlisted.filter(name => name !== candidate.name) : [...shortlisted, candidate.name])}>{shortlisted.includes(candidate.name) ? '✓ Shortlisted' : '+ Add to shortlist'}</button></article>)}</div></section>
      </div>
    </main>
  );
}
