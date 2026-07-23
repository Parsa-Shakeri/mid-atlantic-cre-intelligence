import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function StatePanel({ eyebrow, title, description, children, role = "status" }: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  role?: "status" | "alert";
}) {
  return <Container className="grid min-h-[58vh] place-items-center py-16 sm:py-24">
    <section className="state-panel" role={role}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.025em] text-navy sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate sm:text-base">{description}</p>
      {children ? <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">{children}</div> : null}
    </section>
  </Container>;
}
