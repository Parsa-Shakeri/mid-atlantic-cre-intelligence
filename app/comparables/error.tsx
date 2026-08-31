"use client";

import { StatePanel } from "@/components/ui/state-panel";

export default function ComparablesError({ reset }: { reset: () => void }) {
  return <StatePanel eyebrow="Comparison unavailable" title="The recorded sales could not be loaded." description="No comparable metrics were estimated or replaced." role="alert"><button className="button-primary" onClick={reset} type="button">Try again</button></StatePanel>;
}

