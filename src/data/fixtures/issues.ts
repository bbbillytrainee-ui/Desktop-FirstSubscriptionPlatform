export interface Issue {
  id: string
  number: number
  month: string
  theme: string
  summary: string
  coverImage: string
  status: "published" | "archived" | "draft"
}

export const ISSUES: Issue[] = [
  {
    id: "issue-2026-09",
    number: 15,
    month: "September 2026",
    theme: "Next-Gen Bioprocessing & Commercial CDMO Operations",
    summary: "Exploring continuous manufacturing, single-use bioreactor innovations, and cross-border biopharma partnerships across APAC hubs.",
    coverImage: "https://images.unsplash.com/photo-1581093458791-9f3c3250a8b0?auto=format&fit=crop&w=1200&q=80",
    status: "published",
  },
  {
    id: "issue-2026-08",
    number: 14,
    month: "August 2026",
    theme: "AI Diagnostics & Regulatory Frameworks",
    summary: "Navigating CDSCO guidelines, cross-border clinical data validation, and commercialization strategies for AI-driven diagnostic tools.",
    coverImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
    status: "published",
  },
  {
    id: "issue-2026-07",
    number: 13,
    month: "July 2026",
    theme: "Cell & Gene Therapy Scale-Up in APAC",
    summary: "Manufacturing bottlenecks, cold-chain logistics in Tier-2 Indian hubs, and regional IP landscape updates.",
    coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
  },
  {
    id: "issue-2026-06",
    number: 12,
    month: "June 2026",
    theme: "Smart Cold-Chain Logistics & Vaccine Delivery",
    summary: "Real-time IoT telemetry, ultra-low temperature monitoring, and decentralized supply chain resilience.",
    coverImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
  },
  {
    id: "issue-2026-05",
    number: 11,
    month: "May 2026",
    theme: "Precision Oncology & Companion Diagnostics",
    summary: "Biomarker discovery, payer reimbursement frameworks, and multi-center clinical trials in Asia.",
    coverImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
  },
  {
    id: "issue-2026-04",
    number: 10,
    month: "April 2026",
    theme: "Surgical Robotics & Autonomous MedTech Systems",
    summary: "Regulatory approval pathways, surgeon training centers, and regional co-development partnerships.",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
  },
]

