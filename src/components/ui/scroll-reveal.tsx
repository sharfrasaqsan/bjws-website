"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "fade-up" | "fade" | "scale" | "left" | "right";
  delay?: number | 1 | 2 | 3 | 4 | 5 | 6;
  threshold?: number;
  rootMargin?: string;
  as?: React.ElementType;
}

/**
 * ScrollReveal: High-performance, lightweight, SEO-friendly scroll animation wrapper.
 * - Leaves SSR HTML 100% visible to web crawlers and noscript users.
 * - Activates only on client mount with an efficient IntersectionObserver.
 * - Unobserves immediately upon entering viewport (one-time smooth reveal).
 * - Fully respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  variant = "fade-up",
  delay,
  threshold = 0.12,
  rootMargin = "0px 0px -40px 0px",
  as: Component = "div",
  className,
  style,
  ...props
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user's motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Attach initial state on client
    el.classList.add("reveal-init");
    if (variant === "fade") el.classList.add("reveal-fade");
    if (variant === "scale") el.classList.add("reveal-scale");
    if (variant === "left") el.classList.add("reveal-left");
    if (variant === "right") el.classList.add("reveal-right");

    if (typeof delay === "number" && delay > 0 && delay <= 6) {
      el.classList.add(`reveal-delay-${delay}`);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [variant, delay, threshold, rootMargin]);

  const customStyle: React.CSSProperties = {
    ...style,
    ...(typeof delay === "number" && delay > 6
      ? { transitionDelay: `${delay}ms` }
      : {}),
  };

  return (
    <Component
      ref={ref}
      className={cn(className)}
      style={customStyle}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * ScrollRevealGroup: Helper for staggered grids of items.
 * Wraps children and automatically staggers entrance animations.
 */
export function ScrollRevealGroup({
  children,
  staggerMs = 60,
  variant = "fade-up",
  className,
  as: Component = "div",
  ...props
}: {
  children: React.ReactNode;
  staggerMs?: number;
  variant?: "fade-up" | "fade" | "scale" | "left" | "right";
  className?: string;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component className={cn(className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <ScrollReveal
            variant={variant}
            delay={Math.min((index + 1) * staggerMs, 400)}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </Component>
  );
}

