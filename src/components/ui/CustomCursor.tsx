"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary, .cursor-pointer";

export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false); // real mouse/trackpad only
  const [visible, setVisible] = useState(false); // hidden until the first mouse move
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Inner dot: snappy
  const innerX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const innerY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  // Outer ring: trails behind
  const outerX = useSpring(mouseX, { damping: 40, stiffness: 150 });
  const outerY = useSpring(mouseY, { damping: 40, stiffness: 150 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let first = true;
    const handleMouseMove = (e: MouseEvent) => {
      if (first) {
        // Jump straight to the pointer instead of springing in from the corner.
        first = false;
        innerX.jump(e.clientX);
        innerY.jump(e.clientY);
        outerX.jump(e.clientX);
        outerY.jump(e.clientY);
        setVisible(true);
      }
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setIsHovered(!!target?.closest?.(INTERACTIVE));
    };

    const hide = () => setVisible(false);
    const show = () => !first && setVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
    };
  }, [enabled, mouseX, mouseY, innerX, innerY, outerX, outerY]);

  if (!enabled) return null;

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-[10px] h-[10px] bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: innerX, y: innerY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible && !isHovered ? 1 : 0,
          scale: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{ x: outerX, y: outerY, translateX: "-50%", translateY: "-50%" }}
        initial={{ width: 36, height: 36 }}
        animate={{
          width: isHovered ? 60 : 36,
          height: isHovered ? 60 : 36,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
    </>
  );
};
