"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import SmokeBackground from "./SmokeBackground";
import ShootingStreaks from "./ShootingStreaks";

export function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#080808]">
      
      {/* 1. Cinematic Shooting Streaks (Razor-thin diagonal motion) */}
      <ShootingStreaks />

      {/* 2. Advanced Canvas Smoke Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <SmokeBackground />
      </div>
      
      {/* 3. The Solid Crescent Planet */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[5%] right-[5%] w-[30vw] h-[30vw] max-w-[450px] max-h-[450px] rounded-full z-10 opacity-[0.4] will-change-transform"
        style={{
          background: `
            radial-gradient(circle at 30% 50%, #222 0%, #0a0a0a 60%, #000 100%),
            url('https://www.transparenttextures.com/patterns/stardust.png')
          `,
        }}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 100% 50%, black 25%, transparent 75%)",
            mixBlendMode: "multiply"
          }}
        />
        <div className="absolute inset-0 rounded-full opacity-[0.12] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/rocky-wall.png')]" />
        <div className="absolute inset-0 rounded-full border border-white/[0.12] shadow-[inset_12px_0_25px_rgba(255,255,255,0.08)]" />
      </motion.div>

      {/* 4. Optimized Mouse Glow */}
      {mounted && (
        <div 
          className="absolute w-[30vw] h-[30vw] rounded-full mix-blend-screen blur-[100px] transition-transform duration-700 ease-out will-change-transform"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 60%)",
            transform: `translate3d(${mousePos.x - window.innerWidth * 0.15}px, ${mousePos.y - window.innerHeight * 0.15}px, 0)`
          }}
        />
      )}
    </div>
  );
}
