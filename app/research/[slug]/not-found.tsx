import Link from "next/link";
import { StatePanel } from "@/components/ui/state-panel";

export default function ResearchArticleNotFound() {
  return <StatePanel eyebrow="Research record unavailable" title="This report could not be found." description="The link may be outdated, the report may still be in draft, or the record may no longer be publicly available." role="alert"><Link className="button-primary" href="/research">Return to research</Link><Link className="button-secondary" href="/methodology">Review methodology</Link></StatePanel>;
}
