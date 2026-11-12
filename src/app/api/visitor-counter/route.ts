import { NextResponse } from "next/server";
import {
  getVisitorStats,
  recordVisit,
  FALLBACK_VISITOR_STATS,
} from "@/lib/visitor-stats";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getVisitorStats();
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(FALLBACK_VISITOR_STATS);
  }
}

export async function POST(request: Request) {
  try {
    let isNewVisitor = true;
    try {
      const body = await request.json();
      if (typeof body?.isNewVisitor === "boolean") {
        isNewVisitor = body.isNewVisitor;
      }
    } catch {
      // Body parsing optional; defaults to true
    }

    const stats = await recordVisit(isNewVisitor);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(FALLBACK_VISITOR_STATS);
  }
}
