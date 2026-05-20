import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-w-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-center text-sm font-black uppercase leading-tight tracking-[0.12em] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal/45 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ink text-white shadow-[0_14px_28px_rgba(11,18,32,0.18)] hover:bg-soot",
        saffron: "bg-saffron text-ink shadow-[0_14px_28px_rgba(255,210,63,0.28)] hover:bg-[#ffc928]",
        outline: "border border-royal/30 bg-white text-royal shadow-sm hover:border-royal hover:bg-skywash",
        green: "bg-royal text-white shadow-[0_14px_28px_rgba(11,92,255,0.20)] hover:bg-[#074ad0]",
        ghost: "bg-transparent text-ink hover:bg-skywash hover:text-royal"
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
