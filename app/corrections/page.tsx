import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bug, FileCheck2, LockKeyhole } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Corrections & Feedback",
  description: "Request an evidence review, report a website problem, or disclose a security issue to Mid-Atlantic CRE Intelligence.",
  alternates: { canonical: "/corrections" },
};

const reviewSteps = [
  ["Identify", "Name the property, transaction, report, or page and describe the specific concern."],
  ["Verify", "Compare the request with attributable public evidence and the platform's stated methodology."],
  ["Update", "Correct the record when the evidence supports a change; otherwise preserve the existing value and explain why."],
  ["Document", "Record material changes that could affect interpretation in the public changelog."],
] as const;

const reports = [
  {
    icon: FileCheck2,
    eyebrow: "Research record",
    title: "Request a data correction",
    copy: "Use this form for a disputed value, missing source, broken citation, address issue, or conclusion that may not follow from the evidence.",
    href: "https://github.com/Parsa-Shakeri/mid-atlantic-cre-intelligence/issues/new?template=data-correction.yml",
    cta: "Open correction form",
  },
  {
    icon: Bug,
    eyebrow: "Product behavior",
    title: "Report a website bug",
    copy: "Use this form for a reproducible problem with navigation, filtering, mobile layout, accessibility, or another public feature.",
    href: "https://github.com/Parsa-Shakeri/mid-atlantic-cre-intelligence/issues/new?template=bug-report.yml",
    cta: "Open bug report",
  },
  {
    icon: LockKeyhole,
    eyebrow: "Private channel",
    title: "Report a security issue",
    copy: "Do not open a public issue for a vulnerability, credential, or sensitive technical detail. Use GitHub's private vulnerability-reporting channel.",
    href: "https://github.com/Parsa-Shakeri/mid-atlantic-cre-intelligence/security/advisories/new",
    cta: "Report privately",
  },
] as const;

export default function CorrectionsPage() {
  return <>
    <PageHero
      eyebrow="Evidence review"
      title="Corrections are part of the research record."
      description="Readers can flag disputed data, incomplete sourcing, analytical concerns, and product problems through a documented review process."
      disclosure="A submission begins a review; it does not automatically change a record or published conclusion."
    />

    <Container className="py-16 lg:py-24">
      <section>
        <p className="eyebrow">Review standard</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[0.55fr_1fr] lg:items-end">
          <h2 className="font-serif text-4xl font-semibold leading-tight text-navy">How a correction moves from claim to record</h2>
          <p className="max-w-2xl text-sm leading-7 text-slate">Evidence is reviewed before the public record changes. Material revisions are documented so readers can distinguish a corrected conclusion from a routine formatting update.</p>
        </div>
        <ol className="mt-10 grid border-l border-t border-line md:grid-cols-4">
          {reviewSteps.map(([title, copy], index) => <li className="border-b border-r border-line p-6" key={title}>
            <span aria-hidden="true" className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-navy">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate">{copy}</p>
          </li>)}
        </ol>
      </section>

      <section className="mt-20">
        <p className="eyebrow">Choose the right channel</p>
        <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-navy">Help improve the evidence or the product</h2>
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {reports.map((report) => {
            const Icon = report.icon;
            return <article className="panel flex min-h-80 flex-col p-6 sm:p-8" key={report.title}>
              <Icon aria-hidden="true" className="size-6 text-accent" />
              <p className="eyebrow mt-8">{report.eyebrow}</p>
              <h3 className="mt-3 font-serif text-3xl font-semibold text-navy">{report.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate">{report.copy}</p>
              <a className="mt-7 inline-flex min-h-11 items-center gap-2 border-t border-line pt-5 text-xs font-semibold text-navy" href={report.href} rel="noreferrer" target="_blank">
                {report.cta} <ArrowRight aria-hidden="true" className="size-4 text-accent" />
              </a>
            </article>;
          })}
        </div>
      </section>

      <section className="mt-16 grid gap-8 border border-accent/30 bg-accent-soft/35 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="eyebrow">Public-form warning</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-navy">Share public evidence, not private information.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate">Do not submit confidential, proprietary, internship, credential, or private personal information. Public issue submissions and their attachments may be visible to anyone.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="button-secondary gap-2" href="/methodology">Review methodology <ArrowRight aria-hidden="true" className="size-4" /></Link>
          <Link className="button-primary gap-2" href="/changelog">View changelog <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
      </section>
    </Container>
  </>;
}
