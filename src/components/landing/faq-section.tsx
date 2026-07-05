"use client";

import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, useInView } from "framer-motion";

const faqs = [
  {
    question: "Is KeyFlow really free?",
    answer:
      "Yes! KeyFlow is completely free to use. All features including typing practice, coding practice, AI coaching, analytics, and achievements are available at no cost. We believe in making quality typing education accessible to everyone.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "You can try the basic typing practice without an account, but creating a free account unlocks full features like progress tracking, AI coaching, personalized recommendations, achievements, and detailed analytics. Registration takes less than a minute.",
  },
  {
    question: "What programming languages are supported?",
    answer:
      "We currently support JavaScript, TypeScript, Python, Java, C++, C#, SQL, HTML, CSS, React, Next.js, and more. We're constantly adding new languages based on community feedback. Each language includes real-world code snippets and syntax patterns.",
  },
  {
    question: "How does the AI coaching work?",
    answer:
      "Our AI analyzes your typing patterns, identifies weaknesses, and provides personalized recommendations. It generates custom lessons targeting your problem areas, suggests optimal practice times, and creates improvement plans tailored to your goals. The AI learns from your progress and adapts accordingly.",
  },
  {
    question: "Can I use KeyFlow on mobile devices?",
    answer:
      "KeyFlow is optimized for desktop and laptop use since typing practice is most effective with a physical keyboard. However, our responsive design ensures you can view your progress, analytics, and achievements on mobile devices. We recommend using a desktop for practice sessions.",
  },
  {
    question: "How is my progress tracked?",
    answer:
      "We track comprehensive metrics including WPM (Words Per Minute), accuracy percentage, consistency scores, error rates, improvement trends, and practice time. All data is visualized in beautiful charts and graphs. You can filter by date range, practice type, and see detailed breakdowns of your performance.",
  },
  {
    question: "What are daily challenges?",
    answer:
      "Daily challenges are fresh typing exercises released every day designed to keep you motivated and consistent. They include speed challenges, accuracy goals, special character practice, and coding-specific tasks. Completing challenges earns you achievements and helps build a daily practice habit.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. We take privacy seriously. Your practice data, personal information, and progress are encrypted and securely stored. We never share your data with third parties. You can delete your account and all associated data at any time from your settings.",
  },
  {
    question: "Can I compete with friends?",
    answer:
      "Yes! KeyFlow features global leaderboards where you can see how you rank against other users. You can also view detailed community statistics. We're working on a multiplayer racing mode where you'll be able to compete with friends in real-time typing battles (coming soon!).",
  },
  {
    question: "How often should I practice?",
    answer:
      "Consistency is key! We recommend practicing for 15-20 minutes daily for optimal improvement. The AI coach will help you establish a sustainable practice schedule based on your goals and availability. Even short, regular sessions are more effective than occasional long sessions.",
  },
];

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative py-24 sm:py-32" ref={ref}>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Frequently Asked
            <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
              {" "}
              Questions
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Everything you need to know about KeyFlow
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-key-md overflow-hidden rounded-lg border px-6 backdrop-blur-sm transition-all duration-300"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="mailto:support@keyflow.com"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
