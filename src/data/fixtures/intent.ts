export interface TalentIntentItem {
  id: string
  codeName: string
  roleTitle: string
  organizationType: string
  currentHub: string
  yearsExperience: string
  intentTypes: ("Strategic Advisory" | "Board Seats" | "Co-Founder / Leadership" | "Joint R&D")[]
  specialties: string[]
  bioSummary: string
  isVerifiedExecutive: boolean
}

export const TALENT_INTENTS: TalentIntentItem[] = [
  {
    id: "intent-1",
    codeName: "Executive Lead #R-804",
    roleTitle: "Former VP Global Regulatory Affairs",
    organizationType: "Top 5 Global Pharma Multination",
    currentHub: "Bangalore / Singapore",
    yearsExperience: "22+ years",
    intentTypes: ["Strategic Advisory", "Board Seats"],
    specialties: ["CDSCO Dossier Approvals", "USFDA 510(k)", "Biologics Regulatory Strategy"],
    bioSummary: "Led 40+ successful international drug registrations and CDSCO clearances for biosimilars and oncology portfolios. Open to advising growth-stage biotech boards.",
    isVerifiedExecutive: true,
  },
  {
    id: "intent-2",
    codeName: "Technical Founder #B-412",
    roleTitle: "Head of Cell & Gene R&D",
    organizationType: "Premier APAC Research Institute",
    currentHub: "Hyderabad",
    yearsExperience: "16+ years",
    intentTypes: ["Joint R&D", "Co-Founder / Leadership"],
    specialties: ["mRNA Stability", "Lipid Nanoparticles", "Bioprocess Engineering"],
    bioSummary: "Holder of 8 international patents in lipid nanoparticle formulation. Seeking commercial partnership with established CDMOs for clinical batch scale-up.",
    isVerifiedExecutive: true,
  },
  {
    id: "intent-3",
    codeName: "Commercial Architect #C-198",
    roleTitle: "Senior Director, Market Access & BD",
    organizationType: "Global MedTech Platform",
    currentHub: "Mumbai",
    yearsExperience: "18+ years",
    intentTypes: ["Strategic Advisory", "Joint R&D"],
    specialties: ["APAC Distribution Networks", "HEOR Payer Negotiations", "Surgical Robotics"],
    bioSummary: "Orchestrated $120M+ in cumulative device out-licensing agreements across Japan, India, and Southeast Asia. Advising hospital procurement boards.",
    isVerifiedExecutive: true,
  },
]
