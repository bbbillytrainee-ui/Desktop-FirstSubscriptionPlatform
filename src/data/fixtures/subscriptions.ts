export interface SubscriptionTier {
  id: string
  name: string
  departmentTag: string
  departmentCode: 'explorer' | 'rnd' | 'sales' | 'logistics' | 'enterprise'
  badge?: string
  popular?: boolean
  description: string
  monthlyPriceINR: number
  yearlyPriceINR: number
  currency: string
  features: string[]
  iconName: 'FlaskConical' | 'TrendingUp' | 'Truck' | 'Compass' | 'Building2'
  targetAudience: string
  includesMagazine: boolean
  peerIntroductionsPerMonth: number
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "tier-explorer",
    name: "Explorer",
    departmentTag: "General Access",
    departmentCode: "explorer",
    description: "Essential intelligence and digital magazine preview for pharma professionals.",
    monthlyPriceINR: 0,
    yearlyPriceINR: 0,
    currency: "₹",
    features: [
      "3 premium articles per month",
      "Full access to 3D Magazine Flipbook (Latest Issue)",
      "Daily executive newsletter & breaking dispatches",
      "Basic community directory listing",
      "Access to public webinars & press releases"
    ],
    iconName: "Compass",
    targetAudience: "Students, Junior Researchers & Casual Readers",
    includesMagazine: true,
    peerIntroductionsPerMonth: 0
  },
  {
    id: "tier-rnd",
    name: "In-House / R&D Pro",
    departmentTag: "R&D, Formulation & QC",
    departmentCode: "rnd",
    badge: "Recommended for Scientists",
    description: "Deep technical dossiers, clinical trial intelligence, and formulation breakthroughs.",
    monthlyPriceINR: 999,
    yearlyPriceINR: 9999,
    currency: "₹",
    features: [
      "Unlimited access to all R&D, Clinical & Regulatory dossiers",
      "Full digital magazine archive (PDF & 3D Reader)",
      "Formulation & API Sourcing database access",
      "CDMO & CRO verified vendor directory",
      "5 direct peer introductions/month with R&D peers",
      "Invites to quarterly R&D Expert Roundtables"
    ],
    iconName: "FlaskConical",
    targetAudience: "R&D Scientists, QC Managers, Formulation Heads, Clinical Researchers",
    includesMagazine: true,
    peerIntroductionsPerMonth: 5
  },
  {
    id: "tier-sales",
    name: "Sales & Commercial",
    departmentTag: "Sales, BD & Market Access",
    departmentCode: "sales",
    badge: "Most Popular",
    popular: true,
    description: "Market access intelligence, pricing trends, and targeted commercial networking.",
    monthlyPriceINR: 1499,
    yearlyPriceINR: 14999,
    currency: "₹",
    features: [
      "Full access to Commercial & Market Access intelligence",
      "Pharma market trends, tenders & pricing tracker",
      "Pharma Brand & Molecule performance dashboards",
      "Full digital magazine archive (PDF & 3D Reader)",
      "10 direct peer introductions/month with BD leaders",
      "Priority networking at Mediverse Executive Summits"

    ],
    iconName: "TrendingUp",
    targetAudience: "Sales Directors, Business Development, Brand Managers, Commercial Heads",
    includesMagazine: true,
    peerIntroductionsPerMonth: 10
  },
  {
    id: "tier-logistics",
    name: "Supply Chain & Logistics",
    departmentTag: "Logistics, Cold Chain & SCM",
    departmentCode: "logistics",
    description: "Cold-chain tracking, packaging compliance, CDMO partner networks, and logistics news.",
    monthlyPriceINR: 999,
    yearlyPriceINR: 9999,
    currency: "₹",
    features: [
      "Dedicated Supply Chain & Cold-Chain intelligence section",
      "Pharma Packaging & Temperature-Control compliance reports",
      "Logistics Partner & CDMO Directory access",
      "Full digital magazine archive (PDF & 3D Reader)",
      "5 direct peer introductions/month with SCM leads",
      "Supply Chain disruption alerts & regulatory updates"
    ],
    iconName: "Truck",
    targetAudience: "Supply Chain VPs, Logistics Leads, Packaging Technologists, CDMO Managers",
    includesMagazine: true,
    peerIntroductionsPerMonth: 5
  },
  {
    id: "tier-enterprise",
    name: "Organization / Enterprise",
    departmentTag: "Corporate & Multisite",
    departmentCode: "enterprise",
    description: "Organization-wide access for pharma firms, CDMOs, and institutional teams.",
    monthlyPriceINR: 4999,
    yearlyPriceINR: 49999,
    currency: "₹",
    features: [
      "Multi-user team license (Up to 25 seats included)",
      "Unrestricted access across R&D, Commercial & SCM portals",
      "Custom company dashboard & white-glove onboarding",
      "Unlimited peer networking across all departments",
      "Dedicated account manager & quarterly trend briefings",
      "Co-branded press releases & thought leadership slots"
    ],
    iconName: "Building2",
    targetAudience: "Pharma Companies, CDMOs, CROs, Tech Solution Vendors",
    includesMagazine: true,
    peerIntroductionsPerMonth: 999
  }
]

export function getTierById(id: string): SubscriptionTier | undefined {
  return SUBSCRIPTION_TIERS.find((t) => t.id === id)
}

export function getRecommendedTierForDepartment(dept: string): SubscriptionTier {
  const normalized = dept.toLowerCase()
  if (normalized.includes("r&d") || normalized.includes("formulation") || normalized.includes("quality") || normalized.includes("research")) {
    return SUBSCRIPTION_TIERS[1] // R&D
  }
  if (normalized.includes("sales") || normalized.includes("commercial") || normalized.includes("business") || normalized.includes("marketing")) {
    return SUBSCRIPTION_TIERS[2] // Sales
  }
  if (normalized.includes("supply") || normalized.includes("logistics") || normalized.includes("scm") || normalized.includes("packaging")) {
    return SUBSCRIPTION_TIERS[3] // Logistics
  }
  return SUBSCRIPTION_TIERS[2] // Default Most Popular
}
