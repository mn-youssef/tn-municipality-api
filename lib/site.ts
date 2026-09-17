export const REPO_URL = "https://github.com/youssef-of-web/tn-municipality-api";
export const API_ORIGIN = "https://tn-municipality-api.vercel.app";

export const SECTION_IDS = ["home", "playground", "ai", "docs"] as const;
export type SectionId = (typeof SECTION_IDS)[number];
