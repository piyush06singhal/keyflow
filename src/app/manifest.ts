import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KeyFlow",
    short_name: "KeyFlow",
    description:
      "Master your typing and coding speed with AI coaching and real-time analytics.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#171717", // Primary dark theme accent
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
