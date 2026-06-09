"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** Seconds between each word's entrance. */
  stagger?: number;
}

/**
 * Word-by-word masked rise. Each word sits in an overflow-hidden box and slides
 * up from below — the kinetic headline treatment. Full string is exposed to
 * screen readers via aria-label; the animated pieces are aria-hidden.
 */
export function KineticText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
}: KineticTextProps) {
  const words = text.split(" ");

  return (
    <span className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
