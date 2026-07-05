import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { InteractiveShowcase } from "@/components/landing/interactive-showcase";
import { CodingPracticeSection } from "@/components/landing/coding-practice-section";
import { AnalyticsShowcase } from "@/components/landing/analytics-showcase";
import { AISection } from "@/components/landing/ai-section";
import { StatisticsSection } from "@/components/landing/statistics-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KeyFlow - Master Typing & Coding Speed",
  description:
    "Elevate your typing and coding skills with KeyFlow. AI-powered coaching, real-time analytics, coding practice, and personalized learning paths. Join thousands improving daily.",
  keywords: [
    "typing practice",
    "coding practice",
    "keyboard training",
    "developer practice",
    "AI coaching",
    "typing speed",
    "WPM",
    "programming practice",
    "code typing",
    "developer tools",
  ],
  openGraph: {
    title: "KeyFlow - Master Typing & Coding Speed",
    description:
      "AI-powered typing and coding practice platform with real-time analytics and personalized coaching.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <LandingNavbar />
      <main className="relative">
        <HeroSection />
        <InteractiveShowcase />
        <FeaturesSection />
        <CodingPracticeSection />
        <AnalyticsShowcase />
        <AISection />
        <StatisticsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
