"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface AuthFormWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  footer?: {
    text: string;
    linkText: string;
    linkHref: string;
  };
  className?: string;
}

export function AuthFormWrapper({
  children,
  title,
  description,
  footer,
  className,
}: AuthFormWrapperProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "surface-card w-full max-w-md space-y-6 rounded-2xl p-8",
          className,
        )}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>

        {children}

        {footer && (
          <div className="text-muted-foreground text-center text-sm">
            {footer.text}{" "}
            <Link
              href={footer.linkHref}
              className="text-primary font-medium hover:underline focus-visible:underline"
            >
              {footer.linkText}
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
