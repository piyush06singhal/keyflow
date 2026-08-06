/**
 * Session Lifecycle Hook
 *
 * React hook for completing a typing/coding session: records it locally
 * (no account, no backend) and surfaces the result for the UI.
 */

import { useCallback, useState } from "react";
import type { SessionResult } from "@/lib/typing-engine";
import {
  handleSessionCompletion,
  type SessionCompletionResult,
} from "@/lib/session-lifecycle";
import { useNotifications } from "@/features/notifications/context/notification-provider";

export interface UseSessionLifecycleReturn {
  completionResult: SessionCompletionResult | null;
  completeSession: (
    sessionResult: SessionResult,
    practiceMode: string,
  ) => SessionCompletionResult;
}

export function useSessionLifecycle(): UseSessionLifecycleReturn {
  const { addNotification } = useNotifications();
  const [completionResult, setCompletionResult] =
    useState<SessionCompletionResult | null>(null);

  // Session completion is entirely local (localStorage reads/writes, no
  // network) and finishes synchronously — there's no async gap here to
  // report progress for.
  const completeSession = useCallback(
    (sessionResult: SessionResult, practiceMode: string): SessionCompletionResult => {
      const result = handleSessionCompletion(sessionResult, practiceMode);

      if (result.saved) {
        const modeLabel = practiceMode === "coding" ? "Coding" : "Typing";
        addNotification(
          `${modeLabel} session complete`,
          `${sessionResult.finalWpm.toFixed(0)} WPM · ${sessionResult.finalAccuracy.toFixed(0)}% accuracy`,
          "info",
        );
      }

      setCompletionResult(result);
      return result;
    },
    [addNotification],
  );

  return { completionResult, completeSession };
}
