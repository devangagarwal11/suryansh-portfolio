"use client";

import { useEffect } from "react";
import Lenis from "lenis";

type LenisWindow = Window & { lenis?: Lenis };

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respect reduced motion + skip on touch devices (native momentum scrolling
    // is smoother there than any JS imitation of it).
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (prefersReducedMotion || isTouch) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      autoResize: true,
      // Makes plain <a href="#section"> links (the nav dock, footer) glide via Lenis.
      anchors: true,
    });

    (window as LenisWindow).lenis = lenis;

    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as LenisWindow).lenis;
    };
  }, []);

  return <>{children}</>;
}
