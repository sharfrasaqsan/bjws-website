import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "bg-surface text-text flex w-full rounded-md border px-3.5 py-2.5 text-base leading-relaxed shadow-xs transition-colors",
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

Textarea.displayName = "Textarea";
