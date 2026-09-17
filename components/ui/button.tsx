import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium select-none outline-none",
    "transition-[background-color,border-color,color,box-shadow,scale] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
    "active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-ring/30",
    "disabled:pointer-events-none disabled:opacity-55 aria-busy:cursor-progress",
    "motion-reduce:transition-none motion-reduce:active:scale-100",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // Icons marked data-nudge slide a little toward the reading direction on hover.
    "[&_[data-nudge]]:transition-transform [&_[data-nudge]]:duration-200 hover:[&_[data-nudge]]:translate-x-0.5 rtl:hover:[&_[data-nudge]]:-translate-x-0.5",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(15_27_45/0.18)]",
          "hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_20px_-8px_rgb(31_79_209/0.65)]",
        ],
        ink: [
          "bg-foreground text-background",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(15_27_45/0.2)]",
          "hover:bg-[color-mix(in_srgb,var(--foreground)_86%,white)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_8px_20px_-8px_rgb(15_27_45/0.5)]",
        ],
        outline: [
          "border border-border bg-card text-foreground shadow-[0_1px_2px_rgb(15_27_45/0.05)]",
          "hover:border-foreground/20 hover:bg-muted/60",
        ],
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_srgb,var(--secondary)_85%,var(--primary))]",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive text-white hover:bg-[color-mix(in_srgb,var(--destructive)_88%,black)]",
        link: "h-auto px-0 text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-md px-3 text-[13px]",
        default: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-[15px]",
        icon: "size-10",
        "icon-sm": "size-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Shows a spinner, disables the button and sets aria-busy. */
    loading?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export { Button, buttonVariants };
