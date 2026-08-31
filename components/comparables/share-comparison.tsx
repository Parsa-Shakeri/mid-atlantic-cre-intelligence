"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareComparison() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const share = async () => {
    const shareData = { title: "Capital Parcel Comparable Sales", text: "Review this source-backed comparable-sales set.", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
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
  return <div className="flex flex-col items-start gap-2 sm:items-end"><button className="button-secondary min-h-10 gap-2 px-4 py-2 text-xs" onClick={share} type="button">{status === "copied" ? <Check aria-hidden="true" className="size-4" /> : <Share2 aria-hidden="true" className="size-4" />}{status === "copied" ? "Link copied" : "Share comparison"}</button><span aria-live="polite" className="min-h-4 text-[10px] text-slate">{status === "error" ? "Sharing failed. Copy the address from your browser." : status === "copied" ? "Comparison link copied to clipboard." : ""}</span></div>;
}
