export interface Author {
  id: string
  name: string
  role: string
  company: string
  bio: string
  avatar: string
  photo: string
  linkedin: string
  isContributor: boolean
}

export const AUTHORS: Author[] = [
  {
    id: "auth-priya-nair",
    name: "Dr. Priya Nair",
    role: "VP Regulatory Affairs",
    company: "Pfizer India",
    bio: "20+ years in regulatory strategy for biologics and digital health. Leading Pfizer India's AI-assisted submission framework.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-priyanair",
    isContributor: true,
  },
  {
    id: "auth-marcus-ob",
    name: "Marcus Osei-Bonsu",
    role: "Senior Director, Business Development",
    company: "Medtronic",
    bio: "Focused on licensing strategy for next-gen surgical platforms and APAC partner networks.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-marcus",
    isContributor: true,
  },
  {
    id: "auth-arun-sharma",
    name: "Dr. Arun Sharma",
    role: "Principal Scientist",
    company: "Biocon Biologics",
    bio: "Pioneering cell and gene therapy manufacturing processes at Biocon's biologics facility.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-arunsharma",
    isContributor: true,
  },
  {
    id: "auth-vikram-malhotra",
    name: "Dr. Vikram Malhotra",
    role: "Chief Medical Officer",
    company: "Sun Pharma",
    bio: "Leading clinical development programs across oncology and rare disease portfolios.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-vikram",
    isContributor: true,
  },
  {
    id: "auth-leila-ahmadi",
    name: "Dr. Leila Ahmadi",
    role: "Head, Medical Affairs",
    company: "Roche Diagnostics India",
    bio: "Bridging diagnostics innovation with payer evidence frameworks for South Asian markets.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-leila",
    isContributor: true,
  },
  {
    id: "auth-siddharth-rao",
    name: "Siddharth Rao",
    role: "Associate Director, Pharmacovigilance",
    company: "Tata Elxsi Health",
    bio: "Building AI-assisted pharmacovigilance signal detection for global pharma clients.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-siddharth",
    isContributor: false,
  },
]
