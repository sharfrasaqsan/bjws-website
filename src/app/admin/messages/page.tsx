import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
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
      const supabase = await createClient();
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
  } else {
    // Demo records
    messages = [
      {
        id: "msg-1",
        name: "M. Mohamed Nizam",
        phone: "0771234567",
        email: "nizam@example.com",
        message:
          "Assalamu Alaikum. I would like to inquire about registering my elderly father under the funeral welfare program. Please let me know the procedure and required documents.",
        locale: "en",
        status: "new",
        created_at: "2026-03-01T10:30:00Z",
      },
      {
        id: "msg-2",
        name: "A. Farook",
        phone: "0759876543",
        email: null,
        message:
          "மஹல்லா மையவாடிக்கு நீர் குழாய் இணைப்பு அமைக்கும் திட்டத்திற்கு நன்கொடை வழங்க விரும்புகின்றேன். வங்கி கணக்கு விபரங்களை எனக்கு அனுப்பி வைக்க முடியுமா?",
        locale: "ta",
        status: "new",
        created_at: "2026-02-28T14:15:00Z",
      },
      {
        id: "msg-3",
        name: "S. K. Rizwan",
        phone: "0712345678",
        email: "rizwan@example.com",
        message:
          "Thank you for arranging the Janaza service last week for our family member. We truly appreciate the dedication of your volunteers during the hour of bereavement.",
        locale: "en",
        status: "read",
        created_at: "2026-02-25T11:00:00Z",
      },
      {
        id: "msg-4",
        name: "K. Priyantha",
        phone: "0701112233",
        email: null,
        message:
          "සුසාන භූමියට පිවිසෙන මාර්ගය සම්බන්ධයෙන් විමසීමක් කිරීමට අවශ්‍යයි. කරුණාකර දුරකථන අංකයක් ලබා දෙන්න.",
        locale: "si",
        status: "replied",
        created_at: "2026-02-20T09:30:00Z",
      },
    ];
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
                  Review public inquiries, follow up by phone or WhatsApp, and maintain contact logs.
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
