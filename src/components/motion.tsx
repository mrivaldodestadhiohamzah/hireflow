"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function AnimatedNumber({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const reduced = useReducedMotion();
  const previous = useRef(0);
  const frame = useRef<number | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    if (reduced) {
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
  }, [reduced, value]);

  return <span className={className} aria-label={`${value}${suffix}`}>{display}{suffix}</span>;
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={`flow-reveal ${className}`} style={{ "--flow-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}
