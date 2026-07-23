import { Container } from "@/components/ui/container";

export default function ResearchLoading() {
  return <Container className="py-16 sm:py-20" aria-busy="true" aria-live="polite"><div className="border-b-2 border-navy pb-5"><p className="eyebrow">Loading research</p><p className="mt-3 font-serif text-3xl text-navy">Assembling the publication library</p></div><div className="mt-8 grid gap-5 md:grid-cols-3">{[1, 2, 3].map((item) => <div className="loading-bar h-72" key={item} />)}</div></Container>;
}
