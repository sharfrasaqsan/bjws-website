"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type TeamMember, resolveMemberPhoto } from "@/content/team";
import {
  createTeamMemberAction,
  updateTeamMemberAction,
  deleteTeamMemberAction,
  toggleTeamMemberActiveAction,
  reorderTeamMembersAction,
} from "@/lib/admin-actions";
import { MemberQrModal } from "@/components/admin/member-qr-modal";
import { SingleImageDropzone } from "@/components/admin/single-image-dropzone";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  X,
  ShieldAlert,
  Check,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  IdCard,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

interface TeamManagerProps {
  initialMembers: TeamMember[];
  mode?: "committee" | "volunteer";
}

export function TeamManager({
  initialMembers,
  mode = "committee",
}: TeamManagerProps) {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isPending, startTransition] = useTransition();

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [qrMember, setQrMember] = useState<TeamMember | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleTokenUpdated = (id: string, newToken: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, verificationToken: newToken } : m))
    );
    if (qrMember && qrMember.id === id) {
      setQrMember((prev) =>
        prev ? { ...prev, verificationToken: newToken } : null
      );
    }
  };

  // Photo state separated for create and edit to guarantee no cross-contamination
  const [createPhotoUrl, setCreatePhotoUrl] = useState<string>("");
  const [editPhotoUrl, setEditPhotoUrl] = useState<string>("");

  // Counts
  const totalCount = members.length;
  const activeCount = members.filter((m) => !m.isInactive).length;
  const inactiveCount = members.filter((m) => m.isInactive).length;

  const filteredMembers = members.filter((m) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !m.isInactive) ||
      (statusFilter === "inactive" && m.isInactive);

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesQuery =
      m.name.toLowerCase().includes(q) ||
      m.role.en.toLowerCase().includes(q) ||
      (m.role.ta && m.role.ta.toLowerCase().includes(q)) ||
      (m.role.si && m.role.si.toLowerCase().includes(q)) ||
      m.phone.includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      m.address.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  const handleMove = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const fromIndex = members.findIndex((m) => m.id === fromId);
    const toIndex = members.findIndex((m) => m.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;

    const newOrder = [...members];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);

    setMembers(newOrder);
    setOrderToast(`Order updated: ${moved.name} is now #${toIndex + 1}`);

    startTransition(async () => {
      try {
        await reorderTeamMembersAction(newOrder.map((m) => m.id));
        router.refresh();
      } catch (err) {
        console.error("Failed to persist order:", err);
      }
    });

    setTimeout(() => {
      setOrderToast(null);
    }, 2800);
  };

  const handleShift = (id: string, direction: "up" | "down") => {
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    handleMove(id, members[targetIndex].id);
  };

  const handleToggleStatus = (member: TeamMember) => {
    startTransition(async () => {
      try {
        await toggleTeamMemberActiveAction(member.id);
        setMembers((prev) =>
          prev.map((m) =>
            m.id === member.id ? { ...m, isInactive: !m.isInactive } : m
          )
        );
        router.refresh();
      } catch (err) {
        console.error("Failed to toggle status:", err);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteTeamMemberAction(id);
        setMembers((prev) => prev.filter((m) => m.id !== id));
        setDeleteConfirmId(null);
        router.refresh();
      } catch (err) {
        console.error("Failed to delete member:", err);
      }
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const photoToUse = createPhotoUrl.trim();
    if (photoToUse) {
      formData.set("photo", photoToUse);
    }

    startTransition(async () => {
      const res = await createTeamMemberAction(null, formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        setIsCreateOpen(false);
        setCreatePhotoUrl("");
        window.location.reload();
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const photoToUse = editPhotoUrl.trim();
    if (photoToUse) {
      formData.set("photo", photoToUse);
    }

    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    const nic = (formData.get("nic") as string)?.trim();
    const memberId = (formData.get("memberId") as string)?.trim();
    const issueDate = (formData.get("issueDate") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const roleEn = (formData.get("roleEn") as string)?.trim();
    const category =
      (formData.get("category") as TeamMember["category"]) || undefined;

    startTransition(async () => {
      const res = await updateTeamMemberAction(null, formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  name: name || m.name,
                  nic: nic !== undefined ? nic : m.nic,
                  memberId: memberId || m.memberId,
                  issueDate: issueDate || m.issueDate,
                  phone: phone || m.phone,
                  address: address || m.address,
                  photo: photoToUse || m.photo,
                  category: category || m.category,
                  role: {
                    ...m.role,
                    en: roleEn || m.role.en,
                  },
                }
              : m
          )
        );
        setEditingMember(null);
        setEditPhotoUrl("");
        router.refresh();
      }
    });
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    const resolvedPhoto = resolveMemberPhoto(member.photo) || "";
    setEditPhotoUrl(resolvedPhoto);
    setFormError(null);
  };

  const openCreateModal = () => {
    setIsCreateOpen(true);
    setCreatePhotoUrl("");
    setFormError(null);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setCreatePhotoUrl("");
    setFormError(null);
  };

  const closeEditModal = () => {
    setEditingMember(null);
    setEditPhotoUrl("");
    setFormError(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-border bg-surface flex items-center justify-between rounded-2xl border p-4 shadow-2xs">
          <div>
            <div className="text-text-muted text-xs font-semibold tracking-wider uppercase">
              {mode === "volunteer" ? "Total Volunteers" : "Total Committee"}
            </div>
            <div className="font-display text-primary mt-1 text-2xl font-bold">
              {totalCount}
            </div>
          </div>
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
            {mode === "volunteer" ? (
              <HeartHandshake className="text-primary h-5 w-5" />
            ) : (
              <Users className="text-primary h-5 w-5" />
            )}
          </div>
        </div>

        <div className="border-border bg-surface flex items-center justify-between rounded-2xl border p-4 shadow-2xs">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#166534] uppercase">
              {mode === "volunteer"
                ? "Active Field Volunteers"
                : "Active On-Duty Officers"}
            </div>
            <div className="font-display mt-1 text-2xl font-bold text-[#166534]">
              {activeCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22c55e]/15 text-[#166534]">
            <UserCheck className="h-5 w-5 text-[#166534]" />
          </div>
        </div>

        <div className="border-border bg-surface flex items-center justify-between rounded-2xl border p-4 shadow-2xs">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#9f1239] uppercase">
              {mode === "volunteer"
                ? "Former Volunteers"
                : "Former Committee Members"}
            </div>
            <div className="font-display mt-1 text-2xl font-bold text-[#9f1239]">
              {inactiveCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f43f5e]/15 text-[#9f1239]">
            <UserX className="h-5 w-5 text-[#9f1239]" />
          </div>
        </div>
      </div>

      {/* Drag & Drop Reordering Instructions & Toast */}
      <div className="text-text flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#c99a45]/30 bg-[#c99a45]/10 px-4 py-3 text-xs shadow-2xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <ArrowUpDown className="h-4 w-4 shrink-0 text-[#c99a45]" />
          <span className="font-medium">
            <strong>Drag and Drop Enabled:</strong> Grab any member card by the
            grip handle to arrange the exact display order on the public
            website.
          </span>
        </div>
        {orderToast && (
          <div className="animate-fade-in inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
            <span>{orderToast}</span>
          </div>
        )}
      </div>

      {/* Filter and Action Bar */}
      <div className="border-border bg-surface flex flex-col items-stretch justify-between gap-4 rounded-2xl border p-4 shadow-2xs md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="text-text-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              mode === "volunteer"
                ? "Search volunteer by name, role, phone, or address..."
                : "Search officer by name, role, phone, or address..."
            }
            className="border-border bg-background text-text placeholder:text-text-muted/70 focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-xs focus:ring-1 focus:outline-none sm:text-sm"
          />
        </div>

        {/* Filter Pills & Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="bg-background border-border inline-flex rounded-xl border p-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                statusFilter === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                statusFilter === "active"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                statusFilter === "inactive"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Former ({inactiveCount})
            </button>
          </div>

          {/* Add Button */}
          {mode === "volunteer" ? (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0b2e1e] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#124d34]"
            >
              <HeartHandshake className="h-4 w-4 text-[#c99a45]" />
              <span>Add Volunteer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0b2e1e] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#124d34]"
            >
              <Plus className="h-4 w-4 text-[#c99a45]" />
              <span>Add Officer</span>
            </button>
          )}
        </div>
      </div>

      {/* Team Members List with Drag & Drop */}
      <div className="space-y-3">
        {filteredMembers.map((member, index) => {
          const isInactive = member.isInactive;
          const isDragging = draggedId === member.id;
          const isDragOver = dragOverId === member.id;
          const canShiftUp = index > 0;
          const canShiftDown = index < filteredMembers.length - 1;

          return (
            <div
              key={member.id}
              draggable
              onDragStart={(e) => {
                setDraggedId(member.id);
                e.dataTransfer.setData("text/plain", member.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (dragOverId !== member.id) {
                  setDragOverId(member.id);
                }
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  if (dragOverId === member.id) {
                    setDragOverId(null);
                  }
                }
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setDragOverId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const sourceId =
                  e.dataTransfer.getData("text/plain") || draggedId;
                if (sourceId && sourceId !== member.id) {
                  handleMove(sourceId, member.id);
                }
                setDraggedId(null);
                setDragOverId(null);
              }}
              className={`group bg-surface relative flex flex-col justify-between gap-4 rounded-2xl border p-4 shadow-2xs transition-all hover:shadow-md sm:p-5 md:flex-row md:items-center ${
                isDragging
                  ? "scale-[0.99] border-dashed border-[#c99a45] bg-[#c99a45]/5 opacity-30"
                  : isDragOver
                    ? "scale-[1.01] border-[#c99a45] bg-[#c99a45]/15 shadow-md ring-4 ring-[#c99a45]/30"
                    : isInactive
                      ? "border-rose-200/80 bg-rose-50/10 dark:border-rose-900/30"
                      : "border-border hover:border-[#c99a45]/40"
              }`}
            >
              {/* Drop Target Indicator Badge */}
              {isDragOver && (
                <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 animate-bounce rounded-full border border-[#c99a45] bg-[#0b2e1e] px-3 py-0.5 text-[10px] font-bold text-white shadow-md">
                  Drop here to place at #{index + 1}
                </div>
              )}

              {/* Left Segment: Drag Handle, Order Badge, Portrait, and Details */}
              <div
                className={`flex min-w-0 flex-1 items-center gap-3 sm:gap-4 ${
                  draggedId ? "pointer-events-none select-none" : ""
                }`}
              >
                {/* Drag Handle & Reorder Controls */}
                <div className="flex shrink-0 flex-col items-center justify-center gap-1">
                  <div
                    className="bg-background border-border text-text-muted flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-xl border shadow-2xs transition-all group-hover:border-[#c99a45]/40 group-hover:text-[#c99a45] hover:bg-[#c99a45]/10 active:cursor-grabbing"
                    title="Click and drag to reorder position"
                  >
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={!canShiftUp}
                      onClick={() => handleShift(member.id, "up")}
                      className="text-text-muted hover:text-text hover:bg-background flex h-4 w-4 items-center justify-center rounded disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={!canShiftDown}
                      onClick={() => handleShift(member.id, "down")}
                      className="text-text-muted hover:text-text hover:bg-background flex h-4 w-4 items-center justify-center rounded disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Numerical Position Badge */}
                <div className="bg-background border-border text-text-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold">
                  #{index + 1}
                </div>

                {/* Portrait Photo */}
                <div className="border-border bg-background relative h-13 w-13 shrink-0 overflow-hidden rounded-2xl border ring-1 ring-black/5">
                  {member.photo ? (
                    <Image
                      src={resolveMemberPhoto(member.photo) || member.photo}
                      alt={member.name}
                      fill
                      draggable={false}
                      className="object-cover object-top"
                      sizes="52px"
                    />
                  ) : (
                    <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-xs font-bold">
                      {member.initials}
                    </div>
                  )}
                </div>

                {/* Text Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-[#c99a45]/40 bg-[#0b2e1e] px-2 py-0.5 font-mono text-xs font-bold text-[#f5d78e] shadow-2xs">
                      {member.memberId || "BJWS000"}
                    </span>
                    <h3 className="font-display text-text truncate text-base font-bold">
                      {member.name}
                    </h3>
                    {member.category === "volunteer" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-500/30 dark:bg-amber-950 dark:text-amber-300">
                        <HeartHandshake className="h-3 w-3" /> Youth Volunteer
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isInactive
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {isInactive ? (
                        <>
                          <UserX className="h-3 w-3" /> Former Member
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3 w-3" /> Active Officer
                        </>
                      )}
                    </span>
                    {member.nic && (
                      <span className="text-text-muted bg-muted border-border/60 rounded border px-2 py-0.5 font-mono text-[11px]">
                        NIC: {member.nic}
                      </span>
                    )}
                    <span className="text-text-muted text-[11px] font-semibold">
                      {member.term}
                    </span>
                  </div>

                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs">
                    <span className="font-semibold text-[#c99a45]">
                      {member.role.en}
                    </span>
                    {(member.role.ta || member.role.si) && (
                      <span className="text-text-muted text-[11px]">
                        {member.role.ta}{" "}
                        {member.role.ta && member.role.si && "•"}{" "}
                        {member.role.si}
                      </span>
                    )}
                  </div>

                  {/* Contact Preview inline */}
                  <div className="text-text-muted mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    {member.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="text-primary h-3 w-3 shrink-0" />
                        <a
                          href={`tel:${member.phone.replace(/\s+/g, "")}`}
                          className="hover:text-primary font-medium transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="text-text-muted h-3 w-3 shrink-0" />
                        <span className="max-w-[200px] truncate">
                          {member.email}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MapPin className="text-text-muted h-3 w-3 shrink-0" />
                      <span className="max-w-[220px] truncate">
                        {member.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Segment: Actions */}
              <div
                className={`flex shrink-0 items-center justify-end gap-2 border-t pt-2 md:border-t-0 md:pt-0 ${
                  draggedId ? "pointer-events-none select-none" : ""
                }`}
              >
                {member.whatsapp && (
                  <a
                    href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                    title="Open WhatsApp chat"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                )}

                {/* 1-Click Status Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(member)}
                  disabled={isPending}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    isInactive
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300"
                  }`}
                  title={
                    isInactive ? "Reactivate member" : "Mark as former member"
                  }
                >
                  {isInactive ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Reactivate</span>
                    </>
                  ) : (
                    <>
                      <UserX className="h-3.5 w-3.5" />
                      <span>Set Former</span>
                    </>
                  )}
                </button>

                {/* Member ID Card Button */}
                <button
                  type="button"
                  onClick={() => setQrMember(member)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#c99a45]/50 bg-[#c99a45]/10 px-2.5 py-1.5 text-xs font-semibold text-[#8b651e] shadow-2xs transition-colors hover:bg-[#c99a45] hover:text-white"
                  title="View & Download Member ID Card"
                >
                  <IdCard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ID Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(member)}
                  className="border-border bg-background text-text-muted hover:border-primary hover:text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors"
                  title="Edit Member Details"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(member.id)}
                  className="border-border bg-background inline-flex h-8 w-8 items-center justify-center rounded-lg border text-rose-500 transition-colors hover:border-rose-200 hover:bg-rose-50"
                  title="Delete Member"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="border-border bg-surface rounded-2xl border border-dashed p-12 text-center">
            <Users className="text-text-muted/60 mx-auto h-10 w-10" />
            <h3 className="font-display text-text mt-3 text-base font-bold">
              No Team Members Found
            </h3>
            <p className="text-text-muted mt-1 text-xs">
              Try adjusting your search query or status filter.
            </p>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="border-border bg-surface relative my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeCreateModal}
              className="text-text-muted hover:bg-background hover:text-text absolute top-5 right-5 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-border flex items-center gap-3 border-b pb-4">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-text text-xl font-bold">
                  {mode === "volunteer"
                    ? "Add New Youth Volunteer"
                    : "Add New Committee Officer"}
                </h2>
                <p className="text-text-muted text-xs">
                  {mode === "volunteer"
                    ? "Register a dedicated field worker or youth coordinator."
                    : "Register an elected committee officer or executive council member."}
                </p>
              </div>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-6 space-y-4">
              {/* Hidden category based on mode */}
              <input
                type="hidden"
                name="category"
                value={mode === "volunteer" ? "volunteer" : "operations"}
              />

              <div>
                <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                  {mode === "volunteer"
                    ? "Volunteer Full Name *"
                    : "Officer Full Name *"}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={
                    mode === "volunteer"
                      ? "e.g. M.I. Mohamed Anfas"
                      : "e.g. A.M. Sahibullah"
                  }
                  className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none sm:text-sm"
                />
              </div>

              {/* Member ID (BJWS000) & National ID (NIC) */}
              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#e6e4dc] bg-[#fbfaf6] p-3.5 sm:grid-cols-2 dark:border-white/10 dark:bg-black/20">
                <div>
                  <label className="text-text-muted mb-1 block flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <Sparkles className="h-3 w-3 text-[#c99a45]" />
                    <span>Member ID (Format: BJWS000)</span>
                  </label>
                  <input
                    type="text"
                    name="memberId"
                    placeholder="e.g. BJWS021"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 font-mono text-xs font-semibold focus:outline-none"
                  />
                  <p className="text-text-muted mt-0.5 text-[10px]">
                    Leave blank to auto-generate next sequence
                  </p>
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    National Identity Card (NIC) *
                  </label>
                  <input
                    type="text"
                    name="nic"
                    placeholder="e.g. 198512345678"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 font-mono text-xs focus:outline-none"
                  />
                  <p className="text-text-muted mt-0.5 text-[10px]">
                    Printed on QR credential verification
                  </p>
                </div>
              </div>

              {/* ID Card Validity & Issue Date */}
              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#e6e4dc] bg-[#fbfaf6] p-3.5 sm:grid-cols-2 dark:border-white/10 dark:bg-black/20">
                <div>
                  <label className="text-text-muted mb-1 block flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <Sparkles className="h-3 w-3 text-[#c99a45]" />
                    <span>ID Issue Date</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    defaultValue={editingMember?.issueDate || "2026-01-01"}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 font-mono text-xs focus:outline-none"
                  />
                  <p className="text-text-muted mt-0.5 text-[10px]">
                    Card issue date (default 2026-01-01)
                  </p>
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Card Validity (3 Years)
                  </label>
                  <div className="border-border bg-muted/40 text-primary flex w-full items-center justify-between rounded-xl border px-3 py-2 font-mono text-xs font-bold">
                    <span>3 Years from Issue</span>
                    <span className="text-text-muted text-[11px]">
                      Auto-calculated
                    </span>
                  </div>
                  <p className="text-text-muted mt-0.5 text-[10px]">
                    Valid until 3 years after issue date
                  </p>
                </div>
              </div>

              {/* Multilingual Roles */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Role (English) *
                  </label>
                  <input
                    type="text"
                    name="roleEn"
                    required
                    placeholder="e.g. Vice President"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Role (Tamil)
                  </label>
                  <input
                    type="text"
                    name="roleTa"
                    placeholder="உப தலைவர்"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Role (Sinhala)
                  </label>
                  <input
                    type="text"
                    name="roleSi"
                    placeholder="උප සභාපති"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="077 123 4567"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    placeholder="+94771234567"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="officer@gmail.com"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Address & Term */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="No. 101, Eacha Nagar, Mullipothana"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Tenure Term
                  </label>
                  <input
                    type="text"
                    name="term"
                    defaultValue="2023 - Present"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Officer Portrait Photo Dropzone */}
              <SingleImageDropzone
                name="photo"
                value={createPhotoUrl}
                onChange={(url) => setCreatePhotoUrl(url)}
                folder="team"
                label="Officer Portrait Photo"
                helperText="Drag & drop member portrait or click to browse. Automatically converts to WebP."
              />

              {/* Inactive toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="create-inactive"
                  name="isInactive"
                  className="border-border text-primary focus:ring-primary rounded"
                />
                <label
                  htmlFor="create-inactive"
                  className="text-text cursor-pointer text-xs font-semibold"
                >
                  Mark as Former / Inactive Committee Alumni
                </label>
              </div>

              {/* Buttons */}
              <div className="border-border flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="border-border text-text hover:bg-background rounded-xl border px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#0b2e1e] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#124d34] disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Add Officer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="border-border bg-surface relative my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeEditModal}
              className="text-text-muted hover:bg-background hover:text-text absolute top-5 right-5 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-border flex items-center gap-3 border-b pb-4">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Edit2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-text text-xl font-bold">
                  {mode === "volunteer" ? "Edit Volunteer" : "Edit Officer"}:{" "}
                  {editingMember.name}
                </h2>
                <p className="text-text-muted text-xs">
                  {mode === "volunteer"
                    ? "Update volunteer details, role, or contact information."
                    : "Update officer details, responsibilities, or contact information."}
                </p>
              </div>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              <input type="hidden" name="id" value={editingMember.id} />

              {/* Hidden category */}
              <input
                type="hidden"
                name="category"
                value={
                  editingMember.category ||
                  (mode === "volunteer" ? "volunteer" : "operations")
                }
              />

              <div>
                <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                  {mode === "volunteer"
                    ? "Volunteer Full Name *"
                    : "Officer Full Name *"}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingMember.name}
                  className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none sm:text-sm"
                />
              </div>

              {/* Member ID (BJWS000) & National ID (NIC) */}
              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#e6e4dc] bg-[#fbfaf6] p-3.5 sm:grid-cols-2 dark:border-white/10 dark:bg-black/20">
                <div>
                  <label className="text-text-muted mb-1 block flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <Sparkles className="h-3 w-3 text-[#c99a45]" />
                    <span>Member ID (Format: BJWS000)</span>
                  </label>
                  <input
                    type="text"
                    name="memberId"
                    defaultValue={editingMember.memberId || ""}
                    placeholder="e.g. BJWS001"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 font-mono text-xs font-semibold focus:outline-none"
                  />
                  <p className="text-text-muted mt-0.5 text-[10px]">
                    Official society membership numbering
                  </p>
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    National Identity Card (NIC) *
                  </label>
                  <input
                    type="text"
                    name="nic"
                    defaultValue={editingMember.nic || ""}
                    placeholder="e.g. 197514302918"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 font-mono text-xs focus:outline-none"
                  />
                  <p className="text-text-muted mt-0.5 text-[10px]">
                    Printed on QR credential verification
                  </p>
                </div>
              </div>

              {/* ID Card Validity & Issue Date */}
              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#e6e4dc] bg-[#fbfaf6] p-3.5 sm:grid-cols-2 dark:border-white/10 dark:bg-black/20">
                <div>
                  <label className="text-text-muted mb-1 block flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <Sparkles className="h-3 w-3 text-[#c99a45]" />
                    <span>ID Issue Date</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    defaultValue={editingMember?.issueDate || "2026-01-01"}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 font-mono text-xs focus:outline-none"
                  />
                  <p className="text-text-muted mt-0.5 text-[10px]">
                    Card issue date (default 2026-01-01)
                  </p>
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Card Validity (3 Years)
                  </label>
                  <div className="border-border bg-muted/40 text-primary flex w-full items-center justify-between rounded-xl border px-3 py-2 font-mono text-xs font-bold">
                    <span>3 Years from Issue</span>
                    <span className="text-text-muted text-[11px]">
                      Auto-calculated
                    </span>
                  </div>
                  <p className="text-text-muted mt-0.5 text-[10px]">
                    Valid until 3 years after issue date
                  </p>
                </div>
              </div>

              {/* Multilingual Roles */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Role (English) *
                  </label>
                  <input
                    type="text"
                    name="roleEn"
                    required
                    defaultValue={editingMember.role.en}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Role (Tamil)
                  </label>
                  <input
                    type="text"
                    name="roleTa"
                    defaultValue={editingMember.role.ta || ""}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Role (Sinhala)
                  </label>
                  <input
                    type="text"
                    name="roleSi"
                    defaultValue={editingMember.role.si || ""}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingMember.phone}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    defaultValue={editingMember.whatsapp || ""}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingMember.email || ""}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Address & Term */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={editingMember.address}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Tenure Term
                  </label>
                  <input
                    type="text"
                    name="term"
                    defaultValue={editingMember.term}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Officer Portrait Photo Dropzone */}
              <SingleImageDropzone
                name="photo"
                value={editPhotoUrl}
                onChange={(url) => setEditPhotoUrl(url)}
                folder="team"
                label="Officer Portrait Photo"
                helperText="Drag & drop replacement photo or click to browse. Automatically converts to WebP."
              />

              {/* Inactive toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-inactive"
                  name="isInactive"
                  defaultChecked={editingMember.isInactive}
                  className="border-border text-primary focus:ring-primary rounded"
                />
                <label
                  htmlFor="edit-inactive"
                  className="text-text cursor-pointer text-xs font-semibold"
                >
                  Mark as Former / Inactive Committee Alumni
                </label>
              </div>

              {/* Buttons */}
              <div className="border-border flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="border-border text-text hover:bg-background rounded-xl border px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#0b2e1e] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#124d34] disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Update Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="border-border bg-surface w-full max-w-md rounded-3xl border p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-text mt-4 text-lg font-bold">
              Confirm Member Removal
            </h3>
            <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
              Are you sure you want to remove this team member from the society
              registry? This will take immediate effect on the public leadership
              page.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="border-border text-text hover:bg-background rounded-xl border px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isPending}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete Member"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MEMBER QR CODE ID BADGE MODAL */}
      <MemberQrModal
        member={qrMember}
        isOpen={Boolean(qrMember)}
        onClose={() => setQrMember(null)}
        onTokenUpdated={handleTokenUpdated}
      />
    </div>
  );
}
