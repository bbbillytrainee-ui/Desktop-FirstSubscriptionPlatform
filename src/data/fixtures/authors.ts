export interface Author {
  id: string
  name: string
  role: string
  company: string
  bio: string
  avatar?: string
  photo: string
  linkedin?: string
  email?: string
  expertise?: string[]
  credentials?: string
  location?: string
  publicationsCount?: number
  isContributor: boolean
}

export const AUTHORS: Author[] = [
  {
    id: "auth-priya-nair",
    name: "Dr. Priya Nair",
    role: "VP Regulatory Affairs",
    company: "Pfizer India",
    bio: "20+ years in regulatory strategy for biologics and digital health. Leading Pfizer India's AI-assisted submission framework for CDSCO clearances.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-priyanair",
    email: "priya.nair@pfizer.com",
    expertise: ["Regulatory Strategy", "Biologics API", "AI Diagnostics", "SaMD Compliance"],
    credentials: "Ph.D. Pharmacology, M.Pharm",
    location: "Mumbai, India",
    publicationsCount: 14,
    isContributor: true,
  },
  {
    id: "auth-marcus-ob",
    name: "Marcus Osei-Bonsu",
    role: "Senior Director, Business Development",
    company: "Medtronic",
    bio: "Focused on licensing strategy for next-gen surgical platforms, tele-robotics co-development, and APAC hospital partner networks.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-marcus",
    email: "m.oseibonsu@medtronic.com",
    expertise: ["Surgical Robotics", "IP Licensing", "MedTech M&A", "Commercial Strategy"],
    credentials: "MBA INSEAD, B.Sc Bioengineering",
    location: "Singapore",
    publicationsCount: 9,
    isContributor: true,
  },
  {
    id: "auth-arun-sharma",
    name: "Dr. Arun Sharma",
    role: "Principal Scientist & Bioprocess Director",
    company: "Biocon Biologics",
    bio: "Pioneering continuous cell culture biomanufacturing and single-use bioreactor scale-up at Biocon's Hyderabad biologics facility.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-arunsharma",
    email: "arun.sharma@biocon.com",
    expertise: ["Continuous Biomanufacturing", "Perfusion Bioreactors", "Biosimilars"],
    credentials: "Ph.D. Chemical & Biochemical Engineering",
    location: "Hyderabad, India",
    publicationsCount: 11,
    isContributor: true,
  },
  {
    id: "auth-vikram-malhotra",
    name: "Dr. Vikram Malhotra",
    role: "Chief Medical Officer",
    company: "Sun Pharma",
    bio: "Leading global clinical development programs across oncology, CAR-T cell therapy, and rare disease portfolios across South Asia.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-vikram",
    email: "vikram.m@sunpharma.com",
    expertise: ["Oncology Clinical Trials", "Cell & Gene Therapy", "CAR-T Protocols"],
    credentials: "MD Medical Oncology, FACP",
    location: "New Delhi, India",
    publicationsCount: 18,
    isContributor: true,
  },
  {
    id: "auth-leila-ahmadi",
    name: "Dr. Leila Ahmadi",
    role: "Head, Medical Affairs & Diagnostics",
    company: "Roche Diagnostics India",
    bio: "Bridging precision diagnostics innovation with payer health economics outcome research (HEOR) evidence frameworks for APAC markets.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-leila",
    email: "leila.ahmadi@roche.com",
    expertise: ["Companion Diagnostics", "Liquid Biopsy", "Health Economics (HEOR)"],
    credentials: "Ph.D. Human Genetics, Postdoc Harvard Med",
    location: "Bangalore, India",
    publicationsCount: 15,
    isContributor: true,
  },
  {
    id: "auth-siddharth-rao",
    name: "Siddharth Rao",
    role: "Associate Director, Pharmacovigilance",
    company: "Tata Elxsi Health",
    bio: "Building AI-assisted NLP pharmacovigilance signal detection pipelines and adverse event monitoring for global pharmaceutical clients.",
    avatar: "",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com/in/example-siddharth",
    email: "siddharth.rao@tataelxsi.com",
    expertise: ["Pharmacovigilance", "NLP AI Pipelines", "Safety Signal Analytics"],
    credentials: "M.Tech Biomedical Engineering",
    location: "Pune, India",
    publicationsCount: 6,
    isContributor: false,
  },
]

