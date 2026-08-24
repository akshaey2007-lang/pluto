import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer>
      <div className="shell footer-grid">
        <div><Link className="brand footer-brand" href="/"><span className="logo-crop footer-logo"><img src="/pluto-logo-clean.png" alt="Pluto" /></span></Link><p>Independent work, built on trust.</p></div>
        <div><span>PLATFORM</span><Link href="/opportunities">Find work</Link><Link href="/hire">Hire talent</Link><Link href="/protect">Pluto Protect</Link></div>
        <div><span>LEARN</span><Link href="/how-it-works">How it works</Link><Link href="/how-it-works#fees">Fair fees</Link><Link href="/protect#questions">Questions</Link></div>
        <div><span>FOLLOW</span><a href="#">LinkedIn ↗</a><a href="#">Instagram ↗</a><a href="#">X / Twitter ↗</a></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 PLUTO MARKETPLACE</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Accessibility</a></div><span>MADE FOR INDEPENDENTS</span></div>
    </footer>
  );
}
