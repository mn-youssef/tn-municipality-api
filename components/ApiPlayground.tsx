"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Braces, CircleAlert, LocateFixed, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { API_ORIGIN } from "@/lib/site";
import { Button } from "./ui/button";
import { CopyButton } from "./ui/copy-button";
import { CodeBody, highlightJson } from "./ui/code";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

type Mode = "search" | "nearby";

interface ResponseState {
  ok: boolean;
  status: number | null;
  body: string;
  ms: number;
  bytes: number;
  governorates: number | null;
  localities: number | null;
  error?: string;
}

function buildSearchPath(params: {
  name: string;
  delegation: string;
  postalCode: string;
  sort: string;
}) {
  const query = new URLSearchParams();
  if (params.name) query.set("name", params.name);
  if (params.delegation) query.set("delegation", params.delegation);
  if (params.postalCode) query.set("postalCode", params.postalCode);
  if (params.sort) query.set("sort", params.sort);
  const qs = query.toString();
  return `/api/municipalities${qs ? `?${qs}` : ""}`;
}

function formatBytes(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

function getPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export function ApiPlayground() {
  const t = useTranslations("playground");
  const tCommon = useTranslations("common");
  const tabsId = useId();

  const [mode, setMode] = useState<Mode>("search");
  const [name, setName] = useState("");
  const [delegation, setDelegation] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [sort, setSort] = useState("name");
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseState | null>(null);

  const previewPath =
    mode === "search"
      ? buildSearchPath({ name, delegation, postalCode, sort })
      : `/api/municipalities/near?lat={lat}&lng={lng}&radius=${radius}`;
  const previewUrl = `${API_ORIGIN}${previewPath}`;

  async function run(path: string) {
    const started = performance.now();
    const res = await fetch(path);
    const text = await res.text();
    const ms = Math.round(performance.now() - started);
    let body = text;
    let governorates: number | null = null;
    let localities: number | null = null;
    try {
      const json = JSON.parse(text);
      body = JSON.stringify(json, null, 2);
      if (Array.isArray(json)) {
        governorates = json.length;
        localities = json.reduce(
          (sum: number, g: { Delegations?: unknown[] }) =>
            sum + (g.Delegations?.length ?? 0),
          0,
        );
      }
    } catch {
      // Not JSON: show the raw body.
    }
    setResponse({
      ok: res.ok,
      status: res.status,
      body,
      ms,
      bytes: new TextEncoder().encode(text).length,
      governorates,
      localities,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "search") {
        await run(buildSearchPath({ name, delegation, postalCode, sort }));
      } else {
        let position: GeolocationPosition;
        try {
          position = await getPosition();
        } catch (err) {
          const unsupported =
            err instanceof Error && err.message === "unsupported";
          setResponse({
            ok: false,
            status: null,
            body: "",
            ms: 0,
            bytes: 0,
            governorates: null,
            localities: null,
            error: unsupported
              ? t("geolocationNotSupported")
              : t("geolocationError"),
          });
          return;
        }
        const { latitude, longitude } = position.coords;
        await run(
          `/api/municipalities/near?lat=${latitude}&lng=${longitude}&radius=${radius}`,
        );
      }
    } catch {
      setResponse({
        ok: false,
        status: null,
        body: "",
        ms: 0,
        bytes: 0,
        governorates: null,
        localities: null,
        error: t("requestFailed"),
      });
    } finally {
      setLoading(false);
    }
  }

  const tabs: { id: Mode; label: string }[] = [
    { id: "search", label: t("searchTab") },
    { id: "nearby", label: t("nearbyTab") },
  ];

  return (
    <section
      id="playground"
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-24"
    >
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(15_27_45/0.04),0_16px_40px_-24px_rgb(15_27_45/0.25)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 p-5 sm:p-6"
        >
          <div
            role="tablist"
            aria-label={t("title")}
            className="isolate grid grid-cols-2 rounded-lg bg-muted p-1"
          >
            {tabs.map((tab) => {
              const selected = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`${tabsId}-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`${tabsId}-panel`}
                  onClick={() => setMode(tab.id)}
                  className={cn(
                    "relative h-9 cursor-pointer rounded-md text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/30",
                    selected
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="explorer-tab"
                      className="absolute inset-0 -z-10 rounded-md bg-card shadow-[0_1px_3px_rgb(15_27_45/0.12)]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                      }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            id={`${tabsId}-panel`}
            role="tabpanel"
            aria-labelledby={`${tabsId}-${mode}`}
          >
            {mode === "search" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="name" label={t("governorateName")}>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("governorateNamePlaceholder")}
                    autoComplete="off"
                  />
                </Field>
                <Field id="delegation" label={t("delegation")}>
                  <Input
                    id="delegation"
                    value={delegation}
                    onChange={(e) => setDelegation(e.target.value)}
                    placeholder={t("delegationPlaceholder")}
                    autoComplete="off"
                  />
                </Field>
                <Field id="postalCode" label={t("postalCode")}>
                  <Input
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder={t("postalCodePlaceholder")}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                </Field>
                <Field id="sortBy" label={t("sortBy")}>
                  <Select
                    id="sortBy"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="name">{t("sortByName")}</option>
                    <option value="nameAr">{t("sortByNameAr")}</option>
                  </Select>
                </Field>
              </div>
            ) : (
              <div className="grid gap-4">
                <Field id="radius" label={t("radius")}>
                  <Input
                    id="radius"
                    type="number"
                    min={1}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="sm:max-w-40"
                  />
                </Field>
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <LocateFixed className="mt-0.5 size-4 shrink-0" />
                  {t("nearbyHint")}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium">{t("requestUrl")}</p>
            <div className="mt-2 flex items-start gap-2 rounded-lg border border-border bg-muted/50 py-2 ps-3 pe-1">
              <code
                dir="ltr"
                className="min-w-0 flex-1 py-1 text-left font-mono text-[12.5px] leading-5 break-all text-foreground"
              >
                {previewUrl}
              </code>
              <CopyButton
                value={previewUrl}
                label={t("copyUrl")}
                copiedLabel={tCommon("copied")}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="mt-auto w-full sm:w-auto sm:self-start"
          >
            {loading
              ? t("loading")
              : mode === "search"
                ? t("send")
                : t("getNearbyMunicipalities")}
            {!loading && <Send data-nudge="" className="rtl:-scale-x-100" />}
          </Button>
        </form>

        <div className="flex min-h-[420px] min-w-0 flex-col bg-code text-code-foreground">
          <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-code-border px-4 py-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
              <span className="font-medium">{t("apiResponse")}</span>
              <AnimatePresence mode="wait">
                {response && !response.error && (
                  <motion.span
                    key={`${response.status}-${response.ms}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    dir="ltr"
                    className="flex items-center gap-3 font-mono text-[12px] text-code-muted"
                  >
                    <span
                      className={cn(
                        "flex items-center gap-1.5 font-medium",
                        response.ok ? "text-code-number" : "text-code-error",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          response.ok ? "bg-code-number" : "bg-code-error",
                        )}
                      />
                      {response.status}
                    </span>
                    <span>{response.ms} ms</span>
                    <span>{formatBytes(response.bytes)}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {response?.body && (
              <CopyButton
                tone="dark"
                value={response.body}
                label={t("copyResponse")}
                copiedLabel={tCommon("copied")}
              />
            )}
          </div>

          {response?.governorates != null && (
            <p className="border-b border-code-border px-4 py-2 text-[13px] text-code-muted">
              {t("resultSummary", {
                governorates: response.governorates,
                localities: response.localities ?? 0,
              })}
            </p>
          )}

          <div className="relative min-h-0 flex-1">
            {response?.error ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
                <CircleAlert className="size-6 text-code-error" />
                <p className="max-w-sm text-sm text-code-foreground">
                  {response.error}
                </p>
              </div>
            ) : response ? (
              <CodeBody
                aria-busy={loading}
                className={cn(
                  "absolute inset-0 transition-opacity duration-200",
                  loading && "opacity-50",
                )}
              >
                {highlightJson(response.body)}
              </CodeBody>
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
                <Braces className="size-6 text-code-muted" />
                <p className="max-w-xs text-sm text-code-muted">
                  {t("apiResponsePlaceholder")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
