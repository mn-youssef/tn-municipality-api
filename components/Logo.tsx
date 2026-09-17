import { cn } from "@/lib/utils";

/** Ink tile with a location pin; the flag-red dot is the only red on the page. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={cn("size-7 shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="7" className="fill-foreground" />
      <path
        d="M14 6.5a5.5 5.5 0 0 0-5.5 5.5c0 4.1 5.5 9.5 5.5 9.5s5.5-5.4 5.5-9.5A5.5 5.5 0 0 0 14 6.5Z"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="12" r="2" className="fill-flag" />
    </svg>
  );
}
