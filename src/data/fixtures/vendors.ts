export interface VettedVendor {
  id: string
  name: string
  category: "CDMO & Sterile Fill" | "Clinical CRO" | "Cold Chain Logistics" | "IP & Patent Law"
  location: string
  certifications: string[]
  leadTime: string
  description: string
  rating: string
  verifiedClientsCount: number
  primaryCapabilities: string[]
}

export const VETTED_VENDORS: VettedVendor[] = [
  {
    id: "ven-1",
    name: "Helix Biologics CDMO",
    category: "CDMO & Sterile Fill",
    location: "Genome Valley, Hyderabad",
    certifications: ["USFDA Approved", "EU GMP", "WHO-GMP"],
    leadTime: "3–6 weeks",
    description: "Specialized contract development and manufacturing organization offering single-use bioreactor fermentation (50L–2000L) and sterile injectable fill-finish blocks.",
    rating: "4.9 / 5.0",
    verifiedClientsCount: 28,
    primaryCapabilities: ["Bioconjugation (ADC)", "Monoclonal Antibodies", "Sterile Lyophilization"],
  },
  {
    id: "ven-2",
    name: "CryoTransit Global Logistics",
    category: "Cold Chain Logistics",
    location: "Mumbai / Bangalore / Singapore",
    certifications: ["GDP Certified", "ISO 9001:2015", "IATA CEIV Pharma"],
    leadTime: "Immediate / On-demand",
    description: "End-to-end temperature-controlled supply chain partner operating active phase-change shippers and live IoT multi-sensor telemetry across South Asia.",
    rating: "4.8 / 5.0",
    verifiedClientsCount: 44,
    primaryCapabilities: ["-80°C Ultracold", "2°C–8°C Biologics", "Real-Time Excursion Alerts"],
  },
  {
    id: "ven-3",
    name: "CliniCore Research Services",
    category: "Clinical CRO",
    location: "Bangalore / Pune",
    certifications: ["GCP Compliant", "CDSCO Registered", "ISO 14155"],
    leadTime: "2–4 weeks trial startup",
    description: "Full-service contract research organization conducting Phase I–III clinical trials, bioequivalence studies, and patient recruitment for oncology and immunology.",
    rating: "4.9 / 5.0",
    verifiedClientsCount: 36,
    primaryCapabilities: ["Oncology Trials", "Real-World Evidence (RWE)", "Decentralized Clinical Trials"],
  },
  {
    id: "ven-4",
    name: "Sovereign IP & Life Science Counsel",
    category: "IP & Patent Law",
    location: "New Delhi / Singapore",
    certifications: ["Bar Council Registered", "APAC Patent Office Accredited"],
    leadTime: "1–2 weeks dossier review",
    description: "Boutique intellectual property law firm specializing in cross-border patent clearing, biosimilar FTO opinions, and surgical robotics co-development licensing.",
    rating: "5.0 / 5.0",
    verifiedClientsCount: 52,
    primaryCapabilities: ["Freedom to Operate (FTO)", "Patent Invalidation", "Cross-Border Licensing"],
  },
]
