# Buhary Janaza (Funeral) Welfare Society (BJWS)

**Official Web Portal & Community Management System**

[![CI Pipeline](https://github.com/your-org/bjws-website/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/bjws-website/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres_%26_Auth-3ecf8e?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

Official website for the **Buhary Janaza Welfare Society (BJWS)**, a registered community voluntary welfare organization serving the Muslim community of the Buhary Jummah Mosque area in Mullipothanai, Eastern Province, Sri Lanka.

- **Government Registration No:** `DS/TH/SS/VSSO/2023/01` (Founded 2023)
- **Official Address:** 95th Buhary Jummah Mosque, Kandy Road, Mullipothanai, Sri Lanka
- **Official Email:** `mbjwsociety@gmail.com`
- **Core Activities:** 24/7 Janaza (funeral) assistance, Ghusl & Kafan facilities, cemetery ground maintenance & road renovation, monthly dry ration distributions, and youth training workshops.

---

## Table of Contents

1. [Tech Stack & Architecture](#tech-stack--architecture)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Supabase Setup & Database Migrations](#supabase-setup--database-migrations)
5. [Vercel Deployment Guide](#vercel-deployment-guide)
6. [Connecting Custom Domain](#connecting-custom-domain)
7. [Non-Developer Content Update Guide](#non-developer-content-update-guide)
8. [Pre-Launch Checklist](#pre-launch-checklist)

---

## Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Styling & Design System:** Tailwind CSS v4, mobile-first, WCAG 2.2 AAA contrast with society evergreen palette (`#124d34`).
- **Internationalization (i18n):** `next-intl` with locale-prefixed routing (`/ta` [default], `/en`, `/si`), language switcher, and locale detection.
- **Backend & Database:** Supabase Postgres with strict Row Level Security (RLS) on all tables.
- **File Storage:** Supabase Storage (`reports` bucket for audited PDF documents).
- **Authentication:** Supabase Auth for the protected `/admin` dashboard.
- **SEO & Performance:** Full schema.org JSON-LD (NGO, Breadcrumbs, Services, ContactPage, AboutPage), dynamic Open Graph images (`next/og`), dynamic `sitemap.ts` with `hreflang`, and `robots.ts`.

---

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v20.x or later
- `npm` v10.x or later
- Git

### 1. Clone & Install

```bash
git clone https://github.com/your-org/bjws-website.git
cd bjws-website
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials (see [Environment Variables](#environment-variables)).

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The default route redirects to `/ta` (Tamil).

### 4. Available NPM Scripts

| Command                   | Description                                                      |
| :------------------------ | :--------------------------------------------------------------- |
| `npm run dev`             | Starts local Next.js Turbopack development server                |
| `npm run build`           | Compiles optimized production build and generates static pages   |
| `npm run start`           | Runs the production build locally                                |
| `npm run typecheck`       | Validates strict TypeScript types across the entire project      |
| `npm run lint`            | Runs ESLint analysis                                             |
| `npm run format`          | Auto-formats code with Prettier and Tailwind CSS plugin          |
| `npm run format:check`    | Verifies code formatting in CI                                   |
| `npm run images:optimize` | Converts and compresses gallery photos to WebP/AVIF (max 1600px) |

---

## Environment Variables

| Variable                        | Scope  | Required | Description                                                                           |
| :------------------------------ | :----: | :------: | :------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`          | Public |   Yes    | Canonical site URL (e.g. `http://localhost:3000` locally, `https://bjws.org` in prod) |
| `NEXT_PUBLIC_SUPABASE_URL`      | Public |   Yes    | Supabase Project URL (`https://your-project.supabase.co`)                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public |   Yes    | Supabase Publishable / Anon Key (safe for client-side)                                |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server |   Yes    | Supabase Secret / Service Role Key (**never expose to client**)                       |

---

## Supabase Setup & Database Migrations

### 1. Apply Database Migrations

1. Navigate to your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** (`<_>`) in the left navigation sidebar.
3. Open [`supabase/migrations/20261030000001_initial_schema.sql`](./supabase/migrations/20261030000001_initial_schema.sql) and paste its contents into the editor.
4. Click **Run**.
5. Open [`supabase/migrations/20261030000002_admin_and_storage.sql`](./supabase/migrations/20261030000002_admin_and_storage.sql) and paste its contents into the editor.
6. Click **Run**.

### 2. Created Database Tables & Security Policies

- **`contact_messages`**: Public can `INSERT` with honeypot spam verification; only authenticated admins can `SELECT`/`UPDATE`/`DELETE`.
- **`membership_requests`**: Public can `INSERT` with mandatory consent flag; only authenticated admins can review applications.
- **`notices`**: Public can `SELECT` published notices only (`is_published = true`).
- **`reports`**: Public can `SELECT` published reports only (`is_published = true`).
- **`storage.buckets` (`reports`)**: Public can view PDFs; authenticated admins can upload/delete.

### 3. Create First Administrator Account

1. In your Supabase Dashboard, go to **Authentication** → **Users**.
2. Click **Add User** → **Create User**.
3. Enter your society executive email and a strong password.
4. You can immediately access the protected portal at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Vercel Deployment Guide

### Step 1: Push Repository to GitHub

Ensure all code changes are pushed to your GitHub repository:

```bash
git add .
git commit -m "feat: complete BJWS production website"
git push origin main
```

### Step 2: Import into Vercel

1. Log in to [Vercel](https://vercel.com/) and click **Add New...** → **Project**.
2. Import the `bjws-website` repository.
3. Keep the default settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Configure Environment Variables in Vercel

In the Vercel project configuration, add the following variables under **Project Settings** → **Environment Variables**:

| Variable                        | Environment              | Value Example                              |
| :------------------------------ | :----------------------- | :----------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Production               | `https://bjws.org`                         |
| `NEXT_PUBLIC_SITE_URL`          | Preview & Development    | `https://$VERCEL_URL` (or leave default)   |
| `NEXT_PUBLIC_SUPABASE_URL`      | Production, Preview, Dev | `https://fwnixwzdpioyhjvtqhxm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Dev | `sb_publishable_ELrqI1...`                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | Production, Preview, Dev | `sb_secret_RjcNLL...`                      |

Click **Deploy**. Vercel will build and deploy the production site.

---

## Connecting Custom Domain

To configure `bjws.org` and redirect `www.bjws.org` to the apex domain:

1. In your Vercel Dashboard, go to **Settings** → **Domains**.
2. Enter your apex domain: `bjws.org` and click **Add**.
3. Select **Redirect to bjws.org** when adding `www.bjws.org`.
4. Log into your Domain Registrar / DNS Provider (e.g. Cloudflare, Namecheap, GoDaddy):
   - **Apex Record (A Record):**
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21`
   - **WWW Record (CNAME Record):**
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com.`
5. Vercel automatically provisions free SSL/TLS certificates via Let's Encrypt once DNS records propagate (typically 5–30 minutes).

---

## Non-Developer Content Update Guide

Society committee members can manage the website without technical expertise:

### 1. Managing Bulletins & Reports via the Admin Dashboard

Go to `https://bjws.org/admin` and sign in:

- **Publishing Notices:** Go to **Notices** → Click **+ New Notice**. Choose language (`Tamil`, `English`, or `Sinhala`), type the message, and click **Save & Publish**.
- **Uploading Audited Reports:** Go to **Reports & Storage** → Click **+ Upload Audited Report (PDF)**. Choose the audit year and select the PDF file. The file is securely uploaded to Supabase Storage and published.
- **Managing Applications & Inquiries:** Go to **Messages** or **Memberships** to review incoming forms and mark them as _Read_, _Replied_, or _Approved_.

### 2. Updating Website Translations & Text

All user-facing text lives in 3 JSON files inside `src/i18n/messages/`:

- `src/i18n/messages/ta.json` (Tamil copy)
- `src/i18n/messages/en.json` (English copy)
- `src/i18n/messages/si.json` (Sinhala copy)

To change any wording (e.g., an address or service description), simply edit the text inside the quotation marks:

```json
"phoneLeader1": "President (A.M. Sahibullah): 075 373 8349"
```

_Never change the key name before the colon (`:`)._

### 3. Adding Gallery Photos (Consent Policy)

1. Place compressed photo files inside `public/images/gallery/`.
2. Open [`src/content/gallery.ts`](./src/content/gallery.ts).
3. Add a new entry to the `GALLERY_ITEMS` array:
   ```ts
   {
     id: "shramadana-03",
     category: "cemetery-shramadana",
     src: "/images/gallery/cemetery-clean-03.webp",
     width: 1600,
     height: 1067,
     captionKey: "photoShramadana3Caption",
     altKey: "photoShramadana3Alt",
     date: "2026-03",
     approved: true, // Only approved photos appear on the public site
   }
   ```

> [!IMPORTANT]
> **Society Privacy Policy:** Photos featuring identifiable individuals, women, or children **must have explicit consent** and committee approval before setting `approved: true`. Unapproved photos are automatically blocked from public rendering.

---

## Pre-Launch Checklist

Complete these 6 checks before official community launch:

- [ ] **1. Translations Proofread:** Verify Tamil terminology (`ta.json`) and confirm that all placeholder strings prefixed with `[TODO-TRANSLATE]` in `si.json` have been finalized.
- [ ] **2. Photo Consent Verified:** Confirm every image marked `approved: true` in [`src/content/gallery.ts`](./src/content/gallery.ts) has received subject consent in compliance with the society's privacy standards.
- [ ] **3. Leadership Contact Information:** Verify that all telephone numbers for the President, Secretary, Treasurer, and Coordinator in [`contact/page.tsx`](./src/app/[locale]/contact/page.tsx) and `en.json`/`ta.json` are current and active.
- [ ] **4. End-to-End Form Submissions:** Test submitting a sample message on `/en/contact` and a membership application on `/en/membership`. Confirm records appear in the Supabase Table Editor and Admin Portal.
- [ ] **5. Search Engine Robots & Noindex:** Ensure public routes are indexable and confirm that `/admin` routes return `noindex, nofollow` and are blocked in `/robots.txt`.
- [ ] **6. Sitemaps Submitted:** Submit `https://bjws.org/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
