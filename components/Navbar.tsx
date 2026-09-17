"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { REPO_URL, SECTION_IDS, type SectionId } from "@/lib/site";
import { Button } from "./ui/button";
import { GitHubIcon } from "./icons/GitHubIcon";
import { LogoMark } from "./Logo";

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "عربي", name: "العربية" },
] as const;

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("home");

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.35;
      let current: SectionId = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return active;
}

export function Navbar({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const currentLanguage = pathname.startsWith("/ar") ? "ar" : "en";
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)(?=\/|$)/, "");
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { id: SectionId; label: string }[] = [
    { id: "home", label: t("home") },
    { id: "playground", label: t("api") },
    { id: "ai", label: t("ai") },
    { id: "docs", label: t("docs") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const elevated = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        elevated
          ? "border-border bg-background/85 shadow-[0_1px_12px_rgb(15_27_45/0.04)] backdrop-blur-md"
          : "border-transparent bg-transparent",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a
          href="#home"
          className="-ms-1 flex items-center gap-2.5 rounded-lg px-1 py-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
          onClick={() => setMenuOpen(false)}
        >
          <LogoMark />
          <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight">
            {t("logo")}
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="isolate ms-auto hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/30",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-md bg-muted"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-3">
          <div
            role="group"
            aria-label={t("language")}
            className="isolate flex h-8 items-center rounded-md border border-border bg-card p-0.5"
          >
            {languages.map((lang) => {
              const selected = lang.code === currentLanguage;
              return (
                <Link
                  key={lang.code}
                  href={`/${lang.code}${pathWithoutLocale}`}
                  lang={lang.code}
                  aria-label={lang.name}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "relative grid h-full min-w-9 place-items-center rounded-[5px] px-2 text-xs font-medium outline-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/30",
                    selected
                      ? "text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="lang-active"
                      className="absolute inset-0 -z-10 rounded-[5px] bg-foreground"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                      }}
                    />
                  )}
                  {lang.label}
                </Link>
              );
            })}
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
          >
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
              {t("github")}
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("closeMenu") : t("menu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Primary"
            className="overflow-hidden border-t border-border md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-3 text-[15px] font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/30",
                    active === item.id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-[15px] font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/30"
              >
                <GitHubIcon size={18} />
                {t("github")}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
