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
]
