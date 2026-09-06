export interface TopicTrend {
  topic: string
  category: string
  searchVolumeGrowth: string
  activeResearchers: number
  momentum: "Surging" | "Steady" | "Emerging"
}

export interface HubActivity {
  hub: string
  country: string
  dealsCount: number
  primaryFocus: string
  growthPercentage: string
}

export const TOPIC_TRENDS: TopicTrend[] = [
  {
    topic: "CDSCO SaMD & Clinical AI Validation",
    category: "Regulatory Affairs",
    searchVolumeGrowth: "+54% MoM",
    activeResearchers: 840,
    momentum: "Surging",
  },
  {
    topic: "Antibody-Drug Conjugates (ADC) CDMO Sourcing",
    category: "Biotech & Manufacturing",
    searchVolumeGrowth: "+38% MoM",
    activeResearchers: 620,
    momentum: "Surging",
  },
  {
    topic: "IoT Active Packaging & Cold Chain",
    category: "Logistics",
    searchVolumeGrowth: "+26% MoM",
    activeResearchers: 490,
    momentum: "Steady",
  },
  {
    topic: "Oncology Companion Diagnostics HEOR",
    category: "Market Access",
    searchVolumeGrowth: "+29% MoM",
    activeResearchers: 380,
    momentum: "Emerging",
  },
  {
    topic: "Surgical Robotics IP Cross-Licensing",
    category: "MedTech BD",
    searchVolumeGrowth: "+22% MoM",
    activeResearchers: 310,
    momentum: "Emerging",
  },
]

export const HUB_ACTIVITIES: HubActivity[] = [
  {
    hub: "Hyderabad Genome Valley",
    country: "India",
    dealsCount: 42,
    primaryFocus: "Biologics, CDMO & Bioconjugation",
    growthPercentage: "+31%",
  },
  {
    hub: "Bangalore Biocluster",
    country: "India",
    dealsCount: 36,
    primaryFocus: "AI Diagnostics, Clinical Trials & MedTech",
    growthPercentage: "+28%",
  },
  {
    hub: "Singapore One-North",
    country: "Singapore",
    dealsCount: 29,
    primaryFocus: "APAC Commercial Licensing & IP Law",
    growthPercentage: "+19%",
  },
  {
    hub: "Gujarat Pharma Corridor",
    country: "India",
    dealsCount: 25,
    primaryFocus: "Sterile Fill-Finish & Active Packaging",
    growthPercentage: "+14%",
  },
]
