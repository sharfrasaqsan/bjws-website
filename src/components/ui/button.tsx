import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors duration-150 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

  const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs active:bg-primary-hover",
    secondary:
      "bg-surface-muted text-text hover:bg-muted border border-border shadow-xs",
    outline:
      "border border-border bg-surface text-text hover:bg-surface-muted hover:border-border-hover shadow-xs",
    ghost: "text-text hover:bg-muted hover:text-text",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-red-800 shadow-xs",
    link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-normal",
  };

  const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-9 px-3 text-sm rounded-md gap-1.5",
    md: "h-11 px-4 text-base rounded-md gap-2",
    lg: "h-12 px-6 text-base sm:text-lg rounded-md gap-2.5",
    icon: "h-10 w-10 p-0 rounded-md",
  };

  return cn(
    baseStyles,
    variantStyles[variant],
    variant !== "link" && sizeStyles[size],
    className
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {isLoading && (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
