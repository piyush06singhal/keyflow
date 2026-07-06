import React from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Award,
  Flame,
  Timer,
  Zap,
  MapPin,
  Link as LinkIcon,
  UserPlus,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import { AddFriendButton } from "@/features/social/components/friend-actions";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createSupabaseServerClient();

  // Fetch user profile based on username
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Fetch their statistics
  const { data: stats } = await supabase
    .from("user_statistics")
    .select("*")
    .eq("user_id", profile.user_id)
    .single();

  const userStats = stats || {
    level: 1,
    xp: 0,
    best_wpm: 0,
    current_streak: 0,
    total_sessions: 0,
  };

  return (
    <div className="animate-in fade-in mx-auto max-w-6xl space-y-8 duration-500">
      {/* Profile Header & Banner */}
      <div className="border-border/50 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
        <div className="from-primary/30 via-primary/10 to-background/50 h-48 w-full bg-gradient-to-r object-cover" />

        <div className="relative -mt-16 flex flex-col items-end gap-6 px-8 pt-4 pb-8 md:flex-row md:items-center">
          <div className="border-background bg-secondary flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 shadow-lg">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username}
                width={128}
                height={128}
                className="object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-4xl font-bold">
                {profile.display_name.charAt(0)}
              </span>
            )}
          </div>

          <div className="mt-16 flex-1 space-y-2 md:mt-0">
            <h1 className="text-3xl font-bold tracking-tight">
              {profile.display_name}
            </h1>
            <p className="text-muted-foreground font-medium">@{profile.username}</p>

            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-sm">
              {profile.country && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {profile.country}
                </span>
              )}
              {profile.social_github && (
                <a
                  href={profile.social_github}
                  className="hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <LinkIcon className="h-4 w-4" /> GitHub
                </a>
              )}
            </div>
          </div>

          <div className="mt-4 flex w-full items-center gap-3 md:mt-0 md:w-auto">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-colors md:flex-none">
              <UserPlus className="h-4 w-4" /> Follow
            </button>
            <AddFriendButton
              targetUserId={profile.user_id}
              targetUserName={profile.display_name}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Stats */}
        <div className="space-y-8 lg:col-span-1">
          {/* Level & XP */}
          <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Progression</h3>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">
                Level {userStats.level}
              </span>
              <span className="text-primary font-bold">{userStats.xp} XP</span>
            </div>
            <div className="bg-secondary h-3 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full"
                style={{ width: `${(userStats.xp % 1000) / 10}%` }}
              />
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border-border/50 bg-card rounded-xl border p-5 text-center shadow-sm">
              <Zap className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
              <div className="text-2xl font-bold">{userStats.best_wpm}</div>
              <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Best WPM
              </div>
            </div>
            <div className="border-border/50 bg-card rounded-xl border p-5 text-center shadow-sm">
              <Flame className="mx-auto mb-2 h-6 w-6 text-orange-500" />
              <div className="text-2xl font-bold">{userStats.current_streak}</div>
              <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Day Streak
              </div>
            </div>
            <div className="border-border/50 bg-card col-span-2 rounded-xl border p-5 text-center shadow-sm">
              <Timer className="mx-auto mb-2 h-6 w-6 text-blue-500" />
              <div className="text-2xl font-bold">{userStats.total_sessions}</div>
              <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Total Sessions
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Badges */}
        <div className="space-y-8 lg:col-span-2">
          {/* Biography */}
          {profile.biography && (
            <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold">About</h3>
              <p className="text-muted-foreground leading-relaxed">
                {profile.biography}
              </p>
            </div>
          )}

          {/* Pinned Badges */}
          <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Award className="text-primary h-5 w-5" /> Pinned Achievements
              </h3>
            </div>
            {profile.pinned_badges && profile.pinned_badges.length > 0 ? (
              <div className="flex gap-4">
                {profile.pinned_badges.map((badgeId: string) => (
                  <div
                    key={badgeId}
                    className="bg-secondary border-border flex h-20 w-20 items-center justify-center rounded-full border"
                  >
                    {/* Badge Component would go here */}
                    <Award className="text-muted-foreground h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground bg-secondary/30 border-border rounded-lg border border-dashed py-8 text-center">
                <p>No badges pinned yet.</p>
              </div>
            )}
          </div>

          {/* Activity Heatmap Placeholder */}
          <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold">Practice History</h3>
            <div className="bg-secondary/30 border-border flex h-32 w-full items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">Heatmap Component</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
