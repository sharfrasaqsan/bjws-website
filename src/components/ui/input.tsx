import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "bg-surface text-text flex h-11 w-full rounded-md border px-3.5 py-2 text-base shadow-xs transition-colors",
          "placeholder:text-text-muted/60",
          "focus-visible:ring-ring ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60",
          error
            ? "border-destructive text-destructive focus-visible:ring-destructive"
            : "border-border hover:border-border-hover focus-visible:border-primary",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
