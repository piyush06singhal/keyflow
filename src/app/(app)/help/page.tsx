"use client";

import { useState } from "react";
import { PageContainer } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, HelpCircle, Mail } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  category: "typing" | "coding" | "data";
}

const FAQS: FAQ[] = [
  {
    question: "How is WPM calculated?",
    answer:
      'Net WPM is calculated by dividing total characters typed by 5 (one "word"), subtracting uncorrected errors, and dividing by practice duration in minutes.',
    category: "typing",
  },
  {
    question: "How do I toggle click sound effects?",
    answer:
      "Go to Settings > Typing and toggle sound effects. Make sure your browser tab isn't muted.",
    category: "typing",
  },
  {
    question: "Where does my practice data live?",
    answer:
      "Entirely in your browser's local storage — there's no account and nothing is sent to a server. Clearing your browser data clears your KeyFlow history too.",
    category: "data",
  },
  {
    question: "What programming languages can I practice?",
    answer:
      "JavaScript, TypeScript, Python, Java, C, C++, Go, Rust, SQL, HTML, CSS, JSON, Markdown, Bash, Docker, and YAML, with AI-generated snippets on top of a curated library.",
    category: "coding",
  },
  {
    question: "How do I switch keyboard layout or duration defaults?",
    answer:
      "Go to Settings > Typing or Settings > Coding — your defaults are saved locally and applied the next time you start a session.",
    category: "typing",
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground text-sm">
            Quick answers about typing mechanics, coding practice, and your data.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-1.5 text-base font-bold">
                  <HelpCircle className="text-primary h-4.5 w-4.5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Quick troubleshooting and how-tos</CardDescription>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  placeholder="Search FAQs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 rounded-xl pl-9 text-xs font-semibold"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {filteredFaqs.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-xs font-semibold">
                No FAQs found matching your query.
              </p>
            ) : (
              filteredFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border-border-subtle space-y-1.5 border-b-2 pb-4 last:border-0 last:pb-0"
                >
                  <h4 className="text-foreground flex items-center gap-2 text-sm font-bold">
                    <Badge
                      variant="outline"
                      className="px-2 py-0 font-mono text-[9px] uppercase"
                    >
                      {faq.category}
                    </Badge>
                    {faq.question}
                  </h4>
                  <p className="text-muted-foreground pl-14 text-xs leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Mail className="text-primary h-6 w-6" />
            <p className="text-sm font-semibold">Still stuck?</p>
            <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
              Reach out directly and we&apos;ll get back to you.
            </p>
            <a
              href="mailto:piyush.singhal.2004@gmail.com"
              className="text-primary text-sm font-semibold hover:underline"
            >
              piyush.singhal.2004@gmail.com
            </a>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
