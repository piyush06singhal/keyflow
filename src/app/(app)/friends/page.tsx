import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth";
import { Users, UserPlus, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FriendRequestActions } from "@/features/social/components/friend-actions";

export default async function FriendsPage() {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  // Fetch pending friend requests
  const { data: pendingRequests } = await supabase
    .from("friendships")
    .select(
      `
      id,
      user_id,
      user_profiles!inner (
        username,
        display_name,
        avatar_url
      )
    `,
    )
    .eq("friend_id", user.id)
    .eq("status", "pending");

  // Fetch active friends (bidirectional logic handled here or via advanced RLS view)
  const { data: activeFriends1 } = await supabase
    .from("friendships")
    .select(
      `
      id,
      friend_id,
      user_profiles!friend_id (
        username,
        display_name,
        avatar_url
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "accepted");

  const { data: activeFriends2 } = await supabase
    .from("friendships")
    .select(
      `
      id,
      user_id,
      user_profiles!user_id (
        username,
        display_name,
        avatar_url
      )
    `,
    )
    .eq("friend_id", user.id)
    .eq("status", "accepted");

  // Merge the two sides of accepted friendships
  const friendsList = [
    ...(activeFriends1 || []).map((f: any) => ({ ...f, profile: f.user_profiles })),
    ...(activeFriends2 || []).map((f: any) => ({ ...f, profile: f.user_profiles })),
  ].filter((f: any) => f.profile);

  return (
    <div className="animate-in fade-in mx-auto max-w-5xl space-y-10 px-4 py-8 duration-500">
      {/* Header & Search */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold tracking-tight">
            <Users className="text-primary h-8 w-8" /> Friends & Connections
          </h1>
          <p className="text-muted-foreground">
            Manage your network, challenge friends, and track mutual progress.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by username..."
            className="bg-secondary border-border/50 focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-9 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Pending Requests Section */}
      {pendingRequests && pendingRequests.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <UserPlus className="h-5 w-5 text-blue-500" /> Pending Requests
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-500">
              {pendingRequests.length}
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pendingRequests.map((req: any) => {
              const profile = req.user_profiles?.[0] || req.user_profiles;
              return (
                <div
                  key={req.id}
                  className="border-border/50 bg-card flex items-center justify-between rounded-xl border p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
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
                      <Link
                        href={`/profile/${profile?.username}`}
                        className="hover:text-primary font-semibold transition-colors"
                      >
                        {profile?.display_name}
                      </Link>
                      <div className="text-muted-foreground text-xs">
                        @{profile?.username}
                      </div>
                    </div>
                  </div>

                  <FriendRequestActions
                    requestId={req.id}
                    friendId={profile.user_id || req.user_id}
                    friendName={profile.display_name}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Friends List Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Friends</h2>

        {friendsList.length === 0 ? (
          <div className="border-border bg-secondary/20 rounded-xl border border-dashed p-12 text-center">
            <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
            <h3 className="text-lg font-medium">No friends added yet</h3>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md">
              Search for users by their username above to send friend requests, compare
              stats, and challenge them!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {friendsList.map((friend: any) => {
              const profile = friend.profile?.[0] || friend.profile;
              return (
                <div
                  key={friend.id}
                  className="border-border/50 bg-card hover:border-primary/50 group rounded-xl border p-5 shadow-sm transition-colors"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary group-hover:ring-primary h-12 w-12 shrink-0 overflow-hidden rounded-full transition-all group-hover:ring-2">
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
                      <div>
                        <Link
                          href={`/profile/${profile?.username}`}
                          className="hover:text-primary line-clamp-1 text-base font-semibold transition-colors"
                        >
                          {profile?.display_name}
                        </Link>
                        <div className="text-muted-foreground text-sm">
                          @{profile?.username}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/profile/${profile?.username}`}
                      className="bg-secondary hover:bg-secondary/80 flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors"
                    >
                      View Profile
                    </Link>
                    <button className="border-primary/20 text-primary hover:bg-primary/5 flex-1 rounded-lg border py-2 text-sm font-medium transition-colors">
                      Compare
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
