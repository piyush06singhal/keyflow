import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KeyFlow",
    short_name: "KeyFlow",
    description:
      "A local-first typing and coding practice arena — no accounts, no tracking.",
    start_url: "/",
    display: "standalone",
    background_color: "#141022",
    theme_color: "#7c5cff",
    icons: [
      {
        src: "/manifest-icon-192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/manifest-icon-512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
