"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

import { cn } from "@/lib/utils";
import { buildLlmsTxt } from "@/lib/ai";
import { API_ORIGIN } from "@/lib/site";
import { CopyButton } from "./ui/copy-button";
import {
  CodeBody,
  CodePanel,
  highlightJson,
  highlightSnippet,
} from "./ui/code";

const endpoints = [
  { path: "/api/municipalities", key: "list" },
  { path: "/api/municipalities/near", key: "near" },
] as const;

const parameters = [
  { name: "search", type: "string", key: "search", endpoint: 0 },
  { name: "name", type: "string", key: "name", endpoint: 0 },
  { name: "delegation", type: "string", key: "delegation", endpoint: 0 },
  { name: "postalCode", type: "string", key: "postalCode", endpoint: 0 },
  { name: "sort", type: "name | nameAr", key: "sort", endpoint: 0 },
  { name: "order", type: "asc | desc", key: "order", endpoint: 0 },
  { name: "lat, lng, radius", type: "number", key: "location", endpoint: 1 },
] as const;

const examples = [
  { key: "getAllMunicipalities", query: "" },
  { key: "filterByGovernorate", query: "?name=ariana" },
  { key: "filterByDelegation", query: "?delegation=ville" },
  { key: "filterByPostalCode", query: "?postalCode=2058" },
  { key: "combineFilters", query: "?name=ariana&delegation=ville" },
] as const;

const languages = ["cURL", "JavaScript", "Python"] as const;
type Language = (typeof languages)[number];

function snippet(language: Language, url: string) {
  switch (language) {
    case "cURL":
      return `curl "${url}"`;
    case "JavaScript":
      return `const res = await fetch("${url}");
const municipalities = await res.json();`;
    case "Python":
      return `import requests

municipalities = requests.get("${url}").json()
print(len(municipalities))`;
  }
}

const sections = [
  { id: "docs-endpoints", key: "endpoints.title" },
  { id: "docs-parameters", key: "parameters.title" },
  { id: "docs-examples", key: "examples.title" },
  { id: "docs-response", key: "response.title" },
] as const;

