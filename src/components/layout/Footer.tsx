import Logo from "../brand/Logo"

export interface FooterProps {
  onNavigate?: (route: string) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNav = (route: string) => {
    if (onNavigate) {
      onNavigate(route)
    }
  }

  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-[var(--container-max)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[var(--color-border-subtle)]">
          {/* Col 1: Brand & Identity (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div onClick={() => handleNav("home")} className="cursor-pointer">
              <Logo size="md" />
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-slate-muted)] max-w-sm leading-relaxed">
              A serious monthly publication and verified peer network for leaders building what healthcare becomes next across Pharma, MedTech, and AI-Health.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span
                style={{ fontFamily: "'Geist Mono', monospace" }}
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white border border-[var(--color-border-subtle)] rounded-xs text-[var(--color-brand-teal)]"
              >
                Monthly Circulation
              </span>
              <span
                style={{ fontFamily: "'Geist Mono', monospace" }}
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white border border-[var(--color-border-subtle)] rounded-xs text-[var(--color-brand-coral)]"
              >
                Verified Directory
              </span>
            </div>
          </div>

          {/* Col 2: Magazine & Editorial (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <span
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] mb-1"
            >
              Magazine & Editorial
            </span>
            <button onClick={() => handleNav("magazine")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Current Issue (Flipbook Reader)
            </button>
            <button onClick={() => handleNav("archive")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Digital Issue Archive
            </button>
            <button onClick={() => handleNav("thought-leadership")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Thought Leadership Columns
            </button>
            <button onClick={() => handleNav("interviews")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Special Executive Interviews
            </button>
            <button onClick={() => handleNav("press-release")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Submit Press Release
            </button>
          </div>

          {/* Col 3: Industry & Intelligence (2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-teal)] mb-1"
            >
              Industry & Events
            </span>
            <button onClick={() => handleNav("reports")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Research Reports
            </button>
            <button onClick={() => handleNav("webinars")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Webinars & Masterclasses
            </button>
            <button onClick={() => handleNav("events")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Events & Conclaves
            </button>
            <button onClick={() => handleNav("regulatory-navigator")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Regulatory Navigator
            </button>
            <button onClick={() => handleNav("trends")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Trend Telemetry
            </button>
          </div>

          {/* Col 4: Network & Corporate (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <span
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-teal)] mb-1"
            >
              Network & Corporate
            </span>
            <button onClick={() => handleNav("subscriptions")} className="text-left text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-colors">
              Subscriptions & Packages →
            </button>
            <button onClick={() => handleNav("referral")} className="text-left text-xs text-[var(--color-brand-coral)] font-semibold hover:underline transition-colors">
              🎁 Colleague Referral Program
            </button>

            <button onClick={() => handleNav("professionals")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              For Verified Professionals
            </button>
            <button onClick={() => handleNav("companies")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              For Enterprise Teams
            </button>
            <button onClick={() => handleNav("vendors")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              CDMO & Partner Directory
            </button>
            <button onClick={() => handleNav("advertise")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              Advertise / Media Kit
            </button>
            <button onClick={() => handleNav("about")} className="text-left text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors">
              About Mediverse Life Sciences
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[var(--color-slate-muted)] font-mono">
          <div>© 2026 Mediverse Life Sciences. All rights reserved.</div>

          <div className="flex items-center gap-4 text-[10px] flex-wrap justify-center">
            <span>DPDP Act, 2023 Compliant</span>
            <span>·</span>
            <span>Explicit Consent Matching</span>
            <span>·</span>
            <span>Professional Use Only</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
