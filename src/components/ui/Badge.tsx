import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        variant === "default" &&
          "bg-muted text-muted-foreground border border-border",
        variant === "gradient" &&
          "bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white",
        className
      )}
    >
      {children}
    </span>
  );
}
