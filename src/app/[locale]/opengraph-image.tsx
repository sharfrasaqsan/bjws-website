import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const title = t("heroTitle");
  const subtitle = t("heroMission");

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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
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
              {tCommon("societyShort")}
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#9bd6be",
                fontWeight: 500,
              }}
            >
              Mullipothanai, Sri Lanka
            </span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "30px",
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#d1fae5",
          }}
        >
          {tCommon("regNo")}
        </div>
      </div>

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
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#a7f3d0",
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </div>

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
          <span>• Funeral Services</span>
          <span>• Cemetery Works</span>
          <span>• Monthly Rations</span>
          <span>• Workshops</span>
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#94a3b8",
          }}
        >
          95th Buhary Jummah Mosque, Mullipothanai
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
