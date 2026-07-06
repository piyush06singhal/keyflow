import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "KeyFlow",
    template: "%s | KeyFlow",
  },
  description:
    "A premium typing and coding practice platform with analytics, progress tracking, and optional AI coaching.",
  applicationName: "KeyFlow",
  keywords: [
    "typing practice",
    "coding practice",
    "keyboard training",
    "developer practice",
    "AI coaching",
  ],
  authors: [{ name: "KeyFlow" }],
  creator: "KeyFlow",
  openGraph: {
    title: "KeyFlow",
    description:
      "A premium typing and coding practice platform with optional AI coaching.",
    siteName: "KeyFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyFlow",
    description:
      "A premium typing and coding practice platform with optional AI coaching.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
