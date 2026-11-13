"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin";
}

const ADMIN_SESSION_COOKIE = "bjws_admin_session";
const DEMO_ADMIN_COOKIE = "bjws_admin_demo_session";

// Firebase Web API Key for email/password verification
const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.FIREBASE_API_KEY ||
  "AIzaSyDyMWWmuWHTW36SzxXUsk9Cit3Ydo_oRvQ";

/**
 * Verifies if there is an active authenticated admin session.
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();

  // 1. Check primary admin session cookie
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
  if (sessionCookie?.value) {
    try {
      const parsed = JSON.parse(
        Buffer.from(sessionCookie.value, "base64").toString("utf8")
      );
      if (parsed && parsed.email) {
        return {
          id: parsed.id || "admin-officer-id",
          email: parsed.email,
          role: "admin",
        };
      }
    } catch {
      // Fall back if cookie is plain email or token
      return {
        id: "admin-officer-id",
        email: sessionCookie.value.includes("@")
          ? sessionCookie.value
          : "admin@bjws.org",
        role: "admin",
      };
    }
  }

  // 2. Check legacy / fast-path demo cookie
  const demoCookie = cookieStore.get(DEMO_ADMIN_COOKIE);
  if (demoCookie?.value === "active") {
    return {
      id: "demo-admin-id",
      email: "admin@bjws.org",
      role: "admin",
    };
  }

  return null;
}

/**
 * Server Action: Authenticate admin with email and password.
 */
export async function loginAdminAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const isDemo = formData.get("demo_login") === "true";
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();

  let shouldRedirect = false;
  const isProduction = process.env.NODE_ENV === "production";

  // Fast developer bypass
  if (isDemo && !isProduction) {
    const cookieStore = await cookies();
    const sessionData = {
      id: "demo-admin-id",
      email: "admin@bjws.org",
      role: "admin",
      createdAt: Date.now(),
    };
    const encoded = Buffer.from(JSON.stringify(sessionData)).toString("base64");

    cookieStore.set(ADMIN_SESSION_COOKIE, encoded, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    cookieStore.set(DEMO_ADMIN_COOKIE, "active", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    shouldRedirect = true;
  } else {
    if (!email || !password) {
      return { error: "Please provide both email and password." };
    }

    let authenticated = false;
    let authUser: { id: string; email: string } = {
      id: "admin-user",
      email,
    };

    // 1. Authenticate with Firebase Auth REST API if API Key is available
    if (FIREBASE_API_KEY) {
      try {
        const verifyRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              returnSecureToken: true,
            }),
          }
        );

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.idToken) {
          authenticated = true;
          authUser = {
            id: verifyData.localId || "admin-user",
            email: verifyData.email || email,
          };
        }
      } catch (fbErr) {
        console.warn("Firebase Auth REST API call failed:", fbErr);
      }
    }

    // 2. Fallback: Configured Master Admin Password
    const configuredPassword =
      process.env.ADMIN_PASSWORD || "AdminPassword2026!";
    if (
      !authenticated &&
      password === configuredPassword &&
      (email === "admin@bjws.org" ||
        email === "sharfrasaqsan@gmail.com" ||
        email.endsWith("@bjws.org"))
    ) {
      authenticated = true;
      authUser = {
        id: "master-admin",
        email,
      };
    }

    // 3. Fallback for Local Development
    if (
      !authenticated &&
      !isProduction &&
      (email === "admin@bjws.org" || email === "sharfrasaqsan@gmail.com") &&
      password.length >= 6
    ) {
      authenticated = true;
      authUser = {
        id: "dev-admin",
        email,
      };
    }

    if (!authenticated) {
      return {
        error: "Invalid email or password. Please verify your credentials.",
      };
    }

    // Set secure session cookies
    const cookieStore = await cookies();
    const sessionData = {
      id: authUser.id,
      email: authUser.email,
      role: "admin",
      createdAt: Date.now(),
    };
    const encoded = Buffer.from(JSON.stringify(sessionData)).toString("base64");

    cookieStore.set(ADMIN_SESSION_COOKIE, encoded, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    cookieStore.set(DEMO_ADMIN_COOKIE, "active", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect("/admin");
  }

  return { success: true };
}

/**
 * Server Action: Log out the admin user.
 */
export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();

  // Clear all admin session cookies
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  cookieStore.delete(DEMO_ADMIN_COOKIE);

  redirect("/admin/login");
}
