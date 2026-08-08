"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function DashboardResultsFrame({ children, resultKey }: { children: ReactNode; resultKey: string }) {
  const reduceMotion = useReducedMotion();
  return <motion.div animate={{ opacity: 1, y: 0 }} initial={reduceMotion ? false : { opacity: 0, y: 12 }} key={resultKey} transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
