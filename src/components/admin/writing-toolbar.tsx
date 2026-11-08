"use client";

import * as React from "react";
import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Image as ImageIcon,
  Eye,
  Edit3,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { type ArticleImage } from "@/content/news";
import { RichArticleContent } from "@/components/ui/rich-article-content";

interface WritingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (val: string) => void;
  internalImages?: ArticleImage[];
  placeholder?: string;
  rows?: number;
  label?: string;
  languageLabel?: string;
  name?: string;
  required?: boolean;
}

export function WritingToolbar({
  textareaRef,
  value,
  onChange,
  internalImages = [],
  placeholder = "Write your article content here...",
  rows = 12,
  label,
  languageLabel,
  name,
  required,
}: WritingToolbarProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  // Helper to wrap or insert text at cursor position in textarea
  const wrapSelection = (
    before: string,
    after: string = "",
    defaultText: string = "text"
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;

    const updated =
      value.substring(0, start) +
      before +
      selected +
      after +
      value.substring(end);
    onChange(updated);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 10);
  };

  const handleApplyLink = () => {
    if (!linkUrl.trim()) {
      setIsLinkDialogOpen(false);
      return;
    }
    const labelToUse = linkText.trim() || linkUrl.trim();
    wrapSelection(`[${labelToUse}](`, `)`, "");
    setLinkUrl("");
    setLinkText("");
    setIsLinkDialogOpen(false);
  };

  const handleInsertInternalImage = (img: ArticleImage) => {
    const alt = img.alt || "Article illustration";
    const markdown = `\n![${alt}](${img.url})\n`;
    wrapSelection(markdown, "", "");
    setIsImagePickerOpen(false);
  };

  // Word count and reading time
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className="space-y-2">
      {/* Field Label and Tab Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-text block text-xs font-semibold">
          {label || "Full Content"}
          {languageLabel && (
            <span className="text-text-muted ml-1 font-normal">
              ({languageLabel})
            </span>
          )}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>

        {/* Write / Preview Tab Pill */}
        <div className="bg-surface-muted/60 inline-flex items-center rounded-lg border border-[#e6e4dc] p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
              activeTab === "write"
                ? "bg-white font-bold text-[#0b2e1e] shadow-2xs"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Edit3 className="h-3 w-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
              activeTab === "preview"
                ? "bg-white font-bold text-[#0b2e1e] shadow-2xs"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {activeTab === "write" ? (
        <div className="focus-within:border-primary focus-within:ring-primary/20 overflow-hidden rounded-xl border border-[#e6e4dc] bg-white shadow-2xs focus-within:ring-2">
          {/* Enhanced Writing Toolbar */}
          <div className="text-text-muted flex flex-wrap items-center gap-0.5 border-b border-[#f0eee6] bg-[#fbfaf6] p-1.5 text-xs">
            {/* Bold */}
            <button
              type="button"
              onClick={() => wrapSelection("**", "**", "bold text")}
              title="Bold (**text**)"
              className="hover:text-text cursor-pointer rounded p-1.5 transition-colors hover:bg-white hover:shadow-2xs"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => wrapSelection("*", "*", "italic text")}
              title="Italic (*text*)"
              className="hover:text-text cursor-pointer rounded p-1.5 transition-colors hover:bg-white hover:shadow-2xs"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>

            {/* Underline */}
            <button
              type="button"
              onClick={() => wrapSelection("<u>", "</u>", "underline text")}
              title="Underline (<u>text</u>)"
              className="hover:text-text cursor-pointer rounded p-1.5 transition-colors hover:bg-white hover:shadow-2xs"
            >
              <Underline className="h-3.5 w-3.5" />
            </button>

            <span className="mx-1 h-3.5 w-px bg-[#e6e4dc]" />

            {/* Link Dialog Trigger */}
            <button
              type="button"
              onClick={() => {
                const textarea = textareaRef.current;
                if (textarea) {
                  const sel = value.substring(
                    textarea.selectionStart,
                    textarea.selectionEnd
                  );
                  setLinkText(sel);
                }
                setIsLinkDialogOpen(true);
              }}
              title="Insert Link [Text](URL)"
              className="hover:text-text cursor-pointer rounded p-1.5 transition-colors hover:bg-white hover:shadow-2xs"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </button>

            {/* Heading 2 */}
            <button
              type="button"
              onClick={() => wrapSelection("\n## ", "\n", "Heading 2")}
              title="Heading 2 (## Section Title)"
              className="hover:text-text flex cursor-pointer items-center gap-0.5 rounded px-2 py-1 text-[11px] font-bold transition-colors hover:bg-white hover:shadow-2xs"
            >
              <Heading2 className="h-3.5 w-3.5" />
            </button>

            {/* Heading 3 */}
            <button
              type="button"
              onClick={() => wrapSelection("\n### ", "\n", "Heading 3")}
              title="Heading 3 (### Sub-section Title)"
              className="hover:text-text flex cursor-pointer items-center gap-0.5 rounded px-2 py-1 text-[11px] font-bold transition-colors hover:bg-white hover:shadow-2xs"
            >
              <Heading3 className="h-3.5 w-3.5" />
            </button>

            <span className="mx-1 h-3.5 w-px bg-[#e6e4dc]" />

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => wrapSelection("\n- ", "\n- ", "List item")}
              title="Bulleted List (- item)"
              className="hover:text-text cursor-pointer rounded p-1.5 transition-colors hover:bg-white hover:shadow-2xs"
            >
              <List className="h-3.5 w-3.5" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => wrapSelection("\n1. ", "\n2. ", "Numbered item")}
              title="Numbered List (1. item)"
              className="hover:text-text cursor-pointer rounded p-1.5 transition-colors hover:bg-white hover:shadow-2xs"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>

            {/* Quote */}
            <button
              type="button"
              onClick={() =>
                wrapSelection("\n> ", "\n", "Quotation or key announcement")
              }
              title="Quote (> Quote text)"
              className="hover:text-text cursor-pointer rounded p-1.5 transition-colors hover:bg-white hover:shadow-2xs"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>

            {/* Divider */}
            <button
              type="button"
              onClick={() => wrapSelection("\n---\n", "", "")}
              title="Horizontal Divider (---)"
              className="hover:text-text cursor-pointer rounded p-1.5 transition-colors hover:bg-white hover:shadow-2xs"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <span className="mx-1 h-3.5 w-px bg-[#e6e4dc]" />

            {/* Internal Image Insert Button */}
            {internalImages.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsImagePickerOpen(!isImagePickerOpen)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded bg-[#e8f3ee] px-2 py-1 text-[11px] font-semibold text-[#0b2e1e] transition-colors hover:bg-[#d8eade]"
                  title="Insert an image from this article's photo gallery"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-[#124d34]" />
                  <span>Insert Photo ({internalImages.length})</span>
                </button>

                {/* Dropdown Image Picker */}
                {isImagePickerOpen && (
                  <div className="absolute top-full left-0 z-20 mt-1 w-64 space-y-1 rounded-xl border border-[#e6e4dc] bg-white p-2 shadow-xl">
                    <div className="text-text-muted px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
                      Pick article photo to insert:
                    </div>
                    {internalImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleInsertInternalImage(img)}
                        className="text-text flex w-full cursor-pointer items-center gap-2 rounded-lg p-1.5 text-left text-xs transition-colors hover:bg-[#fbfaf6]"
                      >
                        <div className="bg-muted relative h-8 w-8 shrink-0 overflow-hidden rounded border border-[#e6e4dc]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.alt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="flex-1 truncate text-[11px] font-medium">
                          {img.alt || `Photo ${i + 1}`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Inline Link Dialog */}
          {isLinkDialogOpen && (
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e6e4dc] bg-[#e8f3ee]/60 p-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-[#0b2e1e]">
                <LinkIcon className="h-3.5 w-3.5" />
                Add Link:
              </span>
              <input
                type="text"
                placeholder="Link text (optional)"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="focus:ring-primary w-40 rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1 text-xs focus:ring-1 focus:outline-none"
              />
              <input
                type="url"
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="focus:ring-primary min-w-[180px] flex-1 rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1 text-xs focus:ring-1 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyLink}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#124d34] px-3 py-1 font-semibold text-white hover:bg-[#0b2e1e]"
              >
                <Check className="h-3 w-3" /> Insert
              </button>
              <button
                type="button"
                onClick={() => setIsLinkDialogOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer rounded-lg border border-[#e6e4dc] bg-white px-2 py-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Real Textarea */}
          <textarea
            ref={textareaRef}
            name={name}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="text-text min-h-[160px] w-full resize-y bg-white p-3.5 font-sans text-xs leading-relaxed focus:outline-none sm:text-sm"
          />

          {/* Bottom stats bar */}
          <div className="text-text-muted flex items-center justify-between border-t border-[#f0eee6] bg-[#fbfaf6] px-3.5 py-2 text-[11px]">
            <div className="flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>~{readTime} min read</span>
            </div>
            <span className="text-text-muted/70 text-[10px]">
              Supports **bold**, *italic*, &lt;u&gt;underline&lt;/u&gt;,
              [links](url), ## H2, ### H3, - lists, &gt; quotes
            </span>
          </div>
        </div>
      ) : (
        /* Live Preview Container */
        <div className="min-h-[220px] space-y-4 rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] p-5 shadow-2xs sm:p-6">
          <div className="text-text-muted mb-3 flex items-center justify-between border-b border-[#e6e4dc] pb-2 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-[#0b2e1e]">
              <Sparkles className="h-3.5 w-3.5 text-[#c99a45]" />
              Live Visual Preview
            </span>
            <span>
              ~{readTime} min read ({wordCount} words)
            </span>
          </div>

          {value.trim() ? (
            <RichArticleContent content={value} />
          ) : (
            <div className="text-text-muted py-12 text-center text-xs italic">
              Nothing written yet. Switch to &quot;Write&quot; tab to start
              composing your article.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
