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

/**
 * Items that "arrive" while the page is open (simulated live feed).
 * Replace with a Supabase realtime subscription / polling when the backend is wired.
 * `timestamp` and `timeAgo` are assigned on arrival.
 */
export const INCOMING_NEWS: Omit<NewsItem, "timestamp" | "timeAgo">[] = [
  {
    id: "news-in-1",
    title: "DCGI grants accelerated approval pathway for two indigenous CAR-T candidates",
    category: "Drug Approvals",
    source: "DCGI Notice",
    summary: "Conditional approvals hinge on 24-month real-world follow-up and a registry shared with the ICMR cell therapy network.",
    isBreaking: true,
    readTime: "2 min",
  },
  {
    id: "news-in-2",
    title: "Biocon Biologics closes US$300M facility expansion for insulin aspart in Bengaluru",
    category: "Biotech",
    source: "Company Filing",
    summary: "The expansion adds 40% fill-finish capacity and targets EU GMP inspection readiness by Q2 2027.",
    readTime: "2 min",
  },
  {
    id: "news-in-3",
    title: "CDSCO opens consultation on algorithm change-control plans for SaMD",
    category: "CDSCO & Policy",
    source: "CDSCO Gazette",
    summary: "Draft mirrors FDA PCCP guidance; manufacturers must pre-declare retraining triggers and validation datasets.",
    isBreaking: true,
    readTime: "3 min",
  },
  {
    id: "news-in-4",
    title: "Cold-chain consortium reports 18% drop in vaccine excursions across Tier-2 depots",
    category: "Cold Chain",
    source: "Logistics Council",
    summary: "IoT telemetry pilots across 140 depots cut temperature excursions and shortened incident response to under 40 minutes.",
    readTime: "2 min",
  },
  {
    id: "news-in-5",
    title: "Apollo and a Singapore AI lab sign radiology triage validation partnership",
    category: "AI-Health",
    source: "Press Release",
    summary: "Federated validation across six hospitals will benchmark chest X-ray triage models without moving patient data.",
    readTime: "3 min",
  },
  {
    id: "news-in-6",
    title: "Sun Pharma out-licenses dermatology asset to Japanese partner in US$120M deal",
    category: "Commercial BD",
    source: "Deal Wire",
    summary: "Upfront of US$25M with milestones tied to PMDA approval and first commercial sale in Japan.",
    readTime: "2 min",
  },
]

/** Primary regulator documents: the feed marks these "Verified" (a gazette/order/notice, not a wire report) */
const OFFICIAL_SOURCES = new Set(["CDSCO Gazette", "NPPA Order", "DCGI Notice"])
export const isOfficialSource = (source: string) => OFFICIAL_SOURCES.has(source)
