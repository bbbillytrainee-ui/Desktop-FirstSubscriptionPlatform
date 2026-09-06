export interface ResearchReport {
  id: string
  title: string
  subtitle: string
  category: "Biosimilars & Biologics" | "Cold-Chain Logistics" | "MedTech & Robotics" | "Regulatory & Compliance"
  publishedDate: string
  pagesCount: number
  price: string
  isEnterpriseIncluded: boolean
  executiveSummary: string
  keyTakeaways: string[]
  toc: string[]
  coverImage: string
}

export const RESEARCH_REPORTS: ResearchReport[] = [
  {
    id: "rep-1",
    title: "India Biosimilars & Biologics: APAC Regulatory & Commercial Outlook 2027",
    subtitle: "A 58-page institutional briefing on CDSCO Phase III clearance trends, USFDA inspection readiness, and APAC licensing valuation multiples.",
    category: "Biosimilars & Biologics",
    publishedDate: "August 2026",
    pagesCount: 58,
    price: "₹45,000",
    isEnterpriseIncluded: true,
    executiveSummary: "Regional Indian biosimilar manufacturers are transitioning from low-margin domestic volumes to high-yield out-licensing partnerships across APAC and Latin America. This report benchmarks regulatory dossier approval timelines, CDMO cleanroom capacity, and cross-border IP cross-licensing deal structures.",
    keyTakeaways: [
      "Average CDSCO biosimilar review duration decreased by 18% following digitized validation pipelines.",
      "Hyderabad and Gujarat account for 68% of new contract bioconjugation facility expansion.",
      "Out-licensing deal values for APAC markets surged 24% year-over-year in oncology therapeutics.",
    ],
    toc: [
      "1. Macroeconomic Drivers & APAC Therapeutic Demand",
      "2. CDSCO vs USFDA Biologics Dossier Harmonization",
      "3. CDMO Cleanroom Capacity & Single-Use Bioreactor Economics",
      "4. Licensing Deal Terms & Cross-Border Joint Ventures",
      "5. Company Profiles & 2027 Pipeline Forecasts",
    ],
    coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "rep-2",
    title: "Cold-Chain Infrastructure & Tier-2 Pharma Distribution Audit",
    subtitle: "Real-world telemetry, temperature drift benchmarks, and depot storage audits across 140 regional Indian distribution nodes.",
    category: "Cold-Chain Logistics",
    publishedDate: "July 2026",
    pagesCount: 42,
    price: "₹35,000",
    isEnterpriseIncluded: true,
    executiveSummary: "Ultracold and 2°C–8°C biologic distribution beyond Tier-1 metro airports remains highly vulnerable to final-mile temperature excursions. We audit phase-change packaging performance, active shipper fleet utilization, and IoT sensor mesh telemetry across non-metro distribution lanes.",
    keyTakeaways: [
      "IoT live logging reduced silent temperature excursion write-offs by 84% in trial corridors.",
      "Total cost of ownership for reusable active shippers is 32% lower than single-use polystyrene boxes over 12 months.",
      "Tier-2 depot power-redundancy gaps represent the primary point of thermal breach during summer months.",
    ],
    toc: [
      "1. The Cold-Chain Reality in Tier-2/Tier-3 India",
      "2. Thermal Packaging Comparative Benchmarks",
      "3. Real-Time IoT Sensor Telemetry & API Integration",
      "4. Depot Audit Checklist & Regulatory Compliance",
      "5. Vendor Scorecards & Logistics Cost Matrix",
    ],
    coverImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "rep-3",
    title: "Surgical Robotics & Precision MedTech Licensing in Emerging Markets",
    subtitle: "Market access frameworks, IP patent clearance strategies, and capital equipment hospital financing models.",
    category: "MedTech & Robotics",
    publishedDate: "June 2026",
    pagesCount: 46,
    price: "₹38,000",
    isEnterpriseIncluded: true,
    executiveSummary: "Multi-specialty hospital chains across India and Southeast Asia are accelerating adoption of localized robotic surgical platforms. This report provides strategic blueprints for device licensing, local manufacturing partnerships, and procedure-based hospital leasing models.",
    keyTakeaways: [
      "Robotic surgical procedure volumes in Tier-1 private healthcare chains grew 41% in 2025–2026.",
      "Co-development licensing models reduced upfront device capital expenditure by 35%.",
      "CDSCO Class D medical device certification pathways analyzed across 6 active platforms.",
    ],
    toc: [
      "1. Surgical Robotics Market Size & Procedure Penetration",
      "2. Cross-Border Technology Transfer & Patent Pools",
      "3. Local Precision Manufacturing & Quality Audits",
      "4. Hospital Payer Models & Procedure-Based Leasing",
      "5. Strategic Recommendations for Device Innovators",
    ],
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
  },
]
