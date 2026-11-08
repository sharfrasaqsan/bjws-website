import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  MessagesManager,
  type ContactMessage,
} from "@/components/admin/messages-manager";
import { MessageSquare, ArrowLeft } from "lucide-react";

export default async function AdminMessagesPage() {
  await getAdminSession();

  let messages: ContactMessage[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, name, phone, email, message, locale, status, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        messages = data;
      }
    } catch (err) {
      console.warn("Failed to fetch contact messages:", err);
    }
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#124d34] hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-[#cbd5e1]">/</span>
              <span className="text-xs font-medium text-[#6b7280]">
                Contact Inquiries
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                  Community Inquiries & Messages
                </h1>
                <p className="text-xs text-[#6b7280] sm:text-sm">
                  Review public inquiries, follow up by phone or WhatsApp, and
                  maintain contact logs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <MessagesManager initialMessages={messages} />
      </div>
    </div>
  );
}
