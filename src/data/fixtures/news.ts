export interface NewsItem {
  id: string
  title: string
  category: "Drug Approvals" | "CDSCO & Policy" | "Cold Chain" | "Biotech" | "Commercial BD" | "AI-Health"
  timestamp: string
  timeAgo: string
  source: string
  summary: string
  isBreaking?: boolean
  readTime: string
  url?: string
}

export const LATEST_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "CDSCO issues revised clinical evaluation guidance for AI-integrated radiology software",
    category: "CDSCO & Policy",
    timestamp: "2026-09-05T08:30:00Z",
    timeAgo: "3 hours ago",
    source: "CDSCO Gazette",
    summary: "The apex regulator requires dual-center multi-ethnic validation cohorts and algorithm drift logging for Class C/D medical software.",
    isBreaking: true,
    readTime: "2 min",
  },
  {
    id: "news-2",
    title: "NPPA updates ceiling prices for 18 essential cardiovascular formulations under DPCO 2013",
    category: "Drug Approvals",
    timestamp: "2026-09-05T05:15:00Z",
    timeAgo: "6 hours ago",
    source: "NPPA Order",
    summary: "Revised maximum retail prices take effect October 1st across domestic retail pharmaceutical channels.",
    isBreaking: false,
    readTime: "2 min",
  },
  {
    id: "news-3",
    title: "Cohance Lifesciences expands antibody-drug conjugate (ADC) analytical capabilities",
    category: "Biotech",
    timestamp: "2026-09-04T18:00:00Z",
    timeAgo: "17 hours ago",
    source: "Corporate Wire",
    summary: "Investment in dedicated bioconjugation suites in Hyderabad to support global clinical supply pipelines.",
    isBreaking: false,
    readTime: "3 min",
  },
  {
    id: "news-4",
    title: "AstraZeneca & regional cold-chain consortium deploy IoT live-logging for Tier-2 distribution",
    category: "Cold Chain",
    timestamp: "2026-09-04T14:30:00Z",
    timeAgo: "21 hours ago",
    source: "Supply Chain Digest",
    summary: "Zero-temperature excursion pilot across 140 regional distribution nodes in Maharashtra and Karnataka.",
    isBreaking: false,
    readTime: "4 min",
  },
  {
    id: "news-5",
    title: "USFDA completes cGMP surveillance inspection at Sun Pharma Halol unit with zero Form 483 observations",
    category: "CDSCO & Policy",
    timestamp: "2026-09-04T10:00:00Z",
    timeAgo: "1 day ago",
    source: "Regulatory Wire",
    summary: "5-day extensive audit concludes successfully covering sterile injectable fill-finish blocks.",
    isBreaking: true,
    readTime: "3 min",
  },
  {
    id: "news-6",
    title: "Medtronic partners with APAC robotics hub for localized spinal navigation system manufacturing",
    category: "Commercial BD",
    timestamp: "2026-09-03T16:00:00Z",
    timeAgo: "2 days ago",
    source: "MedTech Asia",
    summary: "Co-development agreement aims to reduce capital acquisition costs for multi-specialty regional hospital chains.",
    isBreaking: false,
    readTime: "3 min",
  },
]
