"use client";

import * as React from "react";
import { useState, useSyncExternalStore } from "react";
import { Phone, X } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return typeof window !== "undefined"
    ? sessionStorage.getItem("bjws_emergency_pill_dismissed") === "true"
    : false;
}

function getServerSnapshot() {
  return false;
}

export function EmergencyHotlinePill() {
  const isStoredDismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [isDismissedLocal, setIsDismissedLocal] = useState(false);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDismissedLocal(true);
    try {
      sessionStorage.setItem("bjws_emergency_pill_dismissed", "true");
    } catch {
      // Ignore storage restrictions
    }
  };

  if (isStoredDismissed || isDismissedLocal) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-4 z-40 duration-300 md:hidden">
      <div className="group relative flex items-center rounded-full border border-[#c99a45]/60 bg-[#072115] py-2 pr-2 pl-3 text-white shadow-2xl backdrop-blur-md">
        {/* Pulsing Green Indicator */}
        <span className="relative mr-2 flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>

        {/* Call Link */}
        <a
          href="tel:+94776227323"
          className="flex items-center gap-2 pr-1 text-xs font-bold text-white transition-colors hover:text-[#f5d78e]"
          title="Direct Dial 24/7 Funeral Hotline"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c99a45]/40 bg-[#124d34] text-[#d4af37]">
            <Phone className="h-3.5 w-3.5 animate-bounce" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-semibold tracking-wider text-[#f5d78e] uppercase">
              24/7 Janaza Hotline
            </span>
            <span className="font-mono text-xs font-bold text-white">
              077 622 7323
            </span>
          </div>
        </a>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="ml-2 cursor-pointer rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Dismiss Hotline Pill"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
