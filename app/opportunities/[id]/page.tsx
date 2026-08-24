import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { jobs } from '../../lib/data';

export function generateStaticParams() {
  return jobs.map(job => ({ id: String(job.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = jobs.find(item => item.id === Number(id));
  if (!job) return {};
  const description = `${job.company} is hiring through Pluto: ${job.summary}`;
  return {
    title: `${job.title} — Pluto`,
    description,
    openGraph: { title: `${job.title} — Pluto`, description, images: [] },
    twitter: { title: `${job.title} — Pluto`, description, images: [] },
  };
}

export default async function OpportunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.find(item => item.id === Number(id));
  if (!job) notFound();

  return (
    <main className="detail-page">
      <SiteHeader />
      <section className="detail-hero shell">
        <Link className="back-link" href="/opportunities">← All opportunities</Link>
        <div className="detail-title"><div><span>{job.category.toUpperCase()} · VERIFIED CLIENT</span><h1>{job.title}</h1><p>{job.summary}</p></div><div className={`detail-company ${job.color}`}><span>{job.company.slice(0,2)}</span><strong>{job.company}</strong><small>Payment verified</small></div></div>
        <div className="detail-facts"><div><small>BUDGET</small><strong>{job.budget}</strong></div><div><small>ENGAGEMENT</small><strong>{job.duration}</strong></div><div><small>MATCH</small><strong>{job.match}%</strong></div><div><small>TALENT FEE</small><strong>₹0</strong></div></div>
      </section>
      <section className="detail-body shell">
        <article><span>THE BRIEF</span><h2>Focused work with<br />clear expectations.</h2><p>{job.summary} You will collaborate directly with the decision-making team, receive consolidated feedback, and work through funded milestones.</p><h3>What you will deliver</h3><ul>{job.deliverables.map(item => <li key={item}><span>✓</span>{item}</li>)}</ul><h3>Skills that matter</h3><div className="detail-skills">{job.skills.map(skill => <span key={skill}>{skill}</span>)}</div></article>
        <aside className="apply-panel"><span>READY TO APPLY?</span><h3>Start with your approach, not a token.</h3><p>The client sees a small, relevant shortlist. Tell them how you would begin.</p><button>Start application <span>→</span></button><small>No application fee · About 4 minutes</small><div><i /> Funded milestone required before work</div></aside>
      </section>
      <SiteFooter />
    </main>
  );
}
