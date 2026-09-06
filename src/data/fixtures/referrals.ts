export interface ReferredUser {
  id: string
  name: string
  organization: string
  role: string
  department: string
  joinedDate: string
  status: 'active' | 'pending'
  rewardEarned: string
}

export interface ReferralStats {
  userCode: string
  inviteLink: string
  totalInvitesSent: number
  totalJoined: number
  pendingInvites: number
  bonusMonthsEarned: number
  peerIntroductionsUnlocked: number
  currentTierBadge: string
  nextMilestone: string
  referredUsers: ReferredUser[]
}

export const MOCK_REFERRAL_STATS: ReferralStats = {
  userCode: "MEDIVERSE-REF-8842",
  inviteLink: "https://mediverse.network/join?ref=MEDIVERSE-REF-8842",

  totalInvitesSent: 8,
  totalJoined: 4,
  pendingInvites: 4,
  bonusMonthsEarned: 2,
  peerIntroductionsUnlocked: 10,
  currentTierBadge: "Pharma Connector (Level 2)",
  nextMilestone: "2 more signups to unlock 3 months of In-House R&D Pro access free!",
  referredUsers: [
    {
      id: "ref-1",
      name: "Dr. Ananya Sharma",
      organization: "Sun Pharma Advanced Research",
      role: "Lead Scientist, Formulation",
      department: "In-House R&D",
      joinedDate: "2026-08-14",
      status: "active",
      rewardEarned: "+1 Month Pro Access"
    },
    {
      id: "ref-2",
      name: "Vikram Malhotra",
      organization: "Cipla Supply Chain Labs",
      role: "Associate VP, Cold Chain Operations",
      department: "Supply Chain & Logistics",
      joinedDate: "2026-08-22",
      status: "active",
      rewardEarned: "+5 Peer Introductions"
    },
    {
      id: "ref-3",
      name: "Meera Deshmukh",
      organization: "Dr. Reddy's Laboratories",
      role: "Global BD & Licensing Manager",
      department: "Sales & Commercial",
      joinedDate: "2026-09-01",
      status: "active",
      rewardEarned: "+1 Month Pro Access"
    },
    {
      id: "ref-4",
      name: "Rohan Varma",
      organization: "Lupin Pharma Tech",
      role: "Senior Director, Regulatory Affairs",
      department: "Regulatory Affairs",
      joinedDate: "2026-09-04",
      status: "active",
      rewardEarned: "+5 Peer Introductions"
    },
    {
      id: "ref-5",
      name: "Karan Patel",
      organization: "Torrent Pharmaceuticals",
      role: "Logistics Specialist",
      department: "Supply Chain & Logistics",
      joinedDate: "2026-09-06",
      status: "pending",
      rewardEarned: "Pending Signup"
    }
  ]
}
