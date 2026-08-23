"use client" 

import * as React from "react"
import { useRef } from "react";
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
 
import { cn } from "@/lib/utils";
import Link from "next/link";
 
export interface DockItemData {
  link: string;
  Icon: React.ReactNode;
  target?: string;
  label?: string;
}

export interface AnimatedDockProps {
  className?: string;
  items: DockItemData[];
}
 
export const AnimatedDock = ({ className, items }: AnimatedDockProps) => {
  const mouseX = useMotionValue(Infinity);
 
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-10 items-center gap-2 px-2",
        className,
      )}
    >
      {items.map((item, index) => (
        <DockItem key={index} mouseX={mouseX}>
          <Link
            href={item.link}
            target={item.target}
            className="flex items-center justify-center w-full h-full"
            onClick={(e) => {
              if (item.link.startsWith('#')) {
                e.preventDefault();
                document.querySelector(item.link)?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {item.Icon}
          </Link>
        </DockItem>
      ))}
    </motion.div>
  );
};
 
interface DockItemProps {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
}
 
export const DockItem = ({ mouseX, children }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [40, 60, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const iconScale = useTransform(width, [40, 60], [1, 1.3]);
  const iconSpring = useSpring(iconScale, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: 'auto', minWidth: width }}
      className="h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer px-2"
    >
      <motion.div
        style={{ scale: iconSpring }}
        className="flex items-center justify-center h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
