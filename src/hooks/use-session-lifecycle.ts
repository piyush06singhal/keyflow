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
  isProcessing: boolean;
  completeSession: (
    sessionResult: SessionResult,
    practiceMode: string,
  ) => SessionCompletionResult;
}

export function useSessionLifecycle(): UseSessionLifecycleReturn {
  const { addNotification } = useNotifications();
  const [completionResult, setCompletionResult] =
    useState<SessionCompletionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const completeSession = useCallback(
    (sessionResult: SessionResult, practiceMode: string): SessionCompletionResult => {
      setIsProcessing(true);

      try {
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
      } finally {
        setIsProcessing(false);
      }
    },
    [addNotification],
  );

  return { completionResult, isProcessing, completeSession };
}
