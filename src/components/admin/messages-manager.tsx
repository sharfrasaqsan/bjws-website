"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import {
  updateMessageStatusAction,
  deleteMessageAction,
} from "@/lib/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const [isPending, startTransition] = useTransition();

  const filtered = messages.filter((m) => {
    if (filter === "all") return true;
    return m.status === filter;
  });

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
    if (!confirm("Are you sure you want to delete this message?")) return;
    startTransition(async () => {
      try {
        await deleteMessageAction(id);
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } catch (err) {
        alert("Failed to delete message: " + (err as Error).message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="border-border flex flex-wrap items-center gap-2 border-b pb-4">
        {[
          { key: "all", label: `All (${messages.length})` },
          {
            key: "new",
            label: `New (${messages.filter((m) => m.status === "new").length})`,
          },
          {
            key: "read",
            label: `Read (${messages.filter((m) => m.status === "read").length})`,
          },
          {
            key: "replied",
            label: `Replied (${messages.filter((m) => m.status === "replied").length})`,
          },
          {
            key: "archived",
            label: `Archived (${messages.filter((m) => m.status === "archived").length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === tab.key
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-surface text-text-muted hover:text-text border-border border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="border-border text-text-muted rounded-xl border border-dashed p-12 text-center">
          <p className="text-sm">
            No messages found matching &ldquo;{filter}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-surface rounded-xl border p-5 transition-shadow ${
                item.status === "new"
                  ? "border-emerald-300 bg-emerald-50/20 shadow-2xs"
                  : "border-border"
              }`}
            >
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-text text-base font-bold">
                      {item.name}
                    </span>
                    <Badge
                      variant={
                        item.status === "new"
                          ? "destructive"
                          : item.status === "replied"
                            ? "primary"
                            : "outline"
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                    <span className="bg-surface-muted text-text-muted rounded px-1.5 py-0.5 font-mono text-[11px] uppercase">
                      {item.locale}
                    </span>
                  </div>
                  <div className="text-text-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <a
                      href={`tel:${item.phone}`}
                      className="text-primary font-mono font-medium hover:underline"
                    >
                      {item.phone}
                    </a>
                    {item.email && (
                      <a
                        href={`mailto:${item.email}`}
                        className="text-text-muted hover:underline"
                      >
                        {item.email}
                      </a>
                    )}
                    <span>
                      {new Date(item.created_at).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  {item.status === "new" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "read")}
                      className="h-7 px-2.5 text-xs"
                    >
                      Mark Read
                    </Button>
                  )}
                  {item.status !== "replied" && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "replied")}
                      className="h-7 px-2.5 text-xs"
                    >
                      Mark Replied
                    </Button>
                  )}
                  {item.status !== "archived" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "archived")}
                      className="h-7 px-2 text-xs"
                    >
                      Archive
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleDelete(item.id)}
                    className="h-7 px-2 text-xs"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-surface-muted/60 text-text rounded-lg p-3.5 text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
                {item.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
