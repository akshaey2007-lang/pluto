'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

type Role = 'talent' | 'client';

const content = {
  talent: {
    eyebrow: 'TALENT ACCESS',
    title: 'Your work.\nYour workspace.',
    description: 'Return to curated opportunities, active milestones, messages, and protected payments.',
    points: ['No paid application tokens', 'Relevant, verified opportunities', 'Full visibility into every payout'],
    destination: '/talent',
    switchHref: '/login/client',
    switchLabel: 'Client login',
    fieldLabel: 'Work email',
  },
  client: {
    eyebrow: 'CLIENT ACCESS',
    title: 'Your brief.\nYour project team.',
    description: 'Return to active projects, curated talent matches, funded milestones, and approvals.',
    points: ['Verified independent professionals', 'Clear scopes and review windows', 'One transparent protection fee'],
    destination: '/client',
    switchHref: '/login/talent',
    switchLabel: 'Talent login',
    fieldLabel: 'Company email',
  },
};

export default function RoleLogin({ role }: { role: Role }) {
  const router = useRouter();
  const details = content[role];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;
    window.sessionStorage.setItem('pluto-demo-role', role);
    router.push(details.destination);
  };

  return (
    <main className={`login-page ${role}-login`}>
      <section className="login-shell">
        <div className="login-story">
          <Link className="login-logo" href="/" aria-label="Back to Pluto home"><span className="logo-crop"><img src="/pluto-logo-clean.png" alt="Pluto" /></span></Link>
          <div className="login-story-copy"><span>{details.eyebrow}</span><h1>{details.title.split('\n').map(line => <span key={line}>{line}</span>)}</h1><p>{details.description}</p><ul>{details.points.map(point => <li key={point}><i>✓</i>{point}</li>)}</ul></div>
          <div className="login-proof"><span>PLUTO PROTECT</span><p>Clear scope. Funded work. Visible release.</p></div>
        </div>
        <div className="login-panel">
          <div className="login-switch"><span>{role === 'talent' ? 'Hiring on Pluto?' : 'Working independently?'}</span><Link href={details.switchHref}>{details.switchLabel} ↗</Link></div>
          <form onSubmit={handleSubmit}>
            <span className="form-kicker">WELCOME BACK</span><h2>Sign in to your<br />{role} workspace.</h2><p>Use the account connected to your Pluto profile.</p>
            <label htmlFor={`${role}-email`}>{details.fieldLabel}</label><input id={`${role}-email`} type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder={role === 'talent' ? 'you@portfolio.com' : 'you@company.com'} autoComplete="email" required />
            <div className="password-label"><label htmlFor={`${role}-password`}>Password</label><a href="#">Forgot password?</a></div><input id={`${role}-password`} type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter password" autoComplete="current-password" required />
            <label className="remember-row"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /><span>Keep me signed in on this device</span></label>
            <button type="submit">Continue as {role} <span>→</span></button>
            <div className="demo-notice"><i>i</i><p><strong>Portfolio preview</strong>Use any email and password. No login details are stored.</p></div>
          </form>
          <Link className="login-back" href="/">← Back to Pluto</Link>
        </div>
      </section>
    </main>
  );
}
