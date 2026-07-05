"use client";

import { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { Brain, Sparkles, Target, TrendingUp, BookOpen, Lightbulb } from "lucide-react";

const aiFeatures = [
  {
    icon: Brain,
    title: "AI Coach",
    description:
      "Get real-time feedback and personalized tips based on your typing patterns and weaknesses.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: BookOpen,
    title: "Lesson Generator",
    description:
      "AI creates custom lessons targeting your specific problem areas and skill gaps.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Target,
    title: "Personalized Recommendations",
    description:
      "Smart suggestions for practice exercises based on your progress and goals.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "AI Coding Practice",
    description:
      "Generate coding exercises in any language tailored to your experience level.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: TrendingUp,
    title: "Weekly Reports",
    description:
      "Comprehensive AI-generated insights into your progress, trends, and improvement areas.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Lightbulb,
    title: "Smart Improvement Plans",
    description:
      "AI designs structured learning paths to help you reach your typing goals faster.",
    gradient: "from-indigo-500 to-blue-500",
  },
];

export function AISection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ai" className="relative py-24 sm:py-32" ref={ref}>
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/5 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Learning
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Your Personal
            <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
              {" "}
              AI Coach
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Intelligent coaching that adapts to your learning style and accelerates your
            progress
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aiFeatures.map((feature, index) => (
            <AIFeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* AI Interaction Example */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="border-border/50 bg-card/50 overflow-hidden backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="text-primary h-5 w-5" />
                AI Coach Insights
              </CardTitle>
              <CardDescription>
                Real-time analysis and personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "strength",
                    title: "Strong Performance",
                    content:
                      "Your accuracy on common words has improved by 8% this week. Keep it up!",
                    color: "border-success/50 bg-success/5",
                  },
                  {
                    type: "improvement",
                    title: "Focus Area",
                    content:
                      "Consider practicing special characters and punctuation. Your speed drops 15% when typing symbols.",
                    color: "border-warning/50 bg-warning/5",
                  },
                  {
                    type: "tip",
                    title: "Pro Tip",
                    content:
                      "Try practicing during your peak focus hours (9-11 AM based on your data) for optimal results.",
                    color: "border-primary/50 bg-primary/5",
                  },
                ].map((insight, i) => (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                    className={`rounded-lg border p-4 ${insight.color}`}
                  >
                    <h4 className="mb-1 font-semibold">{insight.title}</h4>
                    <p className="text-muted-foreground text-sm">{insight.content}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function AIFeatureCard({
  feature,
  index,
  isInView,
}: {
  feature: (typeof aiFeatures)[0];
  index: number;
  isInView: boolean;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-key-lg h-full overflow-hidden backdrop-blur-sm transition-all duration-300">
        <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardHeader className="relative">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} shadow-key-md`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <CardDescription className="text-base leading-relaxed">
            {feature.description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
