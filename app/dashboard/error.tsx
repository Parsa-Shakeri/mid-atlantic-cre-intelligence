"use client";

import { StatePanel } from "@/components/ui/state-panel";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <StatePanel eyebrow="Dashboard unavailable" title="The aggregate results could not be loaded." description="No metrics were estimated or replaced." role="alert"><button className="button-primary" type="button" onClick={reset}>Try again</button></StatePanel>;
}
