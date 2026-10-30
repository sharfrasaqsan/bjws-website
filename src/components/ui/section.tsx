import * as React from "react";
import { cn } from "@/lib/utils";
import { Container, ContainerProps } from "./container";

export interface SectionProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  variant?: "default" | "surface" | "muted";
  containerSize?: ContainerProps["size"];
  headerClassName?: string;
}

const variantStyles: Record<NonNullable<SectionProps["variant"]>, string> = {
  default: "bg-background text-text",
  surface: "bg-surface text-text border-y border-border/60",
  muted: "bg-muted text-text border-y border-border/80",
};

export function Section({
  eyebrow,
  title,
  description,
  align = "left",
  variant = "default",
  containerSize = "lg",
  headerClassName,
  className,
  children,
  ...props
}: SectionProps) {
  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <section
      className={cn(
        "py-12 sm:py-16 lg:py-20",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <Container size={containerSize}>
        {hasHeader && (
          <div
            className={cn(
              "mb-8 max-w-3xl space-y-3 sm:mb-12",
              align === "center" && "mx-auto text-center",
              headerClassName
            )}
          >
            {eyebrow && (
              <div className="text-primary inline-block text-xs font-semibold tracking-wider uppercase">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-text text-2xl leading-snug font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-text-muted text-base leading-relaxed sm:text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
