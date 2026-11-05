"use client";

import * as React from "react";
import { useState, useSyncExternalStore } from "react";
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";

interface ShareButtonsProps {
  title: string;
  excerpt?: string;
  url?: string;
  label?: string;
}

const emptySubscribe = () => () => {};

export function ShareButtons({
  title,
  excerpt = "",
  url,
  label = "Share Article:",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = useSyncExternalStore(
    emptySubscribe,
    () => url || (typeof window !== "undefined" ? window.location.href : ""),
    () => url || ""
  );

  const canNativeShare = useSyncExternalStore(
    emptySubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );

  const handleCopyLink = async () => {
    const targetUrl = currentUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (!targetUrl) return;

    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback prompt if clipboard API blocked
      window.prompt("Copy article link:", targetUrl);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || title,
          url: currentUrl,
        });
      } catch {
        // User cancelled share sheet
      }
    }
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(`${title}\n\nRead more on Buhary Janaza Welfare Society:`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e6e4dc] pt-6 mt-8">
      {/* Label with icon */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b2e1e]">
        <Share2 className="h-4 w-4 text-[#c99a45]" />
        <span>{label}</span>
      </div>

      {/* Share Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Native Mobile Share Sheet */}
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b2e1e] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#124d34] shadow-2xs transition-all cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 text-[#d4a359]" />
            <span>Share via App</span>
          </button>
        )}

        {/* WhatsApp Share */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-[#25D366]/10 px-3.5 py-1.5 text-xs font-bold text-emerald-900 hover:bg-[#25D366]/20 transition-all shadow-2xs cursor-pointer"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
          <span>WhatsApp</span>
        </a>

        {/* Facebook Share */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-blue-600/30 bg-[#1877F2]/10 px-3.5 py-1.5 text-xs font-bold text-blue-900 hover:bg-[#1877F2]/20 transition-all shadow-2xs cursor-pointer"
          title="Share on Facebook"
        >
          <svg className="h-3.5 w-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </a>

        {/* X / Twitter Share */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-black/20 bg-black/5 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-black/10 transition-all shadow-2xs cursor-pointer"
          title="Share on X"
        >
          <svg className="h-3.5 w-3.5 fill-black" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Post</span>
        </a>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
            copied
              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
              : "border-[#e6e4dc] bg-white text-text hover:bg-muted"
          }`}
          title="Copy article link to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-bold text-emerald-700">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-text-muted" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
