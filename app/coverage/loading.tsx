import { Container } from "@/components/ui/container";

export default function CoverageLoading() {
  return <><div className="h-80 animate-pulse bg-ink" /><Container className="grid gap-5 py-16"><div className="loading-bar h-36" /><div className="grid gap-5 md:grid-cols-2"><div className="loading-bar h-80" /><div className="loading-bar h-80" /></div><div className="loading-bar h-72" /></Container></>;
}
