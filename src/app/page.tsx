import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { InteractiveShowcase } from "@/components/landing/interactive-showcase";
import { CodingPracticeSection } from "@/components/landing/coding-practice-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { SiteNavbar } from "@/components/app-shell/site-navbar";
import { SiteFooter } from "@/components/app-shell/site-footer";
import type { Metadata } from "next";

export const revalidate = 86400; // Cache landing page for 24 hours (ISR)

export const metadata: Metadata = {
  title: "KeyFlow - Playful Typing & Coding Practice",
  description:
    "KeyFlow is a local-first typing and coding practice arena. No accounts, no tracking — practice with AI-generated text and code snippets, and keep your stats on your own device.",
  keywords: [
    "typing practice",
    "coding practice",
    "keyboard training",
    "developer practice",
    "typing speed",
    "WPM",
    "programming practice",
    "code typing",
    "developer tools",
  ],
  openGraph: {
    title: "KeyFlow - Playful Typing & Coding Practice",
    description:
      "A local-first typing and coding practice arena. No accounts, no tracking, just practice.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <SiteNavbar />
      <main className="relative">
        <HeroSection />
        <InteractiveShowcase />
        <FeaturesSection />
        <CodingPracticeSection />
        <FAQSection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}
