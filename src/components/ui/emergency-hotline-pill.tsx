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
    <div className="fixed bottom-4 right-4 z-40 md:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="group relative flex items-center rounded-full border border-[#c99a45]/60 bg-[#072115] text-white shadow-2xl pl-3 pr-2 py-2 backdrop-blur-md">
        {/* Pulsing Green Indicator */}
        <span className="relative flex h-2.5 w-2.5 mr-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>

        {/* Call Link */}
        <a
          href="tel:+94776227323"
          className="flex items-center gap-2 text-xs font-bold text-white hover:text-[#f5d78e] transition-colors pr-1"
          title="Direct Dial 24/7 Funeral Hotline"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#124d34] text-[#d4af37] border border-[#c99a45]/40 shrink-0">
            <Phone className="h-3.5 w-3.5 animate-bounce" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-semibold text-[#f5d78e] uppercase tracking-wider">
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
          className="ml-2 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          aria-label="Dismiss Hotline Pill"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
