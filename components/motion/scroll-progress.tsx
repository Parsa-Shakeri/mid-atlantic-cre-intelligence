"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { damping: 28, mass: 0.25, stiffness: 170 });

  if (reduceMotion) return null;

  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-accent" style={{ scaleX }} />;
}
