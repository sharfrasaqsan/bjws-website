"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function LocalizedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");
  const tCommon = useTranslations("common");

  React.useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Container size="md" className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 shadow-2xs">
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <span className="mb-3 inline-block rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-900">
          Error Notice
        </span>

        <h1 className="text-text text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>

        <p className="text-text mt-3 text-base font-medium">{t("subtitle")}</p>

        <p className="text-text-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
          {t("description")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => reset()} variant="primary" size="md">
            {t("retry")}
          </Button>

          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "md" })}
          >
            {t("backHome")}
          </Link>
        </div>

        <div className="border-border text-text-muted mt-12 border-t pt-6 text-xs">
          <span>{tCommon("societyName")} • </span>
          <span>{tCommon("regNo")}</span>
        </div>
      </Container>
    </div>
  );
}
