"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 sm:py-32" ref={ref}>
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/10 absolute top-1/2 left-1/4 h-96 w-96 -translate-y-1/2 animate-pulse rounded-full blur-3xl" />
        <div className="bg-accent-foreground/10 absolute top-1/2 right-1/4 h-96 w-96 -translate-y-1/2 animate-pulse rounded-full blur-3xl delay-1000" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="border-border shadow-pop-lg from-card to-card relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-8 sm:p-12 lg:p-16"
        >
          {/* Gradient Overlay */}
          <div className="from-primary/5 to-accent-foreground/5 absolute inset-0 bg-gradient-to-br via-transparent" />

          {/* Content */}
          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="border-border bg-primary/10 text-primary shadow-pop-sm mb-6 inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold"
            >
              <Sparkles className="h-4 w-4" />
              Start Your Journey Today
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Ready to Type at
              <br />
              <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
                Lightning Speed?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-pretty sm:text-xl"
            >
              No account, nothing to install — just open the page and start typing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
            >
              <Button size="lg" asChild className="group">
                <Link href="/practice">
                  Start Typing Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/practice/code/dashboard">Try Coding Practice</Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Free forever</span>
              </div>
              <div className="bg-border hidden h-4 w-px sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Local-first, no tracking</span>
              </div>
              <div className="bg-border hidden h-4 w-px sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Start in 30 seconds</span>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="bg-primary/20 pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl" />
          <div className="bg-accent-foreground/20 pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
