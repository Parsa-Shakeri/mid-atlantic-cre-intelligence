import { Container } from "@/components/ui/container";

export default function ResearchLoading() {
  return <Container className="py-16 sm:py-20" aria-busy="true" aria-live="polite"><div className="border-b-2 border-navy pb-5"><p className="eyebrow">Loading research</p><p className="mt-3 font-serif text-3xl text-navy">Assembling the publication library</p></div><div className="mt-10 grid gap-8 lg:grid-cols-[0.32fr_1fr]"><div className="loading-bar hidden h-[460px] lg:block" /><div className="grid gap-5"><div className="loading-bar h-44" />{[1, 2, 3].map((item) => <div className="loading-bar h-64" key={item} />)}</div></div><span className="sr-only">Loading research reports.</span></Container>;
}
