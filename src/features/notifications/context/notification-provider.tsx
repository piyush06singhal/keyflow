"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "level_up" | "achievement" | "challenge" | "info" | "streak";
  read: boolean;
  created_at: string;
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  addNotification: (
    title: string,
    message: string,
    type: Notification["type"],
  ) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  // Load initial notifications from Supabase and LocalStorage fallback
  useEffect(() => {
    async function loadNotifications() {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Attempt loading from Supabase
          const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          if (data) {
            setNotifications(data);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn(
          "Supabase notifications table not ready or error. Falling back to localStorage.",
          e,
        );
      }

      // LocalStorage Fallback
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("keyflow-notifications");
        if (local) {
          try {
            setNotifications(JSON.parse(local));
          } catch (err) {
            console.error("Failed to parse local notifications", err);
          }
        } else {
          // Initialize mock welcome notifications for premium initial look
          const welcomeNotifications: Notification[] = [
            {
              id: "welcome-1",
              title: "Welcome to KeyFlow!",
              message:
                "Start typing or coding to earn experience points (XP) and level up your passport.",
              type: "info",
              read: false,
              created_at: new Date().toISOString(),
            },
          ];
          setNotifications(welcomeNotifications);
          localStorage.setItem(
            "keyflow-notifications",
            JSON.stringify(welcomeNotifications),
          );
        }
      }
      setIsLoading(false);
    }

    loadNotifications();
  }, [supabase]);

  // Real-time listener for notifications channel
  useEffect(() => {
    let channel: any;
    async function setupRealtime() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel(`notifications:${user.id}`)
        .on("broadcast", { event: "new-notification" }, ({ payload }: any) => {
          if (payload) {
            const newNotif: Notification = {
              id: payload.id || Math.random().toString(),
              title: payload.title || "New Notification",
              message: payload.message || "",
              type: payload.type || "info",
              read: false,
              created_at: new Date().toISOString(),
            };
            setNotifications((prev) => [newNotif, ...prev]);
            toast(newNotif.title, { description: newNotif.message });
          }
        })
        .subscribe();
    }

    setupRealtime();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Sync to LocalStorage on updates
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
      localStorage.setItem("keyflow-notifications", JSON.stringify(notifications));
    }
  }, [notifications, isLoading]);

  const addNotification = async (
    title: string,
    message: string,
    type: Notification["type"],
  ) => {
    const newNotif: Notification = {
      id: Math.random().toString(),
      title,
      message,
      type,
      read: false,
      created_at: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotif, ...prev]);
    toast(title, { description: message });

    // Sync database
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("notifications").insert([
          {
            id: newNotif.id,
            user_id: user.id,
            title,
            message,
            type,
            read: false,
          },
        ]);
      }
    } catch (e) {
      // Failed silently (table does not exist or network loss)
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

    try {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
    } catch (e) {
      // Ignored fallback
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("notifications")
          .update({ read: true })
          .eq("user_id", user.id);
      }
    } catch (e) {
      // Ignored fallback
    }
  };

  const clearNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await supabase.from("notifications").delete().eq("id", id);
    } catch (e) {
      // Ignored fallback
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isDrawerOpen,
        setIsDrawerOpen,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
