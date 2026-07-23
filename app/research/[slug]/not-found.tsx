import Link from "next/link";
import { StatePanel } from "@/components/ui/state-panel";

export default function ResearchNotFound() {
  return <StatePanel eyebrow="Report not found" title="This research article is unavailable." description="It may be unpublished, renamed, or outside the public research library."><Link className="button-primary" href="/research">Return to research</Link></StatePanel>;
}
