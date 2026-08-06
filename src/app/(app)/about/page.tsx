import { PageContainer } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { TiltCard } from "@/components/motion";
import { getAccentColor } from "@/lib/accent-colors";
import { Cpu, ShieldCheck, Sparkles, Keyboard } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - KeyFlow",
  description:
    "What KeyFlow is, how it works, and why it doesn't need an account or a server to track your progress.",
};

const PRINCIPLES = [
  {
    icon: Cpu,
    title: "Fast local calculations",
    body: "Every keystroke evaluation, WPM figure, and accuracy percentage is computed in your browser as you type, so there's no round trip to a server slowing down feedback.",
  },
  {
    icon: Sparkles,
    title: "Groq-based content generation",
    body: "Typing paragraphs and coding snippets can be generated on demand via the Groq API, so tests are rarely the same twice. If generation is unavailable, a curated local library keeps practice uninterrupted.",
  },
  {
    icon: ShieldCheck,
    title: "No accounts, no tracking",
    body: "There's no login, no email, and no analytics tied to you as a person. Your history, personal bests, and settings live in your browser's local storage — clearing your browser data clears them too.",
  },
  {
    icon: Keyboard,
    title: "Built for real practice",
    body: "Typing practice, coding practice across 16 languages, a daily challenge, and a virtual keyboard heatmap — no gamified filler, just tools that make repetition less boring.",
  },
];

export default function AboutPage() {
  return (
    <PageContainer maxWidth="md">
      <div className="space-y-8 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About KeyFlow</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            KeyFlow is a playful, local-first typing and coding practice arena.
            It&apos;s built as a middle ground between dry corporate typing tests and
            childish gamified apps — quick to start, honest about what it does, and
            respectful of your data.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((item, index) => {
            const Icon = item.icon;
            const accent = getAccentColor(index);
            return (
              <TiltCard key={item.title} maxTilt={5}>
                <Card>
                  <CardContent className="space-y-2 pt-6">
                    <div
                      className={`border-border shadow-pop-sm flex h-10 w-10 items-center justify-center rounded-xl border-2 ${accent.bg} ${accent.fg}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-sm">{item.title}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </CardContent>
                </Card>
              </TiltCard>
            );
          })}
        </div>

        <div className="text-muted-foreground border-border-subtle border-t-2 pt-6 text-sm leading-relaxed">
          <p>
            Have feedback or found a bug? Reach out from the footer link on any page —
            KeyFlow is a small, actively evolving project.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
