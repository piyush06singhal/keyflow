"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp } from "lucide-react";
import { TypingDemo } from "./typing-demo";

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="bg-pink/10 absolute top-1/3 right-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl delay-1000" />
        <div className="bg-orange/10 absolute bottom-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl delay-500" />
      </div>

      <div className="relative container mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mb-8"
        >
          <div className="border-border bg-card shadow-pop-sm inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold">
            <Zap className="text-primary h-4 w-4" />
            <span>Free forever • No account needed</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="text-center text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Master Typing & Coding
          <br />
          <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent">
            At Lightning Speed
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-muted-foreground mt-6 max-w-2xl text-center text-lg leading-relaxed text-pretty sm:text-xl"
        >
          A playful, local-first typing and coding practice arena — AI-generated text
          and code snippets, live WPM/accuracy feedback, and a daily challenge. No
          account required, your stats stay on your device.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button size="lg" asChild className="group">
            <Link href="/practice">
              Start Typing Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">
              <TrendingUp className="mr-2 h-4 w-4" />
              Explore Features
            </Link>
          </Button>
        </motion.div>

        {/* Live Typing Demo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 w-full max-w-4xl"
        >
          <TypingDemo />
        </motion.div>
      </div>
    </section>
  );
}
