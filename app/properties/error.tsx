"use client";

import { StatePanel } from "@/components/ui/state-panel";

export default function PropertiesError({ reset }: { reset: () => void }) {
  return <StatePanel eyebrow="Database unavailable" title="The records could not be loaded." description="No values have been substituted or invented." role="alert"><button className="button-primary" type="button" onClick={reset}>Try again</button></StatePanel>;
}
