export interface NoticeRecord {
  id: string;
  title: string;
  body: string;
  locale: "ta" | "en" | "si" | string;
  published_at: string;
  updated_at?: string;
  is_published: boolean;
  show_on_homepage?: boolean;
  created_at?: string;
}

export interface UnifiedNoticeRecord {
  baseId: string;
  published_at: string;
  updated_at?: string;
  is_published: boolean;
  show_on_homepage?: boolean;
  translations: {
    ta?: NoticeRecord;
    en?: NoticeRecord;
    si?: NoticeRecord;
  };
}

export const INITIAL_NOTICES: NoticeRecord[] = [];

declare global {
  var __liveNoticesStore: NoticeRecord[] | undefined;
}

let liveNoticesStore: NoticeRecord[] = globalThis.__liveNoticesStore || [
  ...INITIAL_NOTICES,
];
globalThis.__liveNoticesStore = liveNoticesStore;

export function getAllNotices(): NoticeRecord[] {
  return [...liveNoticesStore];
}

export function groupNotices(raw: NoticeRecord[]): UnifiedNoticeRecord[] {
  const map = new Map<string, UnifiedNoticeRecord>();

  for (const item of raw) {
    const loc = (item.locale as "ta" | "en" | "si") || "ta";

    // 1. Seed notices match
    if (
      item.id === "notice-1" ||
      item.id === "notice-2" ||
      item.id === "notice-3" ||
      item.id.startsWith("notice-seed-") ||
      item.id.startsWith("seed-")
    ) {
      const key = "notice-shramadhana-seed";
      if (!map.has(key)) {
        map.set(key, {
          baseId: key,
          published_at: item.published_at,
          updated_at: item.updated_at,
          is_published: item.is_published,
          show_on_homepage: item.show_on_homepage ?? true,
          translations: {},
        });
      }
      const u = map.get(key)!;
      u.translations[loc] = item;
      if (item.is_published) u.is_published = true;
      if (item.updated_at) u.updated_at = item.updated_at;
      if (item.show_on_homepage !== undefined)
        u.show_on_homepage = item.show_on_homepage;
      continue;
    }

    // 2. ID has locale suffix like "...-ta" / "...-en" / "...-si"
    const matchSuffix = item.id.match(/^(.+)-(ta|en|si)$/);
    if (matchSuffix) {
      const baseKey = matchSuffix[1];
      if (!map.has(baseKey)) {
        map.set(baseKey, {
          baseId: baseKey,
          published_at: item.published_at,
          updated_at: item.updated_at,
          is_published: item.is_published,
          show_on_homepage: item.show_on_homepage ?? true,
          translations: {},
        });
      }
      const u = map.get(baseKey)!;
      u.translations[loc] = item;
      if (item.is_published) u.is_published = true;
      if (item.updated_at) u.updated_at = item.updated_at;
      if (item.show_on_homepage !== undefined)
        u.show_on_homepage = item.show_on_homepage;
      continue;
    }

    // 3. Match existing group with identical or close published_at (within 60 seconds)
    let matchedGroup: UnifiedNoticeRecord | null = null;
    const itemTime = new Date(item.published_at).getTime();
    for (const group of map.values()) {
      if (!group.translations[loc]) {
        const groupTime = new Date(group.published_at).getTime();
        if (Math.abs(itemTime - groupTime) < 60000) {
          matchedGroup = group;
          break;
        }
      }
    }

    if (matchedGroup) {
      matchedGroup.translations[loc] = item;
      if (item.is_published) matchedGroup.is_published = true;
      if (item.updated_at) matchedGroup.updated_at = item.updated_at;
      if (item.show_on_homepage !== undefined)
        matchedGroup.show_on_homepage = item.show_on_homepage;
    } else {
      const key = item.id;
      map.set(key, {
        baseId: key,
        published_at: item.published_at,
        updated_at: item.updated_at,
        is_published: item.is_published,
        show_on_homepage: item.show_on_homepage ?? true,
        translations: {
          [loc]: item,
        },
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export function getUnifiedNoticesAdmin(
  noticesList?: NoticeRecord[]
): UnifiedNoticeRecord[] {
  const source =
    noticesList && noticesList.length > 0 ? noticesList : liveNoticesStore;
  return groupNotices(source);
}

export function addUnifiedNoticeStore(entries: NoticeRecord[]): void {
  liveNoticesStore = [...entries, ...liveNoticesStore];
  globalThis.__liveNoticesStore = liveNoticesStore;
}

export function updateUnifiedNoticeStore(
  baseId: string,
  updatedTranslations: Partial<
    Record<"ta" | "en" | "si", { title: string; body: string }>
  >,
  is_published: boolean
): void {
  const now = new Date().toISOString();
  const currentGroups = groupNotices(liveNoticesStore);
  const targetGroup = currentGroups.find((g) => g.baseId === baseId);

  if (targetGroup) {
    const existingIds = Object.values(targetGroup.translations)
      .map((t) => t?.id)
      .filter(Boolean);
    // Remove old items of this group
    liveNoticesStore = liveNoticesStore.filter(
      (n) => !existingIds.includes(n.id)
    );

    // Re-insert updated items
    for (const loc of ["ta", "en", "si"] as const) {
      const trans = updatedTranslations[loc];
      if (trans && trans.title && trans.body) {
        liveNoticesStore.unshift({
          id: targetGroup.translations[loc]?.id || `${baseId}-${loc}`,
          title: trans.title,
          body: trans.body,
          locale: loc,
          published_at: targetGroup.published_at || now,
          is_published,
        });
      }
    }
  } else {
    // New group fallback
    for (const loc of ["ta", "en", "si"] as const) {
      const trans = updatedTranslations[loc];
      if (trans && trans.title && trans.body) {
        liveNoticesStore.unshift({
          id: `${baseId}-${loc}`,
          title: trans.title,
          body: trans.body,
          locale: loc,
          published_at: now,
          is_published,
        });
      }
    }
  }
  globalThis.__liveNoticesStore = liveNoticesStore;
}

export function toggleUnifiedNoticePublishStore(
  baseId: string,
  currentState: boolean
): void {
  const newState = !currentState;
  const groups = groupNotices(liveNoticesStore);
  const target = groups.find((g) => g.baseId === baseId);
  if (target) {
    const ids = Object.values(target.translations)
      .map((t) => t?.id)
      .filter(Boolean);
    liveNoticesStore = liveNoticesStore.map((n) =>
      ids.includes(n.id) ? { ...n, is_published: newState } : n
    );
  }
  globalThis.__liveNoticesStore = liveNoticesStore;
}

export function deleteUnifiedNoticeStore(baseId: string): void {
  const groups = groupNotices(liveNoticesStore);
  const target = groups.find((g) => g.baseId === baseId);
  if (target) {
    const ids = Object.values(target.translations)
      .map((t) => t?.id)
      .filter(Boolean);
    liveNoticesStore = liveNoticesStore.filter((n) => !ids.includes(n.id));
  }
  globalThis.__liveNoticesStore = liveNoticesStore;
}
