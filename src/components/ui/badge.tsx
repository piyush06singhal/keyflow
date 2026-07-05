import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary shadow-key-xs",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-key-xs",
        destructive:
          "border-transparent bg-destructive/10 text-destructive shadow-key-xs",
        success: "border-transparent bg-success/10 text-success shadow-key-xs",
        warning: "border-transparent bg-warning/10 text-warning shadow-key-xs",
        outline: "text-foreground border-border",
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
