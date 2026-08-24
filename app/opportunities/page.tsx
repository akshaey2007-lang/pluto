'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { categories, jobs } from '../lib/data';

export default function OpportunitiesPage() {
  const [category, setCategory] = useState('All');
  const [saved, setSaved] = useState<number[]>([2]);
  const visibleJobs = useMemo(() => category === 'All' ? jobs : jobs.filter(job => job.category === category), [category]);

  return (
    <main className="light-page">
      <SiteHeader />
      <section className="page-hero shell opportunity-hero">
        <div><span className="page-kicker">VERIFIED OPPORTUNITIES / 24 LIVE</span><h1>Find work worth<br /><em>showing up for.</em></h1></div>
        <div className="page-hero-aside"><p>Every project is reviewed for scope, budget, and client payment readiness before it reaches the marketplace.</p><div className="live-pill"><i /> Updated today</div></div>
      </section>
      <section className="marketplace shell">
        <div className="market-toolbar"><div className="category-filter" role="group" aria-label="Filter opportunities">{categories.map(item => <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><span>{visibleJobs.length} curated matches</span></div>
        <div className="jobs-list page-jobs">{visibleJobs.map(job => <article className="job-row" key={job.id}>
          <div className={`company-tile ${job.color}`}><span>{job.company.slice(0,2)}</span><small>{job.company}</small></div>
          <div className="job-title"><span>{job.category.toUpperCase()} · VERIFIED CLIENT</span><h3>{job.title}</h3><div>{job.skills.map(skill => <small key={skill}>{skill}</small>)}</div></div>
          <div className="job-numbers"><div><small>BUDGET</small><strong>{job.budget}</strong></div><div><small>TIMELINE</small><strong>{job.duration}</strong></div></div>
          <div className="job-actions"><span>{job.match}% match</span><button className={saved.includes(job.id) ? 'saved' : ''} aria-label={saved.includes(job.id) ? 'Remove saved project' : 'Save project'} onClick={() => setSaved(saved.includes(job.id) ? saved.filter(id => id !== job.id) : [...saved, job.id])}>{saved.includes(job.id) ? '♥' : '♡'}</button><Link href={`/opportunities/${job.id}`}>View project →</Link></div>
        </article>)}</div>
      </section>
      <section className="application-note"><div className="shell"><span>NO TOKENS. NO BIDDING WAR.</span><h2>Your work earns attention.<br />Your wallet does not.</h2><Link href="/how-it-works">Understand matching →</Link></div></section>
      <SiteFooter />
    </main>
  );
}
