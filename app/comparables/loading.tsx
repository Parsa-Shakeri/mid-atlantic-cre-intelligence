import { Container } from "@/components/ui/container";

export default function ComparablesLoading() {
  return <Container aria-busy="true" aria-live="polite" className="py-12 sm:py-16"><p className="eyebrow">Building comparison</p><h1 className="mt-3 font-serif text-3xl text-navy">Scanning recorded sales</h1><div className="loading-bar mt-8 h-72" /><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div className="loading-bar h-40" /><div className="loading-bar h-40" /><div className="loading-bar h-40" /></div><div className="loading-bar mt-8 h-96" /><p className="sr-only">Comparable sale filters, metrics, and records are loading.</p></Container>;
}

