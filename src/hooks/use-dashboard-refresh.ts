/**
 * Dashboard Refresh Hook
 * 
 * Provides methods to refresh dashboard data after session completion.
 */

import { useRouter } from "next/navigation";

export interface UseDashboardRefreshReturn {
  refreshDashboard: () => void;
  refreshStats: () => void;
  refreshAll: () => void;
}

/**
 * Hook to refresh dashboard data
 */
export function useDashboardRefresh(): UseDashboardRefreshReturn {
  const router = useRouter();

  const refreshDashboard = () => {
    // Refresh the current route to trigger server component re-render
    router.refresh();
  };

  const refreshStats = () => {
    // In a real implementation, this would invalidate React Query cache
    // or trigger a specific stats refresh
    router.refresh();
  };

  const refreshAll = () => {
    // Refresh everything
    router.refresh();
  };

  return {
    refreshDashboard,
    refreshStats,
    refreshAll,
  };
}
