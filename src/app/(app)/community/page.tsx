import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Activity, Award, ArrowUpCircle, Zap, Flame, Terminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default async function CommunityFeedPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch the latest 50 activities from the community feed
  const { data: feedEvents } = await supabase
    .from("community_feed")
    .select(
      `
      *,
      user_profiles!inner (
        username,
        display_name,
        avatar_url
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  // Helper to map event types to icons and colors
  const getEventMeta = (type: string) => {
    switch (type) {
      case "achievement":
        return { icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" };
      case "level_up":
        return { icon: ArrowUpCircle, color: "text-blue-500", bg: "bg-blue-500/10" };
      case "new_personal_best":
        return { icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" };
      case "streak_milestone":
        return { icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" };
      case "challenge_completed":
        return { icon: Terminal, color: "text-green-500", bg: "bg-green-500/10" };
      default:
        return { icon: Activity, color: "text-primary", bg: "bg-primary/10" };
    }
  };

  return (
    <div className="animate-in fade-in mx-auto max-w-4xl space-y-8 px-4 py-8 duration-500">
      {/* Header */}
      <div>
        <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold tracking-tight">
          <Activity className="text-primary h-8 w-8" /> Community Feed
        </h1>
        <p className="text-muted-foreground">
          See what your friends and other top typists are accomplishing right now.
        </p>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {!feedEvents || feedEvents.length === 0 ? (
          <div className="border-border bg-secondary/20 rounded-xl border border-dashed p-12 text-center">
            <Activity className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
            <h3 className="text-lg font-medium">It&apos;s quiet in here</h3>
            <p className="text-muted-foreground">
              Be the first to unlock an achievement or set a new record!
            </p>
          </div>
        ) : (
          feedEvents.map((event: any) => {
            const profile = event.user_profiles?.[0] || event.user_profiles;
            const meta = getEventMeta(event.activity_type);
            const Icon = meta.icon;

            return (
              <div
                key={event.id}
                className="border-border/50 bg-card hover:border-primary/30 flex gap-6 rounded-xl border p-6 shadow-sm transition-colors"
              >
                {/* User Avatar */}
                <Link href={`/profile/${profile?.username}`} className="shrink-0">
                  <div className="bg-secondary hover:ring-primary h-12 w-12 overflow-hidden rounded-full transition-all hover:ring-2">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt=""
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full w-full items-center justify-center text-lg font-bold">
                        {profile?.display_name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                </Link>

                {/* Event Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <Link
                      href={`/profile/${profile?.username}`}
                      className="hover:text-primary truncate font-semibold transition-colors"
                    >
                      {profile?.display_name}
                    </Link>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatDistanceToNow(new Date(event.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Activity Badge & Title */}
                  <div className="mt-3 flex items-start gap-3">
                    <div className={`rounded-lg p-2 ${meta.bg} ${meta.color} shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-muted-foreground mt-2 text-sm font-semibold">
                          Join the conversation. Share your progress, ask for help, or
                          discuss the latest typing strategies with other developers in
                          KeyFlow&apos;s global community.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
