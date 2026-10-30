import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Buhary Janaza Welfare Society",
    short_name: "BJWS",
    description:
      "Buhary Janaza (Funeral) Welfare Society, Mullipothanai, Sri Lanka.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8faf8",
    theme_color: "#124d34",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/brand/logo.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
