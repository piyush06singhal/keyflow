"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "keyflow-notifications";
const MAX_NOTIFICATIONS = 50;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "challenge";
  created_at: string;
}

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (title: string, message: string, type: Notification["type"]) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

function readStoredNotifications(): Notification[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Notification[]) : [];
  } catch (error) {
    console.warn("Failed to read notifications:", error);
    return [];
  }
}

/**
 * Local-only notifications provider — no accounts, no realtime backend.
 * Surfaces milestones (personal bests, streaks, etc.) as toasts and keeps a
 * short local history in localStorage.
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    readStoredNotifications(),
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.warn("Failed to persist notifications:", error);
    }
  }, [notifications]);

  const addNotification = (
    title: string,
    message: string,
    type: Notification["type"],
  ) => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      created_at: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS));
    toast(title, { description: message });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
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
