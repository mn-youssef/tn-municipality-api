"use client";

import { useTranslations } from "next-intl";

import { REPO_URL } from "@/lib/site";
import { GitHubIcon } from "./icons/GitHubIcon";
import { LogoMark } from "./Logo";

export function Footer() {
  const tFooter = useTranslations("footer");
  const tNav = useTranslations("nav");

  const links = [
    { href: "#playground", label: tNav("api") },
    { href: "#docs", label: tNav("docs") },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark className="size-6" />
          <p className="text-sm text-muted-foreground">{tFooter("text")}</p>
        </div>
        <nav
          aria-label="Footer"
          className="flex items-center gap-1 -ms-3 md:ms-0"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <GitHubIcon size={16} />
            {tNav("github")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
