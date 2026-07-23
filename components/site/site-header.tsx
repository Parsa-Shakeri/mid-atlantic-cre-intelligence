import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/site/mobile-nav";

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Property Database" },
  { href: "/research", label: "Research" },
  { href: "/dashboard", label: "Market Dashboard" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return <header className="sticky top-0 z-50 border-b border-line bg-paper/95 shadow-[0_3px_18px_rgba(11,34,57,0.06)] backdrop-blur">
    <div className="bg-navy text-white"><Container className="flex h-8 items-center justify-between text-[9px] font-bold uppercase tracking-[0.15em]"><p className="text-white/75">Independent student research platform</p><p className="hidden text-white/55 sm:block">Maryland · Washington, D.C. · Northern Virginia</p></Container></div>
    <Container className="relative flex h-[78px] items-center justify-between gap-8">
      <Link aria-label="Mid-Atlantic CRE Intelligence home" className="group flex items-center gap-3.5" href="/">
        <span className="relative grid h-11 w-12 place-items-center bg-navy text-[10px] font-extrabold tracking-[0.1em] text-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-accent">MACRE</span>
        <span className="max-w-[210px] text-[13px] font-extrabold leading-[1.12] tracking-[0.055em] text-navy">MID-ATLANTIC<br /><span className="font-semibold text-slate">CRE INTELLIGENCE</span></span>
      </Link>
      <nav aria-label="Primary navigation" className="hidden md:block"><ul className="flex items-center gap-5 lg:gap-7">{navItems.map((item) => <li key={item.href}><Link className="nav-link" href={item.href}>{item.label}</Link></li>)}</ul></nav>
      <MobileNav />
    </Container>
  </header>;
}
