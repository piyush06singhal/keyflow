/**
 * Coding Practice Dashboard Page
 *
 * Main entry point for coding practice module.
 */

import { CodingDashboard } from "@/features/coding/components/coding-dashboard";

export const dynamic = "force-dynamic";

export default function CodingDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CodingDashboard />
    </div>
  );
}
