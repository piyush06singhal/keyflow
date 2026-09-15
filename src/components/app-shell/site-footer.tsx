import Link from "next/link";
import { Keyboard, Mail, ExternalLink, ShieldCheck } from "lucide-react";

const footerLinks = {
  practice: [
    { label: "Typing Practice", href: "/practice" },
    { label: "Coding Practice", href: "/practice/code/dashboard" },
    { label: "Daily Challenge", href: "/challenges" },
    { label: "Practice History", href: "/practice/history" },
  ],
  learn: [
    { label: "Guides", href: "/guides" },
    { label: "About", href: "/about" },
    { label: "Help", href: "/help" },
  ],
};

/** Shared footer used on the landing page and every app page. */
export function SiteFooter() {
  return (
    <footer className="border-border bg-card relative border-t-2">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link
              href="/"
              className="font-display mb-3 flex items-center gap-2 text-base"
            >
              <div className="border-border bg-primary text-primary-foreground shadow-pop-sm flex h-8 w-8 items-center justify-center rounded-xl border-2">
                <Keyboard className="h-4 w-4" />
              </div>
              <span>KeyFlow</span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              A local-first typing and coding practice arena. No accounts, no tracking —
              your stats stay on your device.
            </p>
            <div className="text-muted-foreground mt-4 flex items-center gap-1.5 text-xs font-medium">
              <ShieldCheck className="text-success h-3.5 w-3.5" />
              <span>Nothing you type is ever sent to a server</span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold">Practice</h3>
            <ul className="space-y-2">
              {footerLinks.practice.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold">Learn</h3>
            <ul className="space-y-2">
              {footerLinks.learn.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border-subtle mt-6 flex flex-col items-center justify-between gap-3 border-t-2 pt-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} KeyFlow.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/piyush06singhal/keyflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="mailto:piyush.singhal.2004@gmail.com"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
            >
              <Mail className="h-4 w-4" />
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
