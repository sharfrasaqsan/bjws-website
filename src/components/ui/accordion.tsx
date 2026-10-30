"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openValues: string[];
  toggleValue: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  children: React.ReactNode;
}

export function Accordion({
  type = "single",
  defaultValue,
  className,
  children,
  ...props
}: AccordionProps) {
  const [openValues, setOpenValues] = React.useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggleValue = React.useCallback(
    (value: string) => {
      setOpenValues((prev) => {
        if (type === "single") {
          return prev.includes(value) ? [] : [value];
        }
        return prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
      });
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ openValues, toggleValue }}>
      <div
        className={cn(
          "divide-border border-border divide-y border-y",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextType {
  value: string;
  isOpen: boolean;
  itemId: string;
}

const AccordionItemContext =
  React.createContext<AccordionItemContextType | null>(null);

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }

  const itemId = React.useId();
  const isOpen = context.openValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, itemId }}>
      <div className={cn("py-1", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const itemContext = React.useContext(AccordionItemContext);
  const accordionContext = React.useContext(AccordionContext);

  if (!itemContext || !accordionContext) {
    throw new Error("AccordionTrigger must be used within an AccordionItem");
  }

  const { value, isOpen, itemId } = itemContext;

  return (
    <button
      type="button"
      id={`trigger-${itemId}`}
      aria-expanded={isOpen}
      aria-controls={`content-${itemId}`}
      onClick={() => accordionContext.toggleValue(value)}
      className={cn(
        "text-text flex w-full items-center justify-between py-4 text-left font-medium",
        "hover:text-primary focus-visible:ring-ring rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <span className="text-base sm:text-lg">{children}</span>
      <svg
        className={cn(
          "text-text-muted h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
          isOpen && "text-primary rotate-180"
        )}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </button>
  );
}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const itemContext = React.useContext(AccordionItemContext);
  if (!itemContext) {
    throw new Error("AccordionContent must be used within an AccordionItem");
  }

  const { isOpen, itemId } = itemContext;

  return (
    <div
      id={`content-${itemId}`}
      role="region"
      aria-labelledby={`trigger-${itemId}`}
      hidden={!isOpen}
      className={cn(
        "grid transition-all duration-200 ease-in-out motion-reduce:transition-none",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "text-text-muted pt-1 pb-5 text-sm leading-relaxed sm:text-base",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
