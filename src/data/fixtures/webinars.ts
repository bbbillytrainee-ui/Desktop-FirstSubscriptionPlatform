export interface Webinar {
  id: string
  title: string
  date: string
  time: string
  speaker: string
  speakerRole: string
  speakerCompany: string
  category: "Regulatory" | "Supply Chain" | "Commercial BD" | "AI Diagnostics"
  description: string
  isPast?: boolean
  recordingUrl?: string
}

export const WEBINARS: Webinar[] = [
  {
    id: "web-1",
    title: "Navigating CDSCO's 2026 Mandates for AI Software-as-a-Medical-Device",
    date: "September 18, 2026",
    time: "4:00 PM - 5:30 PM IST",
    speaker: "Dr. Priya Nair",
    speakerRole: "VP Regulatory Affairs",
    speakerCompany: "Pfizer India",
    category: "Regulatory",
    description: "A masterclass on compiling clinical validation dossiers, algorithm explainability metrics, and post-market safety protocols for AI diagnostic tools under revised Indian guidelines.",
  },
  {
    id: "web-2",
    title: "Cold-Chain Integrity & IoT Monitoring for mRNA Therapeutics in Tier-2 Hubs",
    date: "October 02, 2026",
    time: "3:00 PM - 4:30 PM IST",
    speaker: "Neha Bajaj",
    speakerRole: "Director, Supply Chain",
    speakerCompany: "Abbott India",
    category: "Supply Chain",
    description: "Operational review of active temperature packaging, regional transit monitoring, and decentralized depot storage architectures across South Asian distribution corridors.",
  },
  {
    id: "web-3",
    title: "Cross-Border IP & Licensing for Surgical Robotics in APAC",
    date: "October 24, 2026",
    time: "5:00 PM - 6:30 PM IST",
    speaker: "Marcus Osei-Bonsu",
    speakerRole: "Senior Director, Business Development",
    speakerCompany: "Medtronic",
    category: "Commercial BD",
    description: "Structuring licensing agreements, joint R&D partnerships, and technology transfer frameworks with regional APAC manufacturers.",
  },
]
