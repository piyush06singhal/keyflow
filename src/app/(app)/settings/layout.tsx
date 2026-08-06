"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Keyboard, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { name: "Appearance", href: "/settings/appearance", icon: Palette },
  { name: "Typing Preferences", href: "/settings/typing", icon: Keyboard },
  { name: "Coding Preferences", href: "/settings/coding", icon: Code },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-8 md:flex-row">
      {/* Settings Navigation Sidebar */}
      <aside className="w-full shrink-0 md:w-64">
        <h1 className="text-foreground mb-6 text-3xl">Settings</h1>
        <nav className="space-y-1.5">
          {sections.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-full border-2 px-3.5 py-2.5 text-sm font-bold transition-all",
                  isActive
                    ? "border-border bg-primary text-primary-foreground shadow-pop-sm"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground border-transparent",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Settings Content Area */}
      <main className="w-full max-w-3xl min-w-0 flex-1">
        <div className="border-border bg-card shadow-pop-sm h-full min-h-[600px] rounded-2xl border-2 p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
