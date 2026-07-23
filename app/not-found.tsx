import Link from "next/link";
import { StatePanel } from "@/components/ui/state-panel";

export default function NotFound() {
  return <StatePanel eyebrow="404 · Record unavailable" title="This page could not be found." description="The address may have changed, or the requested record may not be published."><Link className="button-primary" href="/">Return home</Link><Link className="button-secondary" href="/properties">Explore the database</Link></StatePanel>;
}
