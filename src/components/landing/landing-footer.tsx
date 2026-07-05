"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Keyboard, Mail } from "lucide-react";
import { useState } from "react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Coding Practice", href: "#coding" },
    { label: "Analytics", href: "#analytics" },
    { label: "AI Coach", href: "#ai" },
    { label: "Pricing", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
    { label: "Status", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Licenses", href: "#" },
  ],
};

export function LandingFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="border-border/50 bg-card/30 relative border-t backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-bold">
              <div className="bg-primary text-primary-foreground shadow-key-md flex h-9 w-9 items-center justify-center rounded-lg">
                <Keyboard className="h-5 w-5" />
              </div>
              <span>KeyFlow</span>
            </Link>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Master typing and coding at lightning speed with AI-powered coaching,
              real-time analytics, and personalized learning paths.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Stay Updated</h3>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  disabled={subscribed}
                  required
                />
                <Button
                  type="submit"
                  disabled={subscribed}
                  className="whitespace-nowrap"
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>
              <p className="text-muted-foreground text-xs">
                Get updates about new features and tips to improve your typing speed.
              </p>
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-border/50 mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} KeyFlow. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
              aria-label="GitHub"
              title="GitHub"
            >
              <span className="text-sm font-semibold">💻</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
              aria-label="Twitter"
              title="Twitter"
            >
              <span className="text-sm font-semibold">𝕏</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <span className="text-sm font-semibold">in</span>
            </a>
            <a
              href="mailto:piyush.singhal.2004@gmail.com"
              className="border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
              aria-label="Email"
              title="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
