import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6">
      <section className="border-border bg-card shadow-pop-md w-full max-w-md rounded-2xl border-2 p-8">
        <div className="border-border bg-primary text-primary-foreground shadow-pop-sm mb-5 flex size-11 items-center justify-center rounded-xl border-2">
          <Compass className="size-5" aria-hidden="true" />
        </div>
        <h1 className="text-2xl">Page not found</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          This route does not exist yet, or it has moved during development.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return home</Link>
        </Button>
      </section>
    </main>
  );
}
