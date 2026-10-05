"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import SmokeBackground from "./SmokeBackground";
import ShootingStreaks from "./ShootingStreaks";

export function InteractiveBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  // Mouse glow is moved directly on the DOM node from a rAF loop. Previously it
  // called setState on every mousemove, re-rendering the whole background
  // (including the animated planet) dozens of times a second.
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      glow.style.display = "none";
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const loop = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      const half = glow.offsetWidth / 2;
      glow.style.transform = `translate3d(${x - half}px, ${y - half}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      cancelAnimationFrame(rafId);
      if (!document.hidden) rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#080808]"
      aria-hidden="true"
    >
      {/* 1. Stars + shooting streaks */}
      <ShootingStreaks />

      {/* 2. Canvas smoke */}
      <div className="absolute inset-0 z-0 opacity-40">
        <SmokeBackground />
      </div>

      {/* 3. Crescent planet (pure CSS, no third-party texture requests) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] right-[5%] w-[30vw] h-[30vw] max-w-[450px] max-h-[450px] rounded-full z-10 opacity-[0.4] will-change-transform"
        style={{
          background: "radial-gradient(circle at 30% 50%, #222 0%, #0a0a0a 60%, #000 100%)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 100% 50%, black 25%, transparent 75%)",
            mixBlendMode: "multiply",
          }}
        />
        <div className="absolute inset-0 rounded-full border border-white/[0.12] shadow-[inset_12px_0_25px_rgba(255,255,255,0.08)]" />
      </motion.div>

      {/* 4. Mouse glow. The gradient is already soft, so no blur filter / blend
             mode is needed (a 100px blur on a full-screen-sized layer was costly). */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
