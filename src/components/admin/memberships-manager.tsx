"use client";

import * as React from "react";
import { useState, useTransition, useMemo } from "react";
import {
  updateMembershipStatusAction,
  deleteMembershipAction,
} from "@/lib/admin-actions";
import { formatAdminDate } from "@/lib/utils";
import {
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Search,
  MessageCircle,
} from "lucide-react";

export interface MembershipRequest {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  address_area: string;
  family_size: number | null;
  preferred_contact: "phone" | "whatsapp" | "sms" | "email";
  plan: "monthly" | "annual";
  consent: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface MembershipsManagerProps {
  initialRequests: MembershipRequest[];
}

export function MembershipsManager({
  initialRequests,
}: MembershipsManagerProps) {
  const [requests, setRequests] =
    useState<MembershipRequest[]>(initialRequests);
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

  // WhatsApp Link for Sri Lanka (+94)
  const getWhatsAppLink = (phone: string, name: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "94" + clean.substring(1);
    } else if (!clean.startsWith("94")) {
      clean = "94" + clean;
    }
    const text = encodeURIComponent(
      `Assalamu Alaikum / Greetings ${name}, this is from Buhary Janaza Welfare Society (BJWS), Mullipothanai regarding your membership enrollment application.`
    );
    return `https://wa.me/${clean}?text=${text}`;
  };

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      // Status filter
      if (filter !== "all" && r.status !== filter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = r.full_name.toLowerCase().includes(query);
        const matchesPhone = r.phone.toLowerCase().includes(query);
        const matchesEmail = r.email?.toLowerCase().includes(query);
        const matchesArea = r.address_area.toLowerCase().includes(query);
        const matchesPlan = r.plan.toLowerCase().includes(query);
        return (
          matchesName ||
          matchesPhone ||
          matchesEmail ||
          matchesArea ||
          matchesPlan
        );
      }

      return true;
    });
  }, [requests, filter, searchQuery]);

  const handleStatusChange = (
    id: string,
    newStatus: "pending" | "approved" | "rejected"
  ) => {
    startTransition(async () => {
      try {
        await updateMembershipStatusAction(id, newStatus);
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      } catch (err) {
        alert("Failed to update membership status: " + (err as Error).message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this membership record?"
      )
    )
      return;
    startTransition(async () => {
      try {
        await deleteMembershipAction(id);
        setRequests((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        alert("Failed to delete application: " + (err as Error).message);
      }
    });
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e6e4dc] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "all", label: "All Applicants", count: counts.all },
            {
              key: "pending",
              label: "Pending Review",
              count: counts.pending,
              alert: counts.pending > 0,
            },
            {
              key: "approved",
              label: "Approved Members",
              count: counts.approved,
            },
            { key: "rejected", label: "Rejected", count: counts.rejected },
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
                        ? "bg-amber-100 text-amber-800 font-extrabold"
                        : "bg-[#e6e4dc] text-[#6b7280]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:w-72">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search applicant, area, phone..."
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

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6e4dc] bg-white p-12 text-center">
          <p className="font-serif text-base font-bold text-[#0b2e1e]">
            No membership applications found
          </p>
          <p className="mt-1 text-xs text-[#6b7280]">
            {searchQuery
              ? `No applicants matched "${searchQuery}".`
              : `No applications currently filed under "${filter}".`}
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
                item.status === "pending"
                  ? "border-amber-300 ring-1 ring-amber-200"
                  : "border-[#e6e4dc]"
              }`}
            >
              {/* Header card row */}
              <div className="flex flex-col gap-4 border-b border-[#f3f1ea] bg-[#fbfaf6] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-start gap-3">
                  {/* Initials badge */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-serif text-xs font-bold ${
                      item.status === "approved"
                        ? "bg-[#124d34] text-white ring-2 ring-[#c99a45]/40"
                        : "bg-[#f5eedf] text-[#8b651e]"
                    }`}
                  >
                    {getInitials(item.full_name)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#0b2e1e]">
                        {item.full_name}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          item.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : item.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "pending" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                        )}
                        {item.status}
                      </span>

                      {/* Plan Badge */}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          item.plan === "monthly"
                            ? "bg-[#e8f3ee] text-[#124d34] ring-1 ring-[#124d34]/20"
                            : "bg-[#f5eedf] text-[#8b651e] ring-1 ring-[#c99a45]/40"
                        }`}
                      >
                        {item.plan === "monthly"
                          ? "Monthly Plan (LKR 200)"
                          : "Annual Plan (LKR 2,400)"}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-[#6b7280]">
                      <Clock className="h-3 w-3 text-[#9ca3af]" />
                      <span>Applied on {formatAdminDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:self-center">
                  {item.status !== "approved" && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "approved")}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#124d34] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#0b2e1e] disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#c99a45]" />
                      <span>Approve Member</span>
                    </button>
                  )}

                  {item.status !== "rejected" && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "rejected")}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 shadow-2xs hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  {item.status !== "pending" && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "pending")}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1.5 text-xs font-medium text-[#4b5563] shadow-2xs hover:bg-[#f3f1ea] disabled:opacity-50"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>Reset</span>
                    </button>
                  )}

                  <button
                    disabled={isPending}
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#e6e4dc] bg-white px-2 py-1.5 text-xs font-medium text-[#6b7280] shadow-2xs hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                    title="Delete Record"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Application Details 4-Column Grid */}
              <div className="grid grid-cols-1 gap-4 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
                {/* Contact Phone & WhatsApp */}
                <div className="rounded-xl border border-[#f3f1ea] bg-[#fbfaf6] p-3">
                  <span className="block text-[11px] font-medium text-[#6b7280]">
                    Phone &amp; WhatsApp
                  </span>
                  <div className="mt-1 flex items-center justify-between">
                    <a
                      href={`tel:${item.phone}`}
                      className="font-semibold text-[#124d34] hover:underline"
                    >
                      {item.phone}
                    </a>
                    <a
                      href={getWhatsAppLink(item.phone, item.full_name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16a34a] hover:underline"
                    >
                      <MessageCircle className="h-3 w-3" />
                      <span>Chat</span>
                    </a>
                  </div>
                  {item.email && (
                    <span className="mt-0.5 block truncate text-[11px] text-[#9ca3af]">
                      {item.email}
                    </span>
                  )}
                </div>

                {/* Residential Area */}
                <div className="rounded-xl border border-[#f3f1ea] bg-[#fbfaf6] p-3">
                  <span className="block text-[11px] font-medium text-[#6b7280]">
                    Residential Area / Mahallah
                  </span>
                  <div className="mt-1 flex items-start gap-1 font-semibold text-[#1c2420]">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c99a45]" />
                    <span className="leading-snug">{item.address_area}</span>
                  </div>
                </div>

                {/* Household Headcount */}
                <div className="rounded-xl border border-[#f3f1ea] bg-[#fbfaf6] p-3">
                  <span className="block text-[11px] font-medium text-[#6b7280]">
                    Household Family Size
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold text-[#1c2420]">
                    <Users className="h-3.5 w-3.5 text-[#124d34]" />
                    <span>
                      {item.family_size
                        ? `${item.family_size} Family Members Covered`
                        : "Family count not stated"}
                    </span>
                  </div>
                </div>

                {/* Preferred Contact & Consent */}
                <div className="rounded-xl border border-[#f3f1ea] bg-[#fbfaf6] p-3">
                  <span className="block text-[11px] font-medium text-[#6b7280]">
                    Contact Channel &amp; Consent
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-white px-2 py-0.5 font-medium text-[#1c2420] capitalize shadow-2xs">
                      {item.preferred_contact}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Consent Given</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
