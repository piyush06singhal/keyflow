"use client";

import { useState } from "react";
import { PageContainer } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  UserCheck,
  MessageSquare,
  Flame,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";

interface Friend {
  id: string;
  name: string;
  level: number;
  wpm: number;
  status: "online" | "offline" | "practicing";
  streak: number;
}

const INITIAL_FRIENDS: Friend[] = [
  {
    id: "f1",
    name: "Alex Mercer",
    level: 12,
    wpm: 96,
    status: "practicing",
    streak: 12,
  },
  { id: "f2", name: "Sofia Chen", level: 8, wpm: 89, status: "online", streak: 8 },
  { id: "f3", name: "Marcus Brody", level: 5, wpm: 84, status: "offline", streak: 5 },
  { id: "f4", name: "Elena Rostova", level: 6, wpm: 78, status: "offline", streak: 6 },
];

const INITIAL_REQUESTS = [
  { id: "r1", name: "Sarah Connor", level: 4, wpm: 68 },
  { id: "r2", name: "John Doe", level: 9, wpm: 81 },
];

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [requests, setRequests] = useState<any[]>(INITIAL_REQUESTS);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState<string | null>(null);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    // Simulate search & add
    const isAlreadyFriend = friends.some(
      (f) => f.name.toLowerCase() === searchName.toLowerCase(),
    );
    if (isAlreadyFriend) {
      setSearchStatus("User is already in your friends list.");
      return;
    }

    const newRequest = {
      id: Math.random().toString(),
      name: searchName,
      level: 1,
      wpm: 45,
      status: "offline" as const,
      streak: 0,
    };

    setFriends((prev) => [...prev, newRequest]);
    setSearchStatus(`Success! Added ${searchName} as friend.`);
    setSearchName("");
    setTimeout(() => setSearchStatus(null), 3000);
  };

  const handleAcceptRequest = (id: string, name: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setFriends((prev) => [
      ...prev,
      { id, name, level: 5, wpm: 72, status: "offline", streak: 1 },
    ]);
  };

  const handleDeclineRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        {/* Header toolbar */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Friends & Social</h1>
          <p className="text-muted-foreground text-sm">
            Find coding peers, track online practice sessions, and compare speed stats.
          </p>
        </div>

        {/* Action Panel splits */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Friends List */}
          <div className="space-y-6 lg:col-span-2">
            <Tabs defaultValue="friends" className="w-full">
              <TabsList className="mb-4 grid w-full max-w-[360px] grid-cols-2">
                <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
                <TabsTrigger value="invites">
                  Pending Invites {requests.length > 0 && `(${requests.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="friends">
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
                      <Users className="text-primary h-4.5 w-4.5" />
                      Active Friends List
                    </CardTitle>
                    <CardDescription>
                      Practice status and network updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {friends.map((friend) => {
                      const isOnline = friend.status === "online";
                      const isPracticing = friend.status === "practicing";

                      return (
                        <div
                          key={friend.id}
                          className="bg-card border-border/40 hover:border-primary/20 flex flex-col gap-3 rounded-xl border p-4 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full border font-bold">
                                {friend.name.charAt(0)}
                              </div>
                              <span
                                className={`border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 ${
                                  isPracticing
                                    ? "animate-pulse bg-amber-500"
                                    : isOnline
                                      ? "bg-emerald-500"
                                      : "bg-muted-foreground"
                                }`}
                              />
                            </div>
                            <div>
                              <h5 className="text-foreground flex items-center gap-1.5 text-sm leading-none font-bold">
                                {friend.name}
                                <Badge
                                  variant="secondary"
                                  className="rounded-md px-2 py-0 font-mono text-[9px]"
                                >
                                  Lvl {friend.level}
                                </Badge>
                              </h5>
                              <span className="text-muted-foreground mt-1 flex items-center gap-1 text-[11px] font-semibold">
                                <Flame className="h-3 w-3 text-orange-500" />
                                {friend.streak} day streak
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <div className="text-right sm:pr-4">
                              <p className="text-foreground text-sm font-bold">
                                {friend.wpm} WPM
                              </p>
                              <p className="text-muted-foreground text-[10px] font-semibold">
                                Average Speed
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8.5 rounded-lg text-xs"
                              >
                                Compare
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8.5 w-8.5 rounded-lg"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invites">
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold">
                      Friend Inbound Invites
                    </CardTitle>
                    <CardDescription>Respond to incoming requests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {requests.length === 0 ? (
                      <p className="text-muted-foreground py-6 text-center text-xs font-semibold">
                        No pending friend requests.
                      </p>
                    ) : (
                      requests.map((req) => (
                        <div
                          key={req.id}
                          className="bg-card border-border/40 flex items-center justify-between rounded-xl border p-4"
                        >
                          <div>
                            <h5 className="text-foreground text-sm font-bold">
                              {req.name}
                            </h5>
                            <p className="text-muted-foreground text-[10px] font-semibold">
                              Lvl {req.level} | Speed: {req.wpm} WPM
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="h-8 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                              onClick={() => handleAcceptRequest(req.id, req.name)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 rounded-lg text-rose-500 hover:text-rose-600"
                              onClick={() => handleDeclineRequest(req.id)}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Add Friend action */}
          <div className="space-y-6">
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
                  <UserPlus className="text-primary h-4.5 w-4.5" />
                  Follow Friend
                </CardTitle>
                <CardDescription>
                  Enter a username to send a practice connection invitation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddFriend} className="space-y-3">
                  <Input
                    placeholder="Username"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="h-9.5 rounded-xl text-xs font-semibold"
                  />
                  <Button type="submit" size="sm" className="h-9 w-full rounded-xl">
                    Send Invitation
                  </Button>
                  {searchStatus && (
                    <div className="text-primary bg-primary/5 border-primary/20 rounded-lg border p-2 text-[10px] font-bold">
                      {searchStatus}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
                  <UserCheck className="h-4.5 w-4.5 text-purple-500" />
                  Compare Stats
                </CardTitle>
                <CardDescription>
                  Select friends from list to compare consistency scores and best
                  speeds.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xs leading-normal font-semibold">
                Click the &quot;Compare&quot; button next to any friend to pull up
                side-by-side performance indicators.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
