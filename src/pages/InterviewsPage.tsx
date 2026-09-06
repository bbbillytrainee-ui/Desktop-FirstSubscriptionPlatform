import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Badge from "../components/ui/Badge"
import { AUTHORS } from "../data/fixtures/authors"

export interface InterviewsPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function InterviewsPage({ onJoin, onNavigate }: InterviewsPageProps) {
  const interviewees = [
    {
      author: AUTHORS[0],
      topic: "CDSCO Mandates for AI-Software-as-a-Medical-Device: What Innovators Must Know",
      quote: "Algorithm validation is moving from synthetic bench testing to multi-center clinical drift surveillance. The regulatory bar is rising fast.",
      date: "September 2026",
    },
    {
      author: AUTHORS[1],
      topic: "Cross-Border Surgical Robotics: Structuring Licensing and Local Assembly",
      quote: "Emerging APAC markets cannot support \$2M upfront device capex. We are re-architecting procedure-based leasing with local assembly partners.",
      date: "August 2026",
    },
    {
      author: AUTHORS[4],
      topic: "Diagnostics-Payer Convergence: Establishing HEOR Evidence in Oncology",
      quote: "Precision companion diagnostics save health systems millions, but only if clinical reimbursement frameworks align with real-world outcomes.",
      date: "July 2026",
    },
    {
      author: AUTHORS[3],
      topic: "The Next 5 Years of APAC Biologics Scale-Up and Cleanroom Architecture",
      quote: "Single-use continuous bioprocessing is slashing facility commissioning timelines from 36 months down to 14 months.",
      date: "June 2026",
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      
      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Executive & Pioneer Dialogue
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Special Interviews Archive
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            In-depth, unvarnished conversations with Chief Medical Officers, biotech founders, and regulatory strategists building next-generation healthcare.
          </p>
        </div>

        {/* Interviews Grid (Photo-First Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {interviewees.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[var(--color-border-subtle)] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[var(--color-brand-teal)] transition-all group shadow-sm"
            >
              <div>
                {/* Photo First Container */}
                <div className="h-64 w-full overflow-hidden relative">
                  <img
                    src={item.author.photo}
                    alt={item.author.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <span
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                      className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)] mb-1"
                    >
                      {item.date} · Executive Dialogue
                    </span>
                    <h3 className="text-white text-lg font-bold">{item.author.name}</h3>
                    <p className="text-white/80 text-xs">{item.author.role}, <span className="font-semibold text-white">{item.author.company}</span></p>
                  </div>
                </div>

                <div className="p-6">
                  <h4
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    className="text-lg font-semibold text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-brand-teal)] transition-colors leading-snug"
                  >
                    {item.topic}
                  </h4>

                  <blockquote className="text-xs text-[var(--color-slate-muted)] italic border-l-2 border-[var(--color-brand-coral)] pl-3 my-3 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[var(--color-border-subtle)]/40 flex items-center justify-between">
                <Badge type="pro" label="Exclusive Transcript" />
                <button
                  onClick={() => onNavigate && onNavigate("magazine")}
                  className="text-xs font-semibold text-[var(--color-brand-teal)] hover:text-[var(--color-brand-coral)] transition-colors font-mono"
                >
                  Read Full Q&A Transcript →
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
