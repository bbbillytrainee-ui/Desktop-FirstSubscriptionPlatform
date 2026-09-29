export interface TierFeature {
  text: string
  /** Promised but not built yet — shown with a "Coming soon" tag instead of a tick */
  comingSoon?: boolean
}

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
  /** Name of the lower plan this one builds on; features then lists only what is added */
  includesTier?: string
  features: TierFeature[]
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
    description: "Read the digital magazine and open articles free, with a preview of every premium dossier.",
    monthlyPriceINR: 0,
    yearlyPriceINR: 0,
    currency: "₹",
    features: [
      { text: "Full 3D Magazine Reader access" },
      { text: "Open articles in full, plus a preview of every premium dossier" },
      { text: "Regular executive dispatches & newsletter" }
    ],
    iconName: "Compass",
    targetAudience: "Students, Junior Researchers & Casual Readers",
    includesMagazine: true,
    peerIntroductionsPerMonth: 0
  },
  {
    id: "tier-rnd",
    name: "Personal",
    departmentTag: "Personal Access",
    departmentCode: "rnd",
    badge: "Recommended",
    popular: false,
    description: "For individual professionals: every premium dossier in full, plus regulatory and vendor intelligence.",
    monthlyPriceINR: 99,
    yearlyPriceINR: 99,
    currency: "₹",
    includesTier: "Explorer",
    features: [
      { text: "Every premium dossier in full, across the magazine archive" },
      { text: "Regulatory Navigator dossiers & CDSCO compliance intelligence" },
      { text: "CDMO & vendor directory" },
      { text: "5 direct peer introductions per month" },
      { text: "Invites to expert roundtables" }
    ],
    iconName: "FlaskConical",
    targetAudience: "Individual Researchers, Clinicians, Consultants & Pharma Specialists",
    includesMagazine: true,
    peerIntroductionsPerMonth: 5
  },
  {
    id: "tier-enterprise",
    name: "Organization / Enterprise",
    departmentTag: "Corporate & Multisite",
    departmentCode: "enterprise",
    badge: "For Teams",
    popular: true,
    description: "For pharma companies, CDMOs, hospital networks and institutional teams.",
    monthlyPriceINR: 9999,
    yearlyPriceINR: 9999,
    currency: "₹",
    includesTier: "Personal",
    features: [
      { text: "Multi-user team license for up to 25 seats for corporate, R&D & doctor teams" },
      { text: "Dedicated enterprise dashboard with role-based member management & white-glove onboarding" },
      { text: "Verified Doctor & Clinical Investigator network access for trial advisory" },
      { text: "Unlimited peer networking across corporate, clinical & doctor networks" }
    ],
    iconName: "Building2",
    targetAudience: "Pharma Companies, CDMOs, CROs, Hospital Networks & Tech Solution Vendors",
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
  return SUBSCRIPTION_TIERS[1] // Default Personal
}
