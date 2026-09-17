import * as React from "react";

import { cn } from "@/lib/utils";

const JSON_TOKEN =
  /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

// Past this size, syntax colouring costs more than it helps.
const MAX_HIGHLIGHT_CHARS = 120_000;

export function highlightJson(text: string): React.ReactNode {
  if (text.length > MAX_HIGHLIGHT_CHARS) return text;

  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(JSON_TOKEN)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));

    let className = "text-code-number";
    if (token.startsWith('"')) {
      className = token.trimEnd().endsWith(":")
        ? "text-code-key"
        : "text-code-string";
    }
    nodes.push(
      <span key={start} className={className}>
        {token}
      </span>,
    );
    last = start + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const SNIPPET_TOKEN =
  /(#[^\n]*|\/\/[^\n]*|'[^'\n]*'|"[^"\n]*"|\b(?:const|await|import|from|return|curl|print)\b)/g;

/** Light colouring for short request snippets (cURL, JavaScript, Python). */
export function highlightSnippet(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(SNIPPET_TOKEN)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));

    let className = "text-code-key";
    if (token.startsWith("#") || token.startsWith("//")) {
      className = "text-code-muted";
    } else if (token.startsWith("'") || token.startsWith('"')) {
      className = "text-code-string";
    }
    nodes.push(
      <span key={start} className={className}>
        {token}
      </span>,
    );
    last = start + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

interface CodePanelProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode;
}

/** Dark code surface with an optional header row. Code is always left-to-right. */
export function CodePanel({
  header,
  className,
  children,
  ...props
}: CodePanelProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-code-border bg-code text-code-foreground shadow-[0_24px_48px_-24px_rgb(15_27_45/0.45)]",
        className,
      )}
      {...props}
    >
      {header && (
        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-code-border px-3">
          {header}
        </div>
      )}
      {children}
    </div>
  );
}

export function CodeBody({
  className,
  children,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      dir="ltr"
      className={cn(
        "overflow-auto p-4 text-left font-mono text-[13px] leading-6 [tab-size:2] [scrollbar-color:var(--code-border)_transparent]",
        className,
      )}
      {...props}
    >
      <code>{children}</code>
    </pre>
  );
}
