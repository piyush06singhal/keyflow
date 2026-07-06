"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
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
  FileText,
  Zap,
  Search,
} from "lucide-react";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
  group: "navigation" | "actions" | "settings" | "recent";
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const commands: Command[] = [
    // Navigation
    {
      id: "nav-dashboard",
      label: "Dashboard",
      description: "Go to dashboard",
      icon: LayoutDashboard,
      action: () => router.push("/dashboard"),
      group: "navigation",
    },
    {
      id: "nav-typing",
      label: "Typing Practice",
      description: "Start typing practice",
      icon: Keyboard,
      action: () => router.push("/practice"),
      shortcut: "T",
      group: "navigation",
    },
    {
      id: "nav-coding",
      label: "Coding Practice",
      description: "Start coding practice",
      icon: Code2,
      action: () => router.push("/practice/code/dashboard"),
      shortcut: "C",
      group: "navigation",
    },
    {
      id: "nav-ai",
      label: "AI Coach",
      description: "Get AI coaching",
      icon: Brain,
      action: () => router.push("/ai-coach"),
      shortcut: "I",
      group: "navigation",
    },
    {
      id: "nav-analytics",
      label: "Analytics",
      description: "View analytics",
      icon: BarChart3,
      action: () => router.push("/analytics"),
      shortcut: "A",
      group: "navigation",
    },
    {
      id: "nav-challenges",
      label: "Challenges",
      description: "View challenges",
      icon: Calendar,
      action: () => router.push("/challenges"),
      shortcut: "H",
      group: "navigation",
    },
    {
      id: "nav-achievements",
      label: "Achievements",
      description: "View achievements",
      icon: Trophy,
      action: () => router.push("/achievements"),
      group: "navigation",
    },
    {
      id: "nav-leaderboards",
      label: "Leaderboards",
      description: "View leaderboards",
      icon: Users,
      action: () => router.push("/leaderboards"),
      group: "navigation",
    },
    {
      id: "nav-friends",
      label: "Friends",
      description: "Manage friends",
      icon: Users,
      action: () => router.push("/friends"),
      group: "navigation",
    },
    {
      id: "nav-profile",
      label: "Profile",
      description: "View profile",
      icon: UserCircle,
      action: () => router.push("/profile"),
      group: "navigation",
    },
    {
      id: "nav-settings",
      label: "Settings",
      description: "Open settings",
      icon: Settings,
      action: () => router.push("/settings"),
      shortcut: "S",
      group: "navigation",
    },
    {
      id: "nav-help",
      label: "Help",
      description: "Get help",
      icon: HelpCircle,
      action: () => router.push("/help"),
      group: "navigation",
    },

    // Actions
    {
      id: "action-search",
      label: "Search",
      description: "Search the app",
      icon: Search,
      action: () => {
        onClose();
        // Will open search dialog
      },
      group: "actions",
    },
    {
      id: "action-quick-start",
      label: "Quick Start Practice",
      description: "Start a quick typing session",
      icon: Zap,
      action: () => router.push("/practice?mode=quick"),
      group: "actions",
    },
    {
      id: "action-docs",
      label: "Documentation",
      description: "View documentation",
      icon: FileText,
      action: () => router.push("/docs"),
      group: "actions",
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      command.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedCommands = filteredCommands.reduce(
    (acc, command) => {
      if (!acc[command.group]) acc[command.group] = [];
      acc[command.group]!.push(command);
      return acc;
    },
    {} as Record<string, Command[]>,
  );

  const handleSelect = useCallback(
    (command: Command) => {
      command.action();
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onClose]);

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder="Search commands, pages, and actions..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {groupedCommands.navigation && (
          <>
            <CommandGroup heading="Navigation">
              {groupedCommands.navigation.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => handleSelect(command)}
                  className="flex items-center gap-3"
                >
                  <command.icon className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{command.label}</div>
                    {command.description && (
                      <div className="text-muted-foreground text-xs">
                        {command.description}
                      </div>
                    )}
                  </div>
                  {command.shortcut && (
                    <kbd className="border-border/50 bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-xs font-medium select-none">
                      {command.shortcut}
                    </kbd>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {groupedCommands.actions && (
          <>
            <CommandGroup heading="Actions">
              {groupedCommands.actions.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => handleSelect(command)}
                  className="flex items-center gap-3"
                >
                  <command.icon className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{command.label}</div>
                    {command.description && (
                      <div className="text-muted-foreground text-xs">
                        {command.description}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {groupedCommands.settings && (
          <CommandGroup heading="Settings">
            {groupedCommands.settings.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => handleSelect(command)}
                className="flex items-center gap-3"
              >
                <command.icon className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{command.label}</div>
                  {command.description && (
                    <div className="text-muted-foreground text-xs">
                      {command.description}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
