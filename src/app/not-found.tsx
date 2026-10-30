import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#f8faf8] p-4 font-sans text-[#111827]">
        <Container size="md" className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#124d34] text-xl font-bold text-white shadow-sm">
            BJWS
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            404 - Page Not Found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
            Buhary Janaza Welfare Society (BJWS) • Mullipothanai, Sri Lanka
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ta"
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#124d34] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0e3d29]"
            >
              தமிழ் (Tamil)
            </Link>
            <Link
              href="/en"
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
            >
              English
            </Link>
            <Link
              href="/si"
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
            >
              සිංහල (Sinhala)
            </Link>
          </div>
        </Container>
      </body>
    </html>
  );
}
