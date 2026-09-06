export interface NewsletterEdition {
  id: string
  title: string
  edition: "Regulatory & Policy" | "Commercial BD & Licensing" | "Supply Chain & Logistics"
  date: string
  readTime: string
  summary: string
  highlights: string[]
  isCurrent?: boolean
}

export const NEWSLETTER_EDITIONS: NewsletterEdition[] = [
  {
    id: "nl-reg-2026-09-04",
    title: "CDSCO's 2026 AI Radiology Rules, DPCO Price Caps & Halol Inspection Cleared",
    edition: "Regulatory & Policy",
    date: "September 04, 2026",
    readTime: "4 min read",
    summary: "This week's regulatory briefing breaks down the dual-center validation mandate for Class C software, new NPPA cardiovascular price orders, and audit takeaways from Sun Pharma's Halol sterile unit.",
    highlights: [
      "CDSCO mandates continuous algorithm drift logs for SaMD deployments",
      "NPPA adjusts maximum retail price ceilings across 18 cardiovascular SKUs",
      "USFDA concludes Halol surveillance inspection with zero Form 483 observations",
    ],
    isCurrent: true,
  },
  {
    id: "nl-bd-2026-09-02",
    title: "APAC Surgical Robotics Co-Dev Deals & Antibody-Drug Conjugate (ADC) Pipelines",
    edition: "Commercial BD & Licensing",
    date: "September 02, 2026",
    readTime: "5 min read",
    summary: "Analysis of Medtronic's regional co-manufacturing agreements in South Asia, plus Cohance Lifesciences' new bioconjugation facility investments in Hyderabad.",
    highlights: [
      "Cross-border IP sharing models for robotic spinal instrumentation",
      "Hyderabad emerges as a regional hub for contract bioconjugation services",
      "Companion diagnostics market access trends for APAC oncology portfolios",
    ],
    isCurrent: false,
  },
  {
    id: "nl-log-2026-08-28",
    title: "Cold-Chain Integrity Pilot: Zero Excursions Across 140 Regional Nodes",
    edition: "Supply Chain & Logistics",
    date: "August 28, 2026",
    readTime: "4 min read",
    summary: "How active phase-change materials and live IoT sensor mesh networks are stabilizing high-potency biologic distribution across non-metro healthcare corridors.",
    highlights: [
      "Real-world data from the Maharashtra-Karnataka distribution trial",
      "Cost breakdown: Single-use passive packaging vs reusable active shipper fleet",
      "Tier-2 depot humidity and power-failure redundancy guidelines",
    ],
    isCurrent: false,
  },
]
