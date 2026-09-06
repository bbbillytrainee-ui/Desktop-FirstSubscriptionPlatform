export interface MatchItem {
  id: string
  name: string
  title: string
  org: string
  location: string
  matchedOn: [string, string]
  whyUseful: string
  goal: string
  bio: string
  status: "pending" | "connected" | "dismissed"
}

export const MATCHES: MatchItem[] = [
  {
    id: "match-1",
    name: "Dr. Ananya Krishnamurthy",
    title: "Director, Regulatory Affairs",
    org: "AstraZeneca India",
    location: "Bangalore",
    matchedOn: ["AI Diagnostics", "Regulatory Affairs"],
    whyUseful: "Both focusing on CDSCO regulatory pathways for AI-assisted clinical review platforms.",
    goal: "Find Collaborators",
    bio: "12 years navigating CDSCO and FDA submissions for biologics and SaMD. Currently driving AI clinical data review initiatives.",
    status: "pending",
  },
  {
    id: "match-2",
    name: "Marcus Osei-Bonsu",
    title: "Senior Director, Business Development",
    org: "Medtronic",
    location: "Hyderabad",
    matchedOn: ["Surgical Robotics", "IP & Strategy"],
    whyUseful: "Seeking commercial partners and regulatory counsel in APAC for next-gen device platforms.",
    goal: "Find Vendors",
    bio: "Focused on licensing strategy for next-gen surgical platforms. Seeking CRO and IP partners in the APAC region.",
    status: "pending",
  },
  {
    id: "match-3",
    name: "Dr. Priya Mehta",
    title: "Principal Scientist, Oncology",
    org: "Cipla Ltd.",
    location: "Mumbai",
    matchedOn: ["Oncology BD", "Companion Diagnostics"],
    whyUseful: "Sharing insights on companion diagnostic co-development and tumor biomarker market strategies.",
    goal: "Find Mentors",
    bio: "Transitioning from pure research to business development. Expertise in biomarker strategy and co-development.",
    status: "pending",
  },
  {
    id: "match-4",
    name: "Tanvir Hussain",
    title: "Investment Manager",
    org: "Sofinnova Partners",
    location: "Delhi",
    matchedOn: ["mRNA Platforms", "Gene Therapy"],
    whyUseful: "Evaluating emerging cell & gene therapy startups across Indian life science clusters.",
    goal: "Stay Informed",
    bio: "Deploying healthcare venture funds into early-stage biotech and platform technology companies.",
    status: "pending",
  },
]
