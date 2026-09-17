"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";

import { REPO_URL } from "@/lib/site";
import { useScrolledPast } from "@/lib/use-scrolled-past";
import { GitHubIcon } from "./icons/GitHubIcon";

interface StickyGitHubButtonProps {
  repoUrl?: string;
}

export function StickyGitHubButton({
  repoUrl = REPO_URL,
}: StickyGitHubButtonProps) {
  const t = useTranslations("nav");
  const visible = useScrolledPast(560);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          className="group fixed end-6 bottom-6 z-40 hidden h-11 items-center gap-2 rounded-full border border-border bg-card/90 ps-3.5 pe-4 text-sm font-medium text-foreground shadow-[0_8px_24px_-12px_rgb(15_27_45/0.35)] backdrop-blur-md transition-[box-shadow,border-color,translate] duration-200 outline-none hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_14px_32px_-14px_rgb(15_27_45/0.45)] focus-visible:ring-[3px] focus-visible:ring-ring/30 active:translate-y-0 md:flex"
        >
          <GitHubIcon size={18} />
          {t("star")}
          <Star
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-[color,fill,rotate] duration-300 group-hover:rotate-[72deg] group-hover:fill-amber-400 group-hover:text-amber-500 motion-reduce:group-hover:rotate-0"
          />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
