/**
 * Gallery Manifest for Buhary Janaza Welfare Society (BJWS)
 *
 * PRIVACY & CONSENT POLICY RULE:
 * -------------------------------------------------------------
 * Every photo in this manifest MUST have an `approved: boolean` flag.
 * Only images with `approved: true` will be rendered on the website.
 *
 * Strict Privacy Guidelines:
 * 1. Photos depicting identifiable community members, grieving family members,
 *    women, or children require documented explicit consent before `approved`
 *    can be set to true.
 * 2. Funeral preparation, ghusl, or shrouding photos must never show the deceased
 *    or infringe upon privacy and dignity; only general educational workshops
 *    with consenting attendees may be approved.
 * 3. Any unapproved or pending-verification photo remains omitted from public views.
 */

export * from "./gallery-types";
import type { GalleryCategory, GalleryCategoryMeta, GalleryImage } from "./gallery-types";

export const GALLERY_CATEGORIES: GalleryCategoryMeta[] = [];
export const GALLERY_MANIFEST: GalleryImage[] = [];

import { INITIAL_UPLOADED_IMAGES } from "./gallery-uploads";

declare global {
  var __galleryStore: GalleryImage[] | undefined;
}

// Synchronize in-memory store with latest static definitions on disk
function getSynchronizedStore(): GalleryImage[] {
  const staticList = [...INITIAL_UPLOADED_IMAGES, ...GALLERY_MANIFEST];
  const staticBySrc = new Map<string, GalleryImage>();
  const staticById = new Map<string, GalleryImage>();

  for (const img of staticList) {
    staticBySrc.set(img.src, img);
    staticById.set(img.id, img);
  }

  const existingStore = globalThis.__galleryStore;
  if (!existingStore || existingStore.length === 0) {
    const fresh = [...staticList];
    globalThis.__galleryStore = fresh;
    return fresh;
  }

  // Force latest metadata (captions, categories, alt text) from disk for all static images,
  // while preserving dynamic uploads and approval toggles from current session.
  const synchronized: GalleryImage[] = [];
  const handledSrcs = new Set<string>();

  const REMOVED_CATEGORIES = new Set([
    "ghusl-kafan",
    "iftar-functions",
    "livelihood-project",
  ]);

  for (const item of existingStore) {
    if (REMOVED_CATEGORIES.has(item.category)) {
      continue; // Totally removed per society executive direction
    }

    const staticMatch = staticBySrc.get(item.src) || staticById.get(item.id);
    if (staticMatch) {
      if (!handledSrcs.has(staticMatch.src)) {
        handledSrcs.add(staticMatch.src);
        synchronized.push({
          ...staticMatch,
          approved: item.approved !== undefined ? item.approved : staticMatch.approved,
        });
      }
    } else {
      // Dynamic photo added during this admin session (excluding removed categories)
      synchronized.push(item);
    }
  }

  // Ensure any newly added static photos are included
  for (const img of staticList) {
    if (!handledSrcs.has(img.src)) {
      handledSrcs.add(img.src);
      synchronized.push(img);
    }
  }

  globalThis.__galleryStore = synchronized;
  return synchronized;
}

/**
 * Returns strictly approved gallery images in compliance with the Privacy & Consent Policy.
 */
export function getApprovedGalleryImages(): GalleryImage[] {
  return getSynchronizedStore().filter((item) => item.approved === true);
}

/**
 * Returns approved gallery images for a specific category.
 */
export function getApprovedGalleryByCategory(
  category: GalleryCategory
): GalleryImage[] {
  return getSynchronizedStore().filter(
    (item) => item.approved === true && item.category === category
  );
}

/**
 * Returns all gallery images for executive administration, including unapproved/pending.
 */
export function getAllGalleryImagesAdmin(): GalleryImage[] {
  return [...getSynchronizedStore()];
}

export function addGalleryImageStore(image: GalleryImage): void {
  const store = getSynchronizedStore();
  globalThis.__galleryStore = [image, ...store];
}

export function updateGalleryImageStore(
  id: string,
  updates: Partial<GalleryImage>
): boolean {
  const store = getSynchronizedStore();
  const index = store.findIndex((img) => img.id === id);
  if (index === -1) return false;

  store[index] = {
    ...store[index],
    ...updates,
  };
  globalThis.__galleryStore = store;
  return true;
}

export function deleteGalleryImageStore(id: string): boolean {
  const store = getSynchronizedStore();
  const initialLen = store.length;
  const filtered = store.filter((img) => img.id !== id);
  globalThis.__galleryStore = filtered;
  return filtered.length < initialLen;
}

export function toggleGalleryApprovalStore(id: string): boolean {
  const store = getSynchronizedStore();
  const image = store.find((img) => img.id === id);
  if (!image) return false;
  image.approved = !image.approved;
  globalThis.__galleryStore = store;
  return true;
}

export function renameGalleryCategoryStore(
  oldCategory: string,
  newCategory: string
): number {
  const store = getSynchronizedStore();
  let count = 0;
  globalThis.__galleryStore = store.map((img) => {
    if (img.category === oldCategory) {
      count++;
      return { ...img, category: newCategory as GalleryCategory };
    }
    return img;
  });
  return count;
}
