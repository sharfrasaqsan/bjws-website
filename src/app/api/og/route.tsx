import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "Buhary Janaza Welfare Society";
    const locale = searchParams.get("locale") || "ta";
    const badge = searchParams.get("badge") || "Reg: DS/TH/SS/VSSO/2023/01";

    const subtitleMap: Record<string, string> = {
      ta: "முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் மஹல்லா",
      en: "Buhary Jummah Mosque Area, Mullipothanai, Sri Lanka",
      si: "බුහාරි ජුම්මා පල්ලිය ප්‍රදේශය, මුල්ලිපොතාන",
    };

    const subtitle = subtitleMap[locale] || subtitleMap.ta;

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background:
            "linear-gradient(135deg, #0b2e1e 0%, #124d34 50%, #0d3824 100%)",
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Subtle decorative inner border */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            right: "24px",
            bottom: "24px",
            border: "1.5px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            pointerEvents: "none",
          }}
        />

        {/* Top Row: Society Logo Emblem & Official Registration */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            {/* Crescent/Dome Emblem */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#124d34"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v3m0 0a6 6 0 0 1 6 6v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a6 6 0 0 1 6-6z" />
                <path d="M9 20v-4a3 3 0 0 1 6 0v4" />
              </svg>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  color: "#ffffff",
                }}
              >
                BUHARY JANAZA WELFARE SOCIETY
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#9bd6be",
                  fontWeight: 500,
                }}
              >
                புகாரி ஜனாஸா நலன்புரிச் சங்கம்
              </span>
            </div>
          </div>

          {/* Registration Badge */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "30px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#d1fae5",
              letterSpacing: "0.5px",
            }}
          >
            {badge}
          </div>
        </div>

        {/* Center: Dynamic Page Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "1020px",
            margin: "auto 0",
          }}
        >
          <div
            style={{
              fontSize: title.length > 50 ? "46px" : "56px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "22px",
              color: "#a7f3d0",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom Bar: Services & Geographic Identity */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "24px",
              fontSize: "14px",
              color: "#e2e8f0",
              fontWeight: 600,
            }}
          >
            <span>• Janaza Services</span>
            <span>• Cemetery Renovation</span>
            <span>• Dry Rations</span>
            <span>• Workshops</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#94a3b8",
              fontWeight: 500,
            }}
          >
            <span>Mullipothanai, Eastern Province, Sri Lanka</span>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Open Graph generation error:", e);
    return new Response("Failed to generate OG Image", { status: 500 });
  }
}
