import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-2.5 py-0.5 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default: "border-border bg-primary text-primary-foreground shadow-pop-sm",
        secondary: "border-border bg-secondary text-secondary-foreground shadow-pop-sm",
        destructive:
          "border-border bg-destructive text-destructive-foreground shadow-pop-sm",
        success: "border-border bg-success text-white shadow-pop-sm",
        warning: "border-border bg-warning text-white shadow-pop-sm",
        outline: "text-foreground border-border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
