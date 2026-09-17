"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Brain, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AI_TASKS,
  LLMS_TXT_URL,
  buildPrompt,
  getTaskText,
  type AiTask,
} from "@/lib/ai";
import { Button } from "./ui/button";
import { CopyButton } from "./ui/copy-button";

const assistants = [
  {
    name: "ChatGPT",
    url: (prompt: string) =>
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  },
  {
    name: "Claude",
    url: (prompt: string) =>
      `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
];

export function AiSection() {
  const t = useTranslations("ai");
  const tCommon = useTranslations("common");
  const locale = usePathname().startsWith("/ar") ? "ar" : "en";
  const previewId = useId();
  const [task, setTask] = useState<AiTask>("address");
  const [previewOpen, setPreviewOpen] = useState(false);

  const prompt = buildPrompt(task, locale);
  const taskText = getTaskText(task);
  const taskStart = prompt.indexOf(taskText);

  return (
    <section id="ai" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 md:pb-24">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(15_27_45/0.04)]">
        <div className="flex flex-col gap-5 p-4 sm:p-6">
          {/* Mobile: icon and title share a row, the description runs full width below. */}
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:gap-x-3.5 sm:gap-y-1">
            <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
              <Brain className="size-[18px]" strokeWidth={1.75} />
            </span>
            <h2 className="text-lg leading-snug font-semibold tracking-tight sm:self-center">
              {t("title")}
            </h2>
            <p className="col-span-2 max-w-[70ch] text-sm leading-relaxed text-muted-foreground sm:col-span-1 sm:col-start-2">
              {t("description")}
            </p>
            <LlmsLink className="hidden sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:flex" />
          </div>

          <fieldset className="min-w-0">
            <legend className="sr-only">{t("taskLabel")}</legend>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {AI_TASKS.map((key) => (
                <label key={key} className="cursor-pointer">
                  <input
                    type="radio"
                    name="ai-task"
                    value={key}
                    checked={task === key}
                    onChange={() => setTask(key)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-10 w-full items-center justify-center rounded-full border border-border bg-background px-2.5 py-1 text-center text-[13px] leading-tight font-medium text-muted-foreground transition-[background-color,border-color,color,scale] duration-200 select-none peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/30 hover:border-foreground/25 hover:text-foreground active:scale-[0.97] sm:min-h-8 sm:w-auto sm:px-3 sm:whitespace-nowrap">
                    {t(`tasks.${key}`)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-2">
            <CopyButton
              value={prompt}
              label={t("copyPrompt")}
              copiedLabel={tCommon("copied")}
              showLabel
              variant="default"
              size="default"
              className="w-full sm:w-auto"
            />
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
              {assistants.map((assistant) => (
                <Button key={assistant.name} asChild variant="outline">
                  <a
                    href={assistant.url(prompt)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("openIn", { app: assistant.name })}
                    <ArrowUpRight
                      data-nudge=""
                      className="text-muted-foreground"
                    />
                  </a>
                </Button>
              ))}
            </div>
            <div className="flex w-full items-center justify-between gap-2 sm:ms-auto sm:w-auto">
              <Button
                variant="ghost"
                className="-ms-2 sm:ms-0"
                aria-expanded={previewOpen}
                aria-controls={previewId}
                onClick={() => setPreviewOpen((open) => !open)}
              >
                {previewOpen ? t("hidePrompt") : t("showPrompt")}
                <ChevronDown
                  className={cn(
                    "transition-transform duration-200",
                    previewOpen && "rotate-180",
                  )}
                />
              </Button>
              <LlmsLink className="flex sm:hidden" />
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {previewOpen && (
            <motion.div
              id={previewId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              className="overflow-hidden border-t border-border bg-background"
            >
              <pre
                dir="ltr"
                className="max-h-72 overflow-auto p-4 text-left font-mono text-xs leading-6 break-words whitespace-pre-wrap text-muted-foreground sm:px-6 sm:py-5 sm:text-[12.5px]"
              >
                {prompt.slice(0, taskStart)}
                <mark className="rounded bg-secondary px-1 py-0.5 text-secondary-foreground [box-decoration-break:clone]">
                  {taskText}
                </mark>
                {prompt.slice(taskStart + taskText.length)}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function LlmsLink({ className }: { className?: string }) {
  const t = useTranslations("ai");
  const tCommon = useTranslations("common");

  return (
    <div
      className={cn(
        "shrink-0 items-center gap-0.5 self-start rounded-lg border border-border ps-3",
        className,
      )}
    >
      <a
        href="/llms.txt"
        target="_blank"
        title={t("llmsDescription")}
        className="font-mono text-[13px] font-medium text-primary underline-offset-4 hover:underline"
      >
        llms.txt
      </a>
      <CopyButton
        value={LLMS_TXT_URL}
        label={t("copyLlmsUrl")}
        copiedLabel={tCommon("copied")}
      />
    </div>
  );
}
