import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  label?: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string | React.ReactNode;
  children: React.ReactNode;
}

export function FormField({
  id: explicitId,
  label,
  required,
  hint,
  error,
  children,
  className,
  ...props
}: FormFieldProps) {
  const generatedId = React.useId();
  const id = explicitId || generatedId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  // Enhance child input/textarea with accessibility attributes
  const enhancedChildren = React.isValidElement<{
    id?: string;
    error?: boolean;
    "aria-describedby"?: string;
  }>(children)
    ? React.cloneElement(children, {
        id: children.props.id || id,
        error:
          children.props.error !== undefined
            ? children.props.error
            : Boolean(error),
        "aria-describedby":
          [children.props["aria-describedby"], describedBy]
            .filter(Boolean)
            .join(" ") || undefined,
      })
    : children;

  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      {enhancedChildren}

      {hint && !error && (
        <p id={hintId} className="text-text-muted text-xs leading-relaxed">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-destructive flex items-center gap-1.5 text-xs leading-relaxed font-medium"
        >
          <svg
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm-.75-9.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.75a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
