import { useState } from "react"

interface LandingProps {
  onGetAccess: () => void
}

const MolecularSVG = () => (
  <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full opacity-20">
    <circle cx="240" cy="180" r="6" fill="#5A6B7C" />
    <circle cx="340" cy="100" r="4" fill="#D4A373" />
    <circle cx="160" cy="260" r="4" fill="#5A6B7C" />
    <circle cx="400" cy="240" r="3" fill="#D4A373" />
    <circle cx="120" cy="120" r="3" fill="#1A1A1A" />
    <circle cx="320" cy="300" r="5" fill="#5A6B7C" />
    <circle cx="80" cy="200" r="4" fill="#D4A373" />
    <line x1="240" y1="180" x2="340" y2="100" stroke="#5A6B7C" strokeWidth="1.5" />
    <line x1="240" y1="180" x2="160" y2="260" stroke="#5A6B7C" strokeWidth="1.5" />
    <line x1="240" y1="180" x2="400" y2="240" stroke="#5A6B7C" strokeWidth="1" />
    <line x1="340" y1="100" x2="120" y2="120" stroke="#D4A373" strokeWidth="1" />
    <line x1="160" y1="260" x2="320" y2="300" stroke="#5A6B7C" strokeWidth="1.5" />
    <line x1="400" y1="240" x2="320" y2="300" stroke="#5A6B7C" strokeWidth="1" />
    <line x1="80" y1="200" x2="160" y2="260" stroke="#D4A373" strokeWidth="1" />
    <line x1="80" y1="200" x2="120" y2="120" stroke="#D4A373" strokeWidth="1" />
    <circle cx="240" cy="180" r="22" stroke="#5A6B7C" strokeWidth="0.75" strokeDasharray="4 3" />
    <circle cx="340" cy="100" r="16" stroke="#D4A373" strokeWidth="0.5" strokeDasharray="3 3" />
  </svg>
)

const MiniArticleCard = ({ title, category, readTime, dark = false }: {
  title: string; category: string; readTime: string; dark?: boolean
}) => (
  <div className={`rounded-sm border p-4 flex flex-col gap-2 ${dark ? "bg-[#1A1A1A] border-white/10" : "bg-white border-[rgba(26,26,26,0.1)]"}`}>
    <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#5A6B7C]">{category}</div>
    <div className={`text-sm font-semibold leading-snug ${dark ? "text-[#F8F6F0]" : "text-[#1A1A1A]"}`} style={{ fontFamily: "Newsreader, Georgia, serif" }}>{title}</div>
    <div className="mt-auto">
      <span className="read-pill">{readTime}</span>
    </div>
  </div>
)

const TRUST_COMPANIES = ["Pfizer", "AstraZeneca", "Medtronic", "Novo Nordisk", "Roche", "Sun Pharma", "IQVIA", "Biocon"]

const FEATURES = [
  { icon: "01", title: "Curated Monthly Editorial", desc: "Deep-dive analyses, expert interviews, and sector digests across Pharma, MedTech, and AI-Health — one deliberate drop per month." },
  { icon: "02", title: "Algorithmic Matching", desc: "Every month, get matched with 3-6 professionals based on your tags, role, and goals. See why each match was made — no black boxes." },
  { icon: "03", title: "Verified Network", desc: "Browse 2,400+ verified professionals. Corporate email auto-verification ensures every contact is real. Contributors are publicly credited." },
]

const TIERS = [
  { name: "Free", price: "₹0", period: "", features: ["1 article / month", "1 match / month", "Browse-only contacts"], cta: "Get Started", highlight: false },
  { name: "Professional", price: "₹1,999", period: "/ month", features: ["Full magazine access", "Unlimited matches", "Contributor visibility", "Rollover credits"], cta: "Start Professional", highlight: true },
  { name: "Enterprise", price: "Custom", period: "from ₹15K/mo", features: ["Team dashboard", "Sponsored placement", "Auto-verification", "Priority support"], cta: "Contact Sales", highlight: false },
]

