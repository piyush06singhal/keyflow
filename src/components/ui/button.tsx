import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-2 border-border bg-primary text-primary-foreground shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-md active:translate-x-0 active:translate-y-0 active:shadow-pop-press",
        destructive:
          "border-2 border-border bg-destructive text-destructive-foreground shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-md active:translate-x-0 active:translate-y-0 active:shadow-pop-press",
        outline:
          "border-2 border-border bg-background text-foreground shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-pop-md active:translate-x-0 active:translate-y-0 active:shadow-pop-press",
        secondary:
          "border-2 border-border bg-secondary text-secondary-foreground shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-secondary/70 hover:shadow-pop-md active:translate-x-0 active:translate-y-0 active:shadow-pop-press",
        ghost:
          "hover:bg-secondary hover:text-foreground active:scale-[0.97] rounded-full",
        link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
