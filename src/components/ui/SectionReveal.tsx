"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationVariant = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";

interface SectionRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
}

const variants: any = {
  "fade-up": {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "scale-in": {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  "slide-left": {
    hidden: { x: 60, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  "slide-right": {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
};

export function SectionReveal({
  children,
  id,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  once = true,
}: SectionRevealProps) {
  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10%" }}
      variants={{
        hidden: variants[variant].hidden,
        visible: {
          ...variants[variant].visible,
          transition: {
            duration,
            delay,
            ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
