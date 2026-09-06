export interface PodcastEpisode {
  id: string
  episodeNumber: number
  title: string
  guest: string
  guestRole: string
  guestCompany: string
  duration: string
  date: string
  summary: string
  audioUrl?: string
  topics: string[]
}

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: "pod-1",
    episodeNumber: 1,
    title: "Scaling Biosimilar Commercialization from Hyderabad to Global Markets",
    guest: "Sameer Verma",
    guestRole: "Managing Director",
    guestCompany: "Krystal Biotech APAC",
    duration: "34:20",
    date: "September 01, 2026",
    summary: "Sameer breaks down how regional manufacturers are competing against legacy pharma multinationals with rapid scale-up, decentralized clinical trials, and lean distribution networks.",
    topics: ["Biosimilars", "Commercial BD", "APAC Scale-Up"],
  },
  {
    id: "pod-2",
    episodeNumber: 2,
    title: "The Ethics, Algorithms and Audits of Clinical AI in Diagnostics",
    guest: "Dr. Leila Ahmadi",
    guestRole: "Senior Director",
    guestCompany: "Novartis Oncology",
    duration: "41:10",
    date: "August 18, 2026",
    summary: "Dr. Ahmadi explores how algorithm explainability and patient demographic representation determine CDSCO and FDA clearance outcomes.",
    topics: ["Clinical AI", "Regulatory Audits", "Ethics"],
  },
  {
    id: "pod-3",
    episodeNumber: 3,
    title: "Cold Chain Realities: Why Millions in Biologics Spoil in the Final Mile",
    guest: "Neha Bajaj",
    guestRole: "VP Global Supply Chain",
    guestCompany: "Abbott Logistics",
    duration: "29:45",
    date: "August 04, 2026",
    summary: "An operational teardown of temperature drift during cross-state highway transit and how IoT logger mesh networks are preventing silent inventory losses.",
    topics: ["Cold Chain", "IoT Telemetry", "Supply Chain"],
  },
]
