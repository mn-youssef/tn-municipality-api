"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, BookOpen, Code2, Globe, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { GitHubIcon } from "./icons/GitHubIcon";

interface NavbarProps {
  className?: string;
}

function scrollToHash(hash: string) {
  const el = document.getElementById(hash.replace("#", ""));
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.location.hash = hash;
  }
}
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇹🇳" },
];

export function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const currentLanguage = pathname.startsWith("/ar") ? "ar" : "en";
  const isRTL = currentLanguage === "ar";
  const navItems = [
    { name: t("home"), href: "#home", icon: <Home size={22} /> },
    { name: t("api"), href: "#playground", icon: <Code2 size={22} /> },
    { name: t("docs"), href: "#docs", icon: <BookOpen size={22} /> },
  ];
  const switchLanguage = (langCode: string) => {
    setIsLanguageDropdownOpen(false);

    const pathWithoutLocale =
      pathname.startsWith("/en") || pathname.startsWith("/ar")
        ? pathname.slice(3)
        : pathname;

    router.push(`/${langCode}${pathWithoutLocale}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-language-dropdown]")) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isLanguageDropdownOpen]);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Active section highlight
      let found = false;
      for (const item of navItems) {
        const id = item.href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            setActiveSection(id);
            found = true;
            break;
          }
        }
      }
      if (!found) setActiveSection("home");
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled ? "rgba(255, 255, 255, 0.97)" : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        boxShadow: isScrolled ? "0 2px 12px rgba(0,0,0,0.04)" : "none",
        direction: isRTL ? "rtl" : "ltr",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      aria-label="Main navigation"
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        {/* Logo */}
        <motion.button
          type="button"
          aria-label="Go to home"
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#0070f3",
            cursor: "pointer",
            userSelect: "none",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            background: "none",
            border: "none",
            outline: "none",
            padding: 0,
            order: isRTL ? 2 : 1,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            scrollToHash("#home");
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #0070f3 60%, #00c6fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              fontSize: 24,
              marginRight: isRTL ? 0 : 2,
              marginLeft: isRTL ? 2 : 0,
              letterSpacing: "1px",
            }}
          >
            {t("logo")}
          </span>
        </motion.button>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav
            aria-label="Primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              order: isRTL ? 1 : 2,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 32,
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              {(isRTL ? [...navItems].reverse() : navItems).map(
                (item, index) => (
                  <motion.button
                    key={item.name}
                    type="button"
                    aria-current={
                      activeSection === item.href.replace("#", "")
                        ? "page"
                        : undefined
                    }
                    aria-label={item.name}
                    onClick={() => scrollToHash(item.href)}
                    style={{
                      textDecoration: "none",
                      color:
                        activeSection === item.href.replace("#", "")
                          ? "#0070f3"
                          : "#333",
                      fontWeight:
                        activeSection === item.href.replace("#", "")
                          ? 700
                          : 500,
                      fontSize: 16,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background:
                        activeSection === item.href.replace("#", "")
                          ? "#f0f4ff"
                          : "none",
                      border: "none",
                      transition:
                        "background 0.15s, color 0.15s, font-weight 0.15s",
                      outline: "none",
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                    whileHover={{
                      y: -2,
                      backgroundColor: "#f0f4ff",
                      color: "#0070f3",
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    tabIndex={0}
                  >
                    {item.icon}
                    {item.name}
                  </motion.button>
                ),
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexDirection: "row", // Always maintain the same order
              }}
            >
              {/* GitHub Button */}
              <motion.button
                onClick={() =>
                  window.open(
                    "https://github.com/youssef-of-web/tn-municipality-api",
                    "_blank",
                    "noopener noreferrer",
                  )
                }
                style={{
                  background: "none",
                  border: "2px solid #0070f3",
                  borderRadius: 8,
                  padding: "8px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#0070f3",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#0070f3",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(0, 112, 243, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                tabIndex={0}
                aria-label="Open GitHub repository"
              >
                <GitHubIcon size={18} />
                {t("github")}
              </motion.button>
              {/* Language Dropdown */}
              <div style={{ position: "relative" }} data-language-dropdown>
                <motion.button
                  onClick={() =>
                    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                  }
                  style={{
                    background: "none",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#333",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    outline: "none",
                    fontSize: 14,
                    flexDirection: isRTL ? "row-reverse" : "row",
                  }}
                  whileHover={{
                    backgroundColor: "#f5f5f5",
                    borderColor: "#0070f3",
                  }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={0}
                  aria-label="Select language"
                >
                  {
                    languages.find((lang) => lang.code === currentLanguage)
                      ?.flag
                  }
                  <ChevronDown size={14} />
                </motion.button>

                {/* Dropdown Menu */}
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: "absolute",
                      top: "100%",
                      [isRTL ? "left" : "right"]: 0,
                      marginTop: 8,
                      background: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      zIndex: 1000,
                      minWidth: 140,
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "none",
                          background:
                            currentLanguage === lang.code
                              ? "#f0f4ff"
                              : "transparent",
                          color:
                            currentLanguage === lang.code ? "#0070f3" : "#333",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 14,
                          fontWeight: currentLanguage === lang.code ? 600 : 400,
                          transition: "all 0.2s ease",
                          borderRadius: currentLanguage === lang.code ? 6 : 0,
                          flexDirection: isRTL ? "row-reverse" : "row",
                          textAlign: isRTL ? "right" : "left",
                        }}
                        onMouseEnter={(e) => {
                          if (currentLanguage !== lang.code) {
                            e.currentTarget.style.backgroundColor = "#f5f5f5";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentLanguage !== lang.code) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }
                        }}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </nav>
        )}

        {/* Mobile Navigation: Icons Only */}
        {isMobile && (
          <nav
            aria-label="Primary mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              order: isRTL ? 1 : 2,
              flexDirection: "row",
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                aria-label={item.name}
                onClick={() => scrollToHash(item.href)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 6,
                  borderRadius: 8,
                  color:
                    activeSection === item.href.replace("#", "")
                      ? "#0070f3"
                      : "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 0,
                  transition: "background 0.15s, color 0.15s",
                  outline: "none",
                  boxShadow:
                    activeSection === item.href.replace("#", "")
                      ? "0 2px 8px rgba(0,112,243,0.08)"
                      : "none",
                }}
                tabIndex={0}
              >
                {item.icon}
              </button>
            ))}

            <button
              aria-label="Open GitHub repository"
              onClick={() =>
                window.open(
                  "https://github.com/youssef-of-web/tn-municipality-api",
                  "_blank",
                  "noopener noreferrer",
                )
              }
              style={{
                background: "none",
                border: "none",
                padding: 6,
                borderRadius: 8,
                color: "#0070f3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 0,
                transition: "background 0.15s, color 0.15s",
                outline: "none",
              }}
              tabIndex={0}
            >
              <GitHubIcon size={22} />
            </button>

            <div style={{ position: "relative" }} data-language-dropdown>
              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                style={{
                  background: "none",
                  border: "none",
                  padding: 6,
                  borderRadius: 8,
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 0,
                  transition: "background 0.15s, color 0.15s",
                  outline: "none",
                }}
                tabIndex={0}
                aria-label="Select language"
              >
                <Globe size={22} />
              </button>

              {isLanguageDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    [isRTL ? "left" : "right"]: 0,
                    marginTop: 8,
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    minWidth: 120,
                    direction: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "none",
                        background:
                          currentLanguage === lang.code
                            ? "#f0f4ff"
                            : "transparent",
                        color:
                          currentLanguage === lang.code ? "#0070f3" : "#333",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        fontWeight: currentLanguage === lang.code ? 600 : 400,
                        transition: "all 0.2s ease",
                        borderRadius: currentLanguage === lang.code ? 6 : 0,
                        flexDirection: isRTL ? "row-reverse" : "row",
                        textAlign: isRTL ? "right" : "left",
                      }}
                      onMouseEnter={(e) => {
                        if (currentLanguage !== lang.code) {
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentLanguage !== lang.code) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </nav>
        )}
      </div>
    </motion.nav>
  );
}
