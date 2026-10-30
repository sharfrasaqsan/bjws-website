import { getAdminSession } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import {
  MessagesManager,
  type ContactMessage,
} from "@/components/admin/messages-manager";

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
          "Assalamu Alaikum. I would like to inquire about registering my elderly father under the funeral welfare program. Please let me know the procedure.",
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
          "மஹல்லா மையவாடிக்கு நீர் குழாய் இணைப்பு அமைக்கும் திட்டத்திற்கு நன்கொடை வழங்க விரும்புகின்றேன்.",
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
          "Thank you for arranging the Janaza service last week for our family member. We truly appreciate the dedication of your volunteers.",
        locale: "en",
        status: "read",
        created_at: "2026-02-25T11:00:00Z",
      },
    ];
  }

  return (
    <div className="py-8 sm:py-10">
      <Container size="xl">
        <header className="mb-8">
          <div className="border-primary/20 text-primary mb-2 inline-flex items-center gap-2 rounded-full border bg-[#e8f3ee] px-3 py-0.5 text-xs font-semibold">
            <span>Inquiries & Follow-up</span>
          </div>
          <h1 className="text-text text-2xl font-bold tracking-tight sm:text-3xl">
            Contact Messages
          </h1>
          <p className="text-text-muted mt-1 text-xs sm:text-sm">
            Review incoming inquiries, follow up with community members, and
            track status.
          </p>
        </header>

        <MessagesManager initialMessages={messages} />
      </Container>
    </div>
  );
}
