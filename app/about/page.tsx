import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CodeXml, UserRound } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { safePublicUrl } from "@/lib/public-profile";

export const metadata: Metadata = { title: "About", description: "About Capital Parcel, the independent student research project making selected Capital Region property records easier to inspect.", alternates: { canonical: "/about" } };

const responsibilities = [
  ["Research", "Public-source collection, reconciliation, source notes, verification criteria, and explicit limitations."],
  ["Data", "Relational schema design, validation, calculated fields, quality queues, filtering, and aggregate analysis."],
  ["Product", "Information architecture, institutional visual design, responsive interfaces, accessibility, and editorial workflow."],
  ["Engineering", "Next.js, TypeScript, PostgreSQL, Supabase authentication and policies, testing, deployment, and monitoring."],
];

export default function AboutPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const founderName = process.env.NEXT_PUBLIC_FOUNDER_NAME?.trim() || "Parsa Shakeri";
  const founderRole = process.env.NEXT_PUBLIC_FOUNDER_ROLE?.trim() || "Student";
  const githubUrl = safePublicUrl(process.env.NEXT_PUBLIC_GITHUB_URL);

  return <>
    <PageHero eyebrow="About the project" title="Independent research, built in public." description="A student-led platform for organizing local commercial real estate evidence and explaining what the data can—and cannot—support." disclosure="The platform publishes no confidential or proprietary internship information and is not affiliated with an industry firm." />
    <Container className="py-16 lg:py-24">
      <section className="grid gap-8 border-b border-line pb-16 lg:grid-cols-[0.62fr_1fr] lg:gap-16" aria-labelledby="founder-title">
        <div className="overflow-hidden bg-navy text-white shadow-[0_20px_50px_rgba(11,34,57,0.16)]"><div className="grid min-h-64 place-items-center border-b border-white/15 bg-ink"><div className="grid size-28 place-items-center border border-white/20"><UserRound aria-hidden="true" className="size-10 text-copper" strokeWidth={1.2} /></div></div><div className="p-7"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-copper">Founder profile</p><h2 className="mt-4 font-serif text-3xl font-semibold" id="founder-title">{founderName}</h2><p className="mt-2 text-sm text-white/68">{founderRole}</p><p className="mt-5 border-t border-white/15 pt-5 text-sm leading-7 text-white/68">Interested in commercial real estate, market analysis, public policy, and data-driven research products.</p>{githubUrl ? <div className="mt-7 flex flex-wrap gap-3"><a className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-3 text-xs font-semibold hover:border-white/50" href={githubUrl} rel="noreferrer" target="_blank"><CodeXml aria-hidden="true" className="size-4" /> GitHub</a></div> : null}</div></div>
        <div><p className="eyebrow">Why it exists</p><h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-navy">Commercial real estate information is fragmented. Capital Parcel makes the research trail inspectable.</h2><p className="mt-6 max-w-3xl text-base leading-8 text-slate">Capital Parcel turns public records, company filings, local reporting, and transaction announcements into a searchable, source-backed view of selected commercial property transactions. Every record retains its verification status, calculations, sources, and limitations so readers can inspect the evidence—not just the headline figure.</p><p className="mt-5 max-w-3xl text-base leading-8 text-slate">Founded and maintained by Parsa Shakeri, a student researcher, the platform brings together commercial real estate research, market analysis, public-policy research, and structured data organization.</p><p className="mt-5 max-w-3xl text-base leading-8 text-slate">The project also serves as a working demonstration of full-stack product judgment: deciding what to collect, what not to infer, how to structure it, and how to communicate uncertainty without sacrificing usability.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="button-primary gap-2" href="/comparables">Explore comparable sales <ArrowRight aria-hidden="true" className="size-4" /></Link><Link className="button-secondary" href="/methodology">Review methodology</Link></div></div>
      </section>

      <section className="py-16 lg:py-20" aria-labelledby="ownership-title"><div className="max-w-3xl"><p className="eyebrow">Scope of ownership</p><h2 className="mt-4 font-serif text-4xl font-semibold text-navy" id="ownership-title">One project across research, data, design, and engineering.</h2><p className="mt-5 text-sm leading-7 text-slate">The platform is not a reskinned template. Its public experience and protected operating tools are designed around the specific constraints of public-source CRE research.</p></div><div className="mt-9 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">{responsibilities.map(([title, copy], index) => <article className="min-h-52 bg-white p-7" key={title}><span className="font-mono text-[10px] text-accent">0{index + 1}</span><h3 className="mt-8 font-serif text-3xl font-semibold text-navy">{title}</h3><p className="mt-4 text-sm leading-7 text-slate">{copy}</p></article>)}</div></section>

      <section className="relative overflow-hidden border border-accent/25 bg-accent-soft p-7 shadow-[0_18px_44px_rgba(11,34,57,0.08)] sm:p-10"><span aria-hidden="true" className="absolute right-6 top-2 font-serif text-8xl text-white/70">“</span><p className="eyebrow">Independence statement</p><p className="relative mt-6 max-w-4xl font-serif text-2xl font-semibold leading-9 text-navy">Capital Parcel is an independent student research project and is not affiliated with any brokerage, investment firm, property owner, or data provider.</p><p className="mt-5 text-sm font-bold text-slate">Coverage is selective. No confidential or proprietary internship information is published, and the content is not investment advice.</p></section>

      <section className="mt-16 grid gap-8 border-t-2 border-navy pt-8 lg:grid-cols-[0.65fr_1fr]" aria-labelledby="contact-title"><div><p className="eyebrow">Professional contact</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy" id="contact-title">Discuss the research or the product.</h2></div><div>{contactEmail ? <p className="text-base leading-8 text-slate">Professional inquiries may be directed to <a className="font-semibold text-navy underline decoration-accent/50 underline-offset-4 hover:decoration-accent" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p> : <p className="text-base leading-8 text-slate">Contact information will be published when the production address is configured. No private personal information is displayed.</p>}<p className="mt-4 text-sm leading-7 text-slate">Research interests include local transaction patterns, pricing metrics, property-sector fundamentals, capital markets, tenant activity, and the practical limits of public CRE data.</p></div></section>
    </Container>
  </>;
}
