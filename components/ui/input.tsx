import * as React from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-cwi-border bg-cwi-card px-4 py-3 text-sm text-cwi-ink outline-none transition placeholder:text-cwi-ink/40 focus:border-cwi-green focus:ring-4 focus:ring-cwi-green/10";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(inputClass, className)} {...props} />
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(inputClass, "min-h-36 resize-y", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
