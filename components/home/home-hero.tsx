"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Database, MapPinned } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import type { PublicDataSource } from "@/lib/types";

export function HomeHero({ dataSource }: { dataSource: PublicDataSource }) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.92], [0.8, 0.28]);

  return (
    <section className="home-hero-v2" ref={heroRef}>
      <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { opacity: imageOpacity, scale: imageScale }}>
        <Image alt="Abstract aerial cartographic field representing Mid-Atlantic market coverage" className="object-cover object-center" fill priority sizes="100vw" src="/regional-data-field.png" />
      </motion.div>
      <div aria-hidden="true" className="hero-image-shade" />
      <Container className="relative flex min-h-[calc(100svh-7rem)] flex-col justify-between py-10 sm:py-14 lg:min-h-[760px] lg:py-16">
        <motion.div className="grid gap-12 lg:grid-cols-[1.12fr_0.52fr] lg:items-end" style={reduceMotion ? undefined : { y: copyY }}>
          <div>
            <div className="inline-flex items-center gap-3 border border-white/18 bg-[#071a2c]/55 px-3 py-2 backdrop-blur-md">
              <Database aria-hidden="true" className="size-3.5 text-copper" strokeWidth={1.8} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72">Independent regional intelligence</span>
            </div>
            <h1 className="mt-8 max-w-[940px] font-serif text-[clamp(3.7rem,8.5vw,8.8rem)] font-medium leading-[0.82] tracking-[-0.065em] text-white">
              Commercial real estate,
              <span className="mt-3 block font-normal italic text-white/68">explained locally.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">Transaction-level research on pricing, cap rates, tenants, and market trends across Maryland, Washington, D.C., and Northern Virginia.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="hero-primary-action" href="/properties">Explore the database <ArrowRight aria-hidden="true" className="size-4" /></Link>
              <Link className="hero-secondary-action" href="/research"><BookOpen aria-hidden="true" className="size-4" /> Read the latest research</Link>
            </div>
          </div>
          <aside className="hero-edition-card" aria-label="Research edition status">
            <div className="flex items-center justify-between border-b border-white/14 pb-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/68">Research edition</span>
              <span className="font-mono text-xs text-copper">2026 / 01</span>
            </div>
            <p className="mt-7 font-serif text-3xl font-medium leading-tight text-white">A regional record built from public evidence.</p>
            <div className="mt-7 flex items-start gap-3 border-t border-white/14 pt-5">
              <MapPinned aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-copper" strokeWidth={1.7} />
              <p className="text-xs leading-5 text-white/70">{dataSource === "sample" ? "Development data is clearly marked as fictional." : dataSource === "unavailable" ? "Live records are withheld while the public data service is unavailable." : "Each material figure links back to its record, verification state, and sources."}</p>
            </div>
          </aside>
        </motion.div>

        <div className="mt-14 grid border-y border-white/14 text-[10px] font-medium uppercase tracking-[0.16em] text-white/68 sm:grid-cols-3">
          <p className="flex items-center gap-3 border-b border-white/14 py-4 sm:border-b-0 sm:border-r"><span className="font-mono text-copper">01</span> Transaction records</p>
          <p className="flex items-center gap-3 border-b border-white/14 py-4 sm:border-b-0 sm:border-r sm:px-5"><span className="font-mono text-copper">02</span> Source-linked evidence</p>
          <p className="flex items-center gap-3 py-4 sm:px-5"><span className="font-mono text-copper">03</span> Transparent analysis</p>
        </div>
      </Container>
    </section>
  );
}
