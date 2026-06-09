"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { formatCompact } from "@/lib/utils";

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
  compact?: boolean;
}

/** Animates 0 → value once the element scrolls into view. */
export function CountUp({ value, suffix = "", className, compact }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  const rounded = Math.round(display);
  const text = compact ? formatCompact(rounded) : rounded.toLocaleString();

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  );
}
