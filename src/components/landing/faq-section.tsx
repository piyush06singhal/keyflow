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
      "Yes! KeyFlow is completely free to use, with no account and no paywalled features. Typing practice, coding practice, AI-generated content, and analytics are all available the moment you land on the page.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No — there's no login, no registration, and no email required. Open the page and start typing immediately. Your history and settings are saved locally in your browser, not on a server.",
  },
  {
    question: "What programming languages are supported?",
    answer:
      "17 languages: JavaScript, TypeScript, Python, Java, C++, C, Go, Rust, SQL, HTML, CSS, JSON, Markdown, Bash, Docker, YAML, and Git commands. Each one includes real-world code snippets and syntax patterns, plus AI-generated snippets on demand.",
  },
  {
    question: "How does the AI-generated content work?",
    answer:
      "Every time you start a paragraph or code-typing session, we can generate fresh content tailored to your chosen difficulty and language via the Groq API — so you're never memorizing the same test twice. If generation is ever unavailable, a curated library of text and snippets keeps you practicing without interruption.",
  },
  {
    question: "Can I use KeyFlow on mobile devices?",
    answer:
      "KeyFlow is optimized for desktop and laptop use since typing practice is most effective with a physical keyboard. Our responsive design lets you check your history and stats on mobile, but we recommend a desktop for practice sessions.",
  },
  {
    question: "How is my progress tracked?",
    answer:
      "We track WPM, accuracy, consistency, error rates, and practice time for every session, visualized in charts on your History page. All of it lives in your browser's local storage — nothing is sent to a server or tied to an account.",
  },
  {
    question: "What are daily challenges?",
    answer:
      "One deterministic typing challenge shared by everyone that calendar day — the same text for you as for anyone else who practices today. Your runs on it are saved locally so you can track your own progress over time.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Since there's no account, your practice history, settings, and stats never leave your device — they're stored in your browser's local storage. Clearing your browser data clears your KeyFlow history too.",
  },
  {
    question: "How often should I practice?",
    answer:
      "Consistency is key! We recommend practicing for 15–20 minutes daily for optimal improvement. Even short, regular sessions are more effective than occasional long ones — your History page will show the trend as you build the habit.",
  },
];

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative py-14 sm:py-20" ref={ref}>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Frequently Asked
            <span className="aurora-text"> Questions</span>
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
                  className="border-border bg-card shadow-pop-sm hover:shadow-pop-md overflow-hidden rounded-2xl border-2 px-6 transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5"
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
              href="mailto:piyush.singhal.2004@gmail.com"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Get in touch
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
