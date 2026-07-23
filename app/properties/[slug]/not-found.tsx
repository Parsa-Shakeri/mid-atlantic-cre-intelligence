import Link from "next/link";
import { StatePanel } from "@/components/ui/state-panel";

export default function PropertyNotFound() {
  return <StatePanel eyebrow="Record not found" title="This property is unavailable." description="It may have been removed, renamed, or never existed."><Link className="button-primary" href="/properties">Return to database</Link></StatePanel>;
}
