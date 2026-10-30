import * as React from "react";
import { cn } from "@/lib/utils";

interface IslamicPatternProps {
  className?: string;
  opacity?: number;
  id?: string;
}

/**
 * Authentic 8-point Islamic Star & Girih geometric pattern.
 * Seamless repeating lattice rendered via SVG pattern for dark green sections, banners, and footer.
 */
export function IslamicPattern({
  className,
  opacity = 0.06,
  id: customId,
}: IslamicPatternProps) {
  const reactId = React.useId();
  const patternId = customId || `islamic-pattern-${reactId.replace(/:/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full select-none",
        className
      )}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={patternId}
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* Central 8-pointed star */}
          <path
            d="M30 6 L35 19 L48 14 L43 27 L56 30 L43 33 L48 46 L35 41 L30 54 L25 41 L12 46 L17 33 L4 30 L17 27 L12 14 L25 19 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinejoin="round"
          />
          {/* Corner quarter-stars forming interlaced secondary stars at intersections */}
          <path
            d="M0 6 L5 19 L18 14 L13 27 L26 30 L13 33 L18 46 L5 41 L0 54"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinejoin="round"
          />
          <path
            d="M60 6 L55 19 L42 14 L47 27 L34 30 L47 33 L42 46 L55 41 L60 54"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinejoin="round"
          />
          <path
            d="M6 0 L19 5 L14 18 L27 13 L30 26 L33 13 L46 18 L41 5 L54 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinejoin="round"
          />
          <path
            d="M6 60 L19 55 L14 42 L27 47 L30 34 L33 47 L46 42 L41 55 L54 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinejoin="round"
          />
          {/* Center concentric geometric medallion */}
          <circle
            cx="30"
            cy="30"
            r="4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          />
          {/* Corner concentric medallions */}
          <circle
            cx="0"
            cy="0"
            r="4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          />
          <circle
            cx="60"
            cy="0"
            r="4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          />
          <circle
            cx="0"
            cy="60"
            r="4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          />
          <circle
            cx="60"
            cy="60"
            r="4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

