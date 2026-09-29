import { useState } from "react"
import Button from "./ui/Button"

interface DoctorOpportunity {
  id: string
  title: string
  sponsor: string
  type: "Clinical Trial PI" | "Advisory Board" | "SaMD Validation" | "KOL Roundtable"
  specialty: string
  compensation: string
  timeline: string
  location: string
  requirements: string[]
  description: string
  status: "Open" | "Reviewing" | "Closed"
}

const OPPORTUNITIES: DoctorOpportunity[] = [
  {
    id: "doc-1",
    title: "Phase III Multi-Center Solid Tumor Trial — Principal Investigator",
    sponsor: "Biocon Biologics · Oncology Division",
    type: "Clinical Trial PI",
    specialty: "Oncology",
    compensation: "Institutional Grant + Honorarium",
    timeline: "Q4 2026 – Q2 2027",
    location: "Mumbai / Bengaluru / Hyderabad (Multi-Center)",
    requirements: [
      "MD / DM Medical Oncology with GCP accreditation",
      "Prior experience leading Phase II/III sponsored trials",
      "Institutional Ethics Committee (IEC) clearance capability"
    ],
    description: "Seeking experienced clinical oncologists to serve as site Principal Investigators for a comparative bioequivalence and clinical endpoint trial of a second-generation monoclonal antibody.",
    status: "Open"
  },
  {
    id: "doc-2",
    title: "SaMD Clinical Validation Panel — AI Diagnostic Software",
    sponsor: "Tata Medical Diagnostics & MedTech Lab",
    type: "SaMD Validation",
    specialty: "Cardiology",
    compensation: "₹1,50,000 / Advisory Package",
    timeline: "6-Week Advisory Cycle",
    location: "Remote / Virtual",
    requirements: [
      "DM Cardiology or equivalent board certification",
      "Clinical experience with 12-lead telemetry & arrhythmia detection",
      "Comfort reviewing algorithm sensitivity/specificity dossiers"
    ],
    description: "Expert clinician panel to evaluate clinical drift, specificity thresholds, and edge-case cardiac rhythm classifications in adherence with CDSCO SaMD Form MD-14 guidelines.",
    status: "Open"
  },
  {
    id: "doc-3",
    title: "Formulary & Patient Adherence Advisory Board — GLP-1 Agonist",
    sponsor: "Sun Pharma Advanced Research",
    type: "Advisory Board",
    specialty: "Endocrinology",
    compensation: "₹85,000 honorarium per session",
    timeline: "Quarterly Sessions (3 per year)",
    location: "Hybrid (Delhi NCR & Virtual)",
    requirements: [
      "Senior Consultant Endocrinologist or Diabetologist (10+ yrs)",
      "Hospital formulary or institutional prescribing experience"
    ],
    description: "Quarterly closed-door clinician advisory board reviewing real-world tolerability, injection frequency adherence, and patient self-administration data for novel metabolic formulations.",
    status: "Open"
  },
  {
    id: "doc-4",
    title: "Central Nervous System Biomarker Surveillance Roundtable",
    sponsor: "Dr. Reddy's Laboratories · Clinical Neuroscience",
    type: "KOL Roundtable",
    specialty: "Neurology",
    compensation: "Honorarium & CME Accreditation",
    timeline: "Sept 18, 2026 · 17:00 IST",
    location: "Virtual Closed-Door Session",
    requirements: [
      "Neurologist / Neuro-radiologist active in clinical practice",
      "Interest in neuro-degenerative early-detection biomarkers"
    ],
    description: "Interactive peer symposium discussing cerebrospinal fluid (CSF) and blood-based tau/amyloid biomarkers in clinical diagnostic algorithms across tertiary care hospitals.",
    status: "Open"
  }
]

