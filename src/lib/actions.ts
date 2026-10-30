"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

// ====================================================================
// Contact Form Schema & Action
// ====================================================================
const contactSchema = z.object({
  name: z.string().trim().min(2, "errorNameMin").max(100, "errorNameMax"),
  phone: z
    .string()
    .trim()
    .min(9, "errorPhoneInvalid")
    .max(20, "errorPhoneInvalid"),
  email: z
    .string()
    .trim()
    .email("errorEmailInvalid")
    .or(z.literal(""))
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "errorMessageMin")
    .max(2000, "errorMessageMax"),
  locale: z.enum(["ta", "en", "si"]).default("ta"),
  consent: z.literal(true, { message: "errorConsentRequired" }),
  // Honeypot field (bots fill this, humans cannot see it)
  bot_trap: z.string().max(0, "errorSpamDetected").optional().or(z.literal("")),
});

export interface ActionResponse {
  success: boolean;
  messageKey?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitContactAction(
  _prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // 1. Rate Limiting by Client IP
    const headerList = await headers();
    const clientIp =
      headerList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headerList.get("x-real-ip") ||
      "anonymous";

    const rateLimit = checkRateLimit(`contact:${clientIp}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return {
        success: false,
        messageKey: "errorRateLimit",
      };
    }

    // 2. Extract Data
    const rawData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email") || "",
      message: formData.get("message"),
      locale: formData.get("locale") || "ta",
      consent:
        formData.get("consent") === "on" || formData.get("consent") === "true",
      bot_trap: formData.get("website_url") || "",
    };

    // 3. Honeypot check
    if (rawData.bot_trap) {
      // Silently pretend success to mislead bot scrapers
      return { success: true, messageKey: "successMessageSent" };
    }

    // 4. Validate with Zod
    const validated = contactSchema.safeParse(rawData);
    if (!validated.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validated.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      }
      return { success: false, fieldErrors };
    }

    // 5. Insert into Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: validated.data.name,
        phone: validated.data.phone,
        email: validated.data.email || null,
        message: validated.data.message,
        locale: validated.data.locale,
        status: "new",
      });

      if (error) {
        console.error(
          "Supabase insert error (contact_messages):",
          error.message
        );
        return { success: false, messageKey: "errorDatabaseFailed" };
      }
    } else {
      console.log(
        "[Demo / Dev Mode] Contact message received (Supabase not configured):",
        validated.data
      );
    }

    return { success: true, messageKey: "successMessageSent" };
  } catch (err) {
    console.error("Unexpected error in submitContactAction:", err);
    return { success: false, messageKey: "errorGeneric" };
  }
}

// ====================================================================
// Membership Request Schema & Action
// ====================================================================
const membershipSchema = z.object({
  fullName: z.string().trim().min(3, "errorNameMin").max(120, "errorNameMax"),
  phone: z
    .string()
    .trim()
    .min(9, "errorPhoneInvalid")
    .max(20, "errorPhoneInvalid"),
  email: z
    .string()
    .trim()
    .email("errorEmailInvalid")
    .or(z.literal(""))
    .optional(),
  addressArea: z
    .string()
    .trim()
    .min(3, "errorAddressRequired")
    .max(200, "errorAddressMax"),
  familySize: z.coerce
    .number()
    .int()
    .min(1, "errorFamilySizeMin")
    .max(25, "errorFamilySizeMax")
    .optional(),
  preferredContact: z
    .enum(["phone", "whatsapp", "sms", "email"])
    .default("phone"),
  plan: z.enum(["monthly", "annual"]).default("monthly"),
  consent: z.literal(true, { message: "errorConsentRequired" }),
  bot_trap: z.string().max(0, "errorSpamDetected").optional().or(z.literal("")),
});

export async function submitMembershipAction(
  _prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const headerList = await headers();
    const clientIp =
      headerList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headerList.get("x-real-ip") ||
      "anonymous";

    const rateLimit = checkRateLimit(`membership:${clientIp}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return {
        success: false,
        messageKey: "errorRateLimit",
      };
    }

    const rawData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email") || "",
      addressArea: formData.get("addressArea"),
      familySize: formData.get("familySize") || undefined,
      preferredContact: formData.get("preferredContact") || "phone",
      plan: formData.get("plan") || "monthly",
      consent:
        formData.get("consent") === "on" || formData.get("consent") === "true",
      bot_trap: formData.get("organization_code") || "",
    };

    if (rawData.bot_trap) {
      return { success: true, messageKey: "successMembershipSubmitted" };
    }

    const validated = membershipSchema.safeParse(rawData);
    if (!validated.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validated.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      }
      return { success: false, fieldErrors };
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.from("membership_requests").insert({
        full_name: validated.data.fullName,
        phone: validated.data.phone,
        email: validated.data.email || null,
        address_area: validated.data.addressArea,
        family_size: validated.data.familySize || null,
        preferred_contact: validated.data.preferredContact,
        plan: validated.data.plan,
        consent: true,
        status: "pending",
      });

      if (error) {
        console.error(
          "Supabase insert error (membership_requests):",
          error.message
        );
        return { success: false, messageKey: "errorDatabaseFailed" };
      }
    } else {
      console.log(
        "[Demo / Dev Mode] Membership request received (Supabase not configured):",
        validated.data
      );
    }

    return { success: true, messageKey: "successMembershipSubmitted" };
  } catch (err) {
    console.error("Unexpected error in submitMembershipAction:", err);
    return { success: false, messageKey: "errorGeneric" };
  }
}
