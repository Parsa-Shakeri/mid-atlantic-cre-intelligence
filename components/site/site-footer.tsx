import Link from "next/link";
import { Container } from "@/components/ui/container";
import { navItems } from "@/components/site/site-header";

export function SiteFooter() {
  return <footer className="border-t-4 border-accent bg-navy text-white">
    <Container className="grid gap-10 py-14 md:grid-cols-[1.45fr_0.8fr_0.8fr] lg:py-16">
      <div><div className="flex items-center gap-3"><span className="grid h-10 w-11 place-items-center border border-white/25 text-[9px] font-extrabold tracking-wider">MACRE</span><p className="text-sm font-extrabold tracking-[0.08em]">MID-ATLANTIC CRE INTELLIGENCE</p></div><p className="mt-5 max-w-lg text-sm leading-7 text-[#b9c5ce]">Independent, source-conscious commercial real estate research across Maryland, Washington, D.C., and Northern Virginia.</p><p className="mt-6 max-w-lg border-l-2 border-accent pl-4 text-xs leading-5 text-white/55">Independent student research. Not affiliated with a brokerage, investment firm, property owner, or data provider.</p></div>
      <div><p className="footer-title">Research desk</p><ul className="mt-5 grid gap-3 text-sm text-[#b9c5ce]">{navItems.slice(1, 4).map((item) => <li key={item.href}><Link className="transition-colors hover:text-white" href={item.href}>{item.label}</Link></li>)}</ul></div>
      <div><p className="footer-title">Standards</p><ul className="mt-5 grid gap-3 text-sm text-[#b9c5ce]"><li><Link className="transition-colors hover:text-white" href="/methodology">Methodology</Link></li><li><Link className="transition-colors hover:text-white" href="/about">About the project</Link></li><li><span>Educational use only</span></li><li><span>Not investment advice</span></li></ul></div>
    </Container>
    <div className="border-t border-white/10"><Container className="flex flex-col gap-2 py-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} Mid-Atlantic CRE Intelligence</p><p>Local data · documented limits · transparent methods</p></Container></div>
  </footer>;
}
