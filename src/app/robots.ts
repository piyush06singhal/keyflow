import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://keyflow.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/leaderboards", "/community", "/profile/*"],
      disallow: [
        "/dashboard",
        "/practice/*",
        "/settings/*",
        "/analytics",
        "/ai-coach",
        "/api/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
