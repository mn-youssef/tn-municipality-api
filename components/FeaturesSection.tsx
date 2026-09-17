"use client";

import { useTranslations } from "next-intl";
import { Gauge, ListFilter, MapPinned } from "lucide-react";

const features = [
  { key: "powerfulFiltering", Icon: ListFilter },
  { key: "richData", Icon: MapPinned },
  { key: "fastReliable", Icon: Gauge },
] as const;

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
        {features.map(({ key, Icon }) => (
          <li key={key} className="border-t border-border pt-6">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                <Icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <h2 className="text-base font-semibold tracking-tight">
                {t(`${key}.title`)}
              </h2>
            </div>
            <p className="mt-3 max-w-[38ch] leading-relaxed text-muted-foreground">
              {t(`${key}.description`)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
