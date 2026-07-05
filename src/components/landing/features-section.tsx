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
import {
  Keyboard,
  Code2,
  Brain,
  BarChart3,
  Trophy,
  Calendar,
  Users,
  Sparkles,
  Gamepad2,
} from "lucide-react";

const features = [
  {
    icon: Keyboard,
    title: "Typing Practice",
    description:
      "Master typing with customizable texts, multiple difficulty levels, and instant feedback on your performance.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Code2,
    title: "Coding Practice",
    description:
      "Practice typing real code in JavaScript, Python, TypeScript, React, and more with syntax highlighting.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Brain,
    title: "AI Coaching",
    description:
      "Get personalized tips, weakness analysis, and AI-generated lessons tailored to your skill level.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Track WPM, accuracy, consistency over time with beautiful charts and detailed performance insights.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description:
      "Unlock badges, reach milestones, and celebrate your progress with our comprehensive achievement system.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Calendar,
    title: "Daily Challenges",
    description:
      "Stay motivated with fresh daily challenges designed to push your limits and build consistency.",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Leaderboards",
    description:
      "Compete with the global community, track your rank, and see how you stack up against top typers.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Sparkles,
    title: "Personalized Learning",
    description:
      "Adaptive difficulty, custom practice sets, and targeted exercises based on your unique weaknesses.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Gamepad2,
    title: "Multiplayer (Coming Soon)",
    description:
      "Race against friends in real-time, join tournaments, and compete in live typing battles.",
    gradient: "from-purple-500 to-pink-500",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 sm:py-32" ref={ref}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Everything You Need to
            <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
              {" "}
              Level Up
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            A comprehensive platform designed to transform your typing and coding speed
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  isInView,
}: {
  feature: (typeof features)[0];
  index: number;
  isInView: boolean;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="group border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-key-lg relative h-full overflow-hidden backdrop-blur-sm transition-all duration-300">
        {/* Gradient Background on Hover */}
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

        {/* Hover Effect Border */}
        <div className="from-primary to-accent-foreground absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Card>
    </motion.div>
  );
}
