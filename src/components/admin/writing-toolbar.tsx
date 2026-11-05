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
  const wrapSelection = (before: string, after: string = "", defaultText: string = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;

    const updated = value.substring(0, start) + before + selected + after + value.substring(end);
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
        <label className="block text-xs font-semibold text-text">
          {label || "Full Content"}
          {languageLabel && <span className="ml-1 text-text-muted font-normal">({languageLabel})</span>}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>

        {/* Write / Preview Tab Pill */}
        <div className="inline-flex items-center rounded-lg border border-[#e6e4dc] bg-surface-muted/60 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
              activeTab === "write"
                ? "bg-white text-[#0b2e1e] font-bold shadow-2xs"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Edit3 className="h-3 w-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
              activeTab === "preview"
                ? "bg-white text-[#0b2e1e] font-bold shadow-2xs"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {activeTab === "write" ? (
        <div className="rounded-xl border border-[#e6e4dc] bg-white overflow-hidden shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          {/* Enhanced Writing Toolbar */}
          <div className="flex flex-wrap items-center gap-0.5 border-b border-[#f0eee6] bg-[#fbfaf6] p-1.5 text-xs text-text-muted">
            {/* Bold */}
            <button
              type="button"
              onClick={() => wrapSelection("**", "**", "bold text")}
              title="Bold (**text**)"
              className="p-1.5 rounded hover:bg-white hover:text-text hover:shadow-2xs transition-colors cursor-pointer"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => wrapSelection("*", "*", "italic text")}
              title="Italic (*text*)"
              className="p-1.5 rounded hover:bg-white hover:text-text hover:shadow-2xs transition-colors cursor-pointer"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>

            {/* Underline */}
            <button
              type="button"
              onClick={() => wrapSelection("<u>", "</u>", "underline text")}
              title="Underline (<u>text</u>)"
              className="p-1.5 rounded hover:bg-white hover:text-text hover:shadow-2xs transition-colors cursor-pointer"
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
                  const sel = value.substring(textarea.selectionStart, textarea.selectionEnd);
                  setLinkText(sel);
                }
                setIsLinkDialogOpen(true);
              }}
              title="Insert Link [Text](URL)"
              className="p-1.5 rounded hover:bg-white hover:text-text hover:shadow-2xs transition-colors cursor-pointer"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </button>

            {/* Heading 2 */}
            <button
              type="button"
              onClick={() => wrapSelection("\n## ", "\n", "Heading 2")}
              title="Heading 2 (## Section Title)"
              className="px-2 py-1 rounded hover:bg-white hover:text-text hover:shadow-2xs font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-0.5"
            >
              <Heading2 className="h-3.5 w-3.5" />
            </button>

            {/* Heading 3 */}
            <button
              type="button"
              onClick={() => wrapSelection("\n### ", "\n", "Heading 3")}
              title="Heading 3 (### Sub-section Title)"
              className="px-2 py-1 rounded hover:bg-white hover:text-text hover:shadow-2xs font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-0.5"
            >
              <Heading3 className="h-3.5 w-3.5" />
            </button>

            <span className="mx-1 h-3.5 w-px bg-[#e6e4dc]" />

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => wrapSelection("\n- ", "\n- ", "List item")}
              title="Bulleted List (- item)"
              className="p-1.5 rounded hover:bg-white hover:text-text hover:shadow-2xs transition-colors cursor-pointer"
            >
              <List className="h-3.5 w-3.5" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => wrapSelection("\n1. ", "\n2. ", "Numbered item")}
              title="Numbered List (1. item)"
              className="p-1.5 rounded hover:bg-white hover:text-text hover:shadow-2xs transition-colors cursor-pointer"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>

            {/* Quote */}
            <button
              type="button"
              onClick={() => wrapSelection("\n> ", "\n", "Quotation or key announcement")}
              title="Quote (> Quote text)"
              className="p-1.5 rounded hover:bg-white hover:text-text hover:shadow-2xs transition-colors cursor-pointer"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>

            {/* Divider */}
            <button
              type="button"
              onClick={() => wrapSelection("\n---\n", "", "")}
              title="Horizontal Divider (---)"
              className="p-1.5 rounded hover:bg-white hover:text-text hover:shadow-2xs transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#e8f3ee] text-[#0b2e1e] font-semibold text-[11px] hover:bg-[#d8eade] transition-colors cursor-pointer"
                  title="Insert an image from this article's photo gallery"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-[#124d34]" />
                  <span>Insert Photo ({internalImages.length})</span>
                </button>

                {/* Dropdown Image Picker */}
                {isImagePickerOpen && (
                  <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-[#e6e4dc] bg-white p-2 shadow-xl z-20 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-2 py-1">
                      Pick article photo to insert:
                    </div>
                    {internalImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleInsertInternalImage(img)}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-[#fbfaf6] flex items-center gap-2 text-xs text-text transition-colors cursor-pointer"
                      >
                        <div className="h-8 w-8 rounded bg-muted shrink-0 overflow-hidden relative border border-[#e6e4dc]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.alt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="truncate flex-1 font-medium text-[11px]">
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
            <div className="p-3 bg-[#e8f3ee]/60 border-b border-[#e6e4dc] flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-[#0b2e1e] flex items-center gap-1">
                <LinkIcon className="h-3.5 w-3.5" />
                Add Link:
              </span>
              <input
                type="text"
                placeholder="Link text (optional)"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-40"
              />
              <input
                type="url"
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary flex-1 min-w-[180px]"
              />
              <button
                type="button"
                onClick={handleApplyLink}
                className="rounded-lg bg-[#124d34] text-white px-3 py-1 font-semibold hover:bg-[#0b2e1e] cursor-pointer inline-flex items-center gap-1"
              >
                <Check className="h-3 w-3" /> Insert
              </button>
              <button
                type="button"
                onClick={() => setIsLinkDialogOpen(false)}
                className="rounded-lg border border-[#e6e4dc] bg-white text-text-muted hover:text-text px-2 py-1 cursor-pointer"
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
            className="w-full bg-white p-3.5 text-xs sm:text-sm font-sans text-text leading-relaxed focus:outline-none resize-y min-h-[160px]"
          />

          {/* Bottom stats bar */}
          <div className="flex items-center justify-between border-t border-[#f0eee6] bg-[#fbfaf6] px-3.5 py-2 text-[11px] text-text-muted">
            <div className="flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>~{readTime} min read</span>
            </div>
            <span className="text-[10px] text-text-muted/70">
              Supports **bold**, *italic*, &lt;u&gt;underline&lt;/u&gt;, [links](url), ## H2, ### H3, - lists, &gt; quotes
            </span>
          </div>
        </div>
      ) : (
        /* Live Preview Container */
        <div className="rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] p-5 sm:p-6 min-h-[220px] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6e4dc] pb-2 mb-3 text-xs text-text-muted">
            <span className="font-bold text-[#0b2e1e] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#c99a45]" />
              Live Visual Preview
            </span>
            <span>~{readTime} min read ({wordCount} words)</span>
          </div>

          {value.trim() ? (
            <RichArticleContent content={value} />
          ) : (
            <div className="py-12 text-center text-xs text-text-muted italic">
              Nothing written yet. Switch to &quot;Write&quot; tab to start composing your article.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

