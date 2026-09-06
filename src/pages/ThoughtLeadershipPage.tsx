import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { AUTHORS } from "../data/fixtures/authors"

export interface ThoughtLeadershipPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function ThoughtLeadershipPage({ onJoin, onNavigate }: ThoughtLeadershipPageProps) {
  const [pitchSubmitted, setPitchSubmitted] = useState(false)
  const [pitchAuthor, setPitchAuthor] = useState("")
  const [pitchTopic, setPitchTopic] = useState("")
  const [pitchAbstract, setPitchAbstract] = useState("")

  const handleSubmitPitch = (e: React.FormEvent) => {
    e.preventDefault()
    if (pitchAuthor && pitchTopic) {
      setPitchSubmitted(true)
    }
  }

  const columns = [
    {
      author: AUTHORS[0],
      title: "Building Real-World Evidence Frameworks for CDSCO AI Submissions",
      tagline: "How dual-center validation cohorts and model drift logging satisfy emerging Indian medical device mandates.",
      category: "Regulatory & AI",
      readTime: "6 min read",
    },
    {
      author: AUTHORS[1],
      title: "Cross-Border Surgical Robotics Licensing: Structuring APAC Joint Ventures",
      tagline: "Strategic blueprints for co-development IP pools, local clinical trials, and procedure-based hospital leasing models.",
      category: "MedTech BD",
      readTime: "8 min read",
    },
    {
      author: AUTHORS[3],
      title: "Decentralized Oncology Clinical Trials in Tier-2 Regional Hospitals",
      tagline: "Addressing investigator training, cold-chain drug transport, and patient retention beyond metro medical centers.",
      category: "Clinical Ops",
      readTime: "7 min read",
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      
      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Masthead */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Publish With Mediverse
          </span>

          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Thought Leadership & Expert Columns
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Peer-reviewed essays, regulatory frameworks, and operational strategies authored by practicing life science directors, clinicians, and technology pioneers.
          </p>
        </div>

        {/* Featured Columns Grid (Photo-First Layout) */}
        <div className="mb-16">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[var(--color-border-subtle)]">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-teal)]">
              Featured Industry Columnists
            </span>
            <span className="text-xs text-[var(--color-slate-muted)] font-mono">
              Monthly Expert Perspectives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col, idx) => (
              <div
                key={idx}
                className="bg-white border border-[var(--color-border-subtle)] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[var(--color-brand-teal)] transition-all group"
              >
                <div>
                  {/* Author Portrait Photo (Photo First) */}
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={col.author.photo}
                      alt={col.author.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                      <span className="text-white text-xs font-bold">{col.author.name}</span>
                      <span className="text-white/80 text-[11px]">{col.author.role}, {col.author.company}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-slate-muted)] mb-2">
                      <span className="uppercase font-bold text-[var(--color-brand-coral)]">{col.category}</span>
                      <span>{col.readTime}</span>
                    </div>

                    <h3
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                      className="text-base font-semibold text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-brand-teal)] transition-colors leading-snug"
                    >
                      {col.title}
                    </h3>

                    <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed line-clamp-3 mb-4">
                      {col.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[var(--color-border-subtle)]/40 flex items-center justify-between">
                  <Badge type="pro" label="Verified Column" />
                  <button
                    onClick={() => onNavigate && onNavigate("magazine")}
                    className="text-xs font-semibold text-[var(--color-brand-coral)] font-mono hover:underline"
                  >
                    Read Column →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines & Pitch Submission Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-[var(--color-border-subtle)]">
          {/* Guidelines Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-3">
                Editorial Pillars & Standards
              </h3>
              <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed mb-4">
                We value deep operational specificity over generic market commentary. High-performing submissions typically explore:
              </p>
              <ul className="space-y-3 text-sm text-[var(--color-ink)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-brand-coral)] font-bold">✓</span>
                  <span><strong>First-hand regulatory navigation:</strong> Specific CDSCO, FDA, or EMA dossier compilation strategies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-brand-coral)] font-bold">✓</span>
                  <span><strong>Supply chain case studies:</strong> Cold-chain packaging, temperature drift remediation, and depot audits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-brand-coral)] font-bold">✓</span>
                  <span><strong>Commercial licensing mechanics:</strong> Co-development IP structures and companion diagnostics payer negotiations.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm">
              <h4 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-2">
                Contributor Privileges
              </h4>
              <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">
                Published authors receive prominent Contributor verification badges, public bylines with corporate affiliation, complimentary Professional access, and priority matching placement.
              </p>
            </div>
          </div>

          {/* Submission Form Column */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm">
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-2">
                Submit an Editorial Pitch
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] mb-6">
                Our editorial team reviews pitches weekly for upcoming monthly issues.
              </p>

              {pitchSubmitted ? (
                <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-brand-teal)]/30 rounded-sm text-center">
                  <span className="text-2xl mb-2 block">✓</span>
                  <h4 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-1">
                    Pitch Received
                  </h4>
                  <p className="text-xs text-[var(--color-slate-muted)]">
                    Thank you, {pitchAuthor}. Our editors will review your pitch on &ldquo;{pitchTopic}&rdquo; and follow up within 3 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPitch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Your Name & Role *</label>
                    <input
                      type="text"
                      required
                      value={pitchAuthor}
                      onChange={e => setPitchAuthor(e.target.value)}
                      placeholder="e.g. Dr. Leila Ahmadi, Head of Medical Affairs"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Proposed Article Title / Topic *</label>
                    <input
                      type="text"
                      required
                      value={pitchTopic}
                      onChange={e => setPitchTopic(e.target.value)}
                      placeholder="e.g. Real-World Evidence Frameworks in Oncology"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Short Abstract / Core Takeaways (2-3 sentences)</label>
                    <textarea
                      rows={4}
                      value={pitchAbstract}
                      onChange={e => setPitchAbstract(e.target.value)}
                      placeholder="Summarize the operational problem your piece addresses and key insights for peers."
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <Button variant="coral" size="md" className="w-full">
                    Submit Editorial Pitch →
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
