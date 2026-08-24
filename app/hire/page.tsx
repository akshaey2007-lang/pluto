'use client';

import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const projectTypes = ['Brand identity', 'Product design', 'Web development', 'Motion & video'];
const timelines = ['2–3 weeks', '4–6 weeks', '2–3 months'];

export default function HirePage() {
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [timeline, setTimeline] = useState(timelines[1]);
  const [budget, setBudget] = useState(80000);
  const [submitted, setSubmitted] = useState(false);
  const fee = Math.round(budget * .07);

  return (
    <main className="hire-page">
      <SiteHeader />
      <section className="hire-layout shell">
        <div className="hire-intro"><span className="page-kicker">HIRE ON PLUTO</span><h1>A better project starts<br /><em>with a clear brief.</em></h1><p>Tell Pluto what you are building. We will help shape the scope and prepare a small, relevant talent shortlist.</p><div className="hire-proof"><div><strong>48h</strong><span>typical first shortlist</span></div><div><strong>4.9/5</strong><span>client collaboration rating</span></div></div></div>
        <section className="brief-builder">
          {submitted ? <div className="brief-success"><span>✓</span><small>BRIEF READY</small><h2>Your project has a clear starting point.</h2><p>Pluto would now verify the details and begin matching relevant professionals.</p><button onClick={() => setSubmitted(false)}>Edit brief</button></div> : <>
            <div className="builder-top"><span>PROJECT BRIEF</span><b>01 / BASICS</b></div>
            <fieldset><legend>What are you building?</legend><div className="choice-grid">{projectTypes.map(item => <button className={projectType === item ? 'active' : ''} onClick={() => setProjectType(item)} key={item}>{item}<span>{projectType === item ? '✓' : '+'}</span></button>)}</div></fieldset>
            <fieldset><legend>What is your ideal timeline?</legend><div className="timeline-options">{timelines.map(item => <button className={timeline === item ? 'active' : ''} onClick={() => setTimeline(item)} key={item}>{item}</button>)}</div></fieldset>
            <label className="brief-budget" htmlFor="hire-budget"><span>Working budget</span><strong>₹{budget.toLocaleString('en-IN')}</strong></label><input id="hire-budget" className="hire-range" type="range" min="25000" max="300000" step="5000" value={budget} onChange={event => setBudget(Number(event.target.value))} style={{ '--progress': `${((budget - 25000) / 275000) * 100}%` } as React.CSSProperties}/>
            <div className="brief-summary"><div><small>PROJECT</small><strong>{projectType}</strong></div><div><small>TIMELINE</small><strong>{timeline}</strong></div><div><small>EST. TOTAL</small><strong>₹{(budget + fee).toLocaleString('en-IN')}</strong></div></div>
            <button className="brief-submit" onClick={() => setSubmitted(true)}>Prepare my brief <span>→</span></button><p className="builder-note">No charge today. The total includes Pluto’s 7% protection fee.</p>
          </>}
        </section>
      </section>
      <section className="hire-steps"><div className="shell"><span>WHAT HAPPENS NEXT</span><div>{[['01','Brief review','Pluto checks clarity, budget, and realistic timing.'],['02','Curated shortlist','You meet a small set of relevant, available professionals.'],['03','Fund and begin','Fund the first milestone only after choosing your collaborator.']].map(item => <article key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div></div></section>
      <SiteFooter />
    </main>
  );
}
