"use client";

import * as React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { type TeamMember } from "@/content/team";
import { regenerateMemberVerificationTokenAction } from "@/lib/admin-actions";
import { formatGoogleDriveImageUrl } from "@/lib/utils";
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
} from "lucide-react";

interface MemberQrModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onTokenUpdated?: (id: string, newToken: string) => void;
}

export function MemberQrModal({
  member,
  isOpen,
  onClose,
  onTokenUpdated,
}: MemberQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [overrideToken, setOverrideToken] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !member) return null;

  const currentToken = overrideToken || member.verificationToken || "";

  const handleClose = () => {
    setOverrideToken(null);
    setConfirmRevoke(false);
    onClose();
  };

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://bjws.org";

  const memberCode = member.memberId || "BJWS000";
  const verifyUrl = `${origin}/en/verify/credential?id=${encodeURIComponent(
    memberCode
  )}&token=${encodeURIComponent(currentToken)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy verification link:", verifyUrl);
    }
  };

  const handleRegenerateToken = async () => {
    setIsRegenerating(true);
    try {
      const res = await regenerateMemberVerificationTokenAction(member.id);
      if (res?.token) {
        setOverrideToken(res.token);
        onTokenUpdated?.(member.id, res.token);
        setConfirmRevoke(false);
      }
    } catch (err) {
      console.error("Failed to regenerate token:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownloadBadge = () => {
    const hiddenCanvas = canvasRef.current?.querySelector("canvas");
    if (!hiddenCanvas) return;

    // Trigger download of clean high-res QR code only
    const link = document.createElement("a");
    link.download = `${memberCode}_QR_Code.png`;
    link.href = hiddenCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#c99a45] bg-[#0c2f1f] text-white p-6 sm:p-7 shadow-2xl z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c99a45]/20 text-[#f5d78e] border border-[#c99a45]/30">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Official Verification QR Code
              </h3>
              <p className="text-xs text-[#f5d78e] font-mono">
                {memberCode} &bull; {member.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Member Preview Card */}
        <div className="flex items-center gap-4 rounded-2xl bg-black/30 p-3.5 border border-white/10">
          <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-[#c99a45]/40 bg-black/50">
            {member.photo ? (
              <Image
                src={formatGoogleDriveImageUrl(member.photo)}
                alt={member.name}
                fill
                unoptimized={member.photo.includes("googleusercontent.com")}
                className="object-cover object-top"
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#f5d78e]">
                {member.initials}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm truncate">
                {member.name}
              </span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30">
                Active
              </span>
            </div>
            <p className="text-[#f5d78e] font-semibold truncate">{member.role.en}</p>
            <p className="text-white/60 font-mono text-[11px]">NIC: {member.nic || "Not specified"}</p>
          </div>
        </div>

        {/* QR Code Display Canvas */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-xl">
          <QRCodeSVG
            value={verifyUrl}
            size={220}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/images/bjws logo.webp",
              x: undefined,
              y: undefined,
              height: 48,
              width: 48,
              excavate: true,
            }}
          />

          {/* Hidden Canvas used for high-res PNG download (800x800) */}
          <div ref={canvasRef} className="hidden">
            <QRCodeCanvas
              value={verifyUrl}
              size={800}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/images/bjws logo.webp",
                x: undefined,
                y: undefined,
                height: 160,
                width: 160,
                excavate: true,
              }}
            />
          </div>

          <p className="mt-3 text-center text-xs font-mono font-bold text-[#072015]">
            {memberCode} &bull; Scan to Verify Credential
          </p>
          <p className="text-[11px] text-gray-500 text-center font-sans">
            Encrypted verification token attached
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadBadge}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99a45] hover:bg-[#b58837] text-[#072115] px-4 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download QR Code (PNG)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-semibold border border-white/15 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[#f5d78e]" />
                  <span>Copy QR Target URL</span>
                </>
              )}
            </button>
          </div>

          {/* Revoke / Regenerate Control */}
          <div className="flex items-center justify-end text-xs pt-1 px-1">
            {!confirmRevoke ? (
              <button
                type="button"
                onClick={() => setConfirmRevoke(true)}
                className="text-[11px] text-rose-300 hover:text-rose-200 underline cursor-pointer"
              >
                Lost Card? Revoke & Regenerate QR
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-rose-300">Deactivate old card?</span>
                <button
                  type="button"
                  onClick={handleRegenerateToken}
                  disabled={isRegenerating}
                  className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                >
                  {isRegenerating ? "Regenerating..." : "Confirm Revoke"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRevoke(false)}
                  className="text-[11px] text-white/60 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
