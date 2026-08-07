"use client";

import { Check, FileSearch, LineChart, Link2 } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Container } from "@/components/ui/container";

const stages = [
  { number: "01", label: "Record", title: "Start with the transaction.", copy: "Capture the property, parties, date, consideration, and physical context without filling gaps by assumption.", icon: FileSearch },
  { number: "02", label: "Verify", title: "Trace every material claim.", copy: "Attach public records, filings, company disclosures, and credible reporting. Conflicts stay visible until resolved.", icon: Link2 },
  { number: "03", label: "Interpret", title: "Let the sample set the limit.", copy: "Calculate only what the evidence supports, show sample sizes, and separate reported figures from derived analysis.", icon: LineChart },
] as const;

function StaticStory() {
  return <section className="bg-ink py-20 text-white"><Container><p className="motion-kicker">Research workflow</p><div className="mt-10 grid gap-5 lg:grid-cols-3">{stages.map(({ number, label, title, copy, icon: Icon }) => <article className="border border-white/14 bg-white/[0.035] p-7" key={number}><Icon aria-hidden="true" className="size-5 text-copper" strokeWidth={1.6} /><p className="mt-8 font-mono text-xs text-white/40">{number} / {label}</p><h2 className="mt-4 font-serif text-3xl font-medium">{title}</h2><p className="mt-4 text-sm leading-7 text-white/58">{copy}</p></article>)}</div></Container></section>;
}

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const firstOpacity = useTransform(scrollYProgress, [0, 0.27, 0.36], [1, 1, 0]);
  const secondOpacity = useTransform(scrollYProgress, [0.28, 0.4, 0.62, 0.7], [0, 1, 1, 0]);
  const thirdOpacity = useTransform(scrollYProgress, [0.64, 0.76, 1], [0, 1, 1]);
  const scanY = useTransform(scrollYProgress, [0, 1], [16, 520]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduceMotion) return <StaticStory />;

  const opacities = [firstOpacity, secondOpacity, thirdOpacity];
  return (
    <section className="relative h-[265vh] bg-ink text-white" ref={sectionRef}>
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-16">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-20">
          <div>
            <p className="motion-kicker">Research workflow</p>
            <p className="mt-6 max-w-sm font-serif text-4xl font-medium leading-[1.03] tracking-[-0.035em] sm:text-5xl">Evidence moves before conclusions do.</p>
            <div className="mt-10 h-px bg-white/12"><motion.div className="h-full origin-left bg-copper" style={{ scaleX: progressScale }} /></div>
            <p className="mt-4 max-w-xs text-xs leading-5 text-white/42">Scroll to follow one record from collection through verification and interpretation.</p>
          </div>

          <div className="relative min-h-[560px] border border-white/14 bg-[#0b2135] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="absolute inset-0 data-grid" />
            <motion.div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-copper shadow-[0_0_22px_rgba(203,100,65,0.72)]" style={{ y: scanY }} />
            <div className="relative flex items-center justify-between border-b border-white/12 pb-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">Record protocol</span>
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.13em] text-white/46"><Check aria-hidden="true" className="size-3 text-copper" /> Source-conscious</span>
            </div>
            <div className="relative mt-8 min-h-[410px]">
              {stages.map(({ number, label, title, copy, icon: Icon }, index) => (
                <motion.article className="absolute inset-0 flex flex-col justify-between" key={number} style={{ opacity: opacities[index] }}>
                  <div>
                    <div className="flex items-center justify-between"><span className="font-mono text-sm text-copper">{number}</span><Icon aria-hidden="true" className="size-6 text-white/45" strokeWidth={1.4} /></div>
                    <p className="mt-12 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{label}</p>
                    <h2 className="mt-4 max-w-xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl">{title}</h2>
                    <p className="mt-6 max-w-lg text-sm leading-7 text-white/58 sm:text-base">{copy}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 text-[10px] uppercase tracking-[0.12em] text-white/36 sm:grid-cols-4">
                    {["Property", "Transaction", "Evidence", "Method"].map((field) => <span className="bg-[#0b2135] px-3 py-4" key={field}>{field}</span>)}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
