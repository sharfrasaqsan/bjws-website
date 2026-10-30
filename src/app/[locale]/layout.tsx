import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Inter,
  Playfair_Display,
  Noto_Sans_Tamil,
  Noto_Sans_Sinhala,
} from "next/font/google";
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

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-noto-tamil",
  subsets: ["tamil"],
  weight: ["400", "600"],
  display: "swap",
  adjustFontFallback: true,
});

const notoSansSinhala = Noto_Sans_Sinhala({
  variable: "--font-noto-sinhala",
  subsets: ["sinhala"],
  weight: ["400", "600"],
  display: "swap",
  adjustFontFallback: true,
});

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
    en: "Buhary Janaza Welfare Society (BJWS) | Mullipothanai",
    si: "බුහාරි ජනාසා සුභසාධක සමිතිය (BJWS) | මුල්ලිපොத்தான",
  };

  const descriptions: Record<Locale, string> = {
    ta: "முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் பகுதி முஸ்லிம் சமூகத்திற்கான உத்தியோகபூர்வ ஜனாஸா மற்றும் நலன்புரி சேவைகள் அமைப்பு (பதிவு இல: DS/TH/SS/VSSO/2023/01).",
    en: "Official website of Buhary Janaza Welfare Society, Mullipothanai, Sri Lanka (Reg No: DS/TH/SS/VSSO/2023/01). Community funeral and welfare services.",
    si: "මුල්ලිපොத்தான බුහාරි ජුම්මා මස්ජිද ප්‍රදේශයේ මුස්ලිම් ප්‍රජාව වෙනුවෙන් ක්‍රියාත්මක නිල ජනාසා සහ සුභසාධක සමිතිය (ලියාපදිංචි අංකය: DS/TH/SS/VSSO/2023/01).",
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
        "x-default": `${SITE_URL}/ta`,
        ta: `${SITE_URL}/ta`,
        en: `${SITE_URL}/en`,
        si: `${SITE_URL}/si`,
        "ta-LK": `${SITE_URL}/ta`,
        "en-LK": `${SITE_URL}/en`,
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
  }[] = [];

  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("notices")
      .select("id, title, body, locale, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(5);
    if (data) {
      notices = data;
    }
  } catch {
    notices = [];
  }

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
      className={`${inter.variable} ${playfair.variable} ${notoSansTamil.variable} ${notoSansSinhala.variable} ${scriptClass} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-background text-text selection:bg-primary/15 selection:text-primary flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          {/* Skip-to-content accessibility link */}
          <a
            href="#main-content"
            className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            {t("skipToContent")}
          </a>

          <Header notices={notices} />
          <main
            id="main-content"
            className="flex-1 focus:outline-none"
            tabIndex={-1}
          >
            {children}
          </main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
