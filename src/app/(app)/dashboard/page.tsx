import { requireAuth } from "@/lib/supabase/auth";
import { getDashboardData } from "@/lib/supabase/dashboard";
import { PageContainer } from "@/components/app-shell";
import {
  WelcomeCard,
  StatsGrid,
  RecentActivity,
  PracticeHeatmap,
  GoalsSection,
} from "@/components/dashboard";
import { AiCoachProvider } from "@/features/ai-coach/context/ai-provider";
import { AiCoachDashboardSection } from "@/features/ai-coach/components";

export default async function DashboardPage() {
  const user = await requireAuth();
  const dashboardData = await getDashboardData(user.id);

  // Fallback data if user hasn't completed onboarding or has no data yet
  if (!dashboardData) {
    return (
      <PageContainer maxWidth="full">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Welcome to KeyFlow!</h2>
            <p className="text-muted-foreground mt-2">
              Complete your onboarding to get started.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <AiCoachProvider>
      <PageContainer maxWidth="full">
        <div className="space-y-6">
          {/* Welcome Card */}
          <WelcomeCard
            displayName={dashboardData.displayName}
            email={dashboardData.email ?? undefined}
            level={dashboardData.level}
            streak={dashboardData.streak}
            todayGoal={dashboardData.todayGoal}
            xp={dashboardData.xp}
            rank={dashboardData.rank}
          />

          {/* Stats Grid */}
          <StatsGrid stats={dashboardData.stats} />

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - 2/3 width */}
            <div className="space-y-6 lg:col-span-2">
              <PracticeHeatmap data={dashboardData.heatmapData} />
              <RecentActivity activities={dashboardData.activities} />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <AiCoachDashboardSection />
              <GoalsSection
                dailyGoal={dashboardData.dailyGoal}
                weeklyGoal={dashboardData.weeklyGoal}
                monthlyGoal={dashboardData.monthlyGoal}
                xpProgress={dashboardData.xpProgress}
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </AiCoachProvider>
  );
}
