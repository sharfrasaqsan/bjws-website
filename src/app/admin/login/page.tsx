"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
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
        {/* Institutional Monogram & Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#124d34] to-[#062316] p-0.5 shadow-md ring-2 ring-[#c99a45]/50">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] border border-[#c99a45]/30 bg-[#062316]/60">
              <span className="font-serif text-lg font-bold tracking-widest text-[#f5eedf]">
                BJWS
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c99a45]/30 bg-[#f5eedf]/60 px-3 py-0.5 text-[11px] font-semibold text-[#8b651e]">
            <Building2 className="h-3 w-3 text-[#c99a45]" />
            <span>Reg No: DS/TH/SS/VSSO/2023/01</span>
          </div>

          <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
            Executive Officer Sign In
          </h1>
          <p className="mt-1 text-xs text-[#4b5563] sm:text-sm">
            Buhary Janaza Welfare Society, Mullipothanai
          </p>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-2xl border border-[#e6e4dc] border-t-4 border-t-[#c99a45] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 border-b border-[#e6e4dc] pb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0b2e1e]">
              <ShieldCheck className="h-4 w-4 text-[#124d34]" />
              <span>Restricted Administration Console</span>
            </div>
            <p className="mt-1 text-xs text-[#6b7280]">
              Authorized secretarial, treasury, and executive committee officers only.
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
              {isPending ? "Authenticating Session..." : "Sign In to Admin Portal"}
            </Button>
          </form>

          {/* Quick Demo Sign In Option */}
          <div className="mt-4 pt-3 border-t border-[#f3f1ea]">
            <form action={formAction}>
              <input type="hidden" name="demo_login" value="true" />
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg border border-[#c99a45]/40 bg-[#fbfaf6] py-2 text-xs font-semibold text-[#0b2e1e] shadow-2xs hover:bg-[#f5eedf] transition-colors"
              >
                ⚡ 1-Click Executive Officer Access (Instant Sign In)
              </button>
            </form>
          </div>

          {/* Footer Security Badges */}
          <div className="mt-6 border-t border-[#f3f1ea] pt-5 text-center text-xs text-[#6b7280]">
            <p className="flex items-center justify-center gap-1.5 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#124d34]" />
              <span>
                Protected by <strong className="text-[#1c2420]">Supabase Auth</strong> &amp; RBAC
              </span>
            </p>
            <p className="mt-1 font-mono text-[10px] text-[#9ca3af]">
              Development demo: sign in with password of 6+ characters.
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
