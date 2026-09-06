export interface IndustryEvent {
  id: string
  title: string
  date: string
  location: string
  type: "Conclave" | "Expo" | "Virtual Masterclass" | "Roundtable"
  category: "Regulatory" | "Biotech" | "Supply Chain" | "MedTech"
  organizer: string
  description: string
  isFeatured?: boolean
  registrationUrl?: string
  isMediaPartner?: boolean
}

export const INDUSTRY_EVENTS: IndustryEvent[] = [
  {
    id: "evt-1",
    title: "Mediverse Executive Summit 2026: The Next Decade in APAC Biologics",
    date: "October 14–15, 2026",
    location: "Bangalore International Centre & Virtual",
    type: "Conclave",
    category: "Biotech",
    organizer: "Mediverse Life Sciences",
    description: "The flagship annual gathering of 600+ C-suite leaders, regulatory directors, and clinical trial heads discussing biosimilar scale-up and automated manufacturing.",
    isFeatured: true,
    isMediaPartner: false,
  },
  {
    id: "evt-2",
    title: "National Pharmacovigilance & AI Diagnostics Conclave",
    date: "November 05, 2026",
    location: "Hyderabad HITEX Exhibition Centre",
    type: "Conclave",
    category: "Regulatory",
    organizer: "Indian Pharmacovigilance Society",
    description: "Focusing on CDSCO SaMD audits, real-world data validation, and automated safety signal triage pipelines.",
    isFeatured: false,
    isMediaPartner: true,
  },
  {
    id: "evt-3",
    title: "Pharma Cold Chain & Cold Storage World Expo 2026",
    date: "November 20–22, 2026",
    location: "Bombay Exhibition Centre, Mumbai",
    type: "Expo",
    category: "Supply Chain",
    organizer: "Global Logistics Alliance",
    description: "Exhibition of active phase-change shippers, IoT transit loggers, and Tier-2 depot cold storage infrastructure.",
    isFeatured: false,
    isMediaPartner: true,
  },
  {
    id: "evt-4",
    title: "Cross-Border Surgical Robotics Licensing Roundtable",
    date: "December 08, 2026",
    location: "Virtual (Singapore / India)",
    type: "Roundtable",
    category: "MedTech",
    organizer: "APAC MedTech Innovators",
    description: "Closed-door dialogue on structuring patent pools, clinical trial co-sponsorship, and local manufacturing clearances.",
    isFeatured: false,
    isMediaPartner: true,
  },
]
