import { ArrowRight, Layers3, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const foundationItems = [
  {
    icon: Layers3,
    title: "Feature-first architecture",
    description:
      "Routes, services, providers, UI primitives, and domain modules are separated for long-term scale.",
  },
  {
    icon: ShieldCheck,
    title: "Supabase-ready backend",
    description:
      "Client, server, middleware, storage, realtime, and typed database helpers are prepared.",
  },
  {
    icon: Sparkles,
    title: "Provider-based AI layer",
    description:
      "Gemini and Groq sit behind a common service contract for future provider expansion.",
  },
];

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-dvh">
      <section className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-6">
            KeyFlow foundation
          </Badge>
          <h1 className="text-foreground text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
            Production foundation is ready for product modules.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 text-pretty">
            This screen is intentionally minimal. Authentication, landing, dashboard,
            typing, coding, and analytics features will be built in later phases on top
            of this foundation.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {foundationItems.map((item) => (
            <Card key={item.title} className="surface-card">
              <CardHeader>
                <div className="border-border bg-primary/10 text-primary mb-4 flex size-10 items-center justify-center rounded-lg border">
                  <item.icon className="size-5" aria-hidden="true" />
                </div>
                <CardTitle className="flex items-center gap-2 text-base">
                  {item.title}
                  <ArrowRight className="text-muted-foreground size-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-6">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
