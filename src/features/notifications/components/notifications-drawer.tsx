"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../context/notification-provider";
import type { Notification } from "../context/notification-provider";
import {
  Trophy,
  Target,
  Flame,
  Sparkles,
  Info,
  X,
  Trash2,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function NotificationsDrawer() {
  const {
    notifications,
    unreadCount,
    isDrawerOpen,
    setIsDrawerOpen,
    markAsRead,
    markAllAsRead,
    clearNotification,
  } = useNotifications();

  if (!isDrawerOpen) return null;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "level_up":
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      case "achievement":
        return <Trophy className="h-4 w-4 text-purple-500" />;
      case "challenge":
        return <Target className="h-4 w-4 text-blue-500" />;
      case "streak":
        return <Flame className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="text-muted-foreground h-4 w-4" />;
    }
  };

  const getBg = (type: Notification["type"]) => {
    switch (type) {
      case "level_up":
        return "bg-amber-500/10 border-amber-500/20";
      case "achievement":
        return "bg-purple-500/10 border-purple-500/20";
      case "challenge":
        return "bg-blue-500/10 border-blue-500/20";
      case "streak":
        return "bg-orange-500/10 border-orange-500/20";
      default:
        return "bg-muted/50 border-border/40";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end print:hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsDrawerOpen(false)}
          className="bg-background/80 fixed inset-0 backdrop-blur-sm"
        />

        {/* Drawer slide-out */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="bg-card border-border/40 relative z-10 flex h-full w-full max-w-md flex-col border-l shadow-2xl"
        >
          {/* Header */}
          <div className="border-border/40 flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-lg font-bold">Notifications</h2>
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="rounded-full px-2 py-0.5 text-[10px]"
                >
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-primary hover:bg-primary/5 h-8 gap-1.5 text-xs font-semibold"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  Read All
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
                className="h-8 w-8 rounded-lg"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>
          </div>

          {/* List Scroll */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {notifications.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-2 text-center">
                <Info className="text-muted-foreground/40 h-10 w-10" />
                <h4 className="text-foreground text-sm font-bold">All caught up!</h4>
                <p className="text-muted-foreground max-w-[200px] text-xs">
                  You have no new alerts. Complete practice runs to unlock achievements.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markAsRead(n.id)}
                  className={`group relative flex cursor-pointer gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                    n.read
                      ? "bg-card hover:bg-accent/30 border-border/40"
                      : "bg-primary/[0.02] border-primary/20 shadow-sm"
                  }`}
                >
                  {/* Left Icon */}
                  <div
                    className={`flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl border ${getBg(n.type)}`}
                  >
                    {getIcon(n.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 space-y-0.5 pr-6">
                    <h5
                      className={`text-xs leading-tight font-bold ${n.read ? "text-foreground" : "text-primary"}`}
                    >
                      {n.title}
                    </h5>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-muted-foreground block pt-1.5 text-[9px] font-semibold">
                      {new Date(n.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Right delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(n.id);
                    }}
                    className="hover:text-destructive absolute top-3 right-3 h-6.5 w-6.5 rounded-md opacity-0 transition-all duration-200 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Footer link */}
          <div className="border-border/40 border-t p-4">
            <Button
              className="w-full rounded-xl"
              variant="outline"
              asChild
              onClick={() => setIsDrawerOpen(false)}
            >
              <Link
                href="/notifications"
                className="flex items-center justify-center gap-1.5 text-xs font-bold"
              >
                View All Notifications
                <Info className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
