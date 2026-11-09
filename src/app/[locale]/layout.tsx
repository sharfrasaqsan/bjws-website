import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Inter, Playfair_Display } from "next/font/google";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createPublicClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeScript } from "@/components/theme-script";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { EmergencyHotlinePill } from "@/components/ui/emergency-hotline-pill";
import { getAllNotices } from "@/content/notices";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#124d34" },
    { media: "(prefers-color-scheme: dark)", color: "#072115" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<Locale, string> = {
    ta: "புகாரி ஜனாஸா நலன்புரி சங்கம் (BJWS) | முள்ளிப்பொத்தானை",
    en: "Buhary Janaza Welfare Society (BJWS) | Mullipothana",
    si: "බුහාරි ජනාසා සුභසාධක සමිතිය (BJWS) | මොල්ලිපොතාන",
  };

  const descriptions: Record<Locale, string> = {
    ta: "முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் பகுதி முஸ்லிம் சமூகத்திற்கான உத்தியோகபூர்வ ஜனாஸா மற்றும் நலன்புரி சேவைகள் அமைப்பு (பதிவு இல: DS/TH/SS/VSSO/2023/01).",
    en: "Official website of Buhary Janaza Welfare Society, Mullipothana, Sri Lanka (Reg No: DS/TH/SS/VSSO/2023/01). Community funeral and welfare services.",
    si: "මොල්ලිපොතාන බුහාරි ජුම්මා මස්ජිද ප්‍රදේශයේ මුස්ලිම් ප්‍රජාව වෙනුවෙන් ක්‍රියාත්මක නිල ජනාසා සහ සුභසාධක සමිතිය (ලියාපදිංචි අංකය: DS/TH/SS/VSSO/2023/01).",
  };

  const currentLocale = (
    routing.locales.includes(locale as Locale) ? locale : routing.defaultLocale
  ) as Locale;

  const canonicalUrl = `${SITE_URL}/${currentLocale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titles[currentLocale],
      template: `%s | ${titles[currentLocale]}`,
    },
    description: descriptions[currentLocale],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${SITE_URL}/en`,
        en: `${SITE_URL}/en`,
        ta: `${SITE_URL}/ta`,
        si: `${SITE_URL}/si`,
        "en-LK": `${SITE_URL}/en`,
        "ta-LK": `${SITE_URL}/ta`,
        "si-LK": `${SITE_URL}/si`,
      },
    },
    openGraph: {
      title: titles[currentLocale],
      description: descriptions[currentLocale],
      url: canonicalUrl,
      siteName: "Buhary Janaza Welfare Society (BJWS)",
      locale:
        currentLocale === "ta"
          ? "ta_LK"
          : currentLocale === "si"
            ? "si_LK"
            : "en_LK",
      type: "website",
    },
    icons: {
      icon: [
        { url: "/brand/logo.svg", type: "image/svg+xml" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/brand/logo.svg",
      apple: "/brand/logo.svg",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[currentLocale],
      description: descriptions[currentLocale],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "common" });

  let notices: {
    id: string;
    title: string;
    body: string;
    locale: string;
    published_at: string;
    show_on_homepage?: boolean;
    image_url?: string;
  }[] = [];

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .eq("is_published", true)
      .eq("show_on_homepage", true)
      .order("published_at", { ascending: false })
      .limit(10);
    if (!error && data && data.length > 0) {
      notices = data.map((d: Record<string, unknown>) => ({
        id: String(d.id),
        title: String(d.title),
        body: String(d.body),
        locale: String(d.locale),
        published_at: String(d.published_at),
        show_on_homepage:
          d.show_on_homepage !== undefined
            ? Boolean(d.show_on_homepage)
            : true,
        image_url: d.image_url ? String(d.image_url) : undefined,
      }));
    } else {
      const { data: fallbackData } = await supabase
        .from("notices")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(10);
      if (fallbackData && fallbackData.length > 0) {
        notices = fallbackData.map((d: Record<string, unknown>) => ({
          id: String(d.id),
          title: String(d.title),
          body: String(d.body),
          locale: String(d.locale),
          published_at: String(d.published_at),
          show_on_homepage:
            d.show_on_homepage !== undefined
              ? Boolean(d.show_on_homepage)
              : true,
          image_url: d.image_url ? String(d.image_url) : undefined,
        }));
      }
    }
  } catch {
    notices = [];
  }

  // Guaranteed fallback to in-memory store so notices are always available
  if (notices.length === 0) {
    notices = getAllNotices().map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      locale: n.locale,
      published_at: n.published_at,
      show_on_homepage: n.show_on_homepage ?? true,
      image_url: n.image_url,
    }));
  }

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("bjws-theme")?.value;
  const isDark = themeCookie === "dark";

  const scriptClass =
    locale === "ta"
      ? "font-tamil"
      : locale === "si"
        ? "font-sinhala"
        : "font-sans";

  return (
    <html
      lang={locale}
      dir="ltr"
      suppressHydrationWarning
      className={`${isDark ? "dark" : ""} ${inter.variable} ${playfair.variable} ${scriptClass} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/brand/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/brand/logo.svg" />
        <link rel="apple-touch-icon" href="/brand/logo.svg" />
        <ThemeScript />
      </head>
      <body className="bg-background text-text selection:bg-primary/15 selection:text-primary flex min-h-full flex-col overflow-x-clip">
        <NextIntlClientProvider messages={messages}>
          {/* Skip-to-content accessibility link */}
          <a
            href="#main-content"
            className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            {t("skipToContent")}
          </a>

          <ScrollProgress />
          <Header notices={notices} />
          <main
            id="main-content"
            className="flex-1 focus:outline-none"
            tabIndex={-1}
          >
            {children}
          </main>
          <Footer />
          <EmergencyHotlinePill />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
