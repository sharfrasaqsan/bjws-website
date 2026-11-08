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
} from "lucide-react";

interface TeamManagerProps {
  initialMembers: TeamMember[];
}

export function TeamManager({ initialMembers }: TeamManagerProps) {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
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
      setQrMember((prev) => (prev ? { ...prev, verificationToken: newToken } : null));
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Total Enrolled Team
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-primary">
              {totalCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#166534]">
              Active On-Duty Officers
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-[#166534]">
              {activeCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22c55e]/15 text-[#166534]">
            <UserCheck className="h-5 w-5 text-[#166534]" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9f1239]">
              Former / Honorary Alumni
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-[#9f1239]">
              {inactiveCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f43f5e]/15 text-[#9f1239]">
            <UserX className="h-5 w-5 text-[#9f1239]" />
          </div>
        </div>
      </div>

      {/* Drag & Drop Reordering Instructions & Toast */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-[#c99a45]/30 bg-[#c99a45]/10 px-4 py-3 text-xs text-text shadow-2xs">
        <div className="flex items-center gap-2.5">
          <ArrowUpDown className="h-4 w-4 text-[#c99a45] shrink-0" />
          <span className="font-medium">
            <strong>Drag and Drop Enabled:</strong> Grab any member card by the grip handle to arrange the exact display order on the public website.
          </span>
        </div>
        {orderToast && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs animate-fade-in">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
            <span>{orderToast}</span>
          </div>
        )}
      </div>

      {/* Filter and Action Bar (Department dropdown removed as requested) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, phone, or address..."
            className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs sm:text-sm text-text placeholder:text-text-muted/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="inline-flex rounded-xl bg-background border border-border p-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              }`}
            >
              All Status
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "active"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Active Officers
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "inactive"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Former Members
            </button>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b2e1e] hover:bg-[#124d34] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-4 w-4 text-[#c99a45]" />
            <span>Add Member</span>
          </button>
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
                const sourceId = e.dataTransfer.getData("text/plain") || draggedId;
                if (sourceId && sourceId !== member.id) {
                  handleMove(sourceId, member.id);
                }
                setDraggedId(null);
                setDragOverId(null);
              }}
              className={`group relative rounded-2xl border bg-surface p-4 sm:p-5 transition-all shadow-2xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDragging
                  ? "opacity-30 scale-[0.99] border-dashed border-[#c99a45] bg-[#c99a45]/5"
                  : isDragOver
                  ? "border-[#c99a45] ring-4 ring-[#c99a45]/30 bg-[#c99a45]/15 shadow-md scale-[1.01]"
                  : isInactive
                  ? "border-rose-200/80 bg-rose-50/10 dark:border-rose-900/30"
                  : "border-border hover:border-[#c99a45]/40"
              }`}
            >
              {/* Drop Target Indicator Badge */}
              {isDragOver && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-[#0b2e1e] border border-[#c99a45] px-3 py-0.5 text-[10px] font-bold text-white shadow-md animate-bounce">
                  Drop here to place at #{index + 1}
                </div>
              )}

              {/* Left Segment: Drag Handle, Order Badge, Portrait, and Details */}
              <div
                className={`flex items-center gap-3 sm:gap-4 flex-1 min-w-0 ${
                  draggedId ? "pointer-events-none select-none" : ""
                }`}
              >
                {/* Drag Handle & Reorder Controls */}
                <div className="flex flex-col items-center justify-center gap-1 shrink-0">
                  <div
                    className="flex items-center justify-center h-8 w-8 rounded-xl bg-background border border-border text-text-muted group-hover:text-[#c99a45] group-hover:border-[#c99a45]/40 hover:bg-[#c99a45]/10 cursor-grab active:cursor-grabbing shadow-2xs transition-all shrink-0"
                    title="Click and drag to reorder position"
                  >
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={!canShiftUp}
                      onClick={() => handleShift(member.id, "up")}
                      className="h-4 w-4 flex items-center justify-center rounded text-text-muted hover:text-text hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={!canShiftDown}
                      onClick={() => handleShift(member.id, "down")}
                      className="h-4 w-4 flex items-center justify-center rounded text-text-muted hover:text-text hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Numerical Position Badge */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background border border-border text-[11px] font-bold text-text-muted">
                  #{index + 1}
                </div>

                {/* Portrait Photo */}
                <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-2xl border border-border bg-background ring-1 ring-black/5">
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
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xs font-bold text-primary">
                      {member.initials}
                    </div>
                  )}
                </div>

                {/* Text Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#0b2e1e] text-[#f5d78e] border border-[#c99a45]/40 shadow-2xs">
                      {member.memberId || "BJWS000"}
                    </span>
                    <h3 className="font-display text-base font-bold text-text truncate">
                      {member.name}
                    </h3>
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
                      <span className="font-mono text-[11px] text-text-muted bg-muted px-2 py-0.5 rounded border border-border/60">
                        NIC: {member.nic}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-text-muted">
                      {member.term}
                    </span>
                  </div>

                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs">
                    <span className="font-semibold text-[#c99a45]">
                      {member.role.en}
                    </span>
                    {(member.role.ta || member.role.si) && (
                      <span className="text-text-muted text-[11px]">
                        {member.role.ta} {member.role.ta && member.role.si && "•"}{" "}
                        {member.role.si}
                      </span>
                    )}
                  </div>

                  {/* Contact Preview inline */}
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                    {member.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-primary shrink-0" />
                        <a
                          href={`tel:${member.phone.replace(/\s+/g, "")}`}
                          className="hover:text-primary transition-colors font-medium"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-text-muted shrink-0" />
                        <span className="truncate max-w-[200px]">{member.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-text-muted shrink-0" />
                      <span className="truncate max-w-[220px]">{member.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Segment: Actions */}
              <div
                className={`flex items-center justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 shrink-0 ${
                  draggedId ? "pointer-events-none select-none" : ""
                }`}
              >
                {member.whatsapp && (
                  <a
                    href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
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
                  title={isInactive ? "Reactivate member" : "Mark as former member"}
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
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#c99a45]/50 bg-[#c99a45]/10 px-2.5 py-1.5 text-xs font-semibold text-[#8b651e] hover:bg-[#c99a45] hover:text-white transition-colors cursor-pointer shadow-2xs"
                  title="View & Download Member ID Card"
                >
                  <IdCard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ID Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(member)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  title="Edit Member Details"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(member.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                  title="Delete Member"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-surface">
            <Users className="mx-auto h-10 w-10 text-text-muted/60" />
            <h3 className="mt-3 font-display text-base font-bold text-text">
              No Team Members Found
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              Try adjusting your search query or status filter.
            </p>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeCreateModal}
              className="absolute right-5 top-5 rounded-full p-2 text-text-muted hover:bg-background hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-text">
                  Add New Team Member
                </h2>
                <p className="text-xs text-text-muted">
                  Register a committee officer or dedicated volunteer.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-6 space-y-4">
              <input type="hidden" name="category" value="operations" />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  Officer Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. A.M. Sahibullah"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-text focus:border-primary focus:outline-none"
                />
              </div>

              {/* Member ID (BJWS000) & National ID (NIC) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#fbfaf6] dark:bg-black/20 border border-[#e6e4dc] dark:border-white/10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-[#c99a45]" />
                    <span>Member ID (Format: BJWS000)</span>
                  </label>
                  <input
                    type="text"
                    name="memberId"
                    placeholder="e.g. BJWS021"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-semibold text-text focus:border-primary focus:outline-none"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">Leave blank to auto-generate next sequence</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    National Identity Card (NIC) *
                  </label>
                  <input
                    type="text"
                    name="nic"
                    placeholder="e.g. 198512345678"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-text focus:border-primary focus:outline-none"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">Printed on QR credential verification</p>
                </div>
              </div>

              {/* ID Card Validity & Issue Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#fbfaf6] dark:bg-black/20 border border-[#e6e4dc] dark:border-white/10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-[#c99a45]" />
                    <span>ID Issue Date</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    defaultValue={editingMember?.issueDate || "2026-01-01"}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-text focus:border-primary focus:outline-none"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">Card issue date (default 2026-01-01)</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Card Validity (3 Years)
                  </label>
                  <div className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-mono font-bold text-primary flex items-center justify-between">
                    <span>3 Years from Issue</span>
                    <span className="text-[11px] text-text-muted">Auto-calculated</span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">Valid until 3 years after issue date</p>
                </div>
              </div>

              {/* Multilingual Roles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Role (English) *
                  </label>
                  <input
                    type="text"
                    name="roleEn"
                    required
                    placeholder="e.g. Vice President"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Role (Tamil)
                  </label>
                  <input
                    type="text"
                    name="roleTa"
                    placeholder="உப தலைவர்"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Role (Sinhala)
                  </label>
                  <input
                    type="text"
                    name="roleSi"
                    placeholder="උප සභාපති"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="077 123 4567"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    placeholder="+94771234567"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="officer@gmail.com"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Address & Term */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="No. 101, Eacha Nagar, Mullipothana"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Tenure Term
                  </label>
                  <input
                    type="text"
                    name="term"
                    defaultValue="2023 - Present"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
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
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="create-inactive"
                  className="text-xs font-semibold text-text cursor-pointer"
                >
                  Mark as Former / Inactive Committee Alumni
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text hover:bg-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#0b2e1e] hover:bg-[#124d34] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeEditModal}
              className="absolute right-5 top-5 rounded-full p-2 text-text-muted hover:bg-background hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Edit2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-text">
                  Edit Member: {editingMember.name}
                </h2>
                <p className="text-xs text-text-muted">
                  Update officer details, responsibilities, or contact information.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              <input type="hidden" name="id" value={editingMember.id} />
              <input
                type="hidden"
                name="category"
                value={editingMember.category || "operations"}
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  Officer Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingMember.name}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-text focus:border-primary focus:outline-none"
                />
              </div>

              {/* Member ID (BJWS000) & National ID (NIC) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#fbfaf6] dark:bg-black/20 border border-[#e6e4dc] dark:border-white/10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-[#c99a45]" />
                    <span>Member ID (Format: BJWS000)</span>
                  </label>
                  <input
                    type="text"
                    name="memberId"
                    defaultValue={editingMember.memberId || ""}
                    placeholder="e.g. BJWS001"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-semibold text-text focus:border-primary focus:outline-none"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">Official society membership numbering</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    National Identity Card (NIC) *
                  </label>
                  <input
                    type="text"
                    name="nic"
                    defaultValue={editingMember.nic || ""}
                    placeholder="e.g. 197514302918"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-text focus:border-primary focus:outline-none"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">Printed on QR credential verification</p>
                </div>
              </div>

              {/* ID Card Validity & Issue Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#fbfaf6] dark:bg-black/20 border border-[#e6e4dc] dark:border-white/10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-[#c99a45]" />
                    <span>ID Issue Date</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    defaultValue={editingMember?.issueDate || "2026-01-01"}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-text focus:border-primary focus:outline-none"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">Card issue date (default 2026-01-01)</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Card Validity (3 Years)
                  </label>
                  <div className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-mono font-bold text-primary flex items-center justify-between">
                    <span>3 Years from Issue</span>
                    <span className="text-[11px] text-text-muted">Auto-calculated</span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">Valid until 3 years after issue date</p>
                </div>
              </div>

              {/* Multilingual Roles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Role (English) *
                  </label>
                  <input
                    type="text"
                    name="roleEn"
                    required
                    defaultValue={editingMember.role.en}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Role (Tamil)
                  </label>
                  <input
                    type="text"
                    name="roleTa"
                    defaultValue={editingMember.role.ta || ""}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Role (Sinhala)
                  </label>
                  <input
                    type="text"
                    name="roleSi"
                    defaultValue={editingMember.role.si || ""}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingMember.phone}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    defaultValue={editingMember.whatsapp || ""}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingMember.email || ""}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Address & Term */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={editingMember.address}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Tenure Term
                  </label>
                  <input
                    type="text"
                    name="term"
                    defaultValue={editingMember.term}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
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
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="edit-inactive"
                  className="text-xs font-semibold text-text cursor-pointer"
                >
                  Mark as Former / Inactive Committee Alumni
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text hover:bg-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#0b2e1e] hover:bg-[#124d34] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
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
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-text">
              Confirm Member Removal
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">
              Are you sure you want to remove this team member from the society registry? This will take immediate effect on the public leadership page.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text hover:bg-background"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isPending}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
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
