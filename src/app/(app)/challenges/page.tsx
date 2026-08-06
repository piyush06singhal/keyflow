"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Play, Trophy, Clock } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { TiltCard } from "@/components/motion";
import {
  getTodayChallenge,
  getDisplayName,
  setDisplayName,
  getBestRunForDay,
  getChallengeHistory,
} from "@/lib/local-storage/daily-challenge";

export default function ChallengesPage() {
  const router = useRouter();
  const challenge = useMemo(() => getTodayChallenge(), []);

  const [name, setName] = useState(() => getDisplayName());
  const todayBest = useMemo(() => getBestRunForDay(), []);
  const history = useMemo(() => getChallengeHistory().slice(0, 10), []);

  const handleStart = () => {
    setDisplayName(name || "You");
    sessionStorage.setItem("customPracticeText", challenge.text);
    sessionStorage.setItem("customPracticeTitle", "Daily Challenge");
    sessionStorage.setItem("customPracticeDuration", String(challenge.duration));
    sessionStorage.setItem("dailyChallengeActive", "true");
    router.push("/practice");
  };

  return (
    <PageContainer maxWidth="md">
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Challenge</h1>
          <p className="text-muted-foreground text-sm">
            One challenge, one text, shared by everyone today. Run it as many times as
            you like — your best run is recorded on this device.
          </p>
        </div>

        <TiltCard maxTilt={4}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Today&apos;s Run</CardTitle>
                <CardDescription className="flex items-center gap-1.5 pt-1 text-xs font-semibold">
                  <Clock className="h-3.5 w-3.5" />
                  {challenge.duration}s · {challenge.date}
                </CardDescription>
              </div>
              <Mascot state={todayBest ? "celebrating" : "idle"} size={64} />
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="border-border bg-muted/50 text-foreground rounded-xl border-2 p-4 text-sm leading-relaxed italic">
                &ldquo;{challenge.text}&rdquo;
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="challenger-name" className="text-xs font-bold">
                  Your name (kept on this device only)
                </Label>
                <Input
                  id="challenger-name"
                  placeholder="e.g. SpeedDemon7"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  className="text-sm"
                />
              </div>

              {todayBest && (
                <div className="border-border bg-orange/15 shadow-pop-sm flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-bold">
                  <Trophy className="text-orange h-4 w-4" />
                  Your best today: {todayBest.wpm} WPM at {todayBest.accuracy}% accuracy
                </div>
              )}

              <Button onClick={handleStart} className="h-11 w-full gap-2">
                <Play className="h-4 w-4" />
                {todayBest ? "Run It Again" : "Start Today's Challenge"}
              </Button>
            </CardContent>
          </Card>
        </TiltCard>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Daily Runs</CardTitle>
            <CardDescription>
              A local history of your challenge attempts — nothing here is shared or
              public.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-xs font-semibold">
                No runs yet — start today&apos;s challenge to see it here.
              </p>
            ) : (
              <ul className="divide-border-subtle divide-y-2">
                {history.map((run) => (
                  <li
                    key={run.completedAt}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <div>
                      <span className="font-bold">{run.displayName}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        {run.date}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-mono text-xs font-bold">
                      {run.wpm} WPM · {run.accuracy}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
