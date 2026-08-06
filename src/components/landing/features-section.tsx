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
import { TiltCard } from "@/components/motion";
import {
  Keyboard,
  Code2,
  BarChart3,
  Trophy,
  Calendar,
  Sparkles,
  Rocket,
  Minimize2,
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
    icon: Sparkles,
    title: "AI-Generated Content",
    description:
      "Fresh paragraphs and code snippets generated on demand — never the same test twice.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Track WPM, accuracy, consistency over time with beautiful charts — saved locally, no signup.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Trophy,
    title: "Personal Bests",
    description:
      "See your fastest runs and highest-accuracy sessions highlighted the moment you beat them.",
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
    icon: Rocket,
    title: "Zero Sign-Up",
    description:
      "No account, no email, no password. Land on the page and start typing in seconds.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Minimize2,
    title: "Focus & Zen Modes",
    description:
      "Strip away the UI and practice distraction-free, or go full zen with a minimalist canvas.",
    gradient: "from-cyan-500 to-blue-500",
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
            <span className="aurora-text"> Level Up</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            A comprehensive platform designed to transform your typing and coding speed
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <TiltCard maxTilt={6}>
        <Card className="group relative h-full overflow-hidden">
          <CardHeader className="relative">
            <div
              className={`border-border shadow-pop-sm mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 bg-gradient-to-br ${feature.gradient}`}
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
      </TiltCard>
    </motion.div>
  );
}
