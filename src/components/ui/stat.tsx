import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "card" | "plain";
}

export function Stat({
  value,
  label,
  description,
  icon,
  variant = "card",
  className,
  ...props
}: StatProps) {
  const isCard = variant === "card";

  return (
    <div
      className={cn(
        "flex flex-col",
        isCard &&
          "bg-surface border-border hover:border-border-hover rounded-xl border p-6 shadow-xs transition-colors",
        className
      )}
      {...props}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <dt className="text-text-muted text-sm font-medium">{label}</dt>
        {icon && (
          <span
            className="text-primary rounded-lg bg-[#e8f3ee] p-2"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>
      <dd className="text-text text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
        {value}
      </dd>
      {description && (
        <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}
