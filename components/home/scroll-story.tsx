"use client";

import { Check, FileSearch, LineChart, Link2 } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { Container } from "@/components/ui/container";

const stages = [
  { number: "01", label: "Record", title: "Start with the transaction.", copy: "Capture the property, parties, date, consideration, and physical context without filling gaps by assumption.", icon: FileSearch },
  { number: "02", label: "Verify", title: "Trace every material claim.", copy: "Attach public records, filings, company disclosures, and credible reporting. Conflicts stay visible until resolved.", icon: Link2 },
  { number: "03", label: "Interpret", title: "Let the sample set the limit.", copy: "Calculate only what the evidence supports, show sample sizes, and separate reported figures from derived analysis.", icon: LineChart },
] as const;

function LinearStory({ animated = false, className = "" }: { animated?: boolean; className?: string }) {
  return (
    <section aria-labelledby="linear-workflow-title" className={`bg-ink py-20 text-white ${className}`}>
      <Container>
        <p className="motion-kicker">Research workflow</p>
        <h2 className="mt-6 max-w-2xl font-serif text-4xl font-medium leading-[1.03] tracking-[-0.035em] sm:text-5xl" id="linear-workflow-title">Evidence moves before conclusions do.</h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-white/52">Each record advances through the same three-stage process before it informs the public analysis.</p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {stages.map(({ number, label, title, copy, icon: Icon }, index) => (
            <motion.article
              className="border border-white/14 bg-white/[0.035] p-7"
              initial={animated ? { opacity: 0, y: 24 } : false}
              key={number}
              transition={{ delay: index * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ amount: 0.22, once: true }}
              whileInView={animated ? { opacity: 1, y: 0 } : undefined}
            >
              <Icon aria-hidden="true" className="size-5 text-copper" strokeWidth={1.6} />
              <p className="mt-8 font-mono text-xs text-white/40">{number} / {label}</p>
              <h3 className="mt-4 font-serif text-3xl font-medium">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/58">{copy}</p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progressScale = useSpring(scrollYProgress, { damping: 32, stiffness: 180 });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduceMotion) return;
    const nextIndex = Math.min(stages.length - 1, Math.floor(latest * stages.length));
    setActiveIndex((currentIndex) => currentIndex === nextIndex ? currentIndex : nextIndex);
  });

  const activateStage = (index: number) => {
    setActiveIndex(index);
    const section = sectionRef.current;
    if (!section) return;

    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
    const stagePositions = [0.08, 0.5, 0.88] as const;
    window.scrollTo({
      behavior: reduceMotion ? "auto" : "smooth",
      top: sectionTop + scrollableDistance * stagePositions[index],
    });
  };

  if (reduceMotion) return <LinearStory />;

  const activeStage = stages[activeIndex];
  const ActiveIcon = activeStage.icon;

  return (
    <>
      <LinearStory animated className="lg:hidden" />
      <section className="relative hidden h-[280vh] bg-ink text-white lg:block" data-workflow-section ref={sectionRef}>
      <div className="sticky top-[106px] flex min-h-[calc(100svh-106px)] items-center overflow-hidden py-10 sm:py-14">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-20">
          <div>
            <p className="motion-kicker">Research workflow</p>
            <p className="mt-6 max-w-sm font-serif text-4xl font-medium leading-[1.03] tracking-[-0.035em] sm:text-5xl">Evidence moves before conclusions do.</p>
            <div className="mt-10 h-px bg-white/12"><motion.div className="h-full origin-left bg-copper" style={{ scaleX: progressScale }} /></div>
            <p className="mt-4 max-w-xs text-xs leading-5 text-white/42">Scroll through the workflow or choose a step directly.</p>
            <div aria-label="Research workflow steps" className="mt-8 grid gap-px border border-white/12 bg-white/12 sm:grid-cols-3 lg:grid-cols-1" role="group">
              {stages.map(({ number, label }, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    aria-pressed={isActive}
                    className={`flex min-h-14 items-center justify-between gap-4 px-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-copper ${isActive ? "bg-copper text-white" : "bg-ink text-white/52 hover:bg-white/[0.06] hover:text-white"}`}
                    data-workflow-step={label.toLowerCase()}
                    key={number}
                    onClick={() => activateStage(index)}
                    type="button"
                  >
                    <span className="font-mono text-[10px] tracking-[0.14em]">{number}</span>
                    <span className="flex-1 text-xs font-semibold uppercase tracking-[0.14em]">{label}</span>
                    <span aria-hidden="true" className={`size-1.5 rounded-full ${isActive ? "bg-white" : "bg-white/20"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[560px] border border-white/14 bg-[#0b2135] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="absolute inset-0 data-grid" />
            <motion.div
              animate={{ top: `${12 + activeIndex * 38}%` }}
              aria-hidden="true"
              className="absolute inset-x-0 h-px bg-copper shadow-[0_0_22px_rgba(203,100,65,0.72)]"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="relative flex items-center justify-between border-b border-white/12 pb-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">Record protocol</span>
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.13em] text-white/46"><Check aria-hidden="true" className="size-3 text-copper" /> Step {activeIndex + 1} of {stages.length}</span>
            </div>
            <div className="relative mt-8 min-h-[410px]">
              <AnimatePresence initial={false} mode="wait">
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex flex-col justify-between"
                  data-workflow-stage={activeStage.label.toLowerCase()}
                  exit={{ opacity: 0, y: -18 }}
                  initial={{ opacity: 0, y: 22 }}
                  key={activeStage.number}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div>
                    <div className="flex items-center justify-between"><span className="font-mono text-sm text-copper">{activeStage.number}</span><ActiveIcon aria-hidden="true" className="size-6 text-white/45" strokeWidth={1.4} /></div>
                    <p className="mt-12 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{activeStage.label}</p>
                    <h2 className="mt-4 max-w-xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl">{activeStage.title}</h2>
                    <p className="mt-6 max-w-lg text-sm leading-7 text-white/58 sm:text-base">{activeStage.copy}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 text-[10px] uppercase tracking-[0.12em] text-white/36 sm:grid-cols-4">
                    {["Property", "Transaction", "Evidence", "Method"].map((field) => <span className="bg-[#0b2135] px-3 py-4" key={field}>{field}</span>)}
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
      </section>
    </>
  );
}