export function DocumentationSection({
  exampleResponse,
  counts,
}: {
  exampleResponse: string;
  counts: Parameters<typeof buildLlmsTxt>[0];
}) {
  const t = useTranslations("documentation");
  const tCommon = useTranslations("common");
  const tAi = useTranslations("ai");
  const [exampleIndex, setExampleIndex] = useState(1);
  const [language, setLanguage] = useState<Language>("cURL");

  const exampleUrl = `${API_ORIGIN}/api/municipalities${examples[exampleIndex].query}`;
  const code = snippet(language, exampleUrl);

  return (
    <section id="docs" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
            {t("title")}
          </h2>
          <CopyButton
            value={buildLlmsTxt(counts)}
            label={tAi("docsButton")}
            copiedLabel={tCommon("copied")}
            icon={Brain}
            showLabel
            variant="outline"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label={t("onThisPage")} className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-sm font-medium">{t("onThisPage")}</p>
              <ul className="mt-3 flex flex-col gap-1 border-s border-border">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ms-px block border-s border-transparent py-1 ps-4 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      {t(section.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="flex min-w-0 flex-col gap-16">
            <DocBlock id="docs-endpoints" title={t("endpoints.title")}>
              <div className="flex flex-col gap-3">
                {endpoints.map((endpoint) => (
                  <div
                    key={endpoint.path}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-border bg-card py-2 ps-4 pe-2"
                  >
                    <div dir="ltr" className="flex min-w-0 items-center gap-3">
                      <MethodBadge />
                      <code className="truncate font-mono text-sm font-medium">
                        {endpoint.path}
                      </code>
                    </div>
                    <span className="order-last w-full pb-1 text-sm text-muted-foreground sm:order-none sm:w-auto sm:flex-1 sm:pb-0">
                      {t(`endpoints.${endpoint.key}`)}
                    </span>
                    <CopyButton
                      className="ms-auto sm:ms-0"
                      value={`${API_ORIGIN}${endpoint.path}`}
                      label={tCommon("copy")}
                      copiedLabel={tCommon("copied")}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {t("endpoints.baseUrl")}
                <code
                  dir="ltr"
                  className="rounded-md bg-muted px-2 py-0.5 font-mono text-[13px] text-foreground"
                >
                  {API_ORIGIN}
                </code>
              </p>
            </DocBlock>

            <DocBlock
              id="docs-parameters"
              title={t("parameters.title")}
              description={t("parameters.description")}
            >
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="hidden grid-cols-[170px_130px_minmax(0,1fr)] gap-4 border-b border-border bg-muted/50 px-5 py-2.5 text-xs font-medium text-muted-foreground md:grid">
                  <span>{t("parameters.table.parameter")}</span>
                  <span>{t("parameters.table.type")}</span>
                  <span>{t("parameters.table.description")}</span>
                </div>
                <ul className="divide-y divide-border">
                  {parameters.map((param) => (
                    <li
                      key={param.key}
                      className="grid gap-x-4 gap-y-1.5 px-5 py-4 md:grid-cols-[170px_130px_minmax(0,1fr)]"
                    >
                      <code
                        dir="ltr"
                        className="justify-self-start font-mono text-sm font-medium text-primary rtl:justify-self-end md:rtl:justify-self-start"
                      >
                        {param.name}
                      </code>
                      <code
                        dir="ltr"
                        className="justify-self-start font-mono text-xs text-muted-foreground rtl:justify-self-end md:pt-0.5 md:rtl:justify-self-start"
                      >
                        {param.type}
                      </code>
                      <div className="min-w-0">
                        <p className="text-sm leading-relaxed">
                          {t(`parameters.${param.key}.description`)}
                        </p>
                        <code
                          dir="ltr"
                          className="mt-2 block truncate text-left font-mono text-xs text-muted-foreground"
                        >
                          {endpoints[param.endpoint].path}
                          {t(`parameters.${param.key}.example`)}
                        </code>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </DocBlock>

            <DocBlock id="docs-examples" title={t("examples.title")}>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={example.key}
                    type="button"
                    aria-pressed={index === exampleIndex}
                    onClick={() => setExampleIndex(index)}
                    className={cn(
                      "h-8 cursor-pointer rounded-full border px-3 text-[13px] font-medium outline-none transition-[background-color,border-color,color,scale] duration-200 active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-ring/30",
                      index === exampleIndex
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                    )}
                  >
                    {t(`examples.${example.key}`)}
                  </button>
                ))}
              </div>

              <CodePanel
                className="mt-4"
                header={
                  <>
                    <div
                      role="tablist"
                      aria-label={t("examples.title")}
                      dir="ltr"
                      className="isolate flex items-center gap-1"
                    >
                      {languages.map((lang) => {
                        const selected = lang === language;
                        return (
                          <button
                            key={lang}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setLanguage(lang)}
                            className={cn(
                              "relative h-7 cursor-pointer rounded-md px-2.5 text-[13px] font-medium outline-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-white/30",
                              selected
                                ? "text-code-foreground"
                                : "text-code-muted hover:text-code-foreground",
                            )}
                          >
                            {selected && (
                              <motion.span
                                layoutId="docs-language"
                                className="absolute inset-0 -z-10 rounded-md bg-white/10"
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 40,
                                }}
                              />
                            )}
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                    <CopyButton
                      tone="dark"
                      value={code}
                      label={tCommon("copy")}
                      copiedLabel={tCommon("copied")}
                    />
                  </>
                }
              >
                <CodeBody>{highlightSnippet(code)}</CodeBody>
              </CodePanel>
            </DocBlock>

            <DocBlock id="docs-response" title={t("response.title")}>
              <CodePanel
                header={
                  <>
                    <span
                      dir="ltr"
                      className="flex items-center gap-2 font-mono text-[12px] text-code-muted"
                    >
                      <span className="size-1.5 rounded-full bg-code-number" />
                      200 application/json
                    </span>
                    <CopyButton
                      tone="dark"
                      value={exampleResponse}
                      label={tCommon("copy")}
                      copiedLabel={tCommon("copied")}
                    />
                  </>
                }
              >
                <CodeBody className="max-h-96">
                  {highlightJson(exampleResponse)}
                </CodeBody>
              </CodePanel>
            </DocBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function DocBlock({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 max-w-[65ch] text-muted-foreground">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function MethodBadge() {
  return (
    <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[11px] font-semibold text-secondary-foreground">
      GET
    </span>
  );
}
