"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loginAdminAction } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Mail, Lock, ArrowLeft, Building2 } from "lucide-react";

const initialState = {
  error: undefined,
  success: false,
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAdminAction,
    initialState
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbfaf6] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Institutional Logo & Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-emerald-900/15 bg-white p-2 shadow-md ring-2 ring-[#c99a45]/50">
            <Image
              src="/images/bjws logo.webp"
              alt="Buhary Janaza Welfare Society Logo"
              width={72}
              height={72}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c99a45]/30 bg-[#f5eedf]/60 px-3 py-0.5 text-[11px] font-semibold text-[#8b651e]">
            <Building2 className="h-3 w-3 text-[#c99a45]" />
            <span>Reg No: DS/TH/SS/VSSO/2023/01</span>
          </div>

          <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
            Executive Officer Sign In
          </h1>
          <p className="mt-1 text-xs text-[#4b5563] sm:text-sm">
            Buhary Janaza Welfare Society, Mullipothana
          </p>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-2xl border border-t-4 border-[#e6e4dc] border-t-[#c99a45] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 border-b border-[#e6e4dc] pb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0b2e1e]">
              <ShieldCheck className="h-4 w-4 text-[#124d34]" />
              <span>Restricted Administration Console</span>
            </div>
            <p className="mt-1 text-xs text-[#6b7280]">
              Authorized secretarial, treasury, and executive committee officers
              only.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
              >
                <span className="mt-0.5 font-bold">⚠️</span>
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-[#1c2420]"
              >
                Official Admin Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@bjws.org"
                  required
                  autoComplete="email"
                  disabled={isPending}
                  className="pl-9 text-xs sm:text-sm"
                />
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-[#1c2420]"
              >
                Security Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isPending}
                  className="pl-9 text-xs sm:text-sm"
                />
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isPending}
              className="mt-2 w-full bg-[#124d34] text-white hover:bg-[#0b2e1e]"
            >
              {isPending
                ? "Authenticating Session..."
                : "Sign In to Admin Portal"}
            </Button>
          </form>

          {/* Footer Security Badges */}
          <div className="mt-6 border-t border-[#f3f1ea] pt-5 text-center text-xs text-[#6b7280]">
            <p className="flex items-center justify-center gap-1.5 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#124d34]" />
              <span>
                Protected by{" "}
                <strong className="text-[#1c2420]">Supabase Auth</strong> &amp;
                256-Bit SSL
              </span>
            </p>
            <p className="mt-1 text-[11px] text-[#9ca3af]">
              Official Secretariat Portal. Unauthorized access attempts are
              monitored and logged.
            </p>
          </div>
        </div>

        {/* Back to Public Site Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#124d34] hover:text-[#0b2e1e] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
