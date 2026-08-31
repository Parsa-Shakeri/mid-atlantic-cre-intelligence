"use client";

import { Check, ChevronDown, List, Printer, Share2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useState } from "react";

export interface ArticleSectionLink {
  id: string;
  label: string;
}

export function PrintArticleButton({ className = "" }: { className?: string }) {
  return <button className={`inline-flex min-h-11 items-center justify-center gap-2 border border-line bg-white px-4 text-xs font-semibold text-navy transition-colors hover:border-navy ${className}`} onClick={() => window.print()} type="button"><Printer aria-hidden="true" className="size-4" />Print report</button>;
}

export function ShareArticleButton({ title, className = "" }: { title: string; className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setStatus("copied");
        window.setTimeout(() => setStatus("idle"), 2200);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 3200);
    }
  };
  return <><button className={`inline-flex min-h-11 items-center justify-center gap-2 border border-line bg-white px-4 text-xs font-semibold text-navy transition-colors hover:border-navy ${className}`} onClick={share} type="button">{status === "copied" ? <Check aria-hidden="true" className="size-4" /> : <Share2 aria-hidden="true" className="size-4" />}{status === "copied" ? "Link copied" : "Share report"}</button><span aria-live="polite" className="sr-only">{status === "error" ? "Sharing failed. Copy the address from your browser." : status === "copied" ? "Report link copied to clipboard." : ""}</span></>;
}

export function ArticleMobileContents({ sections, title }: { sections: ArticleSectionLink[]; title: string }) {
  return <div className="print-hidden sticky top-[105px] z-40 border-b border-line bg-paper/95 backdrop-blur-xl lg:hidden">
    <Container>
      <details className="group py-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-xs font-semibold text-navy marker:content-none">
          <span className="inline-flex items-center gap-2"><List aria-hidden="true" className="size-4 text-accent" />In this report</span>
          <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <nav aria-label="Article sections" className="grid max-h-[55vh] gap-1 overflow-y-auto border-t border-line pb-4 pt-3">
          {sections.map((section, index) => <a className="flex items-baseline gap-3 py-2 text-sm text-slate transition-colors hover:text-navy" href={`#${section.id}`} key={section.id}><span aria-hidden="true" className="font-mono text-[10px] text-accent">{String(index + 1).padStart(2, "0")}</span><span>{section.label}</span></a>)}
          <div className="mt-3 grid grid-cols-2 gap-2"><PrintArticleButton className="w-full" /><ShareArticleButton className="w-full" title={title} /></div>
        </nav>
      </details>
    </Container>
  </div>;
}
