"use client";

import * as React from "react";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface BankAccountCopyProps {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  copyLabel?: string;
}

export function BankAccountCopy({
  accountName,
  accountNumber,
  bankName,
  branch,
  copyLabel = "Copy Account No",
}: BankAccountCopyProps) {
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const cleanAccNo = accountNumber.replace(/[^0-9]/g, "");

  const handleCopyAcc = async () => {
    try {
      await navigator.clipboard.writeText(cleanAccNo);
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } catch {
      window.prompt("Account Number:", cleanAccNo);
    }
  };

  const handleCopyAll = async () => {
    const fullText = `Bank: ${bankName}\nAccount Name: ${accountName}\nAccount No: ${accountNumber}\nBranch: ${branch}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      window.prompt("Bank Details:", fullText);
    }
  };

  return (
    <div className="space-y-3 pt-4">
      {/* Quick Action Copy Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopyAcc}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#c99a45] hover:bg-[#b58837] text-[#072115] px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          {copiedAcc ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#072115]" />
              <span>Copied Account No!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>{copyLabel}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleCopyAll}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer"
        >
          {copiedAll ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300">All Details Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>Copy Full Details</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

