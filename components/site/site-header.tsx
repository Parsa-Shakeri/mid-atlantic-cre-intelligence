import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
  return <header className="sticky top-0 z-50 border-b border-navy/10 bg-paper/90 backdrop-blur-xl">
    <div className="bg-ink text-white"><Container className="flex h-8 items-center justify-between text-[9px] font-semibold uppercase tracking-[0.17em]"><p className="text-white/64">Independent student research platform</p><p className="hidden text-white/40 sm:block">Maryland · Washington, D.C. · Northern Virginia</p></Container></div>
    <Container className="relative flex h-[74px] items-center justify-between gap-8">
      <Link aria-label="Mid-Atlantic CRE Intelligence home" className="group flex items-center gap-3.5" href="/">
        <span className="relative grid size-11 place-items-center border border-navy/20 font-serif text-2xl font-medium text-navy after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:bg-accent">M</span>
        <span className="max-w-[210px] text-[12px] font-semibold leading-[1.16] tracking-[0.07em] text-navy">MID-ATLANTIC<br /><span className="font-normal text-slate">CRE INTELLIGENCE</span></span>
      </Link>
      <nav aria-label="Primary navigation" className="hidden md:block"><ul className="flex items-center gap-5 lg:gap-7">{navItems.map((item) => <li key={item.href}><Link className="nav-link" href={item.href}>{item.label}</Link></li>)}</ul></nav>
      <div className="flex items-center gap-3"><Link className="hidden items-center gap-1.5 border-l border-line pl-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy hover:text-accent lg:flex" href="/research">Latest brief <ArrowUpRight aria-hidden="true" className="size-3.5" /></Link><MobileNav /></div>
    </Container>
  </header>;
}
