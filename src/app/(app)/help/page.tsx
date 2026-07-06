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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, HelpCircle, MessageSquare, Send } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  category: "typing" | "coding" | "ai" | "account";
}

const FAQS: FAQ[] = [
  {
    question: "How is Net WPM calculated?",
    answer:
      "Net WPM (Words Per Minute) is calculated by dividing total characters typed by 5, then subtracting uncorrected errors, and dividing by practice duration in minutes.",
    category: "typing",
  },
  {
    question: "How do sound effects trigger on correct keypresses?",
    answer:
      "You can toggle click sound effects under Settings > Typing. Make sure your browser volume is active and tab sound permissions are allowed.",
    category: "typing",
  },
  {
    question: "How does the AI Coach diagnostic operate?",
    answer:
      "The AI Coach runs heuristic parsing algorithms on completed practice logs to compile commonly typed typos, key delay periods, and recommend target practice suites.",
    category: "ai",
  },
  {
    question: "Can I connect my GitHub profile to pull actual repositories?",
    answer:
      "Currently, you can practice coding snippets from pre-built popular repositories. In future milestones, you can authenticate and pull your personal scripts.",
    category: "coding",
  },
  {
    question: "How do I configure Dvorak or Colemak layouts?",
    answer:
      "Go to Preferences & Settings > Typing Practice, and choose your layout from the dropdown options. The virtual keyboard heatmap will update immediately.",
    category: "typing",
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMsg.trim()) return;
    setTicketStatus("Submitting ticket...");
    setTimeout(() => {
      setTicketStatus("Ticket received! We will respond within 24 hours.");
      setTicketMsg("");
      setTimeout(() => setTicketStatus(null), 4000);
    }, 1000);
  };

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground text-sm">
            Search typing FAQ databases, review layouts, and submit custom technical
            support tickets.
          </p>
        </div>

        {/* Action Splitting */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* FAQ list section */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="surface-card">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-base font-bold">
                      <HelpCircle className="text-primary h-4.5 w-4.5" />
                      Frequently Asked Questions
                    </CardTitle>
                    <CardDescription>Quick troubleshooting tutorials</CardDescription>
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
                      className="space-y-1.5 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <h4 className="text-foreground flex items-center gap-2 text-sm font-bold">
                        <Badge
                          variant="outline"
                          className="rounded-md px-1.5 py-0 font-mono text-[9px] uppercase"
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
          </div>

          {/* Ticket support sidebar */}
          <div className="space-y-6">
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
                  <MessageSquare className="text-primary h-4.5 w-4.5" />
                  Submit Support Ticket
                </CardTitle>
                <CardDescription>
                  Experiencing technical layout errors? Reach out to support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <Input
                    type="email"
                    value="piyush@example.com"
                    disabled
                    className="bg-muted/40 h-9.5 cursor-not-allowed rounded-xl text-xs font-semibold"
                  />
                  <Input
                    placeholder="Subject Summary"
                    className="h-9.5 rounded-xl text-xs font-semibold"
                    required
                  />
                  <textarea
                    placeholder="Describe your issue or layout concern..."
                    rows={4}
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    required
                    className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-xl border bg-transparent px-3 py-2 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl"
                  >
                    <Send className="h-4 w-4" />
                    Submit Ticket
                  </Button>
                  {ticketStatus && (
                    <div className="text-primary bg-primary/5 border-primary/20 rounded-lg border p-2.5 text-[10px] font-bold">
                      {ticketStatus}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
