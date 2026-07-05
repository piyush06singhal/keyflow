"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

const stats = [
  { value: 10000, suffix: "+", label: "Active Users", duration: 2 },
  { value: 50000000, suffix: "+", label: "Words Typed", duration: 2.5 },
  { value: 100000, suffix: "+", label: "Coding Exercises", duration: 2 },
  { value: 95, suffix: "%", label: "Satisfaction Rate", duration: 1.5 },
];

function AnimatedCounter({
  value,
  suffix,
  duration,
  isInView,
}: {
  value: number;
  suffix: string;
  duration: number;
  isInView: boolean;
}) {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => {
    if (value >= 1000000) {
      return `${(current / 1000000).toFixed(0)}M`;
    } else if (value >= 1000) {
      return `${(current / 1000).toFixed(0)}K`;
    }
    return Math.floor(current).toString();
  });

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return () => unsubscribe();
  }, [display]);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

export function StatisticsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 sm:py-32" ref={ref}>
      {/* Background */}
      <div className="from-muted/50 absolute inset-0 bg-gradient-to-b to-transparent" />

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Join a Thriving
            <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
              {" "}
              Community
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Thousands of developers and typists improving their skills every day
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-key-lg relative overflow-hidden rounded-2xl border p-8 text-center backdrop-blur-sm transition-all duration-300"
            >
              {/* Gradient Background */}
              <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-2 text-4xl font-bold tabular-nums md:text-5xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={stat.duration}
                    isInView={isInView}
                  />
                </div>
                <div className="text-muted-foreground text-sm font-medium md:text-base">
                  {stat.label}
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="from-primary to-accent-foreground absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
