import { requireAuth } from "@/lib/supabase/auth";
import { hasCompletedOnboarding } from "@/lib/supabase/profile";
import { redirect } from "next/navigation";
import { routes } from "@/lib/constants/routes";
import { AppLayout } from "@/components/app-shell";
import { getUserProfile } from "@/lib/supabase/profile";

import { NotificationProvider } from "@/features/notifications/context/notification-provider";

export default async function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  // Check if user has completed onboarding
  const onboardingCompleted = await hasCompletedOnboarding(user.id);

  if (!onboardingCompleted) {
    redirect(routes.onboarding);
  }

  // Get user profile for display
  const profile = await getUserProfile(user.id);
  const userData = {
    email: user.email,
    display_name:
      (profile as { display_name?: string } | null)?.display_name ||
      user.email?.split("@")[0] ||
      "User",
  };

  return (
    <NotificationProvider>
      <AppLayout user={userData}>{children}</AppLayout>
    </NotificationProvider>
  );
}
