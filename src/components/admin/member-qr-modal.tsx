"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import {
  type TeamMember,
  calculateExpiryDate,
  resolveMemberPhoto,
} from "@/content/team";
import { regenerateMemberVerificationTokenAction } from "@/lib/admin-actions";
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  Printer,
  CreditCard,
  RotateCw,
  Sparkles,
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
  const [activeTab, setActiveTab] = useState<"card" | "qr">("card");
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [overrideToken, setOverrideToken] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [frontDataUrl, setFrontDataUrl] = useState<string | null>(null);
  const [backDataUrl, setBackDataUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);

  const rawQrCanvasRef = useRef<HTMLDivElement>(null);
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);

  const currentToken = overrideToken || member?.verificationToken || "";
  const memberCode = member?.memberId || "BJWS000";

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://bjws.org";

  const verifyUrl = `${origin}/en/verify/credential?id=${encodeURIComponent(
    memberCode
  )}&token=${encodeURIComponent(currentToken)}`;

  // Handle modal closing
  const handleClose = () => {
    setOverrideToken(null);
    setConfirmRevoke(false);
    onClose();
  };

  // Copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy verification link:", verifyUrl);
    }
  };

  // Revoke / Regenerate token
  const handleRegenerateToken = async () => {
    if (!member) return;
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

  // Unified Font Family for the entire ID Card (Front and Back)
  const ID_FONT =
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

  // Render Front & Back Cards onto Canvas
  const renderCards = useCallback(async () => {
    if (!member) return;
    setIsRendering(true);

    try {
      const frontCanvas = frontCanvasRef.current;
      const backCanvas = backCanvasRef.current;
      if (!frontCanvas || !backCanvas) return;

      const fCtx = frontCanvas.getContext("2d");
      const bCtx = backCanvas.getContext("2d");
      if (!fCtx || !bCtx) return;

      // Ensure browser web fonts are fully ready before canvas drawing
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }

      // 1. Load Background Templates
      const loadImg = (src: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const [frontFrame, backFrame] = await Promise.all([
        loadImg("/images/id-card/front-frame.png"),
        loadImg("/images/id-card/back-frame.png"),
      ]);

      // ==========================================
      // RENDER FRONT CARD
      // ==========================================
      fCtx.clearRect(0, 0, 638, 1004);
      fCtx.drawImage(frontFrame, 0, 0, 638, 1004);

      // Draw Photo in Circle (Center: 319, 345, Radius: 155)
      const photoCenterX = 319;
      const photoCenterY = 345;
      const photoRadius = 155;

      fCtx.save();
      fCtx.beginPath();
      fCtx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
      fCtx.closePath();
      fCtx.clip();

      if (member.photo) {
        try {
          const photoUrl = resolveMemberPhoto(member.photo) || member.photo;
          const photoImg = await loadImg(photoUrl);

          // Smart auto-alignment: Keep head and hair 100% visible
          const imgW = photoImg.width;
          const imgH = photoImg.height;
          const targetSize = photoRadius * 2;
          const scale = Math.max(targetSize / imgW, targetSize / imgH);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          const drawX = photoCenterX - drawW / 2;

          // Head alignment: portrait photos have head at top. Never center vertically (which chops heads)
          const circleTop = photoCenterY - photoRadius;
          let drawY = circleTop;
          if (drawH > targetSize) {
            const overflow = drawH - targetSize;
            // Shift down slightly into the circle so hair/forehead is never cut off with gentle breathing space
            drawY = circleTop + Math.min(overflow * 0.08, 16);
          } else {
            drawY = photoCenterY - drawH / 2;
          }

          fCtx.drawImage(photoImg, drawX, drawY, drawW, drawH);
        } catch {
          // Fallback if photo load fails
          fCtx.fillStyle = "#0c2e1e";
          fCtx.fillRect(
            photoCenterX - photoRadius,
            photoCenterY - photoRadius,
            photoRadius * 2,
            photoRadius * 2
          );
          fCtx.fillStyle = "#d4a359";
          fCtx.font = `bold 64px ${ID_FONT}`;
          fCtx.textAlign = "center";
          fCtx.textBaseline = "middle";
          fCtx.fillText(member.initials || "BJWS", photoCenterX, photoCenterY);
        }
      } else {
        fCtx.fillStyle = "#0c2e1e";
        fCtx.fillRect(
          photoCenterX - photoRadius,
          photoCenterY - photoRadius,
          photoRadius * 2,
          photoRadius * 2
        );
        fCtx.fillStyle = "#d4a359";
        fCtx.font = `bold 64px ${ID_FONT}`;
        fCtx.textAlign = "center";
        fCtx.textBaseline = "middle";
        fCtx.fillText(member.initials || "BJWS", photoCenterX, photoCenterY);
      }
      fCtx.restore();

      // Draw Circular Ring Border (Dark Green + Gold accent)
      fCtx.beginPath();
      fCtx.arc(photoCenterX, photoCenterY, photoRadius + 3, 0, Math.PI * 2);
      fCtx.strokeStyle = "#0b2e1e";
      fCtx.lineWidth = 6;
      fCtx.stroke();

      fCtx.beginPath();
      fCtx.arc(photoCenterX, photoCenterY, photoRadius - 1, 0, Math.PI * 2);
      fCtx.strokeStyle = "#c99a45";
      fCtx.lineWidth = 2.5;
      fCtx.stroke();

      // Officer Full Name (Prominent & Executive)
      fCtx.fillStyle = "#0b2e1e";
      fCtx.font = `bold 32px ${ID_FONT}`;
      fCtx.textAlign = "center";
      fCtx.textBaseline = "alphabetic";
      fCtx.fillText(member.name.toUpperCase(), 319, 555);

      // Underline rule below name (Golden accent matching template)
      fCtx.beginPath();
      fCtx.moveTo(189, 570);
      fCtx.lineTo(449, 570);
      fCtx.strokeStyle = "#c99a45";
      fCtx.lineWidth = 3;
      fCtx.stroke();

      // Role / Position
      fCtx.fillStyle = "#0b2e1e";
      fCtx.font = `bold 22px ${ID_FONT}`;
      fCtx.textAlign = "center";
      fCtx.fillText(
        (member.role.en || member.role.ta || "").toUpperCase(),
        319,
        606
      );

      // Attribute Rows (ID No, NIC, Address, Phone, Issue Date, Exp Date) - Unified Font, Size & Color
      const startX = 105;
      const valX = 225;
      const addrMaxWidth = 365; // Ample width to prevent unnecessary line breaks
      const addrLineHeight = 24;

      // Calculate word-wrapped full address lines so nothing is cut off
      const rawAddress = (member.address || "Mullipothana, Sri Lanka").trim();
      const addrWords = rawAddress.split(/\s+/);
      const addrLines: string[] = [];
      let currentAddrLine = "";

      fCtx.font = `bold 20px ${ID_FONT}`;
      for (let i = 0; i < addrWords.length; i++) {
        const word = addrWords[i];
        const testLine = currentAddrLine ? `${currentAddrLine} ${word}` : word;
        const testWidth = fCtx.measureText(testLine).width;
        if (testWidth > addrMaxWidth && currentAddrLine) {
          addrLines.push(currentAddrLine);
          currentAddrLine = word;
        } else {
          currentAddrLine = testLine;
        }
      }
      if (currentAddrLine) {
        addrLines.push(currentAddrLine);
      }

      const issueDate = member.issueDate || "2026-01-01";
      const expiryDate = member.expiryDate || calculateExpiryDate(issueDate, 3);

      const rows: Array<{
        label: string;
        val?: string;
        lines?: string[];
        isAddr?: boolean;
      }> = [
        { label: "ID No", val: member.memberId || "BJWS000" },
        ...(member.nic ? [{ label: "NIC", val: member.nic }] : []),
        { label: "Address", lines: addrLines, isAddr: true },
        { label: "Phone", val: member.phone || "+94 77 622 7323" },
      ];

      let startY = member.nic ? 655 : 668;
      const rowGap = member.nic ? 42 : 46;

      for (const row of rows) {
        // Label - 100% unified font, size, weight & deep brand forest green
        fCtx.textAlign = "left";
        fCtx.font = `bold 20px ${ID_FONT}`;
        fCtx.fillStyle = "#0b2e1e";
        fCtx.fillText(row.label, startX, startY);

        // Value - 100% unified font, size, weight & deep brand forest green
        if (row.isAddr && row.lines) {
          fCtx.font = `bold 20px ${ID_FONT}`;
          fCtx.fillStyle = "#0b2e1e";
          row.lines.forEach((line, idx) => {
            fCtx.fillText(line, valX, startY + idx * addrLineHeight);
          });
          startY += (row.lines.length - 1) * addrLineHeight + rowGap;
        } else if (row.val) {
          fCtx.font = `bold 20px ${ID_FONT}`;
          fCtx.fillStyle = "#0b2e1e";
          fCtx.fillText(row.val, valX, startY);
          startY += rowGap;
        }
      }

      // NOTE: Registration Number footer ("Reg No: DS/TH/SS/VSSO/2023/01") is already
      // perfectly embedded in the front-frame.png template above the bottom wave.
      // We do not re-draw it here to prevent duplicate/ghosted rendering.

      // Save Front Image Data URL
      setFrontDataUrl(frontCanvas.toDataURL("image/png"));

      // ==========================================
      // RENDER BACK CARD
      // ==========================================
      bCtx.clearRect(0, 0, 638, 1004);
      bCtx.drawImage(backFrame, 0, 0, 638, 1004);

      // 1. Official Terms & Conditions (Compact & Legible, Y: 148 to 270)
      const termsX = 70;
      const termsMaxW = 498;
      let termY = 148;
      const termSpacing = 42;

      const termsList = [
        "1. This card certifies official identity & appointment in Buhary Janaza Welfare Society (BJWS).",
        "2. Authorized for 24/7 emergency funeral assistance, cemetery logistics & welfare coordination.",
        "3. Property of BJWS. If found, please return to Secretariat Office, Mullipothana.",
      ];

      bCtx.fillStyle = "#2d3748";
      bCtx.font = `500 13px ${ID_FONT}`;
      bCtx.textAlign = "left";

      for (const term of termsList) {
        const words = term.split(" ");
        let line = "";
        let currentY = termY;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          const metrics = bCtx.measureText(testLine);
          if (metrics.width > termsMaxW && i > 0) {
            bCtx.fillText(line, termsX, currentY);
            line = words[i] + " ";
            currentY += 18;
          } else {
            line = testLine;
          }
        }
        bCtx.fillText(line, termsX, currentY);
        termY += termSpacing;
      }

      // 2. QR Code (Upper Middle, Y: 295 to 480)
      const qrCanvas = rawQrCanvasRef.current?.querySelector("canvas");
      if (qrCanvas) {
        const qrSize = 185;
        const qrX = 319 - qrSize / 2;
        const qrY = 295;

        // Subtle rounded white backing plate with gold outline
        bCtx.fillStyle = "#ffffff";
        bCtx.beginPath();
        bCtx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 14);
        bCtx.fill();
        bCtx.strokeStyle = "#c99a45";
        bCtx.lineWidth = 2.5;
        bCtx.stroke();

        bCtx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      }

      // QR Verification Instruction
      bCtx.fillStyle = "#0b2e1e";
      bCtx.font = `bold 13px ${ID_FONT}`;
      bCtx.textAlign = "center";
      bCtx.fillText("OFFICIAL FIELD VERIFICATION QR", 319, 515);

      bCtx.fillStyle = "#4b5563";
      bCtx.font = `500 11.5px ${ID_FONT}`;
      bCtx.fillText("Scan with mobile camera for live verification", 319, 532);

      // Validity & Issue Metadata Box (3 Years Validity: 2026 - 2029)
      bCtx.save();
      bCtx.fillStyle = "#f4f8f5";
      bCtx.strokeStyle = "#c99a45";
      bCtx.lineWidth = 1.5;
      bCtx.beginPath();
      bCtx.roundRect(99, 560, 440, 36, 8);
      bCtx.fill();
      bCtx.stroke();

      bCtx.fillStyle = "#0b2e1e";
      bCtx.font = `bold 12.5px ${ID_FONT}`;
      bCtx.textAlign = "center";
      bCtx.fillText(
        `ISSUED: ${issueDate}  •  EXPIRES: ${expiryDate} (3 YEARS VALIDITY)`,
        319,
        583
      );
      bCtx.restore();

      // 3. TWO DEDICATED SIGNATURE AREAS BELOW QR (Y: 575 to 735)
      // Generous, clean blank space for manual or digital signing

      // Left Signature: President / Secretary
      const sig1X = 175;
      const sigLine1Start = 85;
      const sigLine1End = 265;
      const sigLineY = 665;

      bCtx.beginPath();
      bCtx.moveTo(sigLine1Start, sigLineY);
      bCtx.lineTo(sigLine1End, sigLineY);
      bCtx.strokeStyle = "#0b2e1e";
      bCtx.lineWidth = 1.5;
      bCtx.stroke();

      bCtx.fillStyle = "#0b2e1e";
      bCtx.font = `bold 14px ${ID_FONT}`;
      bCtx.textAlign = "center";
      bCtx.fillText("PRESIDENT / SECRETARY", sig1X, sigLineY + 22);

      bCtx.fillStyle = "#6b7280";
      bCtx.font = `500 11.5px ${ID_FONT}`;
      bCtx.fillText("Authorized Signature", sig1X, sigLineY + 38);

      // Right Signature: Cardholder
      const sig2X = 463;
      const sigLine2Start = 373;
      const sigLine2End = 553;

      bCtx.beginPath();
      bCtx.moveTo(sigLine2Start, sigLineY);
      bCtx.lineTo(sigLine2End, sigLineY);
      bCtx.strokeStyle = "#0b2e1e";
      bCtx.lineWidth = 1.5;
      bCtx.stroke();

      bCtx.fillStyle = "#0b2e1e";
      bCtx.font = `bold 14px ${ID_FONT}`;
      bCtx.textAlign = "center";
      bCtx.fillText("CARDHOLDER", sig2X, sigLineY + 22);

      bCtx.fillStyle = "#6b7280";
      bCtx.font = `500 11.5px ${ID_FONT}`;
      bCtx.fillText("Signature of Bearer", sig2X, sigLineY + 38);

      // 4. Official Contact & Hotline Footer
      bCtx.fillStyle = "#0b2e1e";
      bCtx.font = `bold 13px ${ID_FONT}`;
      bCtx.textAlign = "center";
      bCtx.fillText(
        "24/7 Emergency Hotline: 077 622 7323 • 077 278 2829",
        319,
        785
      );

      bCtx.fillStyle = "#4b5563";
      bCtx.font = `600 11.5px ${ID_FONT}`;
      bCtx.fillText(
        "Email: bjwsociety@gmail.com • Reg: DS/TH/SS/VSSO/2023/01",
        319,
        805
      );

      // Save Back Image Data URL
      setBackDataUrl(backCanvas.toDataURL("image/png"));
      setIsRendering(false);
    } catch (e) {
      console.error("ID Card canvas rendering failed:", e);
      setIsRendering(false);
    }
  }, [member, ID_FONT]);

  // Trigger render when member or verifyUrl changes
  useEffect(() => {
    if (isOpen && member) {
      // Small timeout to allow QRCodeCanvas in hidden ref to mount
      const timer = setTimeout(() => {
        renderCards();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, member, currentToken, renderCards]);

  if (!isOpen || !member) return null;

  // Downloads
  const downloadFront = () => {
    if (!frontDataUrl) return;
    const link = document.createElement("a");
    link.download = `${memberCode}_ID_Front.png`;
    link.href = frontDataUrl;
    link.click();
  };

  const downloadBack = () => {
    if (!backDataUrl) return;
    const link = document.createElement("a");
    link.download = `${memberCode}_ID_Back.png`;
    link.href = backDataUrl;
    link.click();
  };

  const downloadQrOnly = () => {
    const rawCanvas = rawQrCanvasRef.current?.querySelector("canvas");
    if (!rawCanvas) return;
    const link = document.createElement("a");
    link.download = `${memberCode}_QR_Code.png`;
    link.href = rawCanvas.toDataURL("image/png");
    link.click();
  };

  // Printable Double-Sided Sheet (CR80 standard 54mm x 85.6mm)
  const handlePrintBoth = () => {
    if (!frontDataUrl || !backDataUrl) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to open the printable ID card sheet.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${memberCode} - ${member.name} - Official BJWS ID Card</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              background-color: #f7f9fa;
              color: #111;
            }
            .header-info {
              text-align: center;
              margin-bottom: 25px;
            }
            .header-info h2 {
              margin: 0 0 5px 0;
              color: #0b2e1e;
              font-size: 20px;
            }
            .header-info p {
              margin: 0;
              color: #555;
              font-size: 13px;
            }
            .cards-container {
              display: flex;
              flex-wrap: wrap;
              gap: 30px;
              justify-content: center;
              align-items: center;
            }
            .card-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            }
            .card-label {
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              color: #0b2e1e;
              letter-spacing: 1px;
            }
            .card-image {
              width: 54mm;
              height: 85.6mm;
              border: 1px solid #ccc;
              border-radius: 3.5mm;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              object-fit: cover;
              background: #fff;
            }
            .cut-guide {
              margin-top: 30px;
              font-size: 11px;
              color: #888;
              text-align: center;
              border-top: 1px dashed #ccc;
              padding-top: 12px;
              max-width: 500px;
            }
            @media print {
              body {
                background: #fff;
                padding: 0;
              }
              .cut-guide {
                border-color: #999;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header-info">
            <h2>Buhary Janaza Welfare Society (BJWS)</h2>
            <p>Official Executive Committee ID Card • ${memberCode} - ${member.name} (${member.role.en}) • Issued: ${member.issueDate || "2026-01-01"} • Valid Thru: ${member.expiryDate || calculateExpiryDate(member.issueDate || "2026-01-01", 3)} (3 Years Validity)</p>
          </div>
          <div class="cards-container">
            <div class="card-wrapper">
              <span class="card-label">Front Side (PVC 54mm × 85.6mm)</span>
              <img class="card-image" src="${frontDataUrl}" alt="Front Card" />
            </div>
            <div class="card-wrapper">
              <span class="card-label">Back Side (PVC 54mm × 85.6mm)</span>
              <img class="card-image" src="${backDataUrl}" alt="Back Card" />
            </div>
          </div>
          <div class="cut-guide">
            <strong>Printing Instructions for Secretariat:</strong><br />
            Standard CR80 size (54mm × 85.6mm). Print at 100% scale (no scaling) on PVC ID Card stock or high-gsm laminated photo paper.
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-5"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xs"
        onClick={handleClose}
      />

      <div className="relative z-10 my-auto max-h-[92vh] w-full max-w-2xl space-y-5 overflow-hidden overflow-y-auto rounded-3xl border border-[#c99a45] bg-[#072115] p-5 text-white shadow-2xl sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#c99a45]/30 bg-[#c99a45]/20 text-[#f5d78e]">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-white">
                <span>Official Identity Card &amp; QR Portal</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  <Sparkles className="h-2.5 w-2.5 text-[#d4af37]" />
                  Verified
                </span>
              </h3>
              <p className="font-mono text-xs text-[#f5d78e]">
                {memberCode} &bull; {member.name} ({member.role.en})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-xl p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("card")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === "card"
                  ? "bg-[#c99a45] text-[#072115] shadow-sm"
                  : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Printable ID Card (PVC)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === "qr"
                  ? "bg-[#c99a45] text-[#072115] shadow-sm"
                  : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Standalone QR Code</span>
            </button>
          </div>

          {activeTab === "card" && (
            <button
              type="button"
              onClick={() =>
                setCardSide((prev) => (prev === "front" ? "back" : "front"))
              }
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#f5d78e] transition-colors hover:bg-white/10 hover:text-white"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>
                Flip to {cardSide === "front" ? "Back Side" : "Front Side"}
              </span>
            </button>
          )}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PRINTABLE ID CARD PREVIEW (FRONT / BACK)           */}
        {/* ======================================================== */}
        {activeTab === "card" && (
          <div className="space-y-4">
            {/* Interactive Card Canvas Preview Container */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative aspect-[638/1004] w-[280px] overflow-hidden rounded-2xl border-2 border-[#c99a45]/60 bg-white shadow-2xl sm:w-[320px]">
                {isRendering ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#072115] text-[#d4af37]">
                    <RotateCw className="h-8 w-8 animate-spin" />
                    <span className="font-mono text-xs">
                      Generating ID Card...
                    </span>
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={
                      cardSide === "front"
                        ? frontDataUrl || ""
                        : backDataUrl || ""
                    }
                    alt={`BJWS ID Card - ${cardSide} side`}
                    className="h-full w-full object-cover transition-opacity duration-300"
                  />
                )}

                {/* Flip Badge Overlay */}
                <button
                  type="button"
                  onClick={() =>
                    setCardSide((prev) => (prev === "front" ? "back" : "front"))
                  }
                  className="absolute right-3 bottom-3 flex cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-black/75 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-xs transition-colors hover:bg-black"
                >
                  <RotateCw className="h-3 w-3 text-[#d4af37]" />
                  <span>Showing {cardSide.toUpperCase()} (Click to flip)</span>
                </button>
              </div>
            </div>

            {/* ID Card Action Buttons */}
            <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={handlePrintBoth}
                disabled={isRendering || !frontDataUrl}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-4 py-2.5 text-xs font-bold text-[#072115] shadow-md transition-all hover:bg-[#b58837] disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                <span>Print Both Sides (PVC)</span>
              </button>

              <button
                type="button"
                onClick={downloadFront}
                disabled={isRendering || !frontDataUrl}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/20 disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-[#f5d78e]" />
                <span>Download Front PNG</span>
              </button>

              <button
                type="button"
                onClick={downloadBack}
                disabled={isRendering || !backDataUrl}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/20 disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-[#f5d78e]" />
                <span>Download Back PNG</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: STANDALONE QR CODE PREVIEW                        */}
        {/* ======================================================== */}
        {activeTab === "qr" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-xl">
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

              <p className="mt-3 text-center font-mono text-xs font-bold text-[#072015]">
                {memberCode} &bull; Official Digital Verification
              </p>
              <p className="text-center font-sans text-[11px] text-gray-500">
                Cryptographic token embedded in QR
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={downloadQrOnly}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-4 py-2.5 text-xs font-bold text-[#072115] shadow-md transition-all hover:bg-[#b58837]"
              >
                <Download className="h-4 w-4" />
                <span>Download QR Code (800x800 PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/20"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="font-bold text-emerald-400">
                      Link Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-[#f5d78e]" />
                    <span>Copy Verification URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Revoke / Regenerate QR Control Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
          <span className="text-[11px] text-white/50">
            Target: <code className="text-[#f5d78e]">{memberCode}</code>
          </span>

          <div>
            {!confirmRevoke ? (
              <button
                type="button"
                onClick={() => setConfirmRevoke(true)}
                className="cursor-pointer text-[11px] text-rose-300 underline hover:text-rose-200"
              >
                Lost Card? Revoke &amp; Regenerate QR
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-rose-300">
                  Deactivate old card?
                </span>
                <button
                  type="button"
                  onClick={handleRegenerateToken}
                  disabled={isRegenerating}
                  className="cursor-pointer rounded-lg bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {isRegenerating ? "Regenerating..." : "Confirm Revoke"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRevoke(false)}
                  className="cursor-pointer text-[11px] text-white/60 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden canvases for rendering 638x1004 high-res cards and 800x800 QR */}
        <canvas
          ref={frontCanvasRef}
          width={638}
          height={1004}
          className="hidden"
        />
        <canvas
          ref={backCanvasRef}
          width={638}
          height={1004}
          className="hidden"
        />
        <div ref={rawQrCanvasRef} className="hidden">
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
      </div>
    </div>
  );
}
