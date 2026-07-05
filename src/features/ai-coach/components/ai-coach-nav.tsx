"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/constants/routes";

const navItems = [
  { label: "Overview", href: routes.aiCoach },
  { label: "Insights", href: routes.aiCoachInsights },
  { label: "Planner", href: routes.aiCoachPlanner },
  { label: "Reports", href: routes.aiCoachReports },
  { label: "Generator", href: routes.aiCoachGenerator },
  { label: "Settings", href: routes.aiCoachSettings },
];

export function AiCoachNav() {
  const pathname = usePathname();

  return (
    <nav className="border-border/50 flex flex-wrap gap-1 border-b pb-4">
      {navItems.map((item) => {
        const isActive =
          item.href === routes.aiCoach
            ? pathname === routes.aiCoach
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
