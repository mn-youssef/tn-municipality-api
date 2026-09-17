"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, type LucideIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./button";

interface CopyButtonProps {
  value: string;
  label: string;
  copiedLabel: string;
  /** Show the label next to the icon instead of only using it as aria-label. */
  showLabel?: boolean;
  tone?: "light" | "dark";
  icon?: LucideIcon;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

export function CopyButton({
  value,
  label,
  copiedLabel,
  showLabel = false,
  tone = "light",
  icon: Icon = Copy,
  variant = "ghost",
  size,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const quiet = variant === "ghost";

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? (showLabel ? "sm" : "icon-sm")}
      onClick={copy}
      aria-label={showLabel ? undefined : copied ? copiedLabel : label}
      className={cn(
        tone === "dark" &&
          "text-code-muted hover:bg-white/10 hover:text-code-foreground focus-visible:ring-white/30",
        quiet &&
          copied &&
          (tone === "dark" ? "text-code-number" : "text-success"),
        className,
      )}
    >
      <span className="relative grid size-4 place-items-center">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={copied ? "check" : "copy"}
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
          >
            {copied ? <Check /> : <Icon />}
          </motion.span>
        </AnimatePresence>
      </span>
      {showLabel && <span>{copied ? copiedLabel : label}</span>}
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </Button>
  );
}
