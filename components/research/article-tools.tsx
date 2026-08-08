"use client";

import { ChevronDown, List, Printer } from "lucide-react";
import { Container } from "@/components/ui/container";

export interface ArticleSectionLink {
  id: string;
  label: string;
}

export function PrintArticleButton({ className = "" }: { className?: string }) {
  return <button className={`inline-flex min-h-11 items-center justify-center gap-2 border border-line bg-white px-4 text-xs font-semibold text-navy transition-colors hover:border-navy ${className}`} onClick={() => window.print()} type="button"><Printer aria-hidden="true" className="size-4" />Print report</button>;
}

export function ArticleMobileContents({ sections }: { sections: ArticleSectionLink[] }) {
  return <div className="print-hidden sticky top-[105px] z-40 border-b border-line bg-paper/95 backdrop-blur-xl lg:hidden">
    <Container>
      <details className="group py-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-xs font-semibold text-navy marker:content-none">
          <span className="inline-flex items-center gap-2"><List aria-hidden="true" className="size-4 text-accent" />In this report</span>
          <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <nav aria-label="Article sections" className="grid max-h-[55vh] gap-1 overflow-y-auto border-t border-line pb-4 pt-3">
          {sections.map((section, index) => <a className="flex items-baseline gap-3 py-2 text-sm text-slate transition-colors hover:text-navy" href={`#${section.id}`} key={section.id}><span aria-hidden="true" className="font-mono text-[10px] text-accent">{String(index + 1).padStart(2, "0")}</span><span>{section.label}</span></a>)}
          <PrintArticleButton className="mt-3 w-full" />
        </nav>
      </details>
    </Container>
  </div>;
}
