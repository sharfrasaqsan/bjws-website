import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind merge support.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic UTC date formatter to eliminate SSR/client timezone hydration mismatches.
 */
export function formatAdminDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * Normalizes any Google Drive link (sharing link, open link, uc link)
 * into a direct high-speed Google UserContent CDN image URL (`https://lh3.googleusercontent.com/d/FILE_ID`).
 * Leaves local assets and standard image URLs untouched.
 */
export function formatGoogleDriveImageUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();

  // Already normalized Google CDN format
  if (
    trimmed.startsWith("https://lh3.googleusercontent.com/d/") ||
    trimmed.startsWith("http://lh3.googleusercontent.com/d/")
  ) {
    return trimmed;
  }

  // Pattern 1: drive.google.com/file/d/FILE_ID/...
  const fileDMatch = trimmed.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // Pattern 2: drive.google.com/open?id=FILE_ID or drive.google.com/uc?...id=FILE_ID or thumbnail?id=FILE_ID
  const idMatch = trimmed.match(
    /drive\.google\.com\/(?:open|uc|thumbnail).*?[?&]id=([a-zA-Z0-9_-]+)/
  );
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  // Pattern 3: docs.google.com/uc?...id=FILE_ID
  const docsMatch = trimmed.match(
    /docs\.google\.com\/(?:uc|thumbnail).*?[?&]id=([a-zA-Z0-9_-]+)/
  );
  if (docsMatch && docsMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${docsMatch[1]}`;
  }

  return trimmed;
}
