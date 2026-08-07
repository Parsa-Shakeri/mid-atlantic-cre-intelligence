"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";

export function PageHero({ eyebrow, title, description, disclosure }: { eyebrow: string; title: string; description: string; disclosure?: string }) {
  const reduceMotion = useReducedMotion();
  return <section className="page-hero"><Container className="relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_0.48fr] lg:items-end lg:py-24"><motion.div animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} initial={reduceMotion ? false : { opacity: 0, y: 26 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}><p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-copper before:h-px before:w-9 before:bg-copper">{eyebrow}</p><h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[0.96] tracking-[-0.045em] text-white sm:text-7xl">{title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/58">{description}</p></motion.div>{disclosure ? <motion.aside animate={reduceMotion ? undefined : { opacity: 1, x: 0 }} initial={reduceMotion ? false : { opacity: 0, x: 20 }} transition={{ delay: 0.18, duration: 0.64 }} className="border-l border-copper pl-5"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/38">Research note</p><p className="mt-3 text-sm leading-6 text-white/58">{disclosure}</p></motion.aside> : null}</Container></section>;
}
