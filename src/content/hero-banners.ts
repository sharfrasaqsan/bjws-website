export interface HeroBanner {
  id: string;
  src: string;
  alt: string;
  label?: string;
  title?: string;
  subtitle?: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_HERO_BANNERS: HeroBanner[] = [];

declare global {
  var __liveHeroBannersStore: HeroBanner[] | undefined;
}

const liveHeroBannersStore: HeroBanner[] =
  globalThis.__liveHeroBannersStore ?? [];

if (process.env.NODE_ENV !== "production") {
  globalThis.__liveHeroBannersStore = liveHeroBannersStore;
}

export function getAllHeroBannersAdmin(): HeroBanner[] {
  return [...liveHeroBannersStore].sort(
    (a, b) => a.order_index - b.order_index
  );
}

export function getActiveHeroBanners(): HeroBanner[] {
  return getAllHeroBannersAdmin().filter((b) => b.is_active);
}

export function addHeroBannerStore(banner: HeroBanner): void {
  const existingIdx = liveHeroBannersStore.findIndex((b) => b.id === banner.id);
  if (existingIdx >= 0) {
    liveHeroBannersStore[existingIdx] = banner;
  } else {
    liveHeroBannersStore.push(banner);
  }
}

export function updateHeroBannerStore(
  id: string,
  updates: Partial<HeroBanner>
): void {
  const idx = liveHeroBannersStore.findIndex((b) => b.id === id);
  if (idx >= 0) {
    liveHeroBannersStore[idx] = {
      ...liveHeroBannersStore[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
  }
}

export function deleteHeroBannerStore(id: string): void {
  const idx = liveHeroBannersStore.findIndex((b) => b.id === id);
  if (idx >= 0) {
    liveHeroBannersStore.splice(idx, 1);
  }
}

export function toggleHeroBannerActiveStore(id: string): void {
  const item = liveHeroBannersStore.find((b) => b.id === id);
  if (item) {
    item.is_active = !item.is_active;
    item.updated_at = new Date().toISOString();
  }
}

export function reorderHeroBannersStore(orderedIds: string[]): void {
  orderedIds.forEach((id, idx) => {
    const item = liveHeroBannersStore.find((b) => b.id === id);
    if (item) {
      item.order_index = idx + 1;
      item.updated_at = new Date().toISOString();
    }
  });
}
