import { ArrowUpRight, Mail, Rss } from "lucide-react";
import { safePublicUrl } from "@/lib/public-profile";

export function ResearchUpdatesCta({ compact = false }: { compact?: boolean }) {
  const newsletterUrl = safePublicUrl(process.env.NEXT_PUBLIC_NEWSLETTER_URL);
  return <aside className={`${compact ? "border border-line bg-mist/55 p-5" : "relative overflow-hidden bg-ink p-7 text-white sm:p-10"}`} aria-labelledby={compact ? undefined : "research-updates-title"}>
    <div className={compact ? "" : "relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"}>
      <div><p className={compact ? "eyebrow" : "text-[10px] font-bold uppercase tracking-[0.18em] text-copper"}>Research updates</p><h2 className={`${compact ? "mt-3 font-serif text-2xl font-semibold text-navy" : "mt-4 max-w-2xl font-serif text-4xl font-semibold"}`} id={compact ? undefined : "research-updates-title"}>New records, one useful chart, and the limits that matter.</h2><p className={`${compact ? "mt-3 text-xs leading-5 text-slate" : "mt-5 max-w-2xl text-sm leading-7 text-white/68"}`}>Follow Capital Parcel for concise updates to the transaction record and original Capital Region research.</p></div>
      <div className={`${compact ? "mt-5 grid gap-2" : "flex flex-col gap-3 sm:flex-row"}`}>{newsletterUrl ? <a className={compact ? "button-primary min-h-10 gap-2 px-4 py-2 text-xs" : "hero-primary-action"} href={newsletterUrl} rel="noreferrer" target="_blank"><Mail aria-hidden="true" className="size-4" /> Subscribe to updates <ArrowUpRight aria-hidden="true" className="size-3.5" /></a> : null}<a className={compact ? "button-secondary min-h-10 gap-2 px-4 py-2 text-xs" : "hero-secondary-action"} href="/feed.xml"><Rss aria-hidden="true" className="size-4" /> RSS feed</a></div>
    </div>
  </aside>;
}

