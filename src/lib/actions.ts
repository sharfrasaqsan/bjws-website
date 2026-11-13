"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getFirebaseDb } from "@/lib/firebase/server";
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
  referenceNo?: string;
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

    // 5. Insert into Firebase Firestore
    const db = getFirebaseDb();
    if (!db) {
      console.error("[Database Error] Firebase DB is not configured.");
      return { success: false, messageKey: "errorDatabaseFailed" };
    }

    const docRef = db.collection("contact_messages").doc();
    await docRef.set({
      id: docRef.id,
      name: validated.data.name,
      phone: validated.data.phone,
      email: validated.data.email || null,
      message: validated.data.message,
      locale: validated.data.locale,
      status: "new",
      created_at: new Date().toISOString(),
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

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
  nic: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase().replace(/\s+/g, ""))
    .refine((v) => /^([0-9]{9}[VX]|[0-9]{12})$/.test(v), {
      message: "errorNicInvalid",
    }),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => /^(?:\+94|0094|94|0)?7[0-9]{8}$/.test(v), {
      message: "errorPhoneInvalid",
    })
    .transform((v) => {
      if (v.startsWith("+94")) return "0" + v.slice(3);
      if (v.startsWith("0094")) return "0" + v.slice(4);
      if (v.startsWith("94")) return "0" + v.slice(2);
      if (!v.startsWith("0")) return "0" + v;
      return v;
    }),
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
      nic: formData.get("nic"),
      phone: formData.get("phone"),
      email: formData.get("email") || "",
      addressArea: formData.get("addressArea"),
      familySize: formData.get("familySize") || undefined,
      preferredContact: formData.get("preferredContact") || "phone",
      plan: formData.get("plan") || "monthly",
      consent:
        formData.get("consent") === "on" || formData.get("consent") === "true",
    };

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

    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `BJWS-${currentYear}-${randomSuffix}`;

    const db = getFirebaseDb();
    if (!db) {
      console.error("[Database Error] Firebase DB is not configured.");
      return { success: false, messageKey: "errorDatabaseFailed" };
    }

    // 1. Strict Duplicate Check: Prevent multiple submissions by the same NIC
    const existingNicSnap = await db
      .collection("membership_requests")
      .where("nic", "==", validated.data.nic)
      .where("status", "in", ["pending", "approved"])
      .limit(1)
      .get();

    if (!existingNicSnap.empty) {
      return {
        success: false,
        fieldErrors: {
          nic: "errorDuplicateNIC",
        },
        messageKey: "errorDuplicateNIC",
      };
    }

    // 2. Strict Duplicate Check: Prevent multiple submissions with the same phone
    const existingPhoneSnap = await db
      .collection("membership_requests")
      .where("phone", "==", validated.data.phone)
      .where("status", "in", ["pending", "approved"])
      .limit(1)
      .get();

    if (!existingPhoneSnap.empty) {
      return {
        success: false,
        fieldErrors: {
          phone: "errorDuplicatePhone",
        },
        messageKey: "errorDuplicatePhone",
      };
    }

    // 3. Insert verified membership request with Reference No into Firestore
    const newDocRef = db.collection("membership_requests").doc();
    await newDocRef.set({
      id: newDocRef.id,
      full_name: validated.data.fullName,
      nic: validated.data.nic,
      phone: validated.data.phone,
      email: validated.data.email || null,
      address_area: validated.data.addressArea,
      family_size: validated.data.familySize || null,
      preferred_contact: validated.data.preferredContact,
      plan: validated.data.plan,
      consent: true,
      status: "pending",
      reference_no: referenceNo,
      created_at: new Date().toISOString(),
    });

    revalidatePath("/admin/memberships");
    revalidatePath("/admin");

    return {
      success: true,
      messageKey: "successMembershipSubmitted",
      referenceNo,
    };
  } catch (err) {
    console.error("Unexpected error in submitMembershipAction:", err);
    return { success: false, messageKey: "errorGeneric" };
  }
}
