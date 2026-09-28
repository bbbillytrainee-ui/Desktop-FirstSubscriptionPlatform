import Logo from "../brand/Logo"
import { ISSUES } from "../../data/fixtures/issues"

export interface FooterProps {
  onNavigate?: (route: string) => void
}

const COLUMNS: { title: string; links: { label: string; route: string }[] }[] = [
  {
    title: "Magazine",
    links: [
      { label: "Current issue (3D reader)", route: "magazine" },
      { label: "Digital archive", route: "archive" },
      { label: "Thought leadership", route: "thought-leadership" },
      { label: "Executive interviews", route: "interviews" },
      { label: "Submit a press release", route: "press-release" },
    ],
  },
  {
    title: "Intelligence",
    links: [
      { label: "Research reports", route: "reports" },
      { label: "Regulatory navigator", route: "regulatory-navigator" },
      { label: "Trend telemetry", route: "trends" },
      { label: "Webinars & masterclasses", route: "webinars" },
      { label: "Events & conclaves", route: "events" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Subscriptions & plans", route: "subscriptions" },
      { label: "Refer a colleague", route: "referral" },
      { label: "For professionals", route: "professionals" },
      { label: "For enterprise teams", route: "companies" },
      { label: "CDMO & partner directory", route: "vendors" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Mediverse", route: "about" },
      { label: "Advertise / media kit", route: "advertise" },
      { label: "Morning brief", route: "newsletter" },
      { label: "RSS & live feeds", route: "rss-feeds" },
    ],
  },
]

export default function Footer({ onNavigate }: FooterProps) {
  const go = (route: string) => onNavigate?.(route)
  const issue = ISSUES[0]

  return (
    <footer className="relative overflow-hidden mt-auto bg-[var(--color-footer-dark)] text-[var(--text-inverse-muted)] border-t border-[var(--border-inverse)] px-6 md:px-12 pt-16">
      <div className="max-w-[var(--container-max)] mx-auto">
        {/* Masthead row: brand + mission, current issue */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] gap-10 pb-12 border-b border-[var(--border-inverse)]">
          <div>
            <button type="button" onClick={() => go("home")} aria-label="Mediverse home" className="min-h-11 inline-flex items-center">
              <Logo size="md" inverse />
            </button>
            <p className="mt-5 font-serif text-h3 font-normal text-white max-w-[30ch] [text-wrap:balance]">
              A serious monthly publication <span className="italic text-[var(--accent-on-inverse)]">&amp;</span> verified peer network for the people building what healthcare becomes next.
            </p>
          </div>

          <button
            type="button"
            onClick={() => go("magazine")}
            className="group self-start text-left rounded-card border border-[var(--border-inverse)] bg-white/[0.03] p-5 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-between font-mono text-label font-semibold uppercase">
              <span className="text-[var(--accent-on-inverse)]">Issue #{issue.number}</span>
              <span>{issue.month}</span>
            </span>
            <span className="mt-3 block font-serif text-h4 font-semibold text-white">{issue.theme}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-caption font-semibold text-white">
              Read the current issue
              <span aria-hidden="true" className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1">→</span>
            </span>
          </button>
        </div>

        {/* Link columns: 2-up on phones, 4-up from md */}
        <nav aria-label="Footer" className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 py-12">
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h2 className="mb-3 font-mono text-label font-semibold uppercase text-[var(--accent-on-inverse)]">{col.title}</h2>
              <ul className="space-y-0.5 md:space-y-2">
                {col.links.map(link => (
                  <li key={link.route}>
                    <button
                      type="button"
                      onClick={() => go(link.route)}
                      className="footer-link text-left text-sm min-h-11 md:min-h-0"
                    >
                      {link.label}
                      <span aria-hidden="true" className="footer-link-arrow">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Compliance bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-6 border-t border-[var(--border-inverse)] font-mono text-[11px] uppercase tracking-[0.08em]">
          <p>© 2026 Mediverse Life Sciences</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <span>DPDP Act 2023 compliant</span>
            <span aria-hidden="true" className="opacity-50">/</span>
            <span>Explicit-consent matching</span>
            <span aria-hidden="true" className="opacity-50">/</span>
            <span>Professional use only</span>
          </p>
        </div>
      </div>

      {/* Oversized wordmark, cut off by the footer edge */}
      <div aria-hidden="true" className="footer-wordmark -mb-[0.18em] text-center">Mediverse</div>
    </footer>
  )
}
