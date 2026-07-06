"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Keyboard,
  Code2,
  Brain,
  BarChart3,
  Trophy,
  Calendar,
  Users,
  UserCircle,
  Settings,
  HelpCircle,
  X,
  Zap,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  group: "main" | "practice" | "social" | "account";
}

const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "main" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "main" },
  { label: "AI Coach", href: "/ai-coach", icon: Brain, group: "main" },
  {
    label: "Typing Practice",
    href: "/practice",
    icon: Keyboard,
    group: "practice",
  },
  {
    label: "Coding Practice",
    href: "/practice/code/dashboard",
    icon: Code2,
    group: "practice",
  },
  { label: "Challenges", href: "/challenges", icon: Calendar, group: "practice" },
  { label: "Achievements", href: "/achievements", icon: Trophy, group: "social" },
  { label: "Leaderboards", href: "/leaderboards", icon: Users, group: "social" },
  { label: "Friends", href: "/friends", icon: Users, group: "social" },
  { label: "Profile", href: "/profile", icon: UserCircle, group: "account" },
  { label: "Settings", href: "/settings", icon: Settings, group: "account" },
  { label: "Help", href: "/help", icon: HelpCircle, group: "account" },
];

const groupLabels = {
  main: "Main",
  practice: "Practice",
  social: "Social",
  account: "Account",
};

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="border-border/50 bg-card shadow-key-lg fixed top-0 left-0 z-50 h-screen w-72 border-r lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="border-border/50 flex h-16 items-center justify-between border-b px-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 font-bold"
                  onClick={onClose}
                >
                  <div className="bg-primary text-primary-foreground shadow-key-md flex h-8 w-8 items-center justify-center rounded-lg">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-lg">KeyFlow</span>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <ScrollArea className="flex-1 px-4 py-6">
                <nav className="space-y-6">
                  {Object.entries(
                    navigationItems.reduce(
                      (acc, item) => {
                        if (!acc[item.group]) acc[item.group] = [];
                        acc[item.group]!.push(item);
                        return acc;
                      },
                      {} as Record<string, NavItem[]>,
                    ),
                  ).map(([group, items]) => (
                    <div key={group}>
                      <div className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
                        {groupLabels[group as keyof typeof groupLabels]}
                      </div>
                      <ul className="space-y-1">
                        {items.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;

                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                  isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                )}
                              >
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      {group !== "account" && <Separator className="mt-4" />}
                    </div>
                  ))}
                </nav>
              </ScrollArea>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
