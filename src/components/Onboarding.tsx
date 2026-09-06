import { useState, KeyboardEvent } from "react"
import Logo from "./brand/Logo"
import Button from "./ui/Button"
import Tag from "./ui/Tag"

export interface OnboardingProps {
  onComplete: () => void
}

const ROLES = [
  { id: "rnd", track: "In-House & R&D", label: "Scientist & R&D Lead", desc: "Formulation, drug discovery, QC/QA, clinical research", package: "In-House R&D Package (₹999/mo)" },
  { id: "sales", track: "Commercial & Sales", label: "BD, Licensing & Commercial", desc: "Out-licensing, market access, commercial launches, sales", package: "Sales & Commercial Package (₹1,499/mo)" },
  { id: "logistics", track: "Supply Chain & Logistics", label: "Supply Chain & Manufacturing", desc: "Cold-chain distribution, CDMO sourcing, packaging, transit", package: "Logistics Package (₹999/mo)" },
  { id: "clinical", track: "Clinical & Regulatory", label: "Regulatory & Clinical Lead", desc: "CDSCO/FDA submissions, clinical trials, pharmacovigilance", package: "In-House R&D Package (₹999/mo)" },
  { id: "executive", track: "Executive & Corporate", label: "C-Suite, Founder & Investor", desc: "Enterprise licensing, executive networking, team seats", package: "Enterprise Package" },
]

const DEPARTMENTS = [
  "In-House R&D & Formulation",
  "Sales, BD & Market Access",
  "Supply Chain, Logistics & Packaging",
  "Regulatory Affairs & Quality (CDSCO/FDA)",
  "Clinical Operations & Medical Affairs",
  "Corporate Leadership & C-Suite",
  "Other Pharma Function"
]

const EXPERIENCE_LEVELS = [
  "0 - 2 Years (Early Career)",
  "3 - 5 Years (Mid-Level)",
  "6 - 10 Years (Senior Lead)",
  "10+ Years (Executive / Director)"
]

const TAGS = [
  "Gene Therapy", "AI Diagnostics", "Regulatory Affairs", "Clinical Operations",
  "Oncology BD", "mRNA Platforms", "Surgical Robotics", "Health Economics",
  "Digital Therapeutics", "Cold Chain Logistics", "Medical Affairs", "Companion Diagnostics",
  "Neurology Pipeline", "Rare Disease", "Cell & Gene", "Market Access",
  "Pharmacovigilance", "CDMO Partnerships", "Licensing & IP", "API Sourcing"
]

const GOALS = [
  { id: "collaborators", label: "Find Cross-Functional Collaborators", desc: "Connect with peers across R&D, regulatory, or commercial domains" },
  { id: "vendors", label: "Find Vetted CDMOs & Logistics Partners", desc: "Cold-chain providers, clinical CROs, and packaging specialists" },
  { id: "commercial", label: "Source Licensing & BD Leads", desc: "Product licensing opportunities and commercial distribution leads" },
  { id: "informed", label: "Stay Informed With Sector Drops", desc: "High-signal monthly editorial drops and magazine issues" },
]

