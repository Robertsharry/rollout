"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const INTERACTIVE = "a,button,[role=button],input,textarea,select,[data-cursor=hover]";

/**
 * Custom dot + trailing ring cursor. Renders only on fine-pointer devices with
 * motion enabled; otherwise the native cursor is left untouched.
 */
export function CustomCursor() {
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    document.documentElement.classList.add("cursor-none");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(Boolean(target?.closest(INTERACTIVE)));
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden mix-blend-difference md:block"
    >
      <motion.div
        style={{ x, y }}
        className="absolute -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-white"
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute -ml-4 -mt-4 size-8 rounded-full border border-white"
        animate={{ scale: hovering ? 1.7 : 1, opacity: hovering ? 0.9 : 0.55 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  );
}
