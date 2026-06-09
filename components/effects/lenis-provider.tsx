"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * Site-wide smooth scroll. Smoothing is neutralized (lerp: 1) when the user
 * prefers reduced motion, so the DOM structure stays identical and there's no
 * hydration mismatch.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <ReactLenis
      root
      options={{ lerp: reduced ? 1 : 0.1, smoothWheel: !reduced, duration: 1.1 }}
    >
      {children}
    </ReactLenis>
  );
}
