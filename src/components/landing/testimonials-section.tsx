"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Tech Corp",
    content:
      "KeyFlow transformed my coding speed. The AI coach identified my weak spots and helped me improve by 40% in just two months. Game changer for developers!",
    rating: 5,
    initials: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Full Stack Developer",
    company: "StartupHub",
    content:
      "The coding practice feature is incredible. Typing actual code snippets instead of random text made all the difference. My pull requests are faster now!",
    rating: 5,
    initials: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "Technical Writer",
    company: "DocuTech",
    content:
      "I love the analytics dashboard. Seeing my progress visualized keeps me motivated. The daily challenges are fun and help me stay consistent.",
    rating: 5,
    initials: "ER",
  },
  {
    name: "David Kim",
    role: "DevOps Engineer",
    company: "CloudScale",
    content:
      "As someone who types commands all day, this app has been invaluable. The keyboard heatmap showed me exactly which keys I struggle with.",
    rating: 5,
    initials: "DK",
  },
  {
    name: "Lisa Anderson",
    role: "Product Manager",
    company: "InnovateLabs",
    content:
      "Not a developer but this still helped me tremendously. The personalized learning path adapted to my skill level perfectly. Highly recommend!",
    rating: 5,
    initials: "LA",
  },
  {
    name: "James Wilson",
    role: "Backend Developer",
    company: "DataFlow",
    content:
      "The AI-generated lessons are spot on. It's like having a personal typing tutor that understands exactly what I need to work on.",
    rating: 5,
    initials: "JW",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            Loved by
            <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
              {" "}
              Thousands
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            See what our community has to say about their experience
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-key-lg relative h-full overflow-hidden backdrop-blur-sm transition-all duration-300">
                {/* Glass Effect */}
                <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <CardContent className="relative p-6">
                  {/* Quote Icon */}
                  <Quote className="text-primary/20 mb-4 h-8 w-8" />

                  {/* Rating */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-warning">
                        ⭐
                      </span>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {testimonial.content}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Avatar className="border-primary/20 h-10 w-10 border-2">
                      <AvatarFallback className="from-primary to-accent-foreground bg-gradient-to-br text-xs font-semibold text-white">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Bottom Accent */}
                <div className="from-primary to-accent-foreground absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
