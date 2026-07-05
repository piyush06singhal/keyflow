"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Target, Zap, Activity } from "lucide-react";

export function AnalyticsShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="analytics" className="relative py-24 sm:py-32" ref={ref}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Track Every
            <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
              {" "}
              Keystroke
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Beautiful, actionable insights into your typing and coding performance
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Stat Cards */}
          {[
            {
              icon: Zap,
              label: "Average WPM",
              value: "68",
              change: "+12.5%",
              trend: "up",
              color: "text-primary",
            },
            {
              icon: Target,
              label: "Accuracy",
              value: "94.2%",
              change: "+3.8%",
              trend: "up",
              color: "text-success",
            },
            {
              icon: Activity,
              label: "Consistency",
              value: "87%",
              change: "+5.2%",
              trend: "up",
              color: "text-accent-foreground",
            },
            {
              icon: TrendingUp,
              label: "Improvement",
              value: "+24%",
              change: "This month",
              trend: "up",
              color: "text-warning",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span
                      className={`text-xs font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-muted-foreground mt-1 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Chart Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-border/50 bg-card/50 overflow-hidden backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Chart Visualization */}
              <div className="relative h-64">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 800 250"
                  preserveAspectRatio="none"
                >
                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 62.5}
                      x2="800"
                      y2={i * 62.5}
                      stroke="currentColor"
                      strokeOpacity="0.1"
                      strokeWidth="1"
                    />
                  ))}

                  {/* WPM Line */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, delay: 0.5 }}
                    d="M 0 200 Q 100 180 200 160 T 400 120 T 600 80 T 800 50"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Accuracy Line */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, delay: 0.7 }}
                    d="M 0 180 Q 100 170 200 150 T 400 110 T 600 90 T 800 70"
                    fill="none"
                    stroke="hsl(var(--success))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="8 4"
                  />

                  {/* Data Points */}
                  {[
                    { x: 0, y: 200 },
                    { x: 200, y: 160 },
                    { x: 400, y: 120 },
                    { x: 600, y: 80 },
                    { x: 800, y: 50 },
                  ].map((point, i) => (
                    <motion.circle
                      key={i}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill="hsl(var(--primary))"
                    />
                  ))}
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-3 w-8 rounded-full" />
                  <span className="text-muted-foreground text-sm">
                    Words Per Minute
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="border-success h-3 w-8 rounded-full border-2 border-dashed" />
                  <span className="text-muted-foreground text-sm">Accuracy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Keyboard Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Card className="border-border/50 bg-card/50 overflow-hidden backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Keyboard Heatmap</CardTitle>
              <p className="text-muted-foreground text-sm">
                Visualize which keys you type most and least accurately
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Keyboard rows */}
                {[
                  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
                  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
                  ["Z", "X", "C", "V", "B", "N", "M"],
                ].map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-1">
                    {row.map((key, keyIndex) => {
                      const intensity = Math.random();
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{
                            duration: 0.3,
                            delay: 0.7 + (rowIndex * 10 + keyIndex) * 0.01,
                          }}
                          className="border-border/50 flex h-10 w-10 items-center justify-center rounded border font-mono text-sm font-medium"
                          style={{
                            backgroundColor: `rgba(56, 189, 248, ${intensity * 0.4})`,
                          }}
                        >
                          {key}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="text-muted-foreground mt-6 flex items-center justify-between text-xs">
                <span>Less frequent</span>
                <div className="flex gap-1">
                  {[0.1, 0.2, 0.3, 0.4, 0.5].map((intensity, i) => (
                    <div
                      key={i}
                      className="h-4 w-8 rounded"
                      style={{ backgroundColor: `rgba(56, 189, 248, ${intensity})` }}
                    />
                  ))}
                </div>
                <span>More frequent</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
