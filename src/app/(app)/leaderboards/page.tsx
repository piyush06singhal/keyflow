import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Trophy, Users, Globe, Medal, Flame, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function LeaderboardsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; category?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter || "global"; // global | friends | country
  const category = resolvedParams.category || "xp"; // xp | wpm | streak

  // Map category to database column
  const orderColumn =
    category === "wpm" ? "best_wpm" : category === "streak" ? "current_streak" : "xp";

  // Fetch top 50 users based on the selected category
  // In a real implementation, you would join with user_profiles to get usernames/avatars.
  // We use a raw select with joining if standard RLS allows.
  const { data: rankings, error } = await supabase
    .from("user_statistics")
    .select(
      `
      user_id,
      level,
      xp,
      best_wpm,
      current_streak,
      user_profiles!inner (
        username,
        display_name,
        avatar_url,
        country
      )
    `,
    )
    .order(orderColumn, { ascending: false })
    .limit(50);

  return (
    <div className="animate-in fade-in mx-auto max-w-5xl space-y-8 px-4 py-8 duration-500">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold tracking-tight">
            <Trophy className="h-8 w-8 text-yellow-500" /> Leaderboards
          </h1>
          <p className="text-muted-foreground">
            Compare your progress with the community and climb the ranks.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="bg-secondary flex rounded-lg p-1">
            <Link
              href={`/leaderboards?filter=global&category=${category}`}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${
                filter === "global"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-4 w-4" /> Global
            </Link>
            <Link
              href={`/leaderboards?filter=friends&category=${category}`}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${
                filter === "friends"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" /> Friends
            </Link>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href={`/leaderboards?filter=${filter}&category=xp`}>
          <div
            className={`hover:border-primary/50 cursor-pointer rounded-xl border p-6 transition-all ${
              category === "xp"
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-card border-border/50"
            }`}
          >
            <Medal
              className={`mb-4 h-8 w-8 ${category === "xp" ? "text-primary" : "text-muted-foreground"}`}
            />
            <h3 className="text-lg font-bold">Experience (XP)</h3>
            <p className="text-muted-foreground text-sm">
              Ranked by total practice points.
            </p>
          </div>
        </Link>
        <Link href={`/leaderboards?filter=${filter}&category=wpm`}>
          <div
            className={`hover:border-primary/50 cursor-pointer rounded-xl border p-6 transition-all ${
              category === "wpm"
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-card border-border/50"
            }`}
          >
            <Zap
              className={`mb-4 h-8 w-8 ${category === "wpm" ? "text-yellow-500" : "text-muted-foreground"}`}
            />
            <h3 className="text-lg font-bold">Speed (WPM)</h3>
            <p className="text-muted-foreground text-sm">Highest words per minute.</p>
          </div>
        </Link>
        <Link href={`/leaderboards?filter=${filter}&category=streak`}>
          <div
            className={`hover:border-primary/50 cursor-pointer rounded-xl border p-6 transition-all ${
              category === "streak"
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-card border-border/50"
            }`}
          >
            <Flame
              className={`mb-4 h-8 w-8 ${category === "streak" ? "text-orange-500" : "text-muted-foreground"}`}
            />
            <h3 className="text-lg font-bold">Active Streak</h3>
            <p className="text-muted-foreground text-sm">
              Consecutive days of practice.
            </p>
          </div>
        </Link>
      </div>

      {/* Rankings Table */}
      <div className="border-border/50 bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground border-border/50 border-b font-medium">
              <tr>
                <th className="w-24 rounded-tl-xl px-6 py-4 text-center">Rank</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4 text-right">
                  {category === "xp"
                    ? "Total XP"
                    : category === "wpm"
                      ? "Best WPM"
                      : "Streak"}
                </th>
                <th className="rounded-tr-xl px-6 py-4 text-center">Level</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              {!rankings || rankings.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-muted-foreground px-6 py-12 text-center"
                  >
                    No ranking data available for this category.
                  </td>
                </tr>
              ) : (
                rankings.map((rank: any, index: number) => {
                  const profile = rank.user_profiles?.[0] || rank.user_profiles; // Handle array vs object depending on relationship
                  const value =
                    category === "wpm"
                      ? rank.best_wpm
                      : category === "streak"
                        ? rank.current_streak
                        : rank.xp;

                  return (
                    <tr
                      key={rank.user_id}
                      className="hover:bg-secondary/20 group transition-colors"
                    >
                      <td className="px-6 py-4 text-center font-bold">
                        {index === 0 ? (
                          <Medal className="mx-auto h-6 w-6 text-yellow-500" />
                        ) : index === 1 ? (
                          <Medal className="mx-auto h-6 w-6 text-gray-400" />
                        ) : index === 2 ? (
                          <Medal className="mx-auto h-6 w-6 text-amber-700" />
                        ) : (
                          <span className="text-muted-foreground group-hover:text-foreground">
                            #{index + 1}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/profile/${profile?.username}`}
                          className="flex w-fit items-center gap-3"
                        >
                          <div className="bg-secondary h-10 w-10 shrink-0 overflow-hidden rounded-full">
                            {profile?.avatar_url ? (
                              <Image
                                src={profile.avatar_url}
                                alt=""
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <div className="text-muted-foreground flex h-full w-full items-center justify-center font-bold">
                                {profile?.display_name?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="group-hover:text-primary font-semibold transition-colors">
                              {profile?.display_name || "Unknown User"}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              @{profile?.username || "unknown"}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-base font-bold">
                        {value.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold">
                          Lvl {rank.level}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
