"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Command, Bell, Flame, Menu, Sun, Moon, Monitor } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { routes } from "@/lib/constants/routes";
import Link from "next/link";

interface AppTopbarProps {
  user: { email?: string; display_name?: string };
  onMobileMenuToggle: () => void;
  onCommandPaletteOpen: () => void;
  onSearchOpen: () => void;
  onNotificationsOpen: () => void;
}

export function AppTopbar({
  user,
  onMobileMenuToggle,
  onCommandPaletteOpen,
  onSearchOpen,
  onNotificationsOpen,
}: AppTopbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [notificationCount] = useState(3);

  const breadcrumbs = getBreadcrumbs(pathname);

  const displayName = user.display_name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="border-border/40 bg-background/90 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-2xl lg:px-6">
      {/* Left: Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <nav className="text-muted-foreground hidden items-center gap-2 text-sm md:flex">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <span className="opacity-40">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium tracking-tight">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSearchOpen}
          className="hidden gap-2 rounded-xl md:flex"
        >
          <Search className="h-4 w-4" />
          <span className="text-muted-foreground text-sm">Search...</span>
          <kbd className="border-border/50 bg-muted/60 text-muted-foreground pointer-events-none hidden h-5 items-center gap-1 rounded-md border px-1.5 font-mono text-[10px] font-medium select-none lg:inline-flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </Button>

        {/* Command Palette - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCommandPaletteOpen}
          className="md:hidden"
          aria-label="Open command palette"
        >
          <Command className="h-5 w-5" />
        </Button>

        {/* Streak Indicator */}
        <div className="border-border/50 shadow-key-xs hidden items-center gap-1.5 rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100 px-3.5 py-2 sm:flex dark:from-orange-950/20 dark:to-orange-900/20">
          <Flame className="h-4 w-4 text-orange-500 dark:text-orange-400" />
          <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
            7
          </span>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationsOpen}
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* Theme Switcher */}
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

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full"
              aria-label="User menu"
            >
              <Avatar className="border-primary/30 shadow-key-sm h-10 w-10 border-2">
                <AvatarFallback className="from-primary to-primary/80 bg-gradient-to-br text-sm font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">{displayName}</p>
                <p className="text-muted-foreground text-xs leading-none">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={routes.profile}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={routes.analytics}>Statistics</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={routes.achievements}>Achievements</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={routes.settings}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Documentation</DropdownMenuItem>
            <DropdownMenuItem>Feedback</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/logout" className="text-destructive">
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ label: "Home", href: "/dashboard" }];

  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    breadcrumbs.push({ label, href: currentPath });
  });

  return breadcrumbs;
}
