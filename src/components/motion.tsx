"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches || Boolean(document.querySelector('[data-reduced-motion="true"]')));
    update();
    media.addEventListener("change", update);
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["data-reduced-motion"] });
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  return reduced;
}

export function AnimatedNumber({ value, suffix = "", className = "", reducedMotion = false }: { value: number; suffix?: string; className?: string; reducedMotion?: boolean }) {
  const reduced = useReducedMotion();
  const previous = useRef(0);
  const frame = useRef<number | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    if (reduced || reducedMotion) {
      previous.current = value;
      setDisplay(value);
      return;
    }

    const from = previous.current;
    const delta = value - from;
    const started = performance.now();
    const duration = Math.min(720, Math.max(320, Math.abs(delta) * 28));
    previous.current = value;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + delta * eased));
      if (progress < 1) frame.current = window.requestAnimationFrame(tick);
    };

    frame.current = window.requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [reduced, reducedMotion, value]);

  return <motion.span initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={className} aria-label={`${value}${suffix}`}>{display}{suffix}</motion.span>;
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.52, delay: delay / 1000, ease: [0.2, 0.75, 0.25, 1] }} className={`flow-reveal ${className}`} style={{ "--flow-delay": `${delay}ms` } as CSSProperties}>{children}</motion.div>;
}
