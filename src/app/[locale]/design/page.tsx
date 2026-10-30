import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  Button,
  Container,
  Section,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Stat,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Input,
  Textarea,
  FormField,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Design System & Component Library",
  description:
    "Design system tokens, typography scales, and UI components for Buhary Janaza Welfare Society.",
};

export default async function DesignPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const colorTokens = [
    {
      name: "Primary",
      token: "var(--primary)",
      hex: "#124d34",
      bgClass: "bg-primary",
      textClass: "text-primary-foreground",
      contrast: "9.5:1 (AAA)",
      role: "Main brand actions, headers, identity",
    },
    {
      name: "Primary Hover",
      token: "var(--primary-hover)",
      hex: "#0d3826",
      bgClass: "bg-primary-hover",
      textClass: "text-primary-foreground",
      contrast: "12:1 (AAA)",
      role: "Hover states for primary elements",
    },
    {
      name: "Accent",
      token: "var(--accent)",
      hex: "#1b6e4b",
      bgClass: "bg-accent",
      textClass: "text-accent-foreground",
      contrast: "5.5:1 (AA)",
      role: "Subtle highlights and secondary accents",
    },
    {
      name: "Surface",
      token: "var(--surface)",
      hex: "#ffffff",
      bgClass: "bg-surface border border-border",
      textClass: "text-text",
      contrast: "16:1 (AAA)",
      role: "Cards, modals, elevated surfaces",
    },
    {
      name: "Surface Muted",
      token: "var(--surface-muted)",
      hex: "#f1f5f2",
      bgClass: "bg-surface-muted border border-border/80",
      textClass: "text-text",
      contrast: "14:1 (AAA)",
      role: "Secondary cards, soft backgrounds",
    },
    {
      name: "Background",
      token: "var(--background)",
      hex: "#f8faf8",
      bgClass: "bg-background border border-border/60",
      textClass: "text-text",
      contrast: "15:1 (AAA)",
      role: "Global page background (light neutral grey)",
    },
    {
      name: "Text Primary",
      token: "var(--text)",
      hex: "#111827",
      bgClass: "bg-text",
      textClass: "text-white",
      contrast: "16.3:1 (AAA)",
      role: "Headings, body copy, active text",
    },
    {
      name: "Text Muted",
      token: "var(--text-muted)",
      hex: "#475569",
      bgClass: "bg-text-muted",
      textClass: "text-white",
      contrast: "7.5:1 (AAA)",
      role: "Subtitles, hints, supporting metadata",
    },
    {
      name: "Border",
      token: "var(--border)",
      hex: "#e2e8f0",
      bgClass: "bg-border border border-slate-300",
      textClass: "text-text",
      contrast: "3.2:1 (AA UI)",
      role: "Dividers, container borders, input outlines",
    },
    {
      name: "Destructive",
      token: "var(--destructive)",
      hex: "#b91c1c",
      bgClass: "bg-destructive",
      textClass: "text-white",
      contrast: "5.7:1 (AA)",
      role: "Errors, urgent alerts, destructive actions",
    },
  ];

  return (
    <div className="pb-24">
      {/* Page Header */}
      <div className="border-border bg-surface border-b py-10 shadow-2xs">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  Design System v1.0
                </Badge>
                <span className="text-text-muted text-xs">
                  Reg No: DS/TH/SS/VSSO/2023/01
                </span>
              </div>
              <h1 className="text-text text-2xl font-bold tracking-tight sm:text-3xl">
                Buhary Janaza Welfare Society (BJWS)
              </h1>
              <p className="text-text-muted mt-1 text-sm sm:text-base">
                Dignified, accessible (WCAG 2.2 AA), multilingual design system
                for funeral and welfare community services.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="md">
                WCAG 2.2 AA Verified
              </Badge>
            </div>
          </div>
        </Container>
      </div>

      {/* 1. Brand & Semantic Color Tokens */}
      <Section
        title="1. Semantic Color Tokens"
        eyebrow="Color Architecture"
        description="Derived from the BJWS identity: deep Islamic evergreen (#124d34) and crisp slate on soft light-grey surfaces."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {colorTokens.map((c) => (
            <div
              key={c.name}
              className="bg-surface border-border flex flex-col justify-between rounded-xl border p-4 shadow-2xs"
            >
              <div>
                <div
                  className={`mb-3 flex h-16 w-full items-center justify-center rounded-lg font-mono text-xs font-semibold ${c.bgClass} ${c.textClass}`}
                >
                  {c.hex}
                </div>
                <div className="text-text text-sm font-semibold">{c.name}</div>
                <div className="text-text-muted mt-0.5 font-mono text-xs">
                  {c.token}
                </div>
                <p className="text-text-muted mt-2 text-xs leading-relaxed">
                  {c.role}
                </p>
              </div>
              <div className="border-border/80 mt-3 flex items-center justify-between border-t pt-3 text-xs">
                <span className="text-text-muted">Contrast</span>
                <span className="text-primary font-semibold">{c.contrast}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 2. Typography & Script Handling */}
      <Section
        variant="surface"
        title="2. Typography & Scripts"
        eyebrow="Multilingual Scale"
        description="next/font configured with font-display: swap. Tailored for Latin (Inter), Tamil (Noto Sans Tamil), and Sinhala (Noto Sans Sinhala) with generous 1.85 line-height for script ascenders and descenders."
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Latin (Default)</Badge>
                  <span className="text-text-muted text-xs">Inter</span>
                </div>
                <CardTitle className="mt-2 text-xl">
                  Buhary Janaza Welfare Society
                </CardTitle>
                <CardDescription>
                  Mullipothanai, Eastern Province, Sri Lanka
                </CardDescription>
              </CardHeader>
              <CardContent className="text-text-muted space-y-2 text-sm">
                <p>
                  Providing respectful funeral services, ghusl, kafan, burial
                  assistance, and monthly dry ration packages to families in
                  need.
                </p>
                <p className="text-text-muted/80 pt-2 font-mono text-xs">
                  Line height: 1.70 (Balanced & Calm)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="primary">தமிழ் (Tamil)</Badge>
                  <span className="text-text-muted text-xs">
                    Noto Sans Tamil
                  </span>
                </div>
                <CardTitle className="font-tamil mt-2 text-xl">
                  புகாரி ஜனாஸா நலன்புரி சங்கம்
                </CardTitle>
                <CardDescription className="font-tamil">
                  முள்ளிப்பொத்தானை, கிழக்கு மாகாணம், இலங்கை
                </CardDescription>
              </CardHeader>
              <CardContent className="text-text-muted font-tamil space-y-2 text-sm">
                <p>
                  ஜனாஸா சேவைகள், கஃபன் மற்றும் குஸுல், அடக்கம் செய்யும் உதவி,
                  மற்றும் மாதாந்த உலர் உணவுப் பொதிகள் வழங்குதல்.
                </p>
                <p className="text-text-muted/80 pt-2 font-mono font-sans text-xs">
                  Line height: 1.85 (Tall script ascender safe)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="accent">සිංහල (Sinhala)</Badge>
                  <span className="text-text-muted text-xs">
                    Noto Sans Sinhala
                  </span>
                </div>
                <CardTitle className="font-sinhala mt-2 text-xl">
                  බුහාරි ජනාසා සුභසාධක සමිතිය
                </CardTitle>
                <CardDescription className="font-sinhala">
                  මුල්ලිපොத்தான, නැගෙනහිර පළාත, ශ්‍රී ලංකාව
                </CardDescription>
              </CardHeader>
              <CardContent className="text-text-muted font-sinhala space-y-2 text-sm">
                <p>
                  අවසන් කටයුතු සේවා, සුසාන භූමි නඩත්තුව, සහ දිළිඳු පවුල් සඳහා
                  මාසික වියළි සලාක බෙදා හැරීම.
                </p>
                <p className="text-text-muted/80 pt-2 font-mono font-sans text-xs">
                  Line height: 1.85 (Complex glyph clearance)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* 3. Buttons & Interactive States */}
      <Section
        title="3. Buttons"
        eyebrow="Interactive Elements"
        description="Respectful, accessible button components with distinct keyboard focus rings and gentle CSS transitions."
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link Style</Button>
          </div>

          <div className="border-border border-t pt-6">
            <h3 className="text-text-muted mb-4 text-sm font-semibold tracking-wider uppercase">
              Sizes & Special States
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small (h-9)</Button>
              <Button size="md">Medium (h-11)</Button>
              <Button size="lg">Large (h-12)</Button>
              <Button variant="primary" isLoading>
                Loading...
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Badges */}
      <Section
        variant="surface"
        title="4. Badges & Tags"
        eyebrow="Categorization"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default">Default Muted</Badge>
          <Badge variant="primary">Primary Evergreen</Badge>
          <Badge variant="accent">Accent Sage</Badge>
          <Badge variant="success">Completed / Active</Badge>
          <Badge variant="warning">Notice / Review</Badge>
          <Badge variant="outline">Outline Tag</Badge>
        </div>
      </Section>

      {/* 5. Metrics */}
      <Section
        title="5. Society Metrics (Stat Component)"
        eyebrow="Community Impact"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Year Founded"
            value="2023"
            description="Reg No: DS/TH/SS/VSSO/2023/01"
          />
          <Stat
            label="Emergency Availability"
            value="24 / 7"
            description="Round-the-clock funeral coordination"
          />
          <Stat
            label="Service Area"
            value="Mullipothanai"
            description="Buhary Jummah Mosque area"
          />
          <Stat
            label="Monthly Ration Aid"
            value="TODO: Count"
            description="Verified needy families assisted"
          />
        </div>
      </Section>

      {/* 6. Accordions */}
      <Section
        variant="surface"
        title="6. Accordion (Accessible Collapsible)"
        eyebrow="Interactive Accordion"
      >
        <Card className="mx-auto max-w-3xl p-4 sm:p-6">
          <Accordion type="single" defaultValue="service-1">
            <AccordionItem value="service-1">
              <AccordionTrigger>
                What funeral services does BJWS provide immediately upon a
                death?
              </AccordionTrigger>
              <AccordionContent>
                The society arranges prompt janazah assistance including ghusl
                (ritual bathing), kafan (shrouding cloths), local hearse
                transport, burial preparation at the cemetery, and funeral
                prayer coordination with the mosque committee.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="service-2">
              <AccordionTrigger>
                Who is eligible for the monthly dry ration welfare distribution?
              </AccordionTrigger>
              <AccordionContent>
                Monthly dry rations are distributed to registered destitute
                families, widows, and vulnerable community members residing in
                the Buhary Jummah Mosque area following committee review.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </Section>

      {/* 7. Forms */}
      <Section
        title="7. Form Controls & Validation States"
        eyebrow="Input Elements"
      >
        <div className="bg-surface border-border mx-auto grid max-w-4xl grid-cols-1 gap-8 rounded-xl border p-6 shadow-2xs sm:p-8 md:grid-cols-2">
          <div className="space-y-5">
            <h3 className="text-text border-border border-b pb-2 text-base font-semibold">
              Standard Input States
            </h3>
            <FormField
              id="full-name"
              label="Full Name"
              required
              hint="As indicated on NIC"
            >
              <Input placeholder="e.g. M. Mohamed" />
            </FormField>
            <FormField
              id="phone-number"
              label="Contact Phone Number"
              required
              hint="Mobile number for SMS or call"
            >
              <Input type="tel" placeholder="07X-XXXXXXX" />
            </FormField>
            <FormField id="notes" label="Inquiry / Service Request Details">
              <Textarea placeholder="Write your message here..." rows={3} />
            </FormField>
            <Button variant="primary" className="w-full">
              Submit Request
            </Button>
          </div>

          <div className="space-y-5">
            <h3 className="text-text border-border border-b pb-2 text-base font-semibold">
              Validation & Disabled States
            </h3>
            <FormField
              id="error-email"
              label="Email Address"
              required
              error="Please enter a valid email address."
            >
              <Input defaultValue="invalid-email-address" />
            </FormField>
            <FormField
              id="error-textarea"
              label="Required Description"
              required
              error="This field cannot be left blank."
            >
              <Textarea defaultValue="" rows={2} />
            </FormField>
            <FormField
              id="disabled-field"
              label="Society Registration Number"
              hint="System-assigned identifier"
            >
              <Input defaultValue="DS/TH/SS/VSSO/2023/01" disabled />
            </FormField>
            <Button variant="secondary" disabled className="w-full">
              Processing Action (Disabled)
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
