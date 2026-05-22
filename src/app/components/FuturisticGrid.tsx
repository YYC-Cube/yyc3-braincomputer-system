import type { ReactNode } from "react";
import { motion } from "motion/react";

interface FuturisticGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 lg:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

const gapClasses = {
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
};

export function FuturisticGrid({
  children,
  columns = 3,
  gap = "md",
  className = "",
}: FuturisticGridProps) {
  return (
    <div
      className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}