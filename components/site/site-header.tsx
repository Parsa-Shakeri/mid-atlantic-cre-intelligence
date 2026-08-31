import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DesktopNav } from "@/components/site/desktop-nav";
import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/site/mobile-nav";
import { BRAND_COVERAGE, BRAND_NAME } from "@/lib/brand";

export function SiteHeader() {
  return <header className="sticky top-0 z-50 border-b border-navy/10 bg-paper/90 backdrop-blur-xl">
    <div className="bg-ink text-white"><Container className="flex h-8 items-center justify-between text-[9px] font-semibold uppercase tracking-[0.17em]"><p className="text-white/70">Independent commercial property research</p><p className="hidden text-white/65 sm:block">{BRAND_COVERAGE}</p></Container></div>
    <Container className="relative flex h-[74px] items-center justify-between gap-8">
      <Link aria-label={`${BRAND_NAME} home`} className="group flex items-center gap-3.5" href="/">
        <span className="relative grid size-11 place-items-center border border-navy/20 font-serif text-lg font-semibold tracking-[-0.06em] text-navy after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:bg-accent">CP</span>
        <span className="max-w-[210px] text-[13px] font-semibold leading-[1.08] tracking-[0.08em] text-navy">CAPITAL<br /><span className="font-normal text-slate">PARCEL</span></span>
      </Link>
      <DesktopNav />
      <div className="flex items-center gap-3"><Link className="hidden items-center gap-1.5 border-l border-line pl-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy hover:text-accent xl:flex" href="/comparables">Open explorer <ArrowUpRight aria-hidden="true" className="size-3.5" /></Link><MobileNav /></div>
    </Container>
  </header>;
}
