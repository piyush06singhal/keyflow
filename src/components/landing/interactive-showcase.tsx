"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, useInView } from "framer-motion";
import { Keyboard, Code2, TrendingUp, Target, Award, Calendar } from "lucide-react";

const showcaseItems = [
  {
    id: "typing",
    label: "Typing",
    icon: Keyboard,
    content: <TypingShowcase />,
  },
  {
    id: "coding",
    label: "Coding",
    icon: Code2,
    content: <CodingShowcase />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: TrendingUp,
    content: <AnalyticsShowcase />,
  },
  {
    id: "progress",
    label: "Progress",
    icon: Target,
    content: <ProgressShowcase />,
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Award,
    content: <AchievementsShowcase />,
  },
  {
    id: "challenges",
    label: "Challenges",
    icon: Calendar,
    content: <ChallengesShowcase />,
  },
];

export function InteractiveShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("typing");

  return (
    <section className="relative py-24 sm:py-32" ref={ref}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Experience It
            <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
              {" "}
              In Action
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Interactive previews of what makes KeyFlow exceptional
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-muted/50 grid w-full grid-cols-3 gap-2 p-2 lg:grid-cols-6">
              {showcaseItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="data-[state=active]:bg-background data-[state=active]:shadow-key-sm flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {showcaseItems.map((item) => (
              <TabsContent key={item.id} value={item.id} className="mt-6">
                {item.content}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}

function TypingShowcase() {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden p-8 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Live Typing Practice</h3>
          <div className="bg-success/20 text-success rounded-full px-3 py-1 text-sm font-medium">
            Active
          </div>
        </div>
        <p className="text-muted-foreground">
          Real-time feedback with customizable texts and difficulty levels
        </p>
        <div className="mt-6 grid grid-cols-4 gap-4">
          {[
            { label: "WPM", value: "72", change: "+12%" },
            { label: "Accuracy", value: "96%", change: "+3%" },
            { label: "Time", value: "2:34", change: "-8%" },
            { label: "Words", value: "184", change: "+24" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-border/50 bg-muted/30 rounded-lg border p-4"
            >
              <div className="text-muted-foreground text-sm">{stat.label}</div>
              <div className="mt-1 text-2xl font-bold">{stat.value}</div>
              <div className="text-success mt-1 text-xs">{stat.change}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function CodingShowcase() {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden backdrop-blur-sm">
      <div className="bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <div className="bg-destructive h-3 w-3 rounded-full" />
          <div className="bg-warning h-3 w-3 rounded-full" />
          <div className="bg-success h-3 w-3 rounded-full" />
          <span className="text-muted-foreground ml-4 font-mono text-sm">
            practice.tsx
          </span>
        </div>
      </div>
      <div className="space-y-2 p-6 font-mono text-sm">
        <div>
          <span className="text-purple-400">const</span>{" "}
          <span className="text-blue-400">calculateWPM</span> ={" "}
          <span className="text-yellow-400">(</span>
          <span className="text-orange-400">words</span>,{" "}
          <span className="text-orange-400">time</span>
          <span className="text-yellow-400">)</span> =&gt; {"{"}{" "}
        </div>
        <div className="pl-4">
          <span className="text-purple-400">return</span>{" "}
          <span className="text-orange-400">words</span> /{" "}
          <span className="text-yellow-400">(</span>
          <span className="text-orange-400">time</span> /{" "}
          <span className="text-green-400">60</span>
          <span className="text-yellow-400">)</span>;
        </div>
        <div>{"}"}</div>
      </div>
    </Card>
  );
}

function AnalyticsShowcase() {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden p-8 backdrop-blur-sm">
      <h3 className="mb-6 text-xl font-semibold">Performance Insights</h3>
      <div className="space-y-4">
        {[
          { label: "Average WPM", value: 68, max: 100, color: "bg-primary" },
          { label: "Accuracy", value: 94, max: 100, color: "bg-success" },
          { label: "Consistency", value: 82, max: 100, color: "bg-accent-foreground" },
        ].map((metric) => (
          <div key={metric.label}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-semibold">{metric.value}%</span>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${metric.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProgressShowcase() {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden p-8 backdrop-blur-sm">
      <h3 className="mb-6 text-xl font-semibold">7-Day Progress</h3>
      <div className="flex items-end justify-between gap-2">
        {[45, 52, 48, 61, 58, 67, 72].map((value, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(value / 72) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="from-primary to-accent-foreground w-full rounded-t-lg bg-gradient-to-t"
              style={{ minHeight: "80px", maxHeight: "200px" }}
            />
            <span className="text-muted-foreground text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AchievementsShowcase() {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden p-8 backdrop-blur-sm">
      <h3 className="mb-6 text-xl font-semibold">Recent Achievements</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: "🏆", title: "Speed Demon", desc: "Reached 100 WPM" },
          { icon: "🎯", title: "Perfect Streak", desc: "100% accuracy × 10" },
          { icon: "⚡", title: "Consistency King", desc: "Practiced 30 days" },
          { icon: "🚀", title: "Code Master", desc: "Completed 50 coding exercises" },
        ].map((achievement, i) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="border-border/50 bg-muted/30 flex items-center gap-4 rounded-lg border p-4"
          >
            <div className="text-3xl">{achievement.icon}</div>
            <div>
              <div className="font-semibold">{achievement.title}</div>
              <div className="text-muted-foreground text-sm">{achievement.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function ChallengesShowcase() {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden p-8 backdrop-blur-sm">
      <h3 className="mb-6 text-xl font-semibold">Today&apos;s Challenges</h3>
      <div className="space-y-4">
        {[
          { title: "Speed Challenge", progress: 75, target: "Complete in under 2 min" },
          {
            title: "Accuracy Challenge",
            progress: 90,
            target: "Maintain 95% accuracy",
          },
          { title: "Code Challenge", progress: 50, target: "Type 3 code snippets" },
        ].map((challenge) => (
          <div
            key={challenge.title}
            className="border-border/50 bg-muted/30 rounded-lg border p-4"
          >
            <div className="mb-2 flex justify-between">
              <span className="font-medium">{challenge.title}</span>
              <span className="text-muted-foreground text-sm">
                {challenge.progress}%
              </span>
            </div>
            <div className="bg-muted mb-2 h-2 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${challenge.progress}%` }}
                transition={{ duration: 1 }}
                className="from-primary to-accent-foreground h-full bg-gradient-to-r"
              />
            </div>
            <p className="text-muted-foreground text-xs">{challenge.target}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
