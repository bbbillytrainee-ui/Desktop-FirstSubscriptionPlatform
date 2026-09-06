export interface VideoItem {
  id: string
  title: string
  category: "Keynote" | "Panel Discussion" | "Knowledge Capsule" | "Interview"
  duration: string
  speaker: string
  speakerRole: string
  speakerCompany: string
  date: string
  thumbnail: string
  summary: string
  videoUrl?: string
}

export const VIDEO_ARCHIVE: VideoItem[] = [
  {
    id: "vid-1",
    title: "Panel: Navigating CDSCO's Revised AI Diagnostics Validation Guidelines",
    category: "Panel Discussion",
    duration: "42:15",
    speaker: "Dr. Priya Nair & Panel",
    speakerRole: "VP Regulatory Affairs",
    speakerCompany: "Pfizer India / CDSCO Working Group",
    date: "August 2026",
    thumbnail: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
    summary: "In-depth panel debate on algorithmic drift, multi-center retrospective validation cohorts, and software-as-a-medical-device (SaMD) clearances.",
  },
  {
    id: "vid-2",
    title: "Knowledge Capsule: Single-Use Bioreactors vs Stainless Steel in Tier-2 CDMOs",
    category: "Knowledge Capsule",
    duration: "06:40",
    speaker: "Dr. Arun Sharma",
    speakerRole: "Chief Medical Officer",
    speakerCompany: "TheraGene Biologics",
    date: "July 2026",
    thumbnail: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    summary: "A 6-minute tactical breakdown of batch turnaround economics and cleanroom validation timelines.",
  },
  {
    id: "vid-3",
    title: "Keynote: Structuring High-Value Co-Development IP for Surgical Robotics",
    category: "Keynote",
    duration: "28:50",
    speaker: "Marcus Osei-Bonsu",
    speakerRole: "Director BD",
    speakerCompany: "Medtronic APAC",
    date: "June 2026",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    summary: "Keynote address delivered at the Singapore MedTech Forum on risk-sharing licensing frameworks.",
  },
]
