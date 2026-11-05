export interface NoticeRecord {
  id: string;
  title: string;
  body: string;
  locale: "ta" | "en" | "si" | string;
  published_at: string;
  is_published: boolean;
  created_at?: string;
}

export interface UnifiedNoticeRecord {
  baseId: string;
  published_at: string;
  is_published: boolean;
  translations: {
    ta?: NoticeRecord;
    en?: NoticeRecord;
    si?: NoticeRecord;
  };
}

export const INITIAL_NOTICES: NoticeRecord[] = [
  {
    id: "notice-seed-ta",
    title: "மஹல்லா மையவாடி சிரமதானப் பணி அழைப்பு",
    body: "எமது மஹல்லா மையவாடியை துப்புரவு செய்யும் வருடாந்த சிரமதானப் பணியில் அனைத்து இளைஞர்களையும் பொதுமக்களையும் பங்குபற்றுமாறு அன்புடன் அழைக்கின்றோம். உபகரணங்கள் மற்றும் சிற்றுண்டிகள் சங்கத்தினால் வழங்கப்படும்.",
    locale: "ta",
    published_at: "2026-03-01T08:00:00.000Z",
    is_published: true,
  },
  {
    id: "notice-seed-en",
    title: "Annual Shramadhana Program at Mahallah Cemetery Grounds",
    body: "We invite all youth, volunteers, and community members to participate in the upcoming seasonal clean-up and maintenance of the Mahallah cemetery grounds. Refreshments and tools will be provided by the society.",
    locale: "en",
    published_at: "2026-03-01T08:00:00.000Z",
    is_published: true,
  },
  {
    id: "notice-seed-si",
    title: "සුසාන භූමි වාර්ෂික ශ්‍රමදාන වැඩසටහන",
    body: "මහල්ල සුසාන භූමිය පිරිසිදු කිරීමේ වාර්ෂික ශ්‍රමදාන කටයුතු සඳහා සහභාගී වන ලෙස ප්‍රජාවට ආරාධනා කරමු. සියලු උපකරණ සහ ප්‍රබෝධක සමිතිය විසින් සපයනු ලැබේ.",
    locale: "si",
    published_at: "2026-03-01T08:00:00.000Z",
    is_published: true,
  },
];

declare global {
  var __liveNoticesStore: NoticeRecord[] | undefined;
}

let liveNoticesStore: NoticeRecord[] =
  globalThis.__liveNoticesStore || [...INITIAL_NOTICES];
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
          is_published: item.is_published,
          translations: {},
        });
      }
      const u = map.get(key)!;
      u.translations[loc] = item;
      if (item.is_published) u.is_published = true;
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
          is_published: item.is_published,
          translations: {},
        });
      }
      const u = map.get(baseKey)!;
      u.translations[loc] = item;
      if (item.is_published) u.is_published = true;
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
    } else {
      const key = item.id;
      map.set(key, {
        baseId: key,
        published_at: item.published_at,
        is_published: item.is_published,
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
  const source = noticesList && noticesList.length > 0 ? noticesList : liveNoticesStore;
  return groupNotices(source);
}

export function addUnifiedNoticeStore(entries: NoticeRecord[]): void {
  liveNoticesStore = [...entries, ...liveNoticesStore];
  globalThis.__liveNoticesStore = liveNoticesStore;
}

export function updateUnifiedNoticeStore(
  baseId: string,
  updatedTranslations: Partial<Record<"ta" | "en" | "si", { title: string; body: string }>>,
  is_published: boolean
): void {
  const now = new Date().toISOString();
  const currentGroups = groupNotices(liveNoticesStore);
  const targetGroup = currentGroups.find((g) => g.baseId === baseId);

  if (targetGroup) {
    const existingIds = Object.values(targetGroup.translations).map((t) => t?.id).filter(Boolean);
    // Remove old items of this group
    liveNoticesStore = liveNoticesStore.filter((n) => !existingIds.includes(n.id));

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
    const ids = Object.values(target.translations).map((t) => t?.id).filter(Boolean);
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
    const ids = Object.values(target.translations).map((t) => t?.id).filter(Boolean);
    liveNoticesStore = liveNoticesStore.filter((n) => !ids.includes(n.id));
  }
  globalThis.__liveNoticesStore = liveNoticesStore;
}
