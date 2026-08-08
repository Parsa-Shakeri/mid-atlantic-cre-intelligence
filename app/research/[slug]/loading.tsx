import { Container } from "@/components/ui/container";

export default function ResearchArticleLoading() {
  return <div aria-busy="true" aria-live="polite">
    <div className="bg-navy py-16"><Container><div className="loading-bar h-5 w-32 border-white/10 bg-white/10" /><div className="loading-bar mt-8 h-16 max-w-4xl border-white/10 bg-white/10 sm:h-24" /><div className="loading-bar mt-7 h-16 max-w-3xl border-white/10 bg-white/10" /></Container></div>
    <Container className="grid gap-14 py-14 lg:grid-cols-[minmax(0,780px)_270px] lg:justify-between"><div><div className="loading-bar h-64" /><div className="loading-bar mt-14 h-96" /></div><div className="loading-bar hidden h-[440px] lg:block" /></Container>
    <span className="sr-only">Loading research report.</span>
  </div>;
}
