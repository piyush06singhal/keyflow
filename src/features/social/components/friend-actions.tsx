"use client";

import React, { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Check, X, UserPlus, ShieldAlert } from "lucide-react";
import { useNotifications } from "@/features/notifications/context/notification-provider";
import { useRouter } from "next/navigation";

export function FriendRequestActions({
  requestId,
  friendId,
  friendName,
}: {
  requestId: string;
  friendId: string;
  friendName: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { addNotification } = useNotifications();
  const router = useRouter();

  const handleAction = async (action: "accepted" | "declined") => {
    setIsProcessing(true);
    const supabase = createSupabaseBrowserClient();

    if (action === "declined") {
      await supabase.from("friendships").delete().eq("id", requestId);
      addNotification(
        "Request Declined",
        `You declined the request from ${friendName}`,
        "info",
      );
    } else {
      await supabase
        .from("friendships")
        .update({ status: "accepted" })
        .eq("id", requestId);

      // Also broadcast a notification to the accepted friend
      await supabase.channel(`notifications:${friendId}`).send({
        type: "broadcast",
        event: "new-notification",
        payload: {
          title: "Friend Request Accepted!",
          message: `You are now friends with ${friendName}`,
          type: "achievement",
        },
      });

      addNotification(
        "Friend Added",
        `You are now friends with ${friendName}`,
        "achievement",
      );
    }

    setIsProcessing(false);
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("accepted")}
        disabled={isProcessing}
        className="rounded-lg bg-green-500/10 p-2 text-green-500 transition-colors hover:bg-green-500/20 disabled:opacity-50"
        title="Accept"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleAction("declined")}
        disabled={isProcessing}
        className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-50"
        title="Decline"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function AddFriendButton({
  targetUserId,
  targetUserName,
}: {
  targetUserId: string;
  targetUserName: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"none" | "pending" | "friends">("none");
  const { addNotification } = useNotifications();

  // In a real app, you'd check initial status in a useEffect

  const sendRequest = async () => {
    setIsProcessing(true);
    const supabase = createSupabaseBrowserClient();

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    await supabase
      .from("friendships")
      .insert([{ user_id: user.user.id, friend_id: targetUserId, status: "pending" }]);

    // Broadcast notification to the target user
    await supabase.channel(`notifications:${targetUserId}`).send({
      type: "broadcast",
      event: "new-notification",
      payload: {
        title: "New Friend Request",
        message: `You have a new friend request from someone!`,
        type: "challenge",
      },
    });

    setStatus("pending");
    addNotification("Request Sent", `Friend request sent to ${targetUserName}`, "info");
    setIsProcessing(false);
  };

  if (status === "pending") {
    return (
      <button
        disabled
        className="border-border bg-secondary/50 text-muted-foreground flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg border px-6 py-2.5 font-medium transition-colors md:flex-none"
      >
        Request Sent
      </button>
    );
  }

  return (
    <button
      onClick={sendRequest}
      disabled={isProcessing}
      className="border-border bg-secondary hover:bg-secondary/80 flex flex-1 items-center justify-center gap-2 rounded-lg border px-6 py-2.5 font-medium transition-colors disabled:opacity-50 md:flex-none"
    >
      <UserPlus className="h-4 w-4" /> Add Friend
    </button>
  );
}
