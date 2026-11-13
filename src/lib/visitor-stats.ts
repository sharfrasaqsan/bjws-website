import { getFirebaseDb } from "@/lib/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export interface VisitorStats {
  today: number;
  todayViews: number;
  thisMonth: number;
  thisMonthViews: number;
  allTime: number;
  allTimeViews: number;
}

// Resilient fallback when database is initializing or connection is pending
export const FALLBACK_VISITOR_STATS: VisitorStats = {
  today: 0,
  todayViews: 0,
  thisMonth: 0,
  thisMonthViews: 0,
  allTime: 0,
  allTimeViews: 0,
};

/**
 * Fetch current aggregated visitor stats from Firestore.
 * Calculates 100% authentic live website traffic since launch.
 */
export async function getVisitorStats(): Promise<VisitorStats> {
  const db = getFirebaseDb();
  if (!db) {
    return FALLBACK_VISITOR_STATS;
  }

  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const monthPrefix = todayStr.slice(0, 7);

    const snapshot = await db.collection("site_visit_stats").get();
    if (snapshot.empty) {
      return FALLBACK_VISITOR_STATS;
    }

    let todayUnique = 0;
    let todayViews = 0;
    let monthUnique = 0;
    let monthViews = 0;
    let allTimeUnique = 0;
    let allTimeViews = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.visit_date || doc.id;
      const views = Number(data.page_views) || 0;
      const unique = Number(data.unique_visitors) || 0;

      if (date === todayStr) {
        todayUnique += unique;
        todayViews += views;
      }

      if (typeof date === "string" && date.startsWith(monthPrefix)) {
        monthUnique += unique;
        monthViews += views;
      }

      allTimeUnique += unique;
      allTimeViews += views;
    });

    return {
      today: todayUnique,
      todayViews: todayViews,
      thisMonth: monthUnique,
      thisMonthViews: monthViews,
      allTime: allTimeUnique,
      allTimeViews: allTimeViews,
    };
  } catch (err) {
    console.warn("Failed to get visitor stats from Firestore:", err);
    return FALLBACK_VISITOR_STATS;
  }
}

/**
 * Record a visit and return updated stats atomically using Firestore increment.
 */
export async function recordVisit(
  isNewVisitor: boolean
): Promise<VisitorStats> {
  const db = getFirebaseDb();
  if (!db) {
    return FALLBACK_VISITOR_STATS;
  }

  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const docRef = db.collection("site_visit_stats").doc(todayStr);

    await docRef.set(
      {
        visit_date: todayStr,
        page_views: FieldValue.increment(1),
        unique_visitors: isNewVisitor
          ? FieldValue.increment(1)
          : FieldValue.increment(0),
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );

    return await getVisitorStats();
  } catch (err) {
    console.warn("Failed to record visit in Firestore:", err);
    return FALLBACK_VISITOR_STATS;
  }
}
