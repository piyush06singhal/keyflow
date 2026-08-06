import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_2 } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "KeyFlow",
    template: "%s | KeyFlow",
  },
  description:
    "A local-first typing and coding practice arena with AI-generated content — no accounts, no tracking.",
  applicationName: "KeyFlow",
  keywords: [
    "typing practice",
    "coding practice",
    "keyboard training",
    "developer practice",
    "typing speed",
  ],
  authors: [{ name: "KeyFlow" }],
  creator: "KeyFlow",
  openGraph: {
    title: "KeyFlow",
    description: "A local-first typing and coding practice arena.",
    siteName: "KeyFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyFlow",
    description: "A local-first typing and coding practice arena.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KeyFlow",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
