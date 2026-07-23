import type { ComponentProps } from "react";

export function DeleteForm({ action, id, label }: { action: ComponentProps<"form">["action"]; id: string; label: string }) {
  return <details className="mt-3 text-xs"><summary className="cursor-pointer text-red-700">Delete</summary><form action={action} className="mt-2 grid gap-2"><input name="id" type="hidden" value={id} /><label className="text-slate">Type DELETE to remove {label}.<input className="admin-input mt-1 min-h-9 py-1" name="confirm" required /></label><button className="justify-self-start border border-red-300 px-3 py-2 font-semibold text-red-800" type="submit">Delete permanently</button></form></details>;
}
