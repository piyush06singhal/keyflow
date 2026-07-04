export const siteConfig = {
  name: "KeyFlow",
  description:
    "A premium typing and coding practice platform with analytics and optional AI coaching.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "",
  },
} as const;
