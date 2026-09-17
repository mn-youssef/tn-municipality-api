import * as React from "react";

import { cn } from "@/lib/utils";

export const fieldClassName = cn(
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base text-foreground shadow-[0_1px_2px_rgb(15_27_45/0.04)] outline-none md:text-sm",
  "transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/80",
  "hover:border-foreground/25 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/15",
);

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldClassName, className)}
      {...props}
    />
  );
}

export { Input };
