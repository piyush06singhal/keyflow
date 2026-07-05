"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#coding", label: "Coding Practice" },
  { href: "#analytics", label: "Analytics" },
  { href: "#ai", label: "AI Coach" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-border/30 bg-background/85 shadow-key-sm border-b backdrop-blur-2xl"
          : "bg-transparent",
      )}
    >
      <nav className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="hover:text-primary flex items-center gap-2.5 text-xl font-bold tracking-tight transition-colors duration-200"
        >
          <div className="bg-primary text-primary-foreground shadow-key-sm flex h-9 w-9 items-center justify-center rounded-xl">
            <Keyboard className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">KeyFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild className="rounded-xl">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild className="rounded-xl">
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild className="shadow-key-sm rounded-xl">
            <Link href="#hero">Start Typing</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-muted-foreground hover:bg-accent/60 hover:text-foreground flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="border-border/30 bg-background/90 border-t backdrop-blur-2xl md:hidden"
          >
            <div className="container mx-auto space-y-4 px-4 py-6">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground block text-base font-medium transition-colors duration-200"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-2.5 pt-4">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start rounded-xl"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start rounded-xl"
                >
                  <Link href="/register">Register</Link>
                </Button>
                <Button asChild className="w-full justify-start rounded-xl">
                  <Link href="#hero">Start Typing</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
