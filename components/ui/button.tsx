import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-w-0 items-center justify-center gap-2 rounded-md px-5 py-3 text-center text-sm font-black uppercase leading-tight tracking-[0.12em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cwi-green/45 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-cwi-green text-white shadow-[0_14px_28px_var(--cwi-shadow-soft)] hover:brightness-110",
        saffron: "bg-cwi-saffron text-[#0a0d14] shadow-[0_14px_28px_var(--cwi-shadow-soft)] hover:brightness-105",
        outline: "border border-cwi-border bg-cwi-card text-cwi-green shadow-sm hover:border-cwi-green/45 hover:bg-cwi-muted",
        green: "bg-cwi-green text-white shadow-[0_14px_28px_var(--cwi-shadow-soft)] hover:brightness-110",
        ghost: "bg-transparent text-cwi-ink hover:bg-cwi-muted/60 hover:text-cwi-green"
      },
      size: {
        default: "min-h-12",
        sm: "min-h-10 px-4 text-xs",
        lg: "min-h-14 px-7 text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
