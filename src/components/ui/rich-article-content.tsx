"use client";

import * as React from "react";
import { formatGoogleDriveImageUrl } from "@/lib/utils";
import { CheckCircle2, ExternalLink, Quote } from "lucide-react";
import { ArticleInlineImage } from "./article-inline-image";

export interface RichArticleContentProps {
  content: string;
  className?: string;
}

/**
 * Parses inline formatting:
 * - Bold: **text** or <b>text</b> or <strong>text</strong>
 * - Italic: *text* or <i>text</i> or <em>text</em>
 * - Underline: <u>text</u>
 * - Link: [label](url)
 */
export function formatInlineText(text: string): React.ReactNode {
  // Regex to match markdown links, bold, italic, underline, and basic HTML tags
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|<u>.*?<\/u>|<b>.*?<\/b>|<i>.*?<\/i>|<strong>.*?<\/strong>|<em>.*?<\/em>)/g;

  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isExternal = url.startsWith("http");
      return (
        <a
          key={i}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[#124d34] underline decoration-[#c99a45] decoration-2 underline-offset-4 hover:text-[#0b2e1e] font-semibold transition-colors inline-flex items-center gap-0.5"
        >
          <span>{label}</span>
          {isExternal && <ExternalLink className="h-3 w-3 inline ml-0.5 opacity-70" />}
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-[#0b2e1e]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Bold HTML: <b>...</b> or <strong>...</strong>
    const bMatch = part.match(/^<b>(.*?)<\/b>$/i) || part.match(/^<strong>(.*?)<\/strong>$/i);
    if (bMatch) {
      return (
        <strong key={i} className="font-bold text-[#0b2e1e]">
          {bMatch[1]}
        </strong>
      );
    }

    // Underline HTML: <u>...</u>
    const uMatch = part.match(/^<u>(.*?)<\/u>$/i);
    if (uMatch) {
      return (
        <u key={i} className="underline decoration-1 underline-offset-2">
          {uMatch[1]}
        </u>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Italic HTML: <i>...</i> or <em>...</em>
    const iMatch = part.match(/^<i>(.*?)<\/i>$/i) || part.match(/^<em>(.*?)<\/em>$/i);
    if (iMatch) {
      return (
        <em key={i} className="italic">
          {iMatch[1]}
        </em>
      );
    }

    return part;
  });
}

export function RichArticleContent({
  content,
  className = "",
}: RichArticleContentProps) {
  if (!content) return null;

  // Split into paragraph blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-5 text-sm sm:text-base text-text leading-relaxed font-sans ${className}`}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Horizontal divider
        if (trimmed === "---" || trimmed === "***") {
          return (
            <hr
              key={idx}
              className="my-8 border-t border-[#e6e4dc]"
            />
          );
        }

        // 2. Markdown Image: ![alt](url)
        const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
          const [, alt, rawUrl] = imgMatch;
          const formattedUrl = formatGoogleDriveImageUrl(rawUrl);
          return (
            <ArticleInlineImage
              key={idx}
              src={formattedUrl}
              alt={alt || "BJWS Article Illustration"}
            />
          );
        }

        // 3. Heading 2 (## Title)
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="font-display text-xl sm:text-2xl font-bold text-[#0b2e1e] pt-6 tracking-tight border-b border-[#f0eee6] pb-2"
            >
              {formatInlineText(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        // 4. Heading 3 (### Title)
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="font-display text-lg sm:text-xl font-bold text-[#0b2e1e] pt-4 tracking-tight"
            >
              {formatInlineText(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        // 5. Blockquote (> Quote)
        if (trimmed.startsWith("> ")) {
          const quoteLines = trimmed.split("\n").map((l) => l.replace(/^>\s*/, ""));
          return (
            <blockquote
              key={idx}
              className="my-5 rounded-2xl border-l-4 border-[#c99a45] bg-[#fbfaf6] p-4 sm:p-5 italic text-[#0b2e1e] shadow-xs"
            >
              <div className="flex items-start gap-3">
                <Quote className="h-5 w-5 text-[#c99a45] shrink-0 mt-0.5 opacity-80" />
                <div className="space-y-1 text-sm sm:text-base leading-relaxed">
                  {quoteLines.map((line, lIdx) => (
                    <p key={lIdx}>{formatInlineText(line)}</p>
                  ))}
                </div>
              </div>
            </blockquote>
          );
        }

        // 6. Lists: Bullet list (- or *) or Numbered list (1. 2.)
        if (
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          /^[0-9]+\.\s+/.test(trimmed) ||
          trimmed.includes("\n- ") ||
          trimmed.includes("\n* ") ||
          /\n[0-9]+\.\s+/.test(trimmed)
        ) {
          const lines = trimmed.split("\n");
          const isOrdered = /^[0-9]+\.\s+/.test(trimmed);

          return (
            <ul key={idx} className="space-y-2 py-2">
              {lines.map((l, lIdx) => {
                const cleanLine = l.replace(/^[0-9]+\.\s+|^[-*]\s+/, "");
                if (!cleanLine.trim()) return null;

                return (
                  <li
                    key={lIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-text leading-relaxed"
                  >
                    {isOrdered ? (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c99a45]/20 text-[#072015] font-bold text-[10px] mt-0.5">
                        {lIdx + 1}
                      </span>
                    ) : (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#c99a45] mt-0.5" />
                    )}
                    <span className="flex-1">{formatInlineText(cleanLine)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 7. Regular narrative paragraph
        return (
          <p key={idx} className="text-text/90 leading-relaxed">
            {formatInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default RichArticleContent;
