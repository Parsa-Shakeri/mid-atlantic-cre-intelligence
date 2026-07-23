import { Container } from "@/components/ui/container";

export default function PropertiesLoading() {
  return <Container className="py-16 sm:py-20" aria-busy="true" aria-live="polite"><div className="border-b-2 border-navy pb-5"><p className="eyebrow">Loading records</p><p className="mt-3 font-serif text-3xl text-navy">Preparing the transaction database</p></div><div className="mt-8 grid gap-4">{[1, 2, 3, 4].map((item) => <div className="loading-bar h-24" key={item} />)}</div></Container>;
}
