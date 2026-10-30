import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#124d34",
        borderRadius: "38px",
        color: "#ffffff",
        padding: "24px",
      }}
    >
      <svg
        width="110"
        height="110"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v3m0 0a6 6 0 0 1 6 6v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a6 6 0 0 1 6-6z" />
        <path d="M9 20v-4a3 3 0 0 1 6 0v4" />
      </svg>
    </div>,
    {
      ...size,
    }
  );
}
