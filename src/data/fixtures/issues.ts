export interface MacroSignal {
  number: number
  headline: string
  detail: string
}

export interface EditorialColumn {
  title: string
  quote: string
  authorName: string
  authorRole: string
  authorId?: string
}

export interface Issue {
  id: string
  number: number
  volume: string
  month: string
  theme: string
  summary: string
  coverImage: string
  status: "published" | "archived" | "draft"
  editorialColumn?: EditorialColumn
  macroSignals?: MacroSignal[]
  readersCount?: string
}

export const ISSUES: Issue[] = [
  {
    id: "issue-2026-09",
    number: 15,
    volume: "Vol. XV",
    month: "September 2026",
    theme: "Next-Gen Bioprocessing & Commercial CDMO Operations",
    summary: "Exploring continuous manufacturing, single-use bioreactor innovations, and cross-border biopharma partnerships across APAC hubs.",
    coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    readersCount: "34,200+",
    editorialColumn: {
      title: "The Continuous Paradigm: Why Batch Bioprocessing Is Facing Its Sunset",
      quote: "As global biologics demand surges and patent cliffs loom over first-generation monoclonal antibodies, continuous perfusion manufacturing is no longer a pilot experiment—it is the baseline for commercial survival.",
      authorName: "Dr. Arun Sharma",
      authorRole: "Head of Bioprocess Development, Biocon Biologics",
      authorId: "auth-arun-sharma",
    },
    macroSignals: [
      {
        number: 1,
        headline: "USFDA / EMA Harmonization:",
        detail: "Draft guidelines establish real-time Process Analytical Technology (PAT) release pathways.",
      },
      {
        number: 2,
        headline: "₹4,800 Cr CDMO CAPEX Influx:",
        detail: "Genome Valley and Gujarat Pharma SEZs inaugurate automated single-use perfusion suites.",
      },
      {
        number: 3,
        headline: "GLP-1 API Expiration Cliff:",
        detail: "Top generic titans file 14 DMFs targeting post-2026 semaglutide commercial launches.",
      },
    ],
  },
  {
    id: "issue-2026-08",
    number: 14,
    volume: "Vol. XIV",
    month: "August 2026",
    theme: "AI Diagnostics & Regulatory Frameworks",
    summary: "Navigating CDSCO guidelines, cross-border clinical data validation, and commercialization strategies for AI-driven diagnostic tools.",
    coverImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    readersCount: "28,600+",
    editorialColumn: {
      title: "The Pivot From In-Silico Algorithms to CDSCO Real-World Validation",
      quote: "As APAC health authorities enforce post-market surveillance for medical AI, drug and device developers must build continuous verification loops into their core operating models.",
      authorName: "Dr. Leila Ahmadi",
      authorRole: "VP of Regulatory & Digital Health, Mediverse",
      authorId: "auth-leila-ahmadi",
    },
    macroSignals: [
      {
        number: 1,
        headline: "CDSCO Draft SaMD Rules:",
        detail: "180-day transition timeline enacted for algorithmic clinical diagnostics and triage software.",
      },
      {
        number: 2,
        headline: "Peptide Synthesis Influx:",
        detail: "₹3,200 Cr in greenfield solid-phase peptide CAPEX committed across Telangana & Gujarat.",
      },
      {
        number: 3,
        headline: "Surgical Robotics M&A:",
        detail: "3 APAC regional distribution licensing pacts finalized for orthopedic arms.",
      },
    ],
  },
  {
    id: "issue-2026-07",
    number: 13,
    volume: "Vol. XIII",
    month: "July 2026",
    theme: "Cell & Gene Therapy Scale-Up in APAC",
    summary: "Manufacturing bottlenecks, cold-chain logistics in Tier-2 Indian hubs, and regional IP landscape updates.",
    coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
    readersCount: "22,400+",
    editorialColumn: {
      title: "Democratizing Advanced Therapeutics: The Decentralized Cleanroom Model",
      quote: "Point-of-care viral vector transduction and closed-system isolators inside hospital basements are slashing CAR-T costs by 70%, creating a blueprint for emerging markets.",
      authorName: "Dr. Vikram Malhotra",
      authorRole: "Chief Medical Officer, Immuneel Therapeutics",
      authorId: "auth-vikram-malhotra",
    },
    macroSignals: [
      {
        number: 1,
        headline: "Hospital GMP Suites:",
        detail: "First 6 apex oncology centers clear CDSCO Phase-II trial audits for on-site cell expansion.",
      },
      {
        number: 2,
        headline: "Cryo-Transport Telemetry:",
        detail: "Liquid nitrogen smart dewars with dual-satellite tracking mandated for autologous shipments.",
      },
      {
        number: 3,
        headline: "LNP Formulation Patents:",
        detail: "Key regional patent oppositions cleared, enabling localized mRNA vaccine batch runs.",
      },
    ],
  },
  {
    id: "issue-2026-06",
    number: 12,
    volume: "Vol. XII",
    month: "June 2026",
    theme: "Smart Cold-Chain Logistics & Vaccine Delivery",
    summary: "Real-time IoT telemetry, ultra-low temperature monitoring, and decentralized supply chain resilience.",
    coverImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
    readersCount: "19,800+",
    editorialColumn: {
      title: "Zero-Excursion Cold Chains: Closing the Last-Mile Reliability Gap",
      quote: "Formulation chemistry and packaging innovation must work in tandem to eliminate reliance on brittle dry-ice supply chains across high-ambient temperature corridors.",
      authorName: "Rajiv Deshmukh",
      authorRole: "VP of Quality & Global Supply Chain, Dr. Reddy's",
      authorId: "auth-rajiv-deshmukh",
    },
    macroSignals: [
      {
        number: 1,
        headline: "IoT Datalogger Mandate:",
        detail: "Real-time Bluetooth & cellular temp-tracking enforced on all temperature-sensitive APIs.",
      },
      {
        number: 2,
        headline: "Lyophilized mRNA Advances:",
        detail: "Phase-I trials show 6-month stability at +4°C without lipid degradation.",
      },
      {
        number: 3,
        headline: "Tier-2 Cold Hubs:",
        detail: "18 automated temperature-controlled transshipment depots established across Central India.",
      },
    ],
  },
  {
    id: "issue-2026-05",
    number: 11,
    volume: "Vol. XI",
    month: "May 2026",
    theme: "Precision Oncology & Companion Diagnostics",
    summary: "Biomarker discovery, payer reimbursement frameworks, and multi-center clinical trials in Asia.",
    coverImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
    readersCount: "25,100+",
    editorialColumn: {
      title: "Next-Gen Biomarkers: Bridging the Gap to Public Insurance Coverage",
      quote: "Targeted oncologics only achieve equitable health impact when companion diagnostic assays are integrated directly into national reimbursement benefit packages.",
      authorName: "Dr. Ananya Sen",
      authorRole: "Director of Computational Biology, Aurigene",
      authorId: "auth-ananya-sen",
    },
    macroSignals: [
      {
        number: 1,
        headline: "NGS Panel Subsidies:",
        detail: "National health mission initiates pilot coverage for 42-gene solid tumor sequencing panels.",
      },
      {
        number: 2,
        headline: "ADC Linker Innovations:",
        detail: "Hydrophilic peptide linkers demonstrate 4x reduction in off-target systemic toxicity.",
      },
      {
        number: 3,
        headline: "Biomarker Registry:",
        detail: "Consortium launches 50,000-patient APAC genomic variation repository for clinical R&D.",
      },
    ],
  },
  {
    id: "issue-2026-04",
    number: 10,
    volume: "Vol. X",
    month: "April 2026",
    theme: "Surgical Robotics & Autonomous MedTech Systems",
    summary: "Regulatory approval pathways, surgeon training centers, and regional co-development partnerships.",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
    readersCount: "21,300+",
    editorialColumn: {
      title: "Modular Actuators and the Democratization of Robotic Surgery",
      quote: "High capital equipment costs have long barricaded tier-2 surgical centers. Modular design and regional co-manufacturing are transforming this dynamic.",
      authorName: "Marcus O'Brien",
      authorRole: "Managing Director, HealthTech APAC Partners",
      authorId: "auth-marcus-ob",
    },
    macroSignals: [
      {
        number: 1,
        headline: "Class-C Medical Device Rules:",
        detail: "Robotic arm hardware and console software subject to dual-verification safety standards.",
      },
      {
        number: 2,
        headline: "Simulation Training Hubs:",
        detail: "5 regional robotics simulation academies launched for laparoscopic and orthopedic fellows.",
      },
      {
        number: 3,
        headline: "Cross-Border IP Licensing:",
        detail: "Haptic feedback patent portfolios co-licensed between Japanese and Indian engineering teams.",
      },
    ],
  },
  {
    id: "issue-2026-03",
    number: 9,
    volume: "Vol. IX",
    month: "March 2026",
    theme: "Targeted Theranostics & Radiopharmaceutical Supply Chains",
    summary: "Overcoming half-life decay constraints, Actinium-225 supply bottlenecks, and specialized nuclear pharmacy GMP facilities.",
    coverImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
    readersCount: "26,400+",
    editorialColumn: {
      title: "The Race for Actinium-225: Building Precision Radiotherapy Supply Chains",
      quote: "Targeted Alpha Therapies represent a quantum leap in metastatic prostate and neuroendocrine oncology, but their commercial promise depends on sub-48 hour isotope delivery networks.",
      authorName: "Dr. Christine Vance",
      authorRole: "Global Head of Theranostics, Novartis Radiopharmaceuticals",
      authorId: "auth-christine-vance",
    },
    macroSignals: [
      {
        number: 1,
        headline: "AERB / CDSCO Nuclear Protocols:",
        detail: "Fast-track import approvals cleared for Ac-225 and Lu-177 generator systems.",
      },
      {
        number: 2,
        headline: "Regional Cyclotron Nodes:",
        detail: "₹1,800 Cr private infrastructure investment in 4 commercial medical cyclotrons across West India.",
      },
      {
        number: 3,
        headline: "Theranostic Hospital Suites:",
        detail: "First 12 specialized radioisotope infusion cleanrooms certified for clinical trial dosing.",
      },
    ],
  },
  {
    id: "issue-2026-02",
    number: 8,
    volume: "Vol. VIII",
    month: "February 2026",
    theme: "Synthetic Biology & Green Enzymatic Biocatalysis",
    summary: "Engineering custom enzyme cascades to eliminate toxic organic solvents and boost API reaction yields by 40%.",
    coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    status: "archived",
    readersCount: "20,900+",
    editorialColumn: {
      title: "Enzymatic Biocatalysis: Replacing Petrochemical Solvents in Large-Scale APIs",
      quote: "Synthetic biology is giving biopharma chemists tailored enzymes that perform multi-step stereoselective transformations in aqueous media at ambient room temperatures.",
      authorName: "Dr. Alok Verma",
      authorRole: "VP Synthetic Biology, Lupin Manufacturing Solutions",
      authorId: "auth-alok-verma",
    },
    macroSignals: [
      {
        number: 1,
        headline: "Green Chemistry Mandates:",
        detail: "Environmental pollution control boards incentivize enzyme-catalyzed API production routes.",
      },
      {
        number: 2,
        headline: "Directed Evolution AI:",
        detail: "Machine learning protein design accelerates enzyme thermostability screening from months to 72 hours.",
      },
      {
        number: 3,
        headline: "Fermentation Scale-Up:",
        detail: "50,000L industrial enzyme fermentation capacity brought online in Maharashtra manufacturing hubs.",
      },
    ],
  },
]
