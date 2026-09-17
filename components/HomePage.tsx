"use client";

import { MotionConfig } from "framer-motion";
import type { DataStats } from "../lib/stats";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { StatsSection } from "./StatsSection";
import { ApiPlayground } from "./ApiPlayground";
import { AiSection } from "./AiSection";
import { DocumentationSection } from "./DocumentationSection";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { StickyGitHubButton } from "./StickyGitHubButton";
import { ScrollToTop } from "./ScrollToTop";

const exampleResponse = `[
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
]`;

export function HomePage({ stats }: { stats: DataStats }) {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection stats={stats} />
        <ApiPlayground />
        <AiSection />
        <DocumentationSection
          exampleResponse={exampleResponse}
          counts={stats}
        />
      </main>
      <Footer />
      <StickyGitHubButton repoUrl="https://github.com/youssef-of-web/tn-municipality-api" />
      <ScrollToTop />
    </MotionConfig>
  );
}
