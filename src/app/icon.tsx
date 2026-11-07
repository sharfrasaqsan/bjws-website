import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f3d29",
        borderRadius: "14px",
      }}
    >
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v2" stroke="#d1fae5" strokeWidth="1.5" />
        <circle cx="12" cy="1.5" r="0.8" fill="#d1fae5" />
        <path
          d="M12 4v2m0 0a6 6 0 0 1 6 6v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a6 6 0 0 1 6-6z"
          fill="#ffffff"
          fillOpacity="0.2"
        />
        <path d="M9 20v-4a3 3 0 0 1 6 0v4" fill="#ffffff" fillOpacity="0.3" />
      </svg>
    </div>,
    {
      ...size,
    }
  );
}
