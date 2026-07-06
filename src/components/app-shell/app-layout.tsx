"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { CommandPalette } from "./command-palette";
import { MobileSidebar } from "./mobile-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks";

interface AppLayoutProps {
  children: React.ReactNode;
  user: { email?: string; display_name?: string };
}

export function AppLayout({ children, user }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("sidebar-open");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [_searchOpen, setSearchOpen] = useState(false);
  const [_notificationsOpen, setNotificationsOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-open", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((open: boolean) => !open);
      }

      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isDesktop) {
          setSidebarOpen((open: boolean) => !open);
        } else {
          setMobileSidebarOpen((open: boolean) => !open);
        }
      }

      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        setSearchOpen(false);
        setNotificationsOpen(false);
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isDesktop]);

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    // Only set if currently open and we switch to desktop
    if (!isDesktop || !mobileSidebarOpen) return;

    const timer = setTimeout(() => setMobileSidebarOpen(false), 0);
    return () => clearTimeout(timer);
  }, [isDesktop, mobileSidebarOpen]);

  return (
    <div className="relative min-h-screen">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <AppSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Mobile Sidebar */}
      {!isDesktop && (
        <MobileSidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <motion.div
        animate={{
          marginLeft: isDesktop ? (sidebarOpen ? 240 : 80) : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen"
      >
        {/* Top Bar */}
        <AppTopbar
          user={user}
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
          onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen(true)}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={typeof window !== "undefined" ? window.location.pathname : "page"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* TODO: Add Search Dialog */}
      {/* TODO: Add Notifications Panel */}
    </div>
  );
}
