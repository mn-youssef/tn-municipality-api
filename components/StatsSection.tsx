"use client";

import { useTranslations } from "next-intl";
import { Building2, Landmark, MapPin, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DataStats } from "@/lib/stats";

export function StatsSection({ stats }: { stats: DataStats }) {
  const t = useTranslations("stats");
  const { sample } = stats;
  const format = (n: number) => n.toLocaleString("en-US");

  const counts = [
    { label: t("governorates"), value: stats.governorates },
    { label: t("delegations"), value: stats.delegations },
    { label: t("localities"), value: stats.localities },
    { label: t("postalCodes"), value: stats.postalCodes },
  ];

  const [firstDelegation, secondDelegation] = sample.delegations;

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.025em] text-balance sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground">
            {t("description")}
          </p>

          <dl className="mt-8 divide-y divide-border border-y border-border">
            {counts.map((count) => (
              <div
                key={count.label}
                className="flex items-baseline justify-between gap-4 py-3.5"
              >
                <dt className="text-muted-foreground">{count.label}</dt>
                <dd className="text-xl font-semibold tracking-tight tabular-nums">
                  {format(count.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="min-w-0 overflow-hidden rounded-2xl border border-border bg-background">
          <figcaption
            dir="ltr"
            className="flex h-11 items-center gap-2 border-b border-border bg-card px-4"
          >
            <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] font-semibold text-secondary-foreground">
              GET
            </span>
            <code className="truncate font-mono text-[12.5px] text-muted-foreground">
              /api/municipalities?name=
              {sample.governorate.name.toLowerCase()}
            </code>
          </figcaption>

          <div className="p-4 sm:p-6">
            <TreeRow
              icon={Landmark}
              name={sample.governorate.name}
              nameAr={sample.governorate.nameAr}
              meta={t("levelGovernorate")}
              strong
            />
            <TreeBranch>
              <TreeItem>
                <TreeRow
                  icon={Building2}
                  name={firstDelegation.name}
                  nameAr={firstDelegation.nameAr}
                  meta={t("levelDelegation")}
                />
                <TreeBranch>
                  {sample.localities.map((locality, index) => (
                    <TreeItem key={locality.name}>
                      <TreeRow
                        icon={MapPin}
                        name={locality.name}
                        nameAr={locality.nameAr}
                        meta={index === 0 ? t("levelLocality") : undefined}
                        code={locality.postalCode}
                      />
                    </TreeItem>
                  ))}
                  <TreeItem>
                    <TreeMore>
                      {t("moreLocalities", {
                        count:
                          firstDelegation.localityCount -
                          sample.localities.length,
                      })}
                    </TreeMore>
                  </TreeItem>
                </TreeBranch>
              </TreeItem>
              {secondDelegation && (
                <TreeItem>
                  <TreeRow
                    icon={Building2}
                    name={secondDelegation.name}
                    nameAr={secondDelegation.nameAr}
                  />
                </TreeItem>
              )}
              <TreeItem>
                <TreeMore>
                  {t("moreDelegations", {
                    count:
                      sample.governorate.delegationCount -
                      sample.delegations.length,
                  })}
                </TreeMore>
              </TreeItem>
            </TreeBranch>
          </div>
        </figure>
      </div>
    </section>
  );
}

// Icons are 18px wide, so a 9px inset puts the guide line under their centre.
function TreeBranch({ children }: { children: React.ReactNode }) {
  return <ul className="ms-[9px]">{children}</ul>;
}

function TreeItem({ children }: { children: React.ReactNode }) {
  return (
    <li
      className={cn(
        "relative ps-5",
        // vertical guide, cut at the elbow on the last child
        "before:absolute before:start-0 before:top-0 before:bottom-0 before:border-s before:border-border last:before:bottom-auto last:before:h-5",
        // horizontal elbow into the row
        "after:absolute after:start-0 after:top-5 after:w-3 after:border-t after:border-border",
      )}
    >
      {children}
    </li>
  );
}

function TreeRow({
  icon: Icon,
  name,
  nameAr,
  meta,
  code,
  strong = false,
}: {
  icon: LucideIcon;
  name: string;
  nameAr: string;
  meta?: string;
  code?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex min-h-10 items-center gap-3 py-1.5">
      <Icon
        aria-hidden="true"
        strokeWidth={1.75}
        className={cn(
          "size-[18px] shrink-0",
          strong ? "text-foreground" : "text-primary",
        )}
      />
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2.5">
        <span
          dir="ltr"
          className={cn(
            "text-[15px]",
            strong ? "font-semibold" : "font-medium",
          )}
        >
          {name}
        </span>
        <span lang="ar" dir="rtl" className="text-muted-foreground">
          {nameAr}
        </span>
      </div>
      {code && (
        <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          {code}
        </code>
      )}
      {meta && (
        <span className="hidden w-24 shrink-0 text-end text-xs text-muted-foreground sm:block">
          {meta}
        </span>
      )}
      {!meta && <span className="hidden w-24 shrink-0 sm:block" />}
    </div>
  );
}

function TreeMore({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex min-h-10 items-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
