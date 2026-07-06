"use client";

import { useState } from "react";
import { PageContainer } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Notification } from "@/features/notifications/context/notification-provider";
import { useNotifications } from "@/features/notifications/context/notification-provider";
import {
  Trophy,
  Target,
  Flame,
  Sparkles,
  Info,
  Trash2,
  CheckSquare,
  Search,
  Filter,
} from "lucide-react";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } =
    useNotifications();

  const [activeTab, setActiveTab] = useState<
    "all" | "unread" | "milestones" | "system"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filtering notifications
  const filteredNotifications = notifications.filter((n) => {
    // Search filter
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === "unread") return !n.read;
    if (activeTab === "milestones")
      return n.type === "level_up" || n.type === "achievement";
    if (activeTab === "system") return n.type === "info" || n.type === "challenge";
    return true;
  });

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
            <p className="text-muted-foreground text-sm">
              Review personal progress notifications, achievement alerts, and systems
              milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-9.5 rounded-xl text-xs font-bold"
                onClick={markAllAsRead}
              >
                <CheckSquare className="text-primary mr-1.5 h-4 w-4" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="bg-muted/30 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs Filter */}
          <div className="bg-muted/60 flex w-fit flex-wrap items-center gap-1.5 rounded-xl p-1.5">
            <Button
              variant={activeTab === "all" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => setActiveTab("all")}
            >
              All Alerts
            </Button>
            <Button
              variant={activeTab === "unread" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => setActiveTab("unread")}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </Button>
            <Button
              variant={activeTab === "milestones" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => setActiveTab("milestones")}
            >
              Milestones
            </Button>
            <Button
              variant={activeTab === "system" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => setActiveTab("system")}
            >
              System
            </Button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9.5 rounded-xl pl-9 text-xs font-semibold"
            />
          </div>
        </div>

        {/* Notifications Grid List */}
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
              <Filter className="text-primary h-4.5 w-4.5" />
              Notifications Ledger
            </CardTitle>
            <CardDescription>Comprehensive list of alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-2 text-center">
                <Info className="text-muted-foreground/30 h-10 w-10" />
                <h4 className="text-foreground text-sm font-bold">
                  No alerts match your filter
                </h4>
                <p className="text-muted-foreground max-w-[240px] text-xs">
                  Adjust your search or category filters to review other notifications.
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markAsRead(n.id)}
                  className={`group relative flex cursor-pointer gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                    n.read
                      ? "bg-card hover:bg-accent/30 border-border/40"
                      : "bg-primary/[0.02] border-primary/20 shadow-sm"
                  }`}
                >
                  {/* Left Type Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${getBg(n.type)}`}
                  >
                    {getIcon(n.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 space-y-1 pr-12">
                    <h5
                      className={`text-sm leading-tight font-bold ${n.read ? "text-foreground" : "text-primary"}`}
                    >
                      {n.title}
                    </h5>
                    <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-muted-foreground block pt-2 text-[10px] font-semibold">
                      {new Date(n.created_at).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Right Action buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(n.id);
                      }}
                      className="hover:text-destructive hover:bg-destructive/5 h-8 w-8 rounded-lg opacity-0 transition-all duration-200 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