const CITIES = ["Mumbai", "Bangalore", "Hyderabad", "Delhi NCR", "Pune", "Chennai", "Ahmedabad", "Singapore", "Other"]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  
  // Form State
  const [selectedRole, setSelectedRole] = useState("")
  const [fullName, setFullName] = useState("Siddharth Rao")
  const [organization, setOrganization] = useState("Tata Elxsi Health")
  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [experience, setExperience] = useState(EXPERIENCE_LEVELS[2])
  const [jobTitle, setJobTitle] = useState("Associate Director, Pharmacovigilance")
  const [city, setCity] = useState("Bangalore")
  const [linkedin, setLinkedin] = useState("linkedin.com/in/siddharth-rao")
  const [referralCodeInput, setReferralCodeInput] = useState("")
  const [appliedRefSuccess, setAppliedRefSuccess] = useState(false)

  const [matchingConsentChoice, setMatchingConsentChoice] = useState<"opted_in" | "opted_out" | null>("opted_in")
  const [selectedTags, setSelectedTags] = useState<string[]>(["Regulatory Affairs", "AI Diagnostics", "Pharmacovigilance"])
  const [selectedGoal, setSelectedGoal] = useState("collaborators")
  const [notifyEnabled, setNotifyEnabled] = useState(true)
  
  const [copiedReferral, setCopiedReferral] = useState(false)
  const totalSteps = 7

  const userReferralCode = "MEDIVERSE-REF-" + Math.floor(1000 + Math.random() * 9000)
  const referralLink = `https://mediverse.network/join?ref=${userReferralCode}`


  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 5 ? [...prev, tag] : prev
    )
  }

  const canNext = (s: number) => {
    switch (s) {
      case 1: return selectedRole !== ""
      case 2: return fullName.trim() !== "" && organization.trim() !== "" && jobTitle.trim() !== ""
      case 3: return matchingConsentChoice !== null
      case 4: return selectedTags.length >= 3
      case 5: return selectedGoal !== ""
      case 6: return true
      case 7: return true
      default: return false
    }
  }

  const next = () => { if (canNext(step) && step < totalSteps) setStep(s => s + 1) }
  const back = () => { if (step > 1) setStep(s => s - 1) }

  const handleApplyReferralCode = () => {
    if (referralCodeInput.trim().length > 3) {
      setAppliedRefSuccess(true)
    }
  }

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink)
    setCopiedReferral(true)
    setTimeout(() => setCopiedReferral(false), 2500)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && canNext(step) && step < totalSteps) {
      next()
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center px-4 py-8" onKeyDown={handleKeyDown}>
      <div className="w-full max-w-[var(--modal-max)] bg-white border border-[var(--color-border-subtle)] rounded-sm shadow-[0_8px_40px_rgba(13,59,74,0.08)] overflow-hidden">
        
        {/* Progress Header */}
        <div className="px-6 md:px-10 pt-8 pb-6 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <Logo size="sm" />
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-slate-muted)]">
              Step {step} of {totalSteps}
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="grid grid-cols-7 gap-1.5 h-1.5 w-full bg-[var(--color-surface)] rounded-full overflow-hidden mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-full transition-all ${
                  i + 1 <= step ? "bg-[var(--color-brand-coral)]" : "bg-[var(--color-border-subtle)]"
                }`}
              />
            ))}
          </div>

          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl md:text-3xl font-semibold text-[var(--color-ink)]">
            {step === 1 && "Select your vertical & role"}
            {step === 2 && "Workplace & Department Details"}
            {step === 3 && "Matching Consent & DPDP Privacy"}
            {step === 4 && "Choose 3 to 5 areas of focus"}
            {step === 5 && "What is your primary goal?"}
            {step === 6 && "Monthly Drop Notification Cadence"}
            {step === 7 && "Activation Complete & Referral Code"}
          </h2>
        </div>

        {/* Step Body */}
        <div className="p-6 md:p-10 min-h-[360px] flex flex-col justify-between">
          
          {/* STEP 1: ROLE & VERTICAL */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--color-slate-muted)] mb-2">
                Choose your domain to personalize your monthly intelligence drops and department membership:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {ROLES.map(role => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3.5 rounded-sm border cursor-pointer transition-all flex items-center justify-between ${
                      selectedRole === role.id
                        ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)]/5 ring-1 ring-[var(--color-brand-teal)]"
                        : "border-[var(--color-border-subtle)] hover:border-[var(--color-brand-teal)]/40 hover:bg-[var(--color-surface)]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-[var(--color-ink)]">{role.label}</span>
                        <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] bg-[var(--color-surface)] text-[var(--color-brand-teal)] px-1.5 py-0.2 rounded-sm border border-[var(--color-border-subtle)]">
                          {role.track}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-slate-muted)]">{role.desc}</p>
                    </div>
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-brand-coral)] font-semibold whitespace-nowrap pl-2">
                      {role.package}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: WORKPLACE & PROFESSIONAL DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--color-slate-muted)] mb-1">
                Tell us about your workplace, department, and experience level to tailor your network matches:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Siddharth Rao"
                    className="w-full px-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-sm bg-white focus:outline-none focus:border-[var(--color-brand-teal)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder="e.g. Sun Pharma, Cipla, Biocon, Dr. Reddy's"
                    className="w-full px-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-sm bg-white focus:outline-none focus:border-[var(--color-brand-teal)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Department / Function *</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-sm bg-white focus:outline-none focus:border-[var(--color-brand-teal)]"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Head of Supply Chain / Lead Scientist"
                    className="w-full px-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-sm bg-white focus:outline-none focus:border-[var(--color-brand-teal)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Years of Experience in Pharma</label>
                  <select
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-sm bg-white focus:outline-none focus:border-[var(--color-brand-teal)]"
                  >
                    {EXPERIENCE_LEVELS.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Primary Location / Hub</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--color-border-subtle)] rounded-sm bg-white focus:outline-none focus:border-[var(--color-brand-teal)]"
                  >
                    {CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Referral Code Field */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Have a Referral Code? (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralCodeInput}
                    onChange={e => setReferralCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. MERIDIAN-REF-8842"
                    className="flex-1 px-3 py-1.5 text-xs font-mono border border-[var(--color-border-subtle)] rounded-sm bg-white focus:outline-none focus:border-[var(--color-brand-coral)] uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyReferralCode}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium rounded-sm transition-colors text-[var(--color-ink)]"
                  >
                    Apply Code
                  </button>
                </div>
                {appliedRefSuccess && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    ✓ Referral code applied! You will get 1 month extra trial upon activation.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: MATCHING CONSENT (DPDP COMPLIANCE) */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-5 bg-[var(--color-surface)] border-l-4 border-[var(--color-brand-teal)] rounded-sm">
                <h4 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-2">
                  Transparent Data Usage Notice
                </h4>
                <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed mb-3">
                  Under India's Digital Personal Data Protection (DPDP) Act, 2023, matching consent must be explicitly chosen and separate from Terms of Service.
                </p>
                <p className="text-xs text-[var(--color-ink)] font-medium leading-relaxed">
                  "We use your department ({department}), organization, and selected interest tags to generate monthly introduction drops with verified peers. We never sell your data or share your direct contact details without your explicit permission."
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setMatchingConsentChoice("opted_in")}
                  className={`p-4 rounded-sm border cursor-pointer flex items-start gap-3 transition-all ${
                    matchingConsentChoice === "opted_in"
                      ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)]/5"
                      : "border-[var(--color-border-subtle)] hover:border-[var(--color-brand-teal)]/40"
                  }`}
                >
                  <div className={`consent-check mt-0.5 ${matchingConsentChoice === "opted_in" ? "checked" : ""}`}>
                    {matchingConsentChoice === "opted_in" && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[var(--color-ink)] block">
                      Opt-in to Monthly Introductions (Recommended)
                    </span>
                    <span className="text-xs text-[var(--color-slate-muted)]">
                      Receive explainable cross-disciplinary introductions on the 1st of every month.
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setMatchingConsentChoice("opted_out")}
                  className={`p-4 rounded-sm border cursor-pointer flex items-start gap-3 transition-all ${
                    matchingConsentChoice === "opted_out"
                      ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)]/5"
                      : "border-[var(--color-border-subtle)] hover:border-[var(--color-brand-teal)]/40"
                  }`}
                >
                  <div className={`consent-check mt-0.5 ${matchingConsentChoice === "opted_out" ? "checked" : ""}`}>
                    {matchingConsentChoice === "opted_out" && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[var(--color-ink)] block">
                      Decline Matching (Magazine Access Only)
                    </span>
                    <span className="text-xs text-[var(--color-slate-muted)]">
                      Read monthly intelligence articles without participating in algorithmic network matching.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TOPICS */}
          {step === 4 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[var(--color-slate-muted)]">
                  Selected {selectedTags.length} of 5 (minimum 3 required)
                </span>
                {selectedTags.length >= 3 && (
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-brand-coral)] font-semibold">
                    ✓ Focus threshold met
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-[260px] overflow-y-auto p-1">
                {TAGS.map(tag => (
                  <Tag
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: GOAL */}
          {step === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GOALS.map(goal => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-5 rounded-sm border cursor-pointer transition-all ${
                    selectedGoal === goal.id
                      ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)]/5 ring-1 ring-[var(--color-brand-teal)]"
                      : "border-[var(--color-border-subtle)] hover:border-[var(--color-brand-teal)]/40 hover:bg-[var(--color-surface)]"
                  }`}
                >
                  <h4 className="text-sm font-semibold text-[var(--color-ink)] mb-1">{goal.label}</h4>
                  <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">{goal.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* STEP 6: NOTIFICATIONS */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm">
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] font-semibold uppercase text-[var(--color-brand-coral)] tracking-wider block mb-1">
                  Monthly Cadence
                </span>
                <h4 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-2">
                  Matches & Editorial Drop on the 1st of Every Month
                </h4>
                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">
                  We don&apos;t spam daily notifications. You get one monthly alert when your new introduction drop and magazine issue are released.
                </p>
              </div>

              <div
                onClick={() => setNotifyEnabled(v => !v)}
                className="p-4 border border-[var(--color-border-subtle)] rounded-sm flex items-center justify-between cursor-pointer hover:bg-[var(--color-surface)] transition-colors"
              >
                <div>
                  <span className="text-sm font-semibold text-[var(--color-ink)] block">
                    Notify me when my monthly match drop is ready
                  </span>
                  <span className="text-xs text-[var(--color-slate-muted)]">
                    Sent via email on the 1st of every month at 9:00 AM IST.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEnabled}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[var(--color-brand-coral)] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 7: SUMMARY & REFERRAL REWARD */}
          {step === 7 && (
            <div className="space-y-5">
              <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--color-slate-muted)]">Member:</span>
                  <span className="font-semibold text-[var(--color-ink)]">{fullName} ({experience})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-slate-muted)]">Role & Workplace:</span>
                  <span className="font-semibold text-[var(--color-ink)]">{jobTitle} · {organization} ({department})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-slate-muted)]">Consent:</span>
                  <span className="font-semibold text-[var(--color-brand-coral)]">
                    {matchingConsentChoice === "opted_in" ? "Opted In (DPDP Verified)" : "Magazine Access Only"}
                  </span>
                </div>
              </div>

              {/* Referral Incentive Widget */}
              <div className="p-5 bg-white border-2 border-[var(--color-brand-coral)] rounded-sm relative shadow-sm">
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-[10px] font-semibold uppercase bg-[var(--color-brand-coral)] text-white px-2 py-0.5 rounded-sm inline-block mb-2"
                >
                  Colleague Referral Program
                </span>
                <h4 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-1">
                  Invite 3 Life Science Colleagues → Unlock 1 Month Professional Free
                </h4>
                <p className="text-xs text-[var(--color-slate-muted)] mb-4">
                  Share your personal link with peers in regulatory, clinical, BD, or logistics. When 3 join, you automatically receive a free month upgrade.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 px-3 py-2 text-xs bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm font-mono select-all"
                  />
                  <Button variant="coral" size="sm" onClick={handleCopyReferral}>
                    {copiedReferral ? "Copied! ✓" : "Copy Link"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--color-border-subtle)]">
            <Button variant="ghost" size="sm" onClick={back} disabled={step === 1}>
              ← Back
            </Button>

            {step < totalSteps ? (
              <Button variant="coral" size="sm" onClick={next} disabled={!canNext(step)}>
                Continue →
              </Button>
            ) : (
              <Button variant="primary" size="md" onClick={onComplete}>
                Complete Activation & Enter Platform
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
