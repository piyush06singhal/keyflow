"use client";

import { useState, useEffect } from "react";
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
  ChevronLeft,
  Zap,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  shortcut?: string;
  badge?: string | number;
  group: "main" | "practice" | "social" | "account";
}

const navigationItems: NavItem[] = [
  // Main
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    shortcut: "D",
    group: "main",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    shortcut: "A",
    group: "main",
  },
  { label: "AI Coach", href: "/ai-coach", icon: Brain, shortcut: "I", group: "main" },

  // Practice
  {
    label: "Typing Practice",
    href: "/practice",
    icon: Keyboard,
    shortcut: "T",
    group: "practice",
  },
  {
    label: "Coding Practice",
    href: "/practice/coding",
    icon: Code2,
    shortcut: "C",
    group: "practice",
  },
  {
    label: "Challenges",
    href: "/challenges",
    icon: Calendar,
    shortcut: "H",
    group: "practice",
  },

  // Social
  { label: "Achievements", href: "/achievements", icon: Trophy, group: "social" },
  { label: "Leaderboards", href: "/leaderboards", icon: Users, group: "social" },
  { label: "Friends", href: "/friends", icon: Users, group: "social" },

  // Account
  { label: "Profile", href: "/profile", icon: UserCircle, group: "account" },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    shortcut: "S",
    group: "account",
  },
  { label: "Help", href: "/help", icon: HelpCircle, group: "account" },
];

const groupLabels = {
  main: "Main",
  practice: "Practice",
  social: "Social",
  account: "Account",
};

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 240 : 80 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="border-border/40 bg-card/80 fixed top-0 left-0 z-40 h-screen border-r backdrop-blur-2xl"
    >
      <div className="flex h-full flex-col">
        {/* Logo & Toggle */}
        <div className="border-border/40 flex h-16 items-center justify-between border-b px-4">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Link href="/dashboard" className="flex items-center gap-2 font-bold">
                  <div className="bg-primary text-primary-foreground shadow-key-sm flex h-9 w-9 items-center justify-center rounded-xl">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span className="text-lg tracking-tight">KeyFlow</span>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/dashboard"
                  className="bg-primary text-primary-foreground shadow-key-sm flex h-9 w-9 items-center justify-center rounded-xl"
                >
                  <Zap className="h-5 w-5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onToggle}
            className="text-muted-foreground hover:bg-accent/60 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
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
                {isOpen && (
                  <div className="text-muted-foreground mb-2.5 px-3 text-[11px] font-semibold tracking-wider uppercase opacity-60">
                    {groupLabels[group as keyof typeof groupLabels]}
                  </div>
                )}
                {!isOpen && group !== "main" && (
                  <Separator className="my-3 opacity-50" />
                )}
                <ul className="space-y-0.5">
                  {items.map((item) => (
                    <NavItemComponent
                      key={item.href}
                      item={item}
                      isActive={pathname === item.href}
                      isCollapsed={!isOpen}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </motion.aside>
  );
}

function NavItemComponent({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary shadow-key-xs"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!isCollapsed && item.shortcut && (
        <kbd className="border-border/50 bg-muted/50 text-muted-foreground ml-auto hidden rounded-md border px-1.5 py-0.5 text-[10px] font-medium lg:inline-block">
          {item.shortcut}
        </kbd>
      )}
      {!isCollapsed && item.badge && (
        <span className="bg-primary/90 text-primary-foreground shadow-key-xs ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold">
          {item.badge}
        </span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <li>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.shortcut && (
              <kbd className="border-border/50 bg-muted ml-1 rounded border px-1.5 py-0.5 text-xs">
                {item.shortcut}
              </kbd>
            )}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }

  return <li>{linkContent}</li>;
}
