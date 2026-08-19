import { useState } from "react"

interface OnboardingProps {
  onComplete: () => void
}

const TAGS = [
  "Gene Therapy", "AI Diagnostics", "Regulatory Affairs", "Clinical Operations",
  "Oncology BD", "mRNA Platforms", "Surgical Robotics", "Health Economics",
  "Digital Therapeutics", "Supply Chain", "Medical Affairs", "Companion Diagnostics",
  "Neurology Pipeline", "Rare Disease", "Cell & Gene", "Market Access",
  "Pharmacovigilance", "Wearables & Sensors",
]

const GOALS = [
  { id: "collaborators", label: "Find Collaborators", desc: "Cross-functional partners for research, clinical, or commercial projects" },
  { id: "vendors", label: "Find Vendors", desc: "Vetted service providers, CROs, CDMOs, and technology partners" },
  { id: "mentors", label: "Find Mentors", desc: "Senior professionals who've navigated the challenges you're facing" },
  { id: "informed", label: "Stay Informed", desc: "Deep-dive editorial without the networking — pure signal, no noise" },
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedGoal, setSelectedGoal] = useState("")
  const [notifyEnabled, setNotifyEnabled] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 5 ? [...prev, tag] : prev
    )
  }

  const canNext1 = selectedTags.length >= 3
  const canNext2 = selectedGoal !== ""

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F8F6F0" }}>
      {/* Modal */}
      <div className="w-full max-w-[700px] bg-white border border-[rgba(26,26,26,0.1)] rounded-sm shadow-[0_8px_40px_rgba(26,26,26,0.08)]">

        {/* Modal header */}
        <div className="px-10 pt-10 pb-6 border-b border-[rgba(26,26,26,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-px h-5 bg-[#1A1A1A]" />
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">
              Meridian Life Sciences
            </span>
          </div>
          <h2 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-3xl font-semibold text-[#1A1A1A]">
            {step === 1 && "What do you follow?"}
            {step === 2 && "What brings you here?"}
            {step === 3 && "Stay in the loop."}
          </h2>
          <p className="text-sm text-[#5A6B7C] mt-2">
            {step === 1 && "Select 3–5 topics to shape your editorial feed and match profile."}
            {step === 2 && "Your goal shapes who we surface in your monthly match drop."}
            {step === 3 && "Meridian drops matches once a month. Set your preference."}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mt-6">
            {[1, 2, 3].map(n => (
              <div
                key={n}
                className="h-0.5 flex-1 rounded-full transition-colors duration-300"
                style={{ background: n <= step ? "#1A1A1A" : "rgba(26,26,26,0.12)" }}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-10 py-8" style={{ minHeight: "340px" }}>

          {/* Step 1: Tag chips */}
          {step === 1 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`tag-chip text-sm px-4 py-2 border rounded-full ${selectedTags.includes(tag) ? "selected" : "border-[rgba(26,26,26,0.2)] text-[#1A1A1A] bg-transparent"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2">
                <span
                  className="text-sm font-medium transition-colors"
                  style={{ color: selectedTags.length >= 3 ? "#D4A373" : "#5A6B7C" }}
                >
                  {selectedTags.length}/5 selected
                </span>
                {selectedTags.length >= 3 && (
                  <span className="text-sm text-[#5A6B7C]">— good to go</span>
                )}
                {selectedTags.length < 3 && (
                  <span className="text-sm text-[#5A6B7C]">— pick at least 3</span>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Goal cards */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`goal-card text-left p-5 border rounded-sm relative ${selectedGoal === goal.id ? "selected" : "border-[rgba(26,26,26,0.15)]"}`}
                >
                  {selectedGoal === goal.id && (
                    <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                  <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-lg font-semibold text-[#1A1A1A] mb-2">
                    {goal.label}
                  </div>
                  <div className="text-sm text-[#5A6B7C] leading-relaxed">
                    {goal.desc}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Notification toggle */}
          {step === 3 && (
            <div className="flex flex-col gap-8">
              <div className="flex items-start justify-between gap-8 p-6 border border-[rgba(26,26,26,0.12)] rounded-sm">
                <div className="flex-1">
                  <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Monthly Match Notifications
                  </div>
                  <p className="text-sm text-[#5A6B7C] leading-relaxed">
                    Notify me the day my monthly matches drop.
                  </p>
                  <p className="text-xs text-[#5A6B7C] mt-3 opacity-70">
                    Sent once per month on the 1st. No other emails.
                  </p>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => setNotifyEnabled(v => !v)}
                  className="flex-shrink-0 relative mt-0.5"
                  role="switch"
                  aria-checked={notifyEnabled}
                >
                  <div
                    className="toggle-track w-12 h-6 rounded-full"
                    style={{ background: notifyEnabled ? "#1A1A1A" : "rgba(26,26,26,0.15)" }}
                  />
                  <div
                    className="toggle-thumb absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                    style={{ transform: notifyEnabled ? "translateX(24px)" : "translateX(0)" }}
                  />
                </button>
              </div>

              <div className="flex flex-col gap-3 p-5 bg-[#F8F6F0] rounded-sm border border-[rgba(26,26,26,0.08)]">
                <div className="text-xs font-medium tracking-[0.08em] uppercase text-[#5A6B7C] mb-1">Your profile summary</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 bg-[#1A1A1A] text-[#F8F6F0] rounded-full">{t}</span>
                  ))}
                </div>
                <div className="text-sm text-[#5A6B7C] mt-1">
                  Goal: <span className="text-[#1A1A1A] font-medium">{GOALS.find(g => g.id === selectedGoal)?.label}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 pb-10 flex items-center justify-between">
          <button
            onClick={() => step > 1 && setStep(s => s - 1)}
            className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors"
            style={{ visibility: step > 1 ? "visible" : "hidden" }}
          >
            ← Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => (step === 1 ? canNext1 : canNext2) && setStep(s => s + 1)}
              disabled={step === 1 ? !canNext1 : !canNext2}
              className="px-7 py-3 bg-[#1A1A1A] text-[#F8F6F0] text-sm font-medium rounded-sm hover:bg-[#2a2a2a] transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-7 py-3 bg-[#1A1A1A] text-[#F8F6F0] text-sm font-medium rounded-sm hover:bg-[#2a2a2a] transition-colors"
            >
              Enter Platform →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
