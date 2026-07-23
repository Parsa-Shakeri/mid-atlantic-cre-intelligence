"use client";

import { StatePanel } from "@/components/ui/state-panel";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <StatePanel eyebrow="Temporary interruption" title="This page could not be loaded." description="No missing values were substituted. Try the request again, or return later if the data service is unavailable." role="alert"><button className="button-primary" onClick={reset} type="button">Try again</button></StatePanel>;
}
