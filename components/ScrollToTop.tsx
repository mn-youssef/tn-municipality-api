"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { useScrolledPast } from "@/lib/use-scrolled-past";

export function ScrollToTop() {
  const t = useTranslations("nav");
  const visible = useScrolledPast(560);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label={t("backToTop")}
          onClick={() => window.scrollTo({ top: 0 })}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          className="group fixed end-4 bottom-4 z-40 grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-[0_8px_24px_-12px_rgb(15_27_45/0.35)] backdrop-blur-md transition-[box-shadow,border-color] duration-200 outline-none hover:border-foreground/20 hover:shadow-[0_14px_32px_-14px_rgb(15_27_45/0.45)] focus-visible:ring-[3px] focus-visible:ring-ring/30 md:end-6 md:bottom-20"
        >
          <ArrowUp className="size-[18px] transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
