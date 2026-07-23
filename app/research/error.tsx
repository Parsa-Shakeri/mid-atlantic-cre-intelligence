"use client";

import { StatePanel } from "@/components/ui/state-panel";

export default function ResearchError({ reset }: { reset: () => void }) {
  return <StatePanel eyebrow="Research unavailable" title="The library could not be loaded." description="No substitute articles or claims were created." role="alert"><button className="button-primary" type="button" onClick={reset}>Try again</button></StatePanel>;
}
