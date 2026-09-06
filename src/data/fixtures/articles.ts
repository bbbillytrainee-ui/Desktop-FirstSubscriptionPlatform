export interface Article {
  slug: string
  title: string
  dek: string
  category: "Pharma" | "MedTech" | "AI-Health"
  format: "Feature" | "Analysis" | "Interview" | "Digest"
  issueId: string
  authorId: string
  date: string
  readingTime: string
  tags: string[]
  image: string
  body: string[]
  isLocked?: boolean
}

export const ARTICLES: Article[] = [
  {
    slug: "cdsco-ai-diagnostics-framework-2026",
    title: "CDSCO's 2026 AI Diagnostics Framework: What Regulatory Leads Need to Know",
    dek: "A detailed breakdown of new validation mandates, software-as-a-medical-device (SaMD) requirements, and clinical trial audit expectations.",
    category: "AI-Health",
    format: "Feature",
    issueId: "issue-2026-08",
    authorId: "auth-priya-nair",
    date: "Aug 15, 2026",
    readingTime: "7 min read",
    tags: ["Regulatory Affairs", "AI Diagnostics", "Clinical Operations"],
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
    body: [
      "The Central Drugs Standard Control Organisation (CDSCO) has introduced revised guidelines for AI-assisted diagnostic tools, bringing software-as-a-medical-device (SaMD) oversight into closer alignment with global standards.",
      "For regulatory affairs leaders in India and the wider APAC region, this shift requires a multi-layered approach to clinical evidence collection, real-world data validation, and ongoing post-market surveillance.",
      "Key changes focus on algorithm explainability, training data diversity representative of local patient populations, and continuous performance monitoring protocols.",
    ],
    isLocked: false,
  },
  {
    slug: "surgical-robotics-ip-licensing-apac",
    title: "Navigating IP & Licensing Partnerships for Next-Gen Surgical Platforms",
    dek: "How MedTech innovators are structuring co-development agreements across emerging APAC manufacturing hubs.",
    category: "MedTech",
    format: "Analysis",
    issueId: "issue-2026-08",
    authorId: "auth-marcus-ob",
    date: "Aug 10, 2026",
    readingTime: "5 min read",
    tags: ["Surgical Robotics", "IP & Strategy", "Supply Chain"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    body: [
      "The rapid expansion of robotic-assisted surgical platforms across South and Southeast Asia has created new opportunities for technology licensing and strategic cross-border partnerships.",
      "Early-stage device manufacturers must navigate complex patent clearance procedures while securing local manufacturing partners capable of meeting international precision standards.",
    ],
    isLocked: false,
  },
  {
    slug: "mrna-cold-chain-logistics-tier2",
    title: "mRNA Therapeutics & Cold-Chain Realities in Tier-2 Distribution",
    dek: "Operational strategies for maintaining ultracold storage integrity across decentralized health networks.",
    category: "Pharma",
    format: "Interview",
    issueId: "issue-2026-08",
    authorId: "auth-arun-sharma",
    date: "Aug 05, 2026",
    readingTime: "6 min read",
    tags: ["mRNA Platforms", "Supply Chain", "Market Access"],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
    body: [
      "Distributing mRNA vaccines and gene therapies beyond metro centers remains one of the most pressing supply chain challenges facing pharmaceutical operations today.",
      "Innovative packaging solutions and IoT-enabled temperature sensors are enabling real-time monitoring, reducing product wastage and expanding reach into regional distribution hubs.",
    ],
    isLocked: true,
  },
  {
    slug: "companion-diagnostics-payer-models",
    title: "Companion Diagnostics: Building Payer Evidence Frameworks in Oncology",
    dek: "Why health economics outcomes research (HEOR) must be integrated at early clinical development phases.",
    category: "Pharma",
    format: "Analysis",
    issueId: "issue-2026-08",
    authorId: "auth-leila-ahmadi",
    date: "Jul 28, 2026",
    readingTime: "8 min read",
    tags: ["Companion Diagnostics", "Oncology BD", "Health Economics"],
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    body: [
      "Securing market access for novel companion diagnostic tests requires demonstrating tangible economic value alongside clinical efficacy.",
      "Collaborative models between diagnostic developers and pharmaceutical sponsors are demonstrating faster regulatory clearance and improved market uptake.",
    ],
    isLocked: false,
  },
  {
    slug: "ai-pharmacovigilance-signal-detection",
    title: "Automating Signal Detection: AI Pipelines in Modern Pharmacovigilance",
    dek: "Practical implementation approaches for NLP models parsing multi-lingual adverse event reporting.",
    category: "AI-Health",
    format: "Digest",
    issueId: "issue-2026-08",
    authorId: "auth-siddharth-rao",
    date: "Jul 20, 2026",
    readingTime: "4 min read",
    tags: ["Pharmacovigilance", "AI Diagnostics", "Regulatory Affairs"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    body: [
      "Natural language processing models are transforming how safety teams aggregate and triage potential safety signals from clinical literature and spontaneous reporting systems.",
    ],
    isLocked: false,
  },
]
