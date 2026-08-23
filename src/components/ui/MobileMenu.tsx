"use client";

import { motion } from "framer-motion";
import { navLinks } from "@/lib/constants";

interface MobileMenuProps {
  onClose: () => void;
}

const menuVariants: any = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const linkVariants: any = {
  closed: {
    y: 30,
    opacity: 0,
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
    },
  },
};

export function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <motion.div
      id="mobile-menu"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background"
      variants={menuVariants}
      initial="closed"
      animate="open"
      exit="closed"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-[var(--gradient-start)]/10 to-[var(--gradient-end)]/10 blur-[120px]" />

      <nav className="flex flex-col items-center gap-8">
        {navLinks.map((link, index) => (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={onClose}
            variants={linkVariants}
            className="text-3xl font-semibold text-foreground transition-colors hover:text-[var(--gradient-start)] sm:text-4xl"
          >
            <span className="mr-3 text-sm font-mono text-muted-foreground">
              0{index + 1}
            </span>
            {link.label}
          </motion.a>
        ))}
      </nav>
    </motion.div>
  );
}
