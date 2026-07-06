import { requireAuth } from "@/lib/supabase/auth";
import { PageContainer } from "@/components/app-shell";
import { AnalyticsClient } from "@/features/analytics/components/analytics-client";
import { AiCoachProvider } from "@/features/ai-coach/context/ai-provider";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await requireAuth();

  return (
    <AiCoachProvider>
      <PageContainer maxWidth="full">
        <AnalyticsClient userId={user.id} />
      </PageContainer>
    </AiCoachProvider>
  );
}
