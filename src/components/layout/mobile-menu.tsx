"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { X, Heart, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import type { NavItem } from "./nav-items";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Keep track of which dropdown accordions are expanded
  const [expandedDropdowns, setExpandedDropdowns] = React.useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = { about: true, media: true };
    navItems.forEach((item) => {
      if (item.type === "dropdown") {
        if (item.items.some((sub) => pathname.startsWith(sub.href))) {
          initial[item.id] = true;
        }
      }
    });
    return initial;
  });

  const toggleDropdown = (id: string) => {
    setExpandedDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Focus trapping and Escape key handling
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("common.openMenu")}
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={cn(
          "bg-surface border-border fixed inset-y-0 right-0 w-full max-w-sm border-l shadow-2xl",
          "flex flex-col justify-between overflow-y-auto p-6 transition-transform duration-200 motion-reduce:duration-0"
        )}
      >
        <div>
          {/* Header row with logo */}
          <div className="border-border flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-emerald-900/10">
                <Image
                  src="/images/bjws logo.webp"
                  alt="BJWS Emblem"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="font-display text-sm leading-tight font-bold text-[#0b2e1e] dark:text-[#f5eedf]">
                  {t("common.societyShort")}
                </div>
                <div className="text-text-muted flex items-center gap-1 text-[11px]">
                  <MapPin className="text-primary h-3 w-3" />
                  <span>{t("common.location")}</span>
                </div>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={t("common.closeMenu")}
              className="text-text-muted hover:text-text hover:bg-muted focus-visible:ring-ring rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links with Accordion Sub-sections */}
          <nav
            className="mt-6 flex flex-col space-y-1.5"
            aria-label="Mobile Navigation"
          >
            {navItems.map((item) => {
              if (item.type === "link") {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#124d34] font-semibold text-white shadow-2xs"
                        : "text-text hover:bg-muted hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              // Accordion Dropdown Group
              const isExpanded = !!expandedDropdowns[item.id];
              const isAnyChildActive = item.items.some((sub) =>
                pathname.startsWith(sub.href)
              );

              return (
                <div
                  key={item.id}
                  className="border-border/50 bg-surface-muted/30 overflow-hidden rounded-xl border"
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.id)}
                    aria-expanded={isExpanded}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm font-medium transition-colors",
                      isAnyChildActive
                        ? "text-primary font-semibold"
                        : "text-text hover:text-primary"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {isAnyChildActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-[#c99a45]" />
                      )}
                    </span>
                    <ChevronDown
                      className={cn(
                        "text-text-muted h-4 w-4 transition-transform duration-200",
                        isExpanded && "text-primary rotate-180"
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="border-border/40 bg-surface/50 space-y-1 border-t p-1.5">
                      {item.items.map((sub) => {
                        const isSubActive = pathname.startsWith(sub.href);
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                              isSubActive
                                ? "bg-[#124d34] font-semibold text-white shadow-2xs"
                                : "text-text hover:bg-muted hover:text-primary"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                                isSubActive
                                  ? "bg-white/20 text-white"
                                  : "bg-emerald-100 text-[#124d34] dark:bg-emerald-950/60 dark:text-[#52b788]"
                              )}
                            >
                              <SubIcon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex min-w-0 flex-col">
                              <span className="leading-tight">{sub.label}</span>
                              <span
                                className={cn(
                                  "truncate text-[10px]",
                                  isSubActive
                                    ? "text-emerald-100/80"
                                    : "text-text-muted"
                                )}
                              >
                                {sub.description}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & Contact Info */}
        <div className="border-border space-y-4 border-t pt-5">
          {/* Quick Contact */}
          <div className="text-text-muted space-y-1.5 text-xs">
            <a
              href="tel:+94776227323"
              className="text-primary flex items-center gap-2 font-medium hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>077 622 7323 ({t("common.emergencyBadge")})</span>
            </a>
            <a
              href="mailto:bjwsociety@gmail.com"
              className="flex items-center gap-2 hover:underline"
            >
              <Mail className="text-text-muted h-3.5 w-3.5" />
              <span>bjwsociety@gmail.com</span>
            </a>
          </div>

          {/* Appearance / Theme Toggle */}
          <div>
            <div className="text-text-muted mb-2 text-xs font-semibold tracking-wider uppercase">
              Theme / Appearance
            </div>
            <ThemeToggle variant="menu" />
          </div>

          {/* Language selection */}
          <div>
            <div className="text-text-muted mb-2 text-xs font-semibold tracking-wider uppercase">
              {t("common.language")}
            </div>
            <LanguageSwitcher
              variant="pills"
              className="w-full justify-center"
            />
          </div>

          {/* Donate Button */}
          <Link href="/donate" onClick={onClose} className="block">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#124d34] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0b2e1e]"
            >
              <Heart className="h-4 w-4 fill-white/20" />
              <span>{t("nav.donate")}</span>
            </button>
          </Link>

          <p className="text-text-muted text-center text-[11px]">
            {t("common.regNo")}
          </p>
        </div>
      </div>
    </div>
  );
}
