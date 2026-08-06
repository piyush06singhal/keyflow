"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Keyboard,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Flame,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSessionHistory } from "@/lib/local-storage/practice-history";

const navLinks = [
  { href: "/practice", label: "Practice" },
  { href: "/challenges", label: "Daily Challenge" },
  { href: "/practice/code/dashboard", label: "Coding" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

const moreLinks = [
  { href: "/practice/history", label: "History" },
  { href: "/settings", label: "Settings" },
  { href: "/help", label: "Help" },
];

/** Consecutive-day practice streak computed from local session history. */
function computeStreak(): number {
  const days = new Set(
    getSessionHistory().map((s) => new Date(s.completedAt).toDateString()),
  );
  if (days.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function isLinkActive(pathname: string, href: string) {
  if (href === "/practice") return pathname === "/practice";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Single top navbar used across the landing page and every app page —
 * replaces the old collapsible sidebar + breadcrumb topbar shell.
 */
export function SiteNavbar() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const streak = useMemo(() => computeStreak(), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-border/0 bg-background/90 shadow-pop-sm border-b-2 backdrop-blur-2xl"
          : "bg-background/70 border-b-2 border-transparent backdrop-blur-xl",
      )}
    >
      <nav className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight transition-transform duration-200 hover:-translate-y-0.5"
        >
          <div className="border-border bg-primary text-primary-foreground shadow-pop-sm flex h-10 w-10 items-center justify-center rounded-2xl border-2">
            <Keyboard className="h-5 w-5" />
          </div>
          <span className="font-display hidden sm:inline">KeyFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = isLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-bold transition-all duration-200",
                  isActive
                    ? "border-border bg-primary text-primary-foreground shadow-pop-sm border-2"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60 border-2 border-transparent",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {streak > 0 && (
            <div className="border-border shadow-pop-sm flex items-center gap-1.5 rounded-full border-2 bg-gradient-to-br from-orange-100 to-orange-200 px-3 py-1.5 dark:from-orange-950/40 dark:to-orange-900/30">
              <Flame className="h-4 w-4 text-orange-500 dark:text-orange-400" />
              <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                {streak}
              </span>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                More
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle theme">
                <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild>
            <Link href="/practice">Start Typing</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="border-border text-foreground hover:bg-accent/60 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="border-border bg-background/95 border-t-2 backdrop-blur-2xl md:hidden"
          >
            <div className="container mx-auto space-y-1 px-4 py-6">
              {[...navLinks, ...moreLinks].map((link, index) => {
                const isActive = isLinkActive(pathname, link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block rounded-full px-4 py-2.5 text-base font-bold transition-all duration-200",
                        isActive
                          ? "border-border bg-primary text-primary-foreground shadow-pop-sm border-2"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/60 border-2 border-transparent",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="flex flex-col gap-2.5 pt-4">
                <Button asChild className="w-full justify-start">
                  <Link href="/practice">Start Typing</Link>
                </Button>

                <div className="border-border-subtle flex items-center justify-between border-t-2 pt-4">
                  <span className="text-muted-foreground text-sm font-bold">Theme</span>
                  <div className="bg-muted/60 flex items-center gap-1 rounded-full p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <Moon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTheme("system")}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
