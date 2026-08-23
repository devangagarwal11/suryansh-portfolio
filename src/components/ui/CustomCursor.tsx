"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Inner dot: no delay
  const innerX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const innerY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  // Outer ring: 0.4s lag (using lower stiffness/damping for lag effect)
  const outerX = useSpring(mouseX, { damping: 40, stiffness: 150 });
  const outerY = useSpring(mouseY, { damping: 40, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("button") || 
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-[10px] h-[10px] bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: innerX,
          y: innerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 0 : 1,
        }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-[36px] h-[36px] border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 60 : 36,
          height: isHovered ? 60 : 36,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
    </>
  );
};
