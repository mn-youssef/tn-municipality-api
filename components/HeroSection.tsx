"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { BookOpen, SquareTerminal } from "lucide-react";

import { API_ORIGIN } from "@/lib/site";
import { Button } from "./ui/button";
import { CopyButton } from "./ui/copy-button";
import { CodeBody, CodePanel, highlightJson } from "./ui/code";

const sampleRequest = "/api/municipalities?postalCode=2058";

const sampleResponse = `[
  {
    "Name": "ARIANA",
    "NameAr": "أريانة",
    "Value": "ARIANA",
    "Delegations": [
      {
        "Name": "ARIANA VILLE (Residence Kortoba)",
        "NameAr": "أريانة المدينة (إقامة قرطبة)",
        "Value": "ARIANA VILLE",
        "PostalCode": "2058",
        "Latitude": 36.866011,
        "Longitude": 10.193923
      },`;

const ease = [0.2, 0, 0, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function HeroSection() {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const baseUrl = `${API_ORIGIN}/api/municipalities`;

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-border pt-28 pb-16 sm:pt-32 lg:pb-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.h1
            variants={item}
            className="max-w-[14ch] text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-[3.6rem]"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            {t("description")}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#playground">
                <SquareTerminal />
                {t("primaryButton")}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <a href="#docs">
                <BookOpen />
                {t("secondaryButton")}
              </a>
            </Button>
          </motion.div>

          <motion.div variants={item} className="mt-10 max-w-xl">
            <p className="text-sm font-medium text-foreground">
              {t("baseUrl")}
            </p>
            <div className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-border bg-card ps-3 pe-1 shadow-[0_1px_2px_rgb(15_27_45/0.04)]">
              <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] font-medium text-secondary-foreground">
                GET
              </span>
              <code
                dir="ltr"
                className="min-w-0 flex-1 truncate text-left font-mono text-[13px] text-foreground"
              >
                {baseUrl}
              </code>
              <CopyButton
                value={baseUrl}
                label={tCommon("copy")}
                copiedLabel={tCommon("copied")}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t("note")}</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="min-w-0"
        >
          <CodePanel
            header={
              <>
                <div dir="ltr" className="flex min-w-0 items-center gap-2">
                  <span className="rounded bg-code-number/15 px-1.5 py-0.5 font-mono text-[11px] font-medium text-code-number">
                    GET
                  </span>
                  <code className="truncate font-mono text-[13px] text-code-foreground">
                    {sampleRequest}
                  </code>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 font-mono text-[12px] text-code-muted">
                  <span className="size-1.5 rounded-full bg-code-number" />
                  200
                </span>
              </>
            }
          >
            <div className="relative">
              <CodeBody className="max-h-[280px] overflow-hidden sm:max-h-[400px]">
                {highlightJson(sampleResponse)}
              </CodeBody>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-code to-transparent" />
            </div>
          </CodePanel>
        </motion.div>
      </div>
    </section>
  );
}
