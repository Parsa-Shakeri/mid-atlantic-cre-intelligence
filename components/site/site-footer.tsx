import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { navItems } from "@/lib/navigation";
import { BRAND_NAME } from "@/lib/brand";

export function SiteFooter() {
  return <footer className="border-t-2 border-copper bg-ink text-white">
    <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_0.75fr_0.75fr] lg:py-20">
      <div><div className="flex items-center gap-3"><span className="relative grid size-11 place-items-center border border-white/22 font-serif text-lg font-semibold tracking-[-0.06em] after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:bg-copper">CP</span><p className="text-xs font-semibold tracking-[0.09em]">CAPITAL<br /><span className="font-normal text-white/68">PARCEL</span></p></div><p className="mt-7 max-w-xl font-serif text-3xl font-normal leading-tight text-white/92">Public records, made useful.</p><p className="mt-7 max-w-lg border-l border-copper pl-4 text-xs leading-6 text-white/68">Independent student research founded by Parsa Shakeri. Selective coverage; not affiliated with an industry firm. Educational research only—not investment advice.</p></div>
      <div><p className="footer-title">Research tools</p><ul className="mt-6 grid gap-3 text-sm text-white/70">{navItems.slice(1, 5).map((item) => <li key={item.href}><Link className="inline-flex min-h-7 items-center gap-1.5 transition-colors hover:text-white" href={item.href}>{item.label}<ArrowUpRight aria-hidden="true" className="size-3" /></Link></li>)}</ul></div>
      <div><p className="footer-title">Project</p><ul className="mt-6 grid gap-3 text-sm text-white/70"><li><Link className="inline-flex min-h-7 items-center transition-colors hover:text-white" href="/project">Project case study</Link></li><li><Link className="inline-flex min-h-7 items-center transition-colors hover:text-white" href="/coverage">Data coverage</Link></li><li><Link className="inline-flex min-h-7 items-center transition-colors hover:text-white" href="/changelog">Public changelog</Link></li><li><Link className="inline-flex min-h-7 items-center transition-colors hover:text-white" href="/corrections">Corrections & feedback</Link></li><li><Link className="inline-flex min-h-7 items-center transition-colors hover:text-white" href="/methodology">Methodology</Link></li><li><Link className="inline-flex min-h-7 items-center transition-colors hover:text-white" href="/about">About the project</Link></li><li><a className="inline-flex min-h-7 items-center transition-colors hover:text-white" href="/feed.xml">Research RSS</a></li></ul></div>
    </Container>
    <div className="border-t border-white/10"><Container className="flex flex-col gap-2 py-5 font-mono text-[9px] uppercase tracking-[0.13em] text-white/62 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} {BRAND_NAME}</p><p>Selected data · documented limits · transparent methods</p></Container></div>
  </footer>;
}
