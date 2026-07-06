import React from "react";
import Link from "next/link";
import {
  User,
  Palette,
  Keyboard,
  Code,
  Settings2,
  Shield,
  Activity,
  Share2,
  Command,
} from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const sections = [
    { name: "Account Profile", href: "/settings/account", icon: User },
    { name: "Appearance", href: "/settings/appearance", icon: Palette },
    { name: "Typing Preferences", href: "/settings/typing", icon: Keyboard },
    { name: "Coding Preferences", href: "/settings/coding", icon: Code },
    { name: "AI Preferences", href: "/settings/ai", icon: Settings2 },
    { name: "Privacy & Security", href: "/settings/privacy", icon: Shield },
    { name: "Notifications", href: "/settings/notifications", icon: Activity },
    { name: "Data & Storage", href: "/settings/data", icon: Share2 },
    { name: "Keyboard Shortcuts", href: "/settings/shortcuts", icon: Command },
  ];

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-8 md:flex-row">
      {/* Settings Navigation Sidebar */}
      <aside className="w-full shrink-0 md:w-64">
        <h1 className="text-foreground mb-6 text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <nav className="space-y-1">
          {sections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-secondary/60 text-muted-foreground hover:text-foreground group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Settings Content Area */}
      <main className="w-full max-w-3xl min-w-0 flex-1">
        <div className="border-border/50 bg-card h-full min-h-[600px] rounded-xl border p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
