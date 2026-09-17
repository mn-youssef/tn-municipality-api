import { API_ORIGIN, REPO_URL } from "./site";

export const AI_TASKS = ["address", "postal", "nearby", "custom"] as const;
export type AiTask = (typeof AI_TASKS)[number];

// Prompts stay in English: assistants follow technical instructions most reliably in it.
const TASK_TEXT: Record<AiTask, string> = {
  address:
    "Build a cascading address form: pick a governorate, then a delegation, then a locality, and fill in the postal code automatically. Show both Arabic and English names.",
  postal:
    "Write a function that takes a 4-digit postal code and returns the matching governorate, delegation and locality names in Arabic and English.",
  nearby:
    "Using coordinates from the user's device, list the localities within 5 km, sorted by distance, with their postal codes.",
  custom: "[Describe what you want to build and which stack you use]",
};

export function getTaskText(task: AiTask) {
  return TASK_TEXT[task];
}

export const LLMS_TXT_URL = `${API_ORIGIN}/llms.txt`;

const API_SUMMARY = `Base URL: ${API_ORIGIN}
No API key or authentication. Every endpoint is GET and returns JSON.
The API does not send CORS headers, so call it from server-side code (an API route, server action or backend), not directly from browser code on another domain.

Endpoints:
- GET /api/municipalities
  Returns governorates with their localities. All query parameters are optional and can be combined:
  - search: searches governorates first, then delegations if nothing matches (English or Arabic names)
  - name: governorate name, falls back to delegation search
  - delegation: delegation name, falls back to governorate search
  - postalCode: exact 4-digit postal code
  - sort: name | nameAr
  - order: asc (default) | desc
- GET /api/municipalities/near?lat={latitude}&lng={longitude}&radius={km}
  Returns only the localities within the radius, grouped by governorate.
  lat, lng and radius are all required; without them the full dataset is returned.

Response shape:
[
  {
    "Name": "ARIANA",
    "NameAr": "أريانة",
    "Value": "ARIANA",
    "Delegations": [
      {
        "Name": "ARIANA VILLE (Residence Kortoba)",
        "NameAr": "أريانة المدينة (إقامة قرطبة)",
        "Value": "ARIANA VILLE",
        "PostalCode": "2058",
        "Latitude": 36.866011,
        "Longitude": 10.193923
      }
    ]
  }
]

Notes:
- Each item in "Delegations" is a locality. Items that share the same "Value" belong to the same delegation.
- A locality's own name is the text in parentheses in "Name" and "NameAr".
- Several localities can share one postal code.`;

export function buildPrompt(task: AiTask, locale: string) {
  const language =
    locale === "ar"
      ? "\n\nExplain your answer in Arabic. Keep code in English."
      : "";

  return `I want to use the Tunisian Municipality API, a free REST API for Tunisia's governorates, delegations, localities and postal codes.

Full reference: ${LLMS_TXT_URL}

${API_SUMMARY}

Task: ${TASK_TEXT[task]}${language}`;
}

export function buildLlmsTxt(counts: {
  governorates: number;
  delegations: number;
  localities: number;
  postalCodes: number;
}) {
  const format = (n: number) => n.toLocaleString("en-US");

  return `# Tunisian Municipality API

> Free, open-source REST API for Tunisia's administrative geography: ${format(counts.governorates)} governorates, ${format(counts.delegations)} delegations and ${format(counts.localities)} localities with ${format(counts.postalCodes)} postal codes, Arabic and English names, and GPS coordinates.

${API_SUMMARY}

## Examples

- All data: ${API_ORIGIN}/api/municipalities
- Search: ${API_ORIGIN}/api/municipalities?search=ariana
- Postal code: ${API_ORIGIN}/api/municipalities?postalCode=2058
- Sorted by Arabic name: ${API_ORIGIN}/api/municipalities?sort=nameAr
- Nearby: ${API_ORIGIN}/api/municipalities/near?lat=36.8065&lng=10.1815&radius=5

## Links

- Documentation and playground: ${API_ORIGIN}
- Source code: ${REPO_URL}
`;
}
