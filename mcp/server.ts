import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { data } from "../data/data";
import { haversineDistance } from "../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Delegation {
  Name: string;
  NameAr: string;
  Value: string;
  PostalCode: string;
  Latitude: number;
  Longitude: number;
}

interface Municipality {
  Name: string;
  NameAr: string;
  Value: string;
  Delegations: Delegation[];
}

// ── Search helpers (mirroring the REST API logic) ──────────────────────────────

function searchByGovernorate(
  term: string,
  municipalities: Municipality[]
): Municipality[] {
  const lower = term.toLowerCase();
  return municipalities.filter(
    (m) =>
      m.Name.toLowerCase().includes(lower) ||
      m.NameAr.toLowerCase().includes(lower)
  );
}

function searchByDelegation(
  term: string,
  municipalities: Municipality[]
): Municipality[] {
  const lower = term.toLowerCase();
  return municipalities
    .map((m) => ({
      ...m,
      Delegations: m.Delegations.filter(
        (d) =>
          d.Name.toLowerCase().includes(lower) ||
          d.NameAr.toLowerCase().includes(lower)
      ),
    }))
    .filter((m) => m.Delegations.length > 0);
}

function filterByPostalCode(
  postalCode: string,
  municipalities: Municipality[]
): Municipality[] {
  return municipalities
    .map((m) => ({
      ...m,
      Delegations: m.Delegations.filter((d) => d.PostalCode === postalCode),
    }))
    .filter((m) => m.Delegations.length > 0);
}

function sortMunicipalities(
  municipalities: Municipality[],
  field: "name" | "nameAr",
  order: "asc" | "desc" = "asc"
): Municipality[] {
  return [...municipalities].sort((a, b) => {
    const locale = field === "nameAr" ? "ar" : undefined;
    const valA = field === "nameAr" ? a.NameAr : a.Name;
    const valB = field === "nameAr" ? b.NameAr : b.Name;
    const cmp = valA.localeCompare(valB, locale);
    return order === "asc" ? cmp : -cmp;
  });
}

// ── MCP Server ─────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "tn-municipality",
  version: "1.0.0",
  description:
    "Access Tunisian municipality data – 24 governorates, 264+ delegations with GPS coordinates, bilingual names (EN/AR), and postal codes.",
});

// ── Tool 1: search_municipalities ──────────────────────────────────────────────

server.tool(
  "search_municipalities",
  "Search Tunisian municipalities by governorate name, delegation name, postal code, or a unified search term. Supports bilingual (English/Arabic) search with intelligent fallback.",
  {
    search: z
      .string()
      .optional()
      .describe(
        "Unified search term – tries governorate first, then delegation as fallback"
      ),
    name: z
      .string()
      .optional()
      .describe("Filter by governorate name (English or Arabic)"),
    delegation: z
      .string()
      .optional()
      .describe("Filter by delegation name (English or Arabic)"),
    postalCode: z
      .string()
      .optional()
      .describe("Filter by exact postal code (e.g. '2058')"),
    sort: z
      .enum(["name", "nameAr"])
      .optional()
      .describe("Sort results by field"),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Sort order (default: asc)"),
  },
  async ({ search, name, delegation, postalCode, sort, order }) => {
    let results: Municipality[] = [...(data as Municipality[])];

    // Unified search with fallback
    if (search) {
      let found = searchByGovernorate(search, results);
      if (found.length === 0) {
        found = searchByDelegation(search, results);
      }
      results = found;
    } else if (name) {
      let found = searchByGovernorate(name, results);
      if (found.length === 0) {
        found = searchByDelegation(name, results);
      }
      results = found;
    } else if (delegation) {
      let found = searchByDelegation(delegation, results);
      if (found.length === 0) {
        found = searchByGovernorate(delegation, results);
      }
      results = found;
    }

    if (postalCode) {
      results = filterByPostalCode(postalCode, results);
    }

    if (sort) {
      results = sortMunicipalities(results, sort, order ?? "asc");
    }

    // Build a concise text summary
    const totalDelegations = results.reduce(
      (sum, m) => sum + m.Delegations.length,
      0
    );
    const summary = `Found ${results.length} governorate(s) with ${totalDelegations} delegation(s).`;

    return {
      content: [
        { type: "text" as const, text: summary },
        { type: "text" as const, text: JSON.stringify(results, null, 2) },
      ],
    };
  }
);

// ── Tool 2: find_nearby_municipalities ──────────────────────────────────────────

server.tool(
  "find_nearby_municipalities",
  "Find municipalities within a radius (km) of a GPS coordinate. Uses the Haversine formula for accurate distance calculation.",
  {
    lat: z.number().describe("Latitude of the reference point"),
    lng: z.number().describe("Longitude of the reference point"),
    radius: z
      .number()
      .positive()
      .describe("Search radius in kilometres"),
  },
  async ({ lat, lng, radius }) => {
    const results = (data as Municipality[])
      .map((m) => ({
        ...m,
        Delegations: m.Delegations.filter((d) => {
          const distance = haversineDistance(lat, lng, d.Latitude, d.Longitude);
          return distance <= radius;
        }),
      }))
      .filter((m) => m.Delegations.length > 0);

    const totalDelegations = results.reduce(
      (sum, m) => sum + m.Delegations.length,
      0
    );
    const summary = `Found ${totalDelegations} delegation(s) across ${results.length} governorate(s) within ${radius} km of (${lat}, ${lng}).`;

    return {
      content: [
        { type: "text" as const, text: summary },
        { type: "text" as const, text: JSON.stringify(results, null, 2) },
      ],
    };
  }
);

// ── Tool 3: list_governorates ──────────────────────────────────────────────────

server.tool(
  "list_governorates",
  "List all 24 Tunisian governorates with their names in English and Arabic, plus the number of delegations in each.",
  {},
  async () => {
    const governorates = (data as Municipality[]).map((m) => ({
      name: m.Name,
      nameAr: m.NameAr,
      delegationCount: m.Delegations.length,
    }));

    const summary = `Tunisia has ${governorates.length} governorates with a total of ${governorates.reduce((s, g) => s + g.delegationCount, 0)} delegations.`;

    return {
      content: [
        { type: "text" as const, text: summary },
        { type: "text" as const, text: JSON.stringify(governorates, null, 2) },
      ],
    };
  }
);

// ── Tool 4: get_governorate_details ────────────────────────────────────────────

server.tool(
  "get_governorate_details",
  "Get full details for a specific governorate including all its delegations, postal codes, and GPS coordinates.",
  {
    name: z
      .string()
      .describe(
        "Governorate name to look up (English or Arabic, case-insensitive)"
      ),
  },
  async ({ name }) => {
    const lower = name.toLowerCase();
    const found = (data as Municipality[]).find(
      (m) =>
        m.Name.toLowerCase() === lower || m.NameAr.toLowerCase() === lower
    );

    if (!found) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No governorate found matching "${name}". Use the list_governorates tool to see all available governorates.`,
          },
        ],
      };
    }

    const summary = `${found.Name} (${found.NameAr}) has ${found.Delegations.length} delegation(s).`;

    return {
      content: [
        { type: "text" as const, text: summary },
        { type: "text" as const, text: JSON.stringify(found, null, 2) },
      ],
    };
  }
);

// ── Start ──────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("tn-municipality MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
