import { buildLlmsTxt } from "@/lib/ai";
import { getDataStats } from "@/lib/stats";

// Plain-text API reference for AI assistants (https://llmstxt.org).
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(getDataStats()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
