import { Container } from "@/components/ui/container";

export default function DashboardLoading() {
  return <Container aria-busy="true" aria-live="polite" className="py-12 sm:py-16"><div className="border-b-2 border-navy pb-5"><p className="eyebrow">Calculating dashboard</p><p className="mt-3 font-serif text-3xl text-navy">Aggregating market records</p></div><div className="loading-bar mt-8 h-52" /><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{[1, 2, 3, 4, 5, 6].map((item) => <div className="loading-bar h-40" key={item} />)}</div><div className="mt-8 grid gap-5 xl:grid-cols-2"><div className="loading-bar h-[430px]" /><div className="loading-bar h-[430px]" /></div><p className="sr-only">Dashboard filters, metrics, and charts are loading.</p></Container>;
}