export default function DoctorTab() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const specialties = ["All", "Oncology", "Cardiology", "Endocrinology", "Neurology"]

  const countOf = (type: DoctorOpportunity["type"]) =>
    String(OPPORTUNITIES.filter(o => o.type === type).length)

  const filteredList = OPPORTUNITIES.filter(item => {
    const matchesSpecialty = selectedSpecialty === "All" || item.specialty === selectedSpecialty
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sponsor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSpecialty && matchesSearch
  })

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-8 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)]">
              Doctor & Medical Advisory Portal
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[var(--color-surface)] text-[var(--color-slate-muted)] border border-[var(--color-border-subtle)]">
              Preview · sample listings
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--color-ink)] leading-tight">
            Physician & Clinical Advisory Hub
          </h1>
          <p className="text-sm md:text-base text-[var(--color-slate-muted)] mt-2 max-w-2xl leading-relaxed">
            Direct collaboration between practicing doctors, clinical trial sponsors, and biopharma R&D teams. Review protocols, join advisory boards, and lead investigative studies.
          </p>
        </div>

        {/* Doctor Verification Status Pill */}
        <div className="p-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shrink-0 min-w-[240px]">
          <div className="text-[11px] font-mono uppercase text-[var(--color-slate-muted)] mb-1">
            Doctor Credentialing
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--color-slate-muted)]" />
            <span className="text-xs font-semibold text-[var(--color-ink)]">
              MCI / NMC: Not verified
            </span>
          </div>
          <div className="text-[11px] text-[var(--color-slate-muted)] mt-1.5">
            Credential verification is coming soon
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Clinical Trial PI Roles", value: countOf("Clinical Trial PI"), hint: "Phase II/III investigators" },
          { label: "Advisory Boards", value: countOf("Advisory Board"), hint: "Seeking KOL specialists" },
          { label: "SaMD Validation Panels", value: countOf("SaMD Validation"), hint: "AI & device protocols" },
          { label: "KOL Roundtables", value: countOf("KOL Roundtable"), hint: "Closed-door sessions" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-md bg-card border border-[var(--color-border-subtle)] shadow-xs">
            <div className="font-mono text-2xl font-bold text-[var(--color-ink)] mb-0.5">
              {stat.value}
            </div>
            <div className="text-xs font-medium text-[var(--color-ink)]">
              {stat.label}
            </div>
            <div className="text-[11px] text-[var(--color-slate-muted)] mt-0.5">
              {stat.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Specialty Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors shrink-0 ${
                selectedSpecialty === spec
                  ? "bg-[var(--color-brand-teal)] text-white shadow-xs"
                  : "bg-[var(--color-surface)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] border border-[var(--color-border-subtle)]"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative sm:w-64">
          <input
            type="text"
            placeholder="Search trials, sponsors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-card border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)] text-[var(--color-ink)] placeholder-[var(--color-slate-muted)]"
          />
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[var(--color-border-subtle)] rounded-md">
            <p className="text-sm text-[var(--color-slate-muted)]">No clinical opportunities match the selected criteria.</p>
          </div>
        ) : (
          filteredList.map((opp) => {
            return (
              <div
                key={opp.id}
                className="p-6 rounded-md bg-card border border-[var(--color-border-subtle)] hover:border-[var(--color-brand-teal)] transition duration-200 shadow-xs"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)]">
                        {opp.type}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)]">
                        {opp.specialty}
                      </span>
                      <span className="text-[11px] text-[var(--color-slate-muted)] font-mono">
                        {opp.location}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg md:text-xl font-bold text-[var(--color-ink)] mb-1">
                      {opp.title}
                    </h3>
                    
                    <div className="text-xs font-medium text-[var(--color-brand-coral)] mb-3">
                      {opp.sponsor}
                    </div>

                    <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                      {opp.description}
                    </p>

                    {/* Requirements checklist */}
                    <div className="space-y-1 mb-4">
                      <div className="text-[11px] font-mono font-semibold uppercase text-[var(--color-slate-muted)]">
                        Key Investigator Criteria:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[var(--color-ink)]">
                        {opp.requirements.map((req, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-2">
                            <span className="text-[var(--color-brand-teal)] font-bold">✓</span>
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--color-slate-muted)]">
                      <div>
                        <span className="text-[var(--color-slate-muted)]">Compensation:</span>{" "}
                        <strong className="text-[var(--color-ink)]">{opp.compensation}</strong>
                      </div>
                      <div>
                        <span className="text-[var(--color-slate-muted)]">Timeline:</span>{" "}
                        <strong className="text-[var(--color-ink)]">{opp.timeline}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 md:min-w-[160px] justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="w-full justify-center"
                    >
                      Applications open soon
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
