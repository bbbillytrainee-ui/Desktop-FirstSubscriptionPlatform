import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { WhatsAppIcon, LinkedInIcon, MailIcon, CheckIcon } from "../components/ui/Icons"
import { MOCK_REFERRAL_STATS } from "../data/fixtures/referrals"

export interface ReferralPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function ReferralPage({ onJoin, onNavigate }: ReferralPageProps) {
  const [copied, setCopied] = useState(false)
  const [invitedEmail, setInvitedEmail] = useState("")
  const [invitedName, setInvitedName] = useState("")
  const [sentSuccess, setSentSuccess] = useState(false)
  const stats = MOCK_REFERRAL_STATS

  const handleCopy = () => {
    navigator.clipboard.writeText(stats.inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (invitedEmail.trim()) {
      setSentSuccess(true)
      setInvitedEmail("")
      setInvitedName("")
      setTimeout(() => setSentSuccess(false), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      
      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-4 sm:px-6 md:px-12 py-10 w-full">
        
        {/* Top Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)]">
              Network Growth Program
            </span>
            <Badge type="pro" label={stats.currentTierBadge} />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--color-ink)] mb-3">
            Invite Colleagues & Expand Your Network
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-slate-muted)] max-w-3xl leading-relaxed">
            Give your life science colleagues 1 month free access to Mediverse Life Sciences. For every 2 colleagues who sign up, you unlock +1 month of department-pro features and +5 peer introductions.
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-[var(--color-border-subtle)] p-5 rounded-sm shadow-xs">
            <span className="text-xs text-[var(--color-slate-muted)] block mb-1">Invites Sent</span>
            <span className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)]">{stats.totalInvitesSent}</span>
            <span className="text-[10px] text-gray-400 block mt-1">Direct & link shares</span>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] p-5 rounded-sm shadow-xs">
            <span className="text-xs text-[var(--color-slate-muted)] block mb-1">Colleagues Joined</span>
            <span className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-teal)]">{stats.totalJoined}</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckIcon size={12} /> Active members
            </span>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] p-5 rounded-sm shadow-xs">
            <span className="text-xs text-[var(--color-slate-muted)] block mb-1">Bonus Months Earned</span>
            <span className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-coral)]">{stats.bonusMonthsEarned} Mo</span>
            <span className="text-[10px] text-[var(--color-brand-coral)] block mt-1">Value ₹2,998</span>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] p-5 rounded-sm shadow-xs">
            <span className="text-xs text-[var(--color-slate-muted)] block mb-1">Peer Introductions</span>
            <span className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)]">+{stats.peerIntroductionsUnlocked}</span>
            <span className="text-[10px] text-gray-400 block mt-1">Extra match credits</span>
          </div>
        </div>

        {/* Invite Link & Email Invite Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Share Link Card (2 cols) */}
          <div className="lg:col-span-2 bg-white border border-[var(--color-border-subtle)] p-6 rounded-sm shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)] mb-2">
                Your Personal Referral Link & Code
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] mb-5">
                Share this link on LinkedIn, WhatsApp, or email. Anyone registering with your link or code automatically gets priority network matching.
              </p>

              {/* Link Input Bar */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-4">
                <input
                  type="text"
                  readOnly
                  value={stats.inviteLink}
                  className="flex-1 px-3 py-2.5 bg-gray-50 border border-[var(--color-border-subtle)] rounded-sm font-mono text-xs text-[var(--color-ink)] select-all focus:outline-none"
                />
                <Button variant="coral" size="sm" onClick={handleCopy} className="whitespace-nowrap">
                  {copied ? "Copied to Clipboard! ✓" : "Copy Link"}
                </Button>
              </div>

              {/* Code Display */}
              <div className="flex items-center gap-3 text-xs text-[var(--color-slate-muted)] bg-[var(--color-surface)] p-3 rounded-sm">
                <span>Referral Code: <strong className="font-mono text-[var(--color-ink)] text-sm">{stats.userCode}</strong></span>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="border-t border-gray-100 pt-4 mt-6">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-3">Quick Share:</span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Join me on Mediverse Life Sciences — premier B2B pharma intelligence platform. Use my link to get 1 month free access: ${stats.inviteLink}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors"
                >
                  <WhatsAppIcon size={14} />
                  <span>Share on WhatsApp</span>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(stats.inviteLink)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors"
                >
                  <LinkedInIcon size={14} />
                  <span>Share on LinkedIn</span>
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent("Invitation to Mediverse Life Sciences")}&body=${encodeURIComponent(`Hi,\n\nI wanted to invite you to join Mediverse Life Sciences platform. It provides department-segmented intelligence, 3D magazine flipbooks, and peer networking for pharma leads.\n\nUse my invite link to claim 1 month free: ${stats.inviteLink}\n\nBest regards`)}`}
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors"
                >
                  <MailIcon size={14} />
                  <span>Email Colleagues</span>
                </a>
              </div>
            </div>
          </div>

          {/* Direct Email Invite Form (1 col) */}
          <div className="bg-white border border-[var(--color-border-subtle)] p-6 rounded-sm shadow-xs">
            <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)] mb-2">
              Send Direct Invitation
            </h3>
            <p className="text-xs text-[var(--color-slate-muted)] mb-4">
              Enter your colleague&apos;s email address to send them a personalized invitation from Mediverse.
            </p>

            <form onSubmit={handleSendInvite} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-ink)] mb-1">Colleague Name</label>
                <input
                  type="text"
                  value={invitedName}
                  onChange={e => setInvitedName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm bg-white focus:outline-none focus:border-[var(--color-brand-teal)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-ink)] mb-1">Workplace Email *</label>
                <input
                  type="email"
                  required
                  value={invitedEmail}
                  onChange={e => setInvitedEmail(e.target.value)}
                  placeholder="e.g. rkumar@sunpharma.com"
                  className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm bg-white focus:outline-none focus:border-[var(--color-brand-teal)]"
                />
              </div>

              <Button type="submit" variant="primary" size="sm" className="w-full mt-2">
                Send Invitation Pass
              </Button>

              {sentSuccess && (
                <p className="text-xs text-emerald-600 font-medium bg-emerald-50 p-2.5 rounded-sm border border-emerald-200 flex items-center gap-1.5">
                  <CheckIcon size={14} />
                  <span>Invitation sent successfully to {invitedEmail}!</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Referred Colleagues Table */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 mb-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
                Referred Colleagues & Rewards Tracking
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)]">
                Track the status of your invitations and rewards earned.
              </p>
            </div>
            <span className="text-xs text-[var(--color-brand-teal)] font-medium">
              {stats.referredUsers.filter(u => u.status === "active").length} of {stats.referredUsers.length} Activated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-[var(--color-surface)] text-[var(--color-slate-muted)] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Colleague</th>
                  <th className="py-3 px-4">Organization & Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Reward Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.referredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--color-ink)]">{user.name}</td>
                    <td className="py-3.5 px-4 text-[var(--color-slate-muted)]">{user.role} at {user.organization}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-sm text-[10px] font-medium">
                        {user.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-slate-muted)]">{user.joinedDate}</td>
                    <td className="py-3.5 px-4">
                      {user.status === "active" ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckIcon size={10} /> Joined & Active
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          ○ Invite Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[var(--color-brand-coral)]">
                      {user.rewardEarned}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Rules & FAQ */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm p-6 sm:p-8">
          <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)] mb-4">
            Referral Program Details & FAQ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[var(--color-slate-muted)]">
            <div>
              <h4 className="font-semibold text-[var(--color-ink)] text-sm mb-1">Who can I invite?</h4>
              <p className="leading-relaxed">
                Any verified professional working in pharmaceuticals, biotech, clinical research, CDMO, medical devices, or supply chain.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-ink)] text-sm mb-1">When do I receive rewards?</h4>
              <p className="leading-relaxed">
                Rewards are applied to your account automatically as soon as your referee completes their workplace registration.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-ink)] text-sm mb-1">Is there an invite limit?</h4>
              <p className="leading-relaxed">
                There is no cap on referrals! You can stack bonus months up to 12 months free per year.
              </p>
            </div>
          </div>
        </div>

      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
