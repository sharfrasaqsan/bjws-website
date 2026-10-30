import { getAdminSession } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import {
  MembershipsManager,
  type MembershipRequest,
} from "@/components/admin/memberships-manager";

export default async function AdminMembershipsPage() {
  await getAdminSession();

  let requests: MembershipRequest[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("membership_requests")
        .select(
          "id, full_name, phone, email, address_area, family_size, preferred_contact, plan, consent, status, created_at"
        )
        .order("created_at", { ascending: false });

      if (!error && data) {
        requests = data;
      }
    } catch (err) {
      console.warn("Failed to fetch membership requests:", err);
    }
  } else {
    requests = [
      {
        id: "mem-1",
        full_name: "K. Rauff Mohamed",
        phone: "0765551234",
        email: "rauff@example.com",
        address_area: "95th Mile Post, Kandy Road, Mullipothanai",
        family_size: 5,
        preferred_contact: "phone",
        plan: "monthly",
        consent: true,
        status: "pending",
        created_at: "2026-03-01T09:00:00Z",
      },
      {
        id: "mem-2",
        full_name: "S. Haleem",
        phone: "0718889999",
        email: null,
        address_area: "Station Road, Mullipothanai",
        family_size: 4,
        preferred_contact: "whatsapp",
        plan: "annual",
        consent: true,
        status: "pending",
        created_at: "2026-02-27T16:45:00Z",
      },
      {
        id: "mem-3",
        full_name: "M. T. Nawas",
        phone: "0773334444",
        email: "nawas@example.com",
        address_area: "Buhary Mosque Mahallah, Mullipothanai",
        family_size: 6,
        preferred_contact: "phone",
        plan: "monthly",
        consent: true,
        status: "approved",
        created_at: "2026-02-20T11:20:00Z",
      },
    ];
  }

  return (
    <div className="py-8 sm:py-10">
      <Container size="xl">
        <header className="mb-8">
          <div className="border-primary/20 text-primary mb-2 inline-flex items-center gap-2 rounded-full border bg-[#e8f3ee] px-3 py-0.5 text-xs font-semibold">
            <span>Membership Directory</span>
          </div>
          <h1 className="text-text text-2xl font-bold tracking-tight sm:text-3xl">
            Membership Applications
          </h1>
          <p className="text-text-muted mt-1 text-xs sm:text-sm">
            Review membership applications, verify local Mahallah residence, and
            approve subscribers.
          </p>
        </header>

        <MembershipsManager initialRequests={requests} />
      </Container>
    </div>
  );
}
