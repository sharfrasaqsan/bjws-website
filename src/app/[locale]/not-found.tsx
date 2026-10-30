import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";

export default function LocalizedNotFound() {
  const t = useTranslations("notFound");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Container size="md" className="text-center">
        <div className="text-primary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#e8f3ee] shadow-2xs">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <span className="border-primary/20 text-primary mb-3 inline-block rounded-full border bg-[#e8f3ee] px-3.5 py-1 text-xs font-semibold">
          404 Error
        </span>

        <h1 className="text-text text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>

        <p className="text-text mt-3 text-base font-medium">{t("subtitle")}</p>

        <p className="text-text-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
          {t("description")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            {t("backHome")}
          </Link>

          <Link
            href="/services"
            className={buttonVariants({ variant: "outline", size: "md" })}
          >
            {t("viewServices")}
          </Link>

          <Link
            href="/contact"
            className={buttonVariants({ variant: "ghost", size: "md" })}
          >
            {t("contactSupport")}
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
