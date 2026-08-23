"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary:
    "bg-accent text-accent-foreground hover:scale-[1.03] shadow-lg",
  secondary:
    "bg-muted text-foreground hover:bg-border border border-transparent",
  ghost:
    "bg-transparent text-foreground hover:bg-muted",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted",
};

const sizeStyles = {
  sm: "h-9 px-4 text-xs font-medium",
  md: "h-11 px-6 text-sm font-medium",
  lg: "h-14 px-8 text-base font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full font-medium",
          "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
