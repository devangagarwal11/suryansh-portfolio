"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedDock } from "./animated-dock";
import { Play, Video, Palette, User } from "lucide-react";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "AI Videos", href: "#work-ai-videos" },
    { name: "Edits", href: "#work-edits" },
    { name: "Designs", href: "#work-post-designs" },
    { name: "About", href: "#about" },
  ];

  return (
    <motion.header
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-5 left-1/2 z-[100] flex items-center gap-2 md:gap-4 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10 bg-[#141414]/85 backdrop-blur-xl transition-all duration-500 max-w-[95vw] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        isScrolled ? "shadow-[0_20px_50px_rgba(255,255,255,0.05)] border-white/15" : "shadow-none"
      )}
    >
      {/* Logo */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center gap-2 pr-2 md:pr-4 border-r border-white/10 cursor-pointer group shrink-0"
      >
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0c0c0c] font-bold transition-transform group-hover:scale-110">
          S
        </div>
        <span className="hidden sm:inline text-white font-medium tracking-tight">Suryansh S.</span>
      </div>

      {/* Nav Links */}
      <nav className="flex items-center shrink-0">
        <AnimatedDock
          items={[
            {
              link: "#work-ai-videos",
              Icon: <span className="text-[10px] md:text-xs font-medium whitespace-nowrap px-1 md:px-2">AI Videos</span>,
              label: "AI Videos"
            },
            {
              link: "#work-edits",
              Icon: <span className="text-[10px] md:text-xs font-medium whitespace-nowrap px-1 md:px-2">Edits</span>,
              label: "Edits"
            },
            {
              link: "#work-post-designs",
              Icon: <span className="text-[10px] md:text-xs font-medium whitespace-nowrap px-1 md:px-2">Designs</span>,
              label: "Designs"
            },
            {
              link: "#about",
              Icon: <span className="text-[10px] md:text-xs font-medium whitespace-nowrap px-1 md:px-2">About</span>,
              label: "About"
            },
          ]}
        />
      </nav>

      <div className="h-4 w-[1px] bg-white/10 hidden md:block shrink-0" />

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        className="flex items-center gap-2 bg-white text-[#0c0c0c] px-3 md:px-5 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors shrink-0"
      >
        <span>✦</span>
        <span className="hidden sm:inline">Let&apos;s Talk</span>
      </motion.button>
    </motion.header>
  );
};

