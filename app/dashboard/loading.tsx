import { Container } from "@/components/ui/container";

export default function DashboardLoading() {
  return <Container className="py-16 sm:py-20" aria-busy="true" aria-live="polite"><div className="border-b-2 border-navy pb-5"><p className="eyebrow">Calculating dashboard</p><p className="mt-3 font-serif text-3xl text-navy">Aggregating market records</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div className="loading-bar h-28" key={item} />)}</div><div className="mt-6 grid gap-5 lg:grid-cols-2"><div className="loading-bar h-96" /><div className="loading-bar h-96" /></div></Container>;
}
