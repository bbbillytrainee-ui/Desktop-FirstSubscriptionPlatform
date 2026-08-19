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
    <div className={`text-[10px] font-medium tracking-[0.08em] uppercase ${dark ? "text-[#5A6B7C]" : "text-[#5A6B7C]"}`}>{category}</div>
    <div className={`text-sm font-semibold leading-snug ${dark ? "text-[#F8F6F0]" : "text-[#1A1A1A]"}`} style={{ fontFamily: "Newsreader, Georgia, serif" }}>{title}</div>
    <div className="mt-auto">
      <span className="read-pill">{readTime}</span>
    </div>
  </div>
)

export default function Landing({ onGetAccess }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F6F0" }}>
      {/* Nav */}
      <header className="flex items-center justify-between px-12 py-5 border-b border-[rgba(26,26,26,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-px h-7 bg-[#1A1A1A] mr-1" />
          <span style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
            Meridian
          </span>
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#5A6B7C] ml-1 mt-0.5">
            Life Sciences
          </span>
        </div>
        <nav className="flex items-center gap-8">
          <a href="#" className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors">About</a>
          <a href="#" className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors">Editorial</a>
          <a href="#" className="text-sm text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors">Pricing</a>
          <button
            onClick={onGetAccess}
            className="text-sm font-medium px-5 py-2 bg-[#1A1A1A] text-[#F8F6F0] rounded-sm hover:bg-[#2a2a2a] transition-colors"
          >
            Sign In
          </button>
        </nav>
      </header>

      {/* Hero — asymmetric 55/45 split */}
      <main className="flex-1 grid" style={{ gridTemplateColumns: "55fr 45fr", minHeight: "calc(100vh - 65px)" }}>

        {/* LEFT: Headline + CTA */}
        <div className="flex flex-col justify-center px-16 py-20 border-r border-[rgba(26,26,26,0.1)] relative">
          {/* Issue badge */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-6 h-px bg-[#D4A373]" />
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">
              Issue 24 · August 2026
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{ fontFamily: "Newsreader, Georgia, serif", lineHeight: 1.08, letterSpacing: "-0.02em" }}
            className="text-[68px] font-semibold text-[#1A1A1A] mb-8"
          >
            The intelligence layer for<br />
            <span className="saffron-underline italic">pharma minds.</span>
          </h1>

          {/* Descriptor */}
          <p className="text-[18px] leading-relaxed text-[#5A6B7C] mb-12 max-w-[480px]">
            A monthly journal and curated matching network for mid-career professionals in pharmaceutical, medtech, and AI-health. Read deeply. Connect deliberately.
          </p>

          {/* CTA cluster */}
          <div className="flex items-center gap-5">
            <button
              onClick={onGetAccess}
              className="px-8 py-4 bg-[#1A1A1A] text-[#F8F6F0] text-[15px] font-medium rounded-sm hover:bg-[#2a2a2a] transition-colors"
            >
              Request Early Access
            </button>
            <span className="text-sm text-[#5A6B7C]">
              ₹1,999 / month · Expense-ready
            </span>
          </div>

          {/* Social proof */}
          <div className="mt-16 pt-8 border-t border-[rgba(26,26,26,0.1)] flex items-center gap-10">
            <div>
              <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-3xl font-semibold text-[#1A1A1A]">2,400+</div>
              <div className="text-xs text-[#5A6B7C] mt-0.5 tracking-wide">Verified professionals</div>
            </div>
            <div className="w-px h-10 bg-[rgba(26,26,26,0.12)]" />
            <div>
              <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-3xl font-semibold text-[#1A1A1A]">94%</div>
              <div className="text-xs text-[#5A6B7C] mt-0.5 tracking-wide">Match acceptance rate</div>
            </div>
            <div className="w-px h-10 bg-[rgba(26,26,26,0.12)]" />
            <div>
              <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-3xl font-semibold text-[#1A1A1A]">Monthly</div>
              <div className="text-xs text-[#5A6B7C] mt-0.5 tracking-wide">Curated drops, not feeds</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Magazine mockup preview */}
        <div className="relative flex flex-col p-8 gap-4 overflow-hidden" style={{ background: "#EDEAE2" }}>
          {/* Molecular background */}
          <div className="absolute inset-0 pointer-events-none">
            <MolecularSVG />
          </div>

          {/* Magazine grid mockup */}
          <div className="relative z-10 flex flex-col gap-4 h-full">
            {/* Hero card */}
            <div className="rounded-sm bg-[#1A1A1A] p-6 relative overflow-hidden flex-shrink-0" style={{ minHeight: "200px" }}>
              <div className="absolute inset-0 article-image-bg opacity-10" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-px bg-[#D4A373]" />
                  <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#D4A373]">Cover Story</span>
                </div>
                <h2 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-2xl font-semibold text-[#F8F6F0] leading-tight mb-3">
                  FDA's Draft Guidance on AI-Enabled Diagnostics: What Every Regulatory Affairs Lead Needs to Know
                </h2>
                <div className="flex items-center gap-3">
                  <span className="read-pill">8 min</span>
                  <span className="text-xs text-[#5A6B7C]">Dr. Priya Nair · Aug 12</span>
                </div>
              </div>
            </div>

            {/* 2-column cards */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              <MiniArticleCard
                title="CRISPR Patent Landscape Q3 2026: Who Holds the Keys"
                category="IP & Strategy"
                readTime="5 min"
              />
              <MiniArticleCard
                title="MedTech VC Deal Flow: $2.3B Deployed in Surgical Robotics"
                category="Investment"
                readTime="4 min"
              />
              <MiniArticleCard
                title="mRNA Platform Scalability: Supply Chain Constraints Ahead"
                category="Manufacturing"
                readTime="6 min"
                dark
              />
              <MiniArticleCard
                title="GLP-1 Pipeline Crowding: Differentiation Strategies for Late Entrants"
                category="Commercial"
                readTime="7 min"
              />
            </div>
          </div>

          {/* Issue label */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[rgba(26,26,26,0.12)]">
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#5A6B7C]">
              Meridian Life Sciences · Vol. 2 Issue 8
            </span>
            <span className="text-[10px] font-medium tracking-[0.08em] text-[#5A6B7C]">
              August 2026
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
