"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import {
  updateMembershipStatusAction,
  deleteMembershipAction,
} from "@/lib/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const [isPending, startTransition] = useTransition();

  const filtered = requests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

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
      !confirm("Are you sure you want to delete this membership application?")
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

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="border-border flex flex-wrap items-center gap-2 border-b pb-4">
        {[
          { key: "all", label: `All (${requests.length})` },
          {
            key: "pending",
            label: `Pending (${requests.filter((r) => r.status === "pending").length})`,
          },
          {
            key: "approved",
            label: `Approved (${requests.filter((r) => r.status === "approved").length})`,
          },
          {
            key: "rejected",
            label: `Rejected (${requests.filter((r) => r.status === "rejected").length})`,
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

      {/* Requests Grid */}
      {filtered.length === 0 ? (
        <div className="border-border text-text-muted rounded-xl border border-dashed p-12 text-center">
          <p className="text-sm">
            No membership requests found matching &ldquo;{filter}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-surface rounded-xl border p-5 transition-shadow ${
                item.status === "pending"
                  ? "border-amber-300 bg-amber-50/15 shadow-2xs"
                  : "border-border"
              }`}
            >
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-text text-base font-bold">
                      {item.full_name}
                    </span>
                    <Badge
                      variant={
                        item.status === "approved"
                          ? "primary"
                          : item.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                    <Badge variant="outline" size="sm" className="capitalize">
                      {item.plan} Plan
                    </Badge>
                  </div>

                  <p className="text-text-muted text-xs">
                    Applied on{" "}
                    {new Date(item.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Status action buttons */}
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {item.status !== "approved" && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "approved")}
                      className="h-8 px-3 text-xs"
                    >
                      Approve Member
                    </Button>
                  )}
                  {item.status !== "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "rejected")}
                      className="text-destructive border-destructive/30 h-8 px-3 text-xs hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  )}
                  {item.status !== "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleStatusChange(item.id, "pending")}
                      className="h-8 px-2 text-xs"
                    >
                      Reset to Pending
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleDelete(item.id)}
                    className="text-text-muted hover:text-destructive h-8 px-2 text-xs"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Application Details Grid */}
              <div className="border-border/80 grid grid-cols-1 gap-3 border-t pt-3 text-xs sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <span className="text-text-muted block">Phone</span>
                  <a
                    href={`tel:${item.phone}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {item.phone}
                  </a>
                </div>

                <div>
                  <span className="text-text-muted block">Area / Address</span>
                  <span className="text-text font-medium">
                    {item.address_area}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block">
                    Preferred Contact
                  </span>
                  <span className="text-text font-medium capitalize">
                    {item.preferred_contact}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block">
                    Household Members
                  </span>
                  <span className="text-text font-medium">
                    {item.family_size
                      ? `${item.family_size} persons`
                      : "Unspecified"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
