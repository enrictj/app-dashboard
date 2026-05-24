"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export function GlassCard({
  children,
  className,
  hover = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        "rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm backdrop-blur-md",
        hover && "transition-shadow hover:shadow-md hover:shadow-primary/5",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
