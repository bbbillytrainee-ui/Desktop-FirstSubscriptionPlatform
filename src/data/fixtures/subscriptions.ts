export interface SubscriptionTier {
  id: string
  name: string
  departmentTag: string
  departmentCode: 'explorer' | 'rnd' | 'enterprise'
  badge?: string
  popular?: boolean
  description: string
  monthlyPriceINR: number
  yearlyPriceINR: number
  currency: string
  features: string[]
  iconName: 'Compass' | 'FlaskConical' | 'Building2'
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
      "Full 3D Magazine Reader access",
      "Daily executive dispatches & newsletter",
      "Basic community directory listing"
    ],
    iconName: "Compass",
    targetAudience: "Students, Junior Researchers & Casual Readers",
    includesMagazine: true,
    peerIntroductionsPerMonth: 0
  },
  {
    id: "tier-rnd",
    name: "In-House / R&D",
    departmentTag: "R&D, Formulation & QC",
    departmentCode: "rnd",
    badge: "Recommended",
    popular: false,
    description: "Deep technical dossiers, clinical trial intelligence, and formulation breakthroughs.",
    monthlyPriceINR: 99,
    yearlyPriceINR: 99,
    currency: "₹",
    features: [
      "Unlimited access to all R&D & Regulatory dossiers",
      "Full digital magazine archive (PDF & 3D Reader)",
      "Formulation, API & CDMO vendor directory",
      "5 direct peer introductions per month",
      "Invites to quarterly R&D Expert Roundtables"
    ],
    iconName: "FlaskConical",
    targetAudience: "R&D Scientists, QC Managers, Formulation Heads, Clinical Researchers",
    includesMagazine: true,
    peerIntroductionsPerMonth: 5
  },
  {
    id: "tier-enterprise",
    name: "Organization / Enterprise",
    departmentTag: "Corporate & Multisite",
    departmentCode: "enterprise",
    badge: "Most Popular",
    popular: true,
    description: "Organization-wide access for pharma firms, CDMOs, and institutional teams.",
    monthlyPriceINR: 9999,
    yearlyPriceINR: 9999,
    currency: "₹",
    features: [
      "Multi-user team license (Up to 25 seats included)",
      "Unrestricted access across R&D, Commercial & SCM portals",
      "Custom company dashboard & white-glove onboarding",
      "Unlimited peer networking across all departments",
      "Dedicated account manager & quarterly trend briefings"
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
  if (normalized.includes("organization") || normalized.includes("enterprise") || normalized.includes("company") || normalized.includes("team")) {
    return SUBSCRIPTION_TIERS[2] // Enterprise
  }
  return SUBSCRIPTION_TIERS[1] // Default In-House / R&D
}
