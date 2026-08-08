import { Container } from "@/components/ui/container";

export default function PropertiesLoading() {
  return (
    <Container aria-busy="true" aria-live="polite" className="py-12 sm:py-16">
      <div className="border-b-2 border-navy pb-5"><p className="eyebrow">Loading records</p><p className="mt-3 font-serif text-3xl text-navy">Preparing the transaction database</p></div>
      <div className="loading-bar mt-8 h-52" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div className="loading-bar h-72" key={item} />)}</div>
      <p className="sr-only">Filters and transaction records are loading.</p>
    </Container>
  );
}
