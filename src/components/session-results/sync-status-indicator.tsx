"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SessionSyncStatus } from "@/lib/session-lifecycle";
import { cn } from "@/lib/utils";

export interface SyncStatusIndicatorProps {
  syncStatus: SessionSyncStatus | null;
  isSyncing?: boolean;
  onSync?: () => void;
  className?: string;
}

export function SyncStatusIndicator({
  syncStatus,
  isSyncing,
  onSync,
  className,
}: SyncStatusIndicatorProps) {
  if (!syncStatus) return null;

  const isOnline = navigator.onLine;
  const hasPending = syncStatus.isPending && syncStatus.pendingCount > 0;

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: CloudOff,
        label: "Offline",
        variant: "secondary" as const,
        description: "You're offline. Sessions will sync when connection is restored.",
      };
    }

    if (hasPending) {
      return {
        icon: RefreshCw,
        label: `${syncStatus.pendingCount} Pending`,
        variant: "warning" as const,
        description: `${syncStatus.pendingCount} session(s) waiting to sync.`,
      };
    }

    if (syncStatus.lastSyncError) {
      return {
        icon: AlertCircle,
        label: "Sync Failed",
        variant: "destructive" as const,
        description: syncStatus.lastSyncError,
      };
    }

    return {
      icon: CheckCircle2,
      label: "Synced",
      variant: "success" as const,
      description: "All sessions are synced.",
    };
  };

  const status = getStatusInfo();
  const Icon = status.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-2", className)}>
            <Badge
              variant={
                status.variant as "default" | "secondary" | "destructive" | "outline"
              }
              className="flex items-center gap-1.5"
            >
              <AnimatePresence mode="wait">
                {isSyncing ? (
                  <motion.div
                    key="syncing"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="size-3" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Icon className="size-3" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="text-xs">{status.label}</span>
            </Badge>

            {hasPending && onSync && isOnline && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSync}
                disabled={isSyncing}
                className="h-6 px-2 text-xs"
              >
                Sync Now
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{status.description}</p>
          {syncStatus.lastSyncTime && (
            <p className="text-muted-foreground mt-1 text-xs">
              Last sync: {new Date(syncStatus.lastSyncTime).toLocaleTimeString()}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
