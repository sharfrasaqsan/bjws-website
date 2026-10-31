"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";

// Intercept React 19 false-positive script warning during dev hydration / client locale transitions
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args
      .map((arg) => (typeof arg === "string" ? arg : ""))
      .join(" ");
    if (message.includes("Encountered a script tag")) {
      return;
    }
    originalError.apply(console, args);
  };
}

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('bjws-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&p)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`;

export function ThemeScript() {
  const isInserted = React.useRef(false);

  useServerInsertedHTML(() => {
    if (isInserted.current) return null;
    isInserted.current = true;
    return (
      <script
        id="theme-script"
        dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        suppressHydrationWarning
      />
    );
  });

  return null;
}
