import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BrushHighlightProps {
  children: ReactNode;
  tone?: "sun" | "brand";
  className?: string;
}

const PATHS = {
  sun: "M6 46c26-16 62-25 108-27 44-2 86 5 124 14 15 4 30 8 44 14-20 14-52 23-88 27-40 4-82 1-120-6C48 63 22 56 6 46Z",
  brand: "M8 40c30-14 70-22 116-23 42-1 80 6 116 15 12 3 24 7 36 12-22 12-56 20-94 23-40 3-80-1-116-9C44 54 22 48 8 40Z",
};

/** Trazo de pincel detrás de frases manuscritas. */
export const BrushHighlight = ({ children, tone = "sun", className }: BrushHighlightProps) => (
  <span className={cn("relative inline-block", className)}>
    <span aria-hidden className="absolute inset-x-[-0.18em] inset-y-[0.08em] -z-10">
      <svg
        viewBox="0 0 300 76"
        preserveAspectRatio="none"
        className="h-full w-full"
        focusable="false"
      >
        <path d={PATHS[tone]} fill={tone === "sun" ? "#FFC61E" : "#0057A8"} opacity={tone === "sun" ? 0.92 : 1} />
      </svg>
    </span>
    <span className="relative">{children}</span>
  </span>
);

/** Subrayado de pincel (rojo) para links emocionales. */
export const BrushUnderline = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("brush-underline", className)}>{children}</span>
);