export default function Landing({ onGetAccess }: LandingProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F6F0" }}>

      {/* ── Nav ── */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[rgba(26,26,26,0.1)] sticky top-0 z-30 bg-[#F8F6F0]/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-px h-7 bg-[#1A1A1A] mr-1" />
          <span style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
            Meridian
          </span>
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#5A6B7C] ml-1 mt-0.5">
            Life Sciences
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hide-mobile flex items-center gap-8">
          <a href="#features" className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors">Features</a>
          <a href="#editorial" className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors">Editorial</a>
          <a href="#pricing" className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors">Pricing</a>
          <button
            onClick={onGetAccess}
            className="text-sm font-medium px-5 py-2 bg-[#1A1A1A] text-[#F8F6F0] rounded-sm hover:bg-[#2a2a2a] transition-colors"
          >
            Sign In
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="show-mobile-only flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-px bg-[#1A1A1A] transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
          <div className={`w-5 h-px bg-[#1A1A1A] transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
        </button>
      </header>

      {/* Mobile slide-down menu */}
      {mobileMenuOpen && (
        <div className="show-mobile-only border-b border-[rgba(26,26,26,0.1)] bg-[#F8F6F0] px-6 py-5 flex flex-col gap-4 animate-fade-up z-20">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A]">Features</a>
          <a href="#editorial" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A]">Editorial</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A]">Pricing</a>
          <button
            onClick={() => { setMobileMenuOpen(false); onGetAccess() }}
            className="text-sm font-medium px-5 py-3 bg-[#1A1A1A] text-[#F8F6F0] rounded-sm w-full"
          >
            Sign In
          </button>
        </div>
      )}

      {/* ── Hero ── */}
      <main className="flex-1">
        <section className="grid grid-cols-1 lg:grid-cols-[55fr_45fr]" style={{ minHeight: "calc(100vh - 65px)" }}>

          {/* LEFT: Headline + CTA */}
          <div className="flex flex-col justify-center px-6 md:px-16 py-12 md:py-20 lg:border-r border-[rgba(26,26,26,0.1)] relative animate-fade-up">
            {/* Issue badge */}
            <div className="flex items-center gap-2 mb-8 md:mb-10">
              <div className="w-6 h-px bg-[#D4A373]" />
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">
                Issue 24 · August 2026
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{ fontFamily: "Newsreader, Georgia, serif", lineHeight: 1.08, letterSpacing: "-0.02em" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-semibold text-[#1A1A1A] mb-6 md:mb-8"
            >
              The intelligence layer for<br />
              <span className="saffron-underline italic">pharma minds.</span>
            </h1>

            {/* Descriptor */}
            <p className="text-base md:text-[18px] leading-relaxed text-[#5A6B7C] mb-8 md:mb-12 max-w-[480px]">
              A monthly journal and curated matching network for mid-career professionals in pharmaceutical, medtech, and AI-health. Read deeply. Connect deliberately.
            </p>

            {/* CTA cluster */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <button
                onClick={onGetAccess}
                className="px-8 py-4 bg-[#1A1A1A] text-[#F8F6F0] text-[15px] font-medium rounded-sm hover:bg-[#2a2a2a] transition-colors w-full sm:w-auto"
              >
                Request Early Access
              </button>
              <span className="text-sm text-[#5A6B7C]">
                ₹1,999 / month · Expense-ready
              </span>
            </div>

            {/* Social proof */}
            <div className="mt-12 md:mt-16 pt-8 border-t border-[rgba(26,26,26,0.1)] flex items-center gap-6 md:gap-10 flex-wrap">
              <div>
                <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-2xl md:text-3xl font-semibold text-[#1A1A1A]">2,400+</div>
                <div className="text-xs text-[#5A6B7C] mt-0.5 tracking-wide">Verified professionals</div>
              </div>
              <div className="w-px h-10 bg-[rgba(26,26,26,0.12)] hide-mobile" />
              <div>
                <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-2xl md:text-3xl font-semibold text-[#1A1A1A]">94%</div>
                <div className="text-xs text-[#5A6B7C] mt-0.5 tracking-wide">Match acceptance rate</div>
              </div>
              <div className="w-px h-10 bg-[rgba(26,26,26,0.12)] hide-mobile" />
              <div>
                <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Monthly</div>
                <div className="text-xs text-[#5A6B7C] mt-0.5 tracking-wide">Curated drops, not feeds</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Magazine mockup preview */}
          <div className="relative flex flex-col p-6 md:p-8 gap-4 overflow-hidden bg-[#EDEAE2] min-h-[400px] lg:min-h-0">
            <div className="absolute inset-0 pointer-events-none">
              <MolecularSVG />
            </div>
            <div className="relative z-10 flex flex-col gap-4 h-full">
              <div className="rounded-sm bg-[#1A1A1A] p-6 relative overflow-hidden flex-shrink-0" style={{ minHeight: "200px" }}>
                <div className="absolute inset-0 article-image-bg opacity-10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-px bg-[#D4A373]" />
                    <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#D4A373]">Cover Story</span>
                  </div>
                  <h2 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl md:text-2xl font-semibold text-[#F8F6F0] leading-tight mb-3">
                    {"FDA's Draft Guidance on AI-Enabled Diagnostics: What Every Regulatory Affairs Lead Needs to Know"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="read-pill">8 min</span>
                    <span className="text-xs text-[#5A6B7C]">{"Dr. Priya Nair · Aug 12"}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                <MiniArticleCard title="CRISPR Patent Landscape Q3 2026: Who Holds the Keys" category="IP & Strategy" readTime="5 min" />
                <MiniArticleCard title="MedTech VC Deal Flow: $2.3B Deployed in Surgical Robotics" category="Investment" readTime="4 min" />
                <MiniArticleCard title="mRNA Platform Scalability: Supply Chain Constraints Ahead" category="Manufacturing" readTime="6 min" dark />
                <MiniArticleCard title="GLP-1 Pipeline Crowding: Differentiation Strategies for Late Entrants" category="Commercial" readTime="7 min" />
              </div>
            </div>
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[rgba(26,26,26,0.12)]">
              <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#5A6B7C]">
                Meridian Life Sciences · Vol. 2 Issue 8
              </span>
              <span className="text-[10px] font-medium tracking-[0.08em] text-[#5A6B7C]">
                August 2026
              </span>
            </div>
          </div>
        </section>

        {/* ── Trust Bar ── */}
        <section className="border-y border-[rgba(26,26,26,0.08)] py-6 px-6 md:px-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-px bg-[#D4A373]" />
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">
              Trusted by professionals from
            </span>
          </div>
          <div className="flex items-center gap-6 md:gap-10 flex-wrap">
            {TRUST_COMPANIES.map(name => (
              <span
                key={name}
                className="trust-logo text-sm md:text-base font-semibold tracking-tight text-[#1A1A1A] cursor-default"
                style={{ fontFamily: "Newsreader, Georgia, serif" }}
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-6 md:px-16 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-px bg-[#D4A373]" />
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">What You Get</span>
            </div>
            <h2 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-12">
              Three pillars. One platform.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURES.map((f, i) => (
                <div
                  key={f.icon}
                  className="animate-fade-up border border-[rgba(26,26,26,0.1)] rounded-sm p-8 bg-white hover:border-[rgba(26,26,26,0.25)] transition-colors"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-[10px] font-bold tracking-[0.12em] text-[#D4A373] mb-4">{f.icon}</div>
                  <h3 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl font-semibold text-[#1A1A1A] mb-3">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[#5A6B7C] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Editorial Preview ── */}
        <section id="editorial" className="px-6 md:px-16 py-16 md:py-24 bg-[#EDEAE2]">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-px bg-[#D4A373]" />
                  <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">Latest Issue</span>
                </div>
                <h2 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
                  August 2026 · Vol. 2 Issue 8
                </h2>
              </div>
              <span className="tier-badge pro hide-mobile">Professional Preview</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { cat: "Cover Story", title: "FDA's Draft Guidance on AI-Enabled Diagnostics", time: "8 min", author: "Dr. Priya Nair" },
                { cat: "IP & Strategy", title: "CRISPR Patent Landscape Q3 2026", time: "5 min", author: "Marcus Osei-Bonsu" },
                { cat: "Investment", title: "MedTech VC Deal Flow: $2.3B in Surgical Robotics", time: "4 min", author: "Tanvir Hussain" },
              ].map((a, i) => (
                <div key={i} className="bg-white border border-[rgba(26,26,26,0.08)] rounded-sm p-6 flex flex-col gap-3 hover:border-[rgba(26,26,26,0.2)] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-px bg-[#D4A373]" />
                    <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#5A6B7C]">{a.cat}</span>
                  </div>
                  <h3 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-lg font-semibold text-[#1A1A1A] leading-snug group-hover:text-[#5A6B7C] transition-colors">
                    {a.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-auto">
                    <span className="read-pill">{a.time}</span>
                    <span className="text-xs text-[#5A6B7C]">{a.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="px-6 md:px-16 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-px bg-[#D4A373]" />
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">Pricing</span>
            </div>
            <h2 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-4">
              Plans that scale with your career.
            </h2>
            <p className="text-sm text-[#5A6B7C] mb-12 max-w-[520px]">
              {"Whether you're a student building your network or a manager scaling your team's intelligence — there's a tier for you."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TIERS.map(tier => (
                <div
                  key={tier.name}
                  className={`rounded-sm p-8 flex flex-col gap-5 border transition-colors ${
                    tier.highlight
                      ? "border-[#1A1A1A] border-2 bg-white shadow-[0_8px_40px_rgba(26,26,26,0.08)]"
                      : "border-[rgba(26,26,26,0.12)] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl font-semibold text-[#1A1A1A]">{tier.name}</h3>
                    {tier.highlight && <span className="tier-badge pro">Most Popular</span>}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-3xl font-semibold text-[#1A1A1A]">{tier.price}</span>
                    <span className="text-sm text-[#5A6B7C]">{tier.period}</span>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#5A6B7C]">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                          <path d="M3 7.5L5.5 10L11 4" stroke="#D4A373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onGetAccess}
                    className={`mt-auto py-3 text-sm font-medium rounded-sm transition-colors ${
                      tier.highlight
                        ? "bg-[#1A1A1A] text-[#F8F6F0] hover:bg-[#2a2a2a]"
                        : "border border-[rgba(26,26,26,0.2)] text-[#1A1A1A] hover:border-[rgba(26,26,26,0.5)]"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-6 md:px-16 py-16 md:py-20 bg-[#1A1A1A] text-center">
          <div className="max-w-[600px] mx-auto">
            <h2 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-3xl md:text-4xl font-semibold text-[#F8F6F0] mb-4">
              Ready to read deeper and connect deliberately?
            </h2>
            <p className="text-sm text-[#5A6B7C] mb-8">
              Join 2,400+ pharma, medtech, and AI-health professionals. Your first match drop is one click away.
            </p>
            <button
              onClick={onGetAccess}
              className="px-10 py-4 bg-[#D4A373] text-[#1A1A1A] text-[15px] font-semibold rounded-sm hover:bg-[#c9965f] transition-colors"
            >
              Request Early Access
            </button>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="px-6 md:px-16 py-8 border-t border-[rgba(26,26,26,0.08)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-px h-4 bg-[#1A1A1A] opacity-40" />
          <span style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-sm font-medium text-[#5A6B7C]">
            Meridian Life Sciences
          </span>
        </div>
        <div className="flex items-center gap-6 text-[11px] text-[#5A6B7C] flex-wrap justify-center">
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Editorial Guidelines</a>
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Grievance Officer</a>
          <span>© 2026 Meridian Life Sciences Pvt. Ltd.</span>
        </div>
      </footer>
    </div>
  )
}
