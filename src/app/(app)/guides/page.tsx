import { PageContainer } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/motion";
import { getAccentColor } from "@/lib/accent-colors";
import { Keyboard, BarChart3, HeartPulse, Code2, Flame } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides - KeyFlow",
  description: "Short, practical guides for typing faster and practicing consistently.",
};

interface Guide {
  icon: React.ElementType;
  category: string;
  title: string;
  minutes: number;
  body: string;
}

const GUIDES: Guide[] = [
  {
    icon: Keyboard,
    category: "Tutorial",
    title: "How to Touch Type: The Beginner's Blueprint",
    minutes: 5,
    body: "Rest your fingers on the home row — ASDF for your left hand, JKL; for your right — and return to it after every keystroke. Resist looking at the keys; the discomfort fades within a week of consistent practice. Start slow and accurate in Timed Practice with punctuation and numbers off, then add them back in once your accuracy holds above 95%.",
  },
  {
    icon: BarChart3,
    category: "Theory",
    title: "Understanding Typing Metrics: WPM vs Raw WPM vs Accuracy",
    minutes: 4,
    body: "WPM (words per minute) assumes a 'word' is 5 characters, so it works for any language or symbol density. Raw WPM counts everything you typed, including mistakes; net WPM subtracts uncorrected errors — that's the number KeyFlow shows you. Accuracy is the percentage of keystrokes that were correct on the first try. Chasing raw speed without accuracy just trains you to type wrong faster.",
  },
  {
    icon: HeartPulse,
    category: "Health",
    title: "Keyboard Ergonomics: Say Goodbye to Wrist Fatigue",
    minutes: 6,
    body: "Keep your wrists straight and floating just above the keyboard, not resting on the desk edge — that bend is what causes strain over long sessions. Elbows at roughly 90 degrees, shoulders relaxed, and the top of your monitor at eye level. Take a 30-second break every 10–15 minutes of focused practice; consistency beats marathon sessions for both speed and joint health.",
  },
  {
    icon: Code2,
    category: "Coding",
    title: "Building Muscle Memory for Brackets, Braces, and Symbols",
    minutes: 5,
    body: "Code typing is dominated by symbols — brackets, semicolons, arrows — that rarely show up in prose. Practice each language's Coding Practice mode deliberately at a slower pace first, paying attention to where your pinky reaches for Shift. Once symbol placement feels automatic, speed follows naturally; don't try to rush both at once.",
  },
  {
    icon: Flame,
    category: "Habit",
    title: "Why Daily Streaks Beat Weekend Marathons",
    minutes: 3,
    body: "Ten focused minutes every day builds motor memory faster than one long session on the weekend, because the brain consolidates fine motor skills during the rest between practices. The Daily Challenge exists for exactly this — a fixed, short target you can hit consistently. Check your History page to see the trend build over a couple of weeks.",
  },
];

export default function GuidesPage() {
  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-8 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guides</h1>
          <p className="text-muted-foreground text-sm">
            Short, practical reads to help your typing and coding speed actually stick.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {GUIDES.map((guide, index) => {
            const Icon = guide.icon;
            const accent = getAccentColor(index);
            return (
              <TiltCard key={guide.title} maxTilt={5}>
                <Card className="flex h-full flex-col">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="px-2 py-0 font-mono text-[9px] uppercase"
                      >
                        {guide.category}
                      </Badge>
                      <span className="text-muted-foreground text-[10px] font-bold">
                        {guide.minutes} min read
                      </span>
                    </div>
                    <div
                      className={`border-border shadow-pop-sm mb-1 flex h-10 w-10 items-center justify-center rounded-xl border-2 ${accent.bg} ${accent.fg}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-base">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {guide.body}
                    </CardDescription>
                  </CardContent>
                </Card>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
