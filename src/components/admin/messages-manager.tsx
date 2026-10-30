"use client";

import * as React from "react";
import { useState, useTransition, useMemo } from "react";
import {
  updateMessageStatusAction,
  deleteMessageAction,
} from "@/lib/admin-actions";
import { formatAdminDate } from "@/lib/utils";
import {
  Phone,
  Mail,
  Clock,
  Check,
  Reply,
  Archive,
  Trash2,
  Search,
  MessageCircle,
} from "lucide-react";

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  locale: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
}

interface MessagesManagerProps {
  initialMessages: ContactMessage[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Helper to extract initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Format WhatsApp number for Sri Lanka (+94)
  const getWhatsAppLink = (phone: string, name: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "94" + clean.substring(1);
    } else if (!clean.startsWith("94")) {
      clean = "94" + clean;
    }
    const text = encodeURIComponent(
      `Assalamu Alaikum / Greetings ${name}, this is from Buhary Janaza Welfare Society (BJWS), Mullipothanai regarding your message.`
    );
    return `https://wa.me/${clean}?text=${text}`;
  };

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      // Status filter
      if (filter !== "all" && m.status !== filter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesPhone = m.phone.toLowerCase().includes(query);
        const matchesEmail = m.email?.toLowerCase().includes(query);
        const matchesMsg = m.message.toLowerCase().includes(query);
        return matchesName || matchesPhone || matchesEmail || matchesMsg;
      }

      return true;
    });
  }, [messages, filter, searchQuery]);

  const handleStatusChange = (
    id: string,
    newStatus: "new" | "read" | "replied" | "archived"
  ) => {
    startTransition(async () => {
      try {
        await updateMessageStatusAction(id, newStatus);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id ? { ...msg, status: newStatus } : msg
          )
        );
      } catch (err) {
        alert("Failed to update status: " + (err as Error).message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?"))
      return;
    startTransition(async () => {
      try {
        await deleteMessageAction(id);
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } catch (err) {
        alert("Failed to delete message: " + (err as Error).message);
      }
    });
  };

  const counts = {
    all: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
    archived: messages.filter((m) => m.status === "archived").length,
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Filters & Search */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e6e4dc] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "all", label: "All Messages", count: counts.all },
            { key: "new", label: "New", count: counts.new, alert: counts.new > 0 },
            { key: "read", label: "Read", count: counts.read },
            { key: "replied", label: "Replied", count: counts.replied },
            { key: "archived", label: "Archived", count: counts.archived },
          ].map((tab) => {
            const isSelected = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#124d34] text-white shadow-2xs"
                    : "bg-[#fbfaf6] text-[#4b5563] hover:bg-[#f3f1ea] hover:text-[#1c2420]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : tab.alert
                        ? "bg-red-100 text-red-700 font-extrabold"
                        : "bg-[#e6e4dc] text-[#6b7280]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Instant Search Bar */}
        <div className="relative min-w-[240px] sm:w-72">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search by name, phone, text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] py-1.5 pr-3 pl-9 text-xs text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs font-bold text-[#9ca3af] hover:text-[#1c2420]"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6e4dc] bg-white p-12 text-center">
          <p className="font-serif text-base font-bold text-[#0b2e1e]">
            No messages found
          </p>
          <p className="mt-1 text-xs text-[#6b7280]">
            {searchQuery
              ? `No inquiries matched "${searchQuery}".`
              : `No messages currently filed under "${filter}".`}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-xs font-semibold text-[#124d34] underline"
            >
              Clear search filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`overflow-hidden rounded-2xl border bg-white shadow-xs transition-all ${
                item.status === "new"
                  ? "border-[#124d34]/40 ring-1 ring-[#124d34]/20"
                  : "border-[#e6e4dc]"
              }`}
            >
              {/* Header row of message */}
              <div className="flex flex-col gap-4 border-b border-[#f3f1ea] bg-[#fbfaf6] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-start gap-3">
                  {/* Initials Avatar */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-serif text-xs font-bold ${
                      item.status === "new"
                        ? "bg-[#124d34] text-white ring-2 ring-[#c99a45]/40"
                        : "bg-[#e8f3ee] text-[#124d34]"
                    }`}
                  >
                    {getInitials(item.name)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#0b2e1e]">
                        {item.name}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          item.status === "new"
                            ? "bg-red-100 text-red-800"
                            : item.status === "replied"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "read"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status === "new" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                        )}
                        {item.status}
                      </span>

                      {/* Language Badge */}
                      <span className="rounded bg-[#f5eedf] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#8b651e] uppercase">
                        {item.locale === "ta"
                          ? "Tamil"
                          : item.locale === "si"
                            ? "Sinhala"
                            : "English"}
                      </span>
                    </div>

                    {/* Metadata & Quick Contact Links */}
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6b7280]">
                      <a
                        href={`tel:${item.phone}`}
                        className="inline-flex items-center gap-1 font-semibold text-[#124d34] hover:underline"
                        title="Call Phone"
                      >
                        <Phone className="h-3.5 w-3.5 text-[#124d34]" />
                        <span>{item.phone}</span>
                      </a>

                      <a
                        href={getWhatsAppLink(item.phone, item.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#16a34a] hover:underline"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {item.email && (
                        <a
                          href={`mailto:${item.email}`}
                          className="inline-flex items-center gap-1 text-[#6b7280] hover:text-[#1c2420] hover:underline"
                          title="Send Email"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span>{item.email}</span>
                        </a>
                      )}

                      <span className="inline-flex items-center gap-1 text-[#9ca3af]">
                        <Clock className="h-3 w-3" />
                        <span>{formatAdminDate(item.created_at)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:self-center">
                  {item.status === "new" && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "read")}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1c2420] shadow-2xs hover:bg-[#fbfaf6] disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5 text-[#124d34]" />
                      <span>Mark Read</span>
                    </button>
                  )}

                  {item.status !== "replied" && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "replied")}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#124d34] px-2.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#0b2e1e] disabled:opacity-50"
                    >
                      <Reply className="h-3.5 w-3.5 text-[#c99a45]" />
                      <span>Mark Replied</span>
                    </button>
                  )}

                  {item.status !== "archived" && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "archived")}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#e6e4dc] bg-white px-2 py-1.5 text-xs font-medium text-[#4b5563] shadow-2xs hover:bg-[#f3f1ea] disabled:opacity-50"
                      title="Archive message"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <button
                    disabled={isPending}
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1.5 text-xs font-medium text-red-600 shadow-2xs hover:bg-red-50 disabled:opacity-50"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Message Content Body */}
              <div className="p-4 sm:p-5">
                <div className="rounded-xl border border-[#f3f1ea] bg-[#fbfaf6] p-4 text-xs leading-relaxed text-[#1c2420] whitespace-pre-wrap sm:text-sm">
                  {item.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
