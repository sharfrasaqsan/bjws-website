"use client";

import * as React from "react";
import { useActionState } from "react";
import { loginAdminAction } from "@/lib/admin-auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

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
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="bg-primary text-primary-foreground mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-base font-black shadow-sm">
            BJWS
          </div>
          <h1 className="text-text text-2xl font-bold tracking-tight">
            BJWS Admin Portal
          </h1>
          <p className="text-text-muted mt-1 text-xs sm:text-sm">
            Buhary Janaza Welfare Society, Mullipothanai
          </p>
        </div>

        <Card className="p-6 shadow-sm sm:p-8">
          <CardHeader className="border-border mb-6 border-b p-0 pb-6">
            <CardTitle as="h2" className="text-lg">
              Sign In to Admin
            </CardTitle>
            <CardDescription className="pt-1 text-xs">
              Protected area for authorized executive officers only.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div
                  role="alert"
                  className="border-destructive/30 text-destructive rounded-lg border bg-red-50 p-3 text-xs font-medium"
                >
                  {state.error}
                </div>
              )}

              <FormField id="email" label="Admin Email" required>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@bjws.org"
                  required
                  autoComplete="email"
                  disabled={isPending}
                />
              </FormField>

              <FormField id="password" label="Password" required>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isPending}
                />
              </FormField>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="mt-2 w-full"
              >
                {isPending ? "Authenticating..." : "Sign In to Dashboard"}
              </Button>
            </form>

            <div className="border-border text-text-muted mt-6 border-t pt-5 text-center text-xs">
              <p>
                Powered by{" "}
                <span className="text-text font-semibold">Supabase Auth</span>.
              </p>
              <p className="text-text-muted mt-1 text-[11px]">
                Demo preview: enter password of 6+ characters if Supabase keys
                are not set.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
