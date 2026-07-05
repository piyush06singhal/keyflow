import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <div className="relative min-h-screen">{children}</div>;
}
