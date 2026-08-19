const articles = [
  {
    id: 1,
    category: "Cover Story",
    title: "FDA's Draft Guidance on AI-Enabled Diagnostics: What Every Regulatory Affairs Lead Needs to Know",
    byline: "Dr. Priya Nair, VP Regulatory Affairs · Pfizer",
    date: "Aug 12, 2026",
    readTime: "8 min",
    excerpt: "The agency's proposed framework shifts from device-centric oversight to algorithm-centric governance, fundamentally changing how your team files 510(k) submissions for software-based diagnostic tools. Here is what you must action before the comment window closes.",
    hero: true,
  },
  {
    id: 2,
    category: "IP & Strategy",
    title: "CRISPR Patent Landscape Q3 2026: Who Holds the Keys to the Next Wave",
    byline: "Marcus Osei-Bonsu · Medtronic BD",
    date: "Aug 8, 2026",
    readTime: "5 min",
    excerpt: "Three licensing pools are reshaping the competitive dynamics around base-editing IP. A structured breakdown of the Broad, UC Berkeley, and Intellia positions.",
  },
  {
    id: 3,
    category: "Investment",
    title: "MedTech VC Deal Flow: $2.3B Deployed in Surgical Robotics Since January",
    byline: "Tanvir Hussain · Sofinnova Partners",
    date: "Aug 5, 2026",
    readTime: "4 min",
    excerpt: "Laparoscopic autonomy and haptic-feedback systems dominated Q1–Q2 deployment. What the deal structures reveal about investor conviction.",
  },
  {
    id: 4,
    category: "Manufacturing",
    title: "mRNA Platform Scalability: Supply Chain Constraints Ahead of the 2027 Pandemic Preparedness Window",
    byline: "Ananya Krishnamurthy · AstraZeneca",
    date: "Aug 3, 2026",
    readTime: "6 min",
    excerpt: "LNP lipid shortages and fill-finish capacity constraints will affect all but the most vertically integrated manufacturers within 18 months.",
  },
  {
    id: 5,
    category: "Commercial",
    title: "GLP-1 Pipeline Crowding: Differentiation Strategies for Late Entrants",
    byline: "Roshni Kapoor · Novo Nordisk",
    date: "Jul 28, 2026",
    readTime: "7 min",
    excerpt: "With 40+ molecules now in Phase II, the commercial question is no longer efficacy — it is formulary access, dosing convenience, and co-morbidity labeling.",
  },
  {
    id: 6,
    category: "Policy",
    title: "EU AI Act Implications for In Vitro Diagnostics: A 12-Month Compliance Roadmap",
    byline: "Dr. Johan Van der Berg · EAPM",
    date: "Jul 22, 2026",
    readTime: "9 min",
    excerpt: "High-risk AI system classifications under Annex III will capture most next-generation IVD platforms. The window for conformity assessment is narrowing.",
  },
]

const digests = [
  { label: "Gene Therapy Digest", date: "Aug 2026", unread: 3 },
  { label: "AI in Drug Discovery", date: "Aug 2026", unread: 1 },
  { label: "Regulatory Roundup", date: "Jul 2026", unread: 0 },
  { label: "Clinical Ops Briefing", date: "Jul 2026", unread: 2 },
]

const contributors = [
  { name: "Dr. Priya Nair", org: "Pfizer", topic: "Regulatory AI" },
  { name: "Marcus Osei-Bonsu", org: "Medtronic", topic: "IP Strategy" },
  { name: "Ananya Krishnamurthy", org: "AstraZeneca", topic: "mRNA Supply" },
  { name: "Roshni Kapoor", org: "Novo Nordisk", topic: "Commercial Strategy" },
]

const MolecularBg = () => (
  <svg viewBox="0 0 320 200" className="w-full h-full opacity-10" fill="none">
    <circle cx="160" cy="100" r="5" fill="#5A6B7C" />
    <circle cx="220" cy="50" r="3" fill="#D4A373" />
    <circle cx="100" cy="150" r="3" fill="#5A6B7C" />
    <circle cx="260" cy="140" r="2" fill="#D4A373" />
    <circle cx="60" cy="70" r="2.5" fill="#1A1A1A" />
    <line x1="160" y1="100" x2="220" y2="50" stroke="#5A6B7C" strokeWidth="1" />
    <line x1="160" y1="100" x2="100" y2="150" stroke="#5A6B7C" strokeWidth="1" />
    <line x1="160" y1="100" x2="260" y2="140" stroke="#5A6B7C" strokeWidth="0.75" />
    <line x1="220" y1="50" x2="60" y2="70" stroke="#D4A373" strokeWidth="0.75" />
    <circle cx="160" cy="100" r="18" stroke="#5A6B7C" strokeWidth="0.5" strokeDasharray="3 3" />
  </svg>
)

export default function MagazineTab() {
  const hero = articles[0]
  const secondary = articles.slice(1)

  return (
    <div
      className="grid gap-0"
      style={{ gridTemplateColumns: "1fr 280px", minHeight: "100%" }}
    >
      {/* Main editorial grid */}
      <div className="pr-8 border-r border-[rgba(26,26,26,0.08)]">
        {/* Issue header */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-[rgba(26,26,26,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-px bg-[#D4A373]" />
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">
              August 2026 · Issue 24
            </span>
          </div>
          <span className="text-[11px] font-medium tracking-[0.08em] text-[#5A6B7C]">
            6 articles this month
          </span>
        </div>

        {/* Hero article — spans full width */}
        <article className="mb-8 pb-8 border-b border-[rgba(26,26,26,0.1)] group">
          <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Hero image placeholder */}
            <div className="article-image-bg rounded-sm overflow-hidden relative" style={{ height: "300px" }}>
              <MolecularBg />
              <div className="absolute bottom-4 left-4">
                <span className="read-pill">{hero.readTime}</span>
              </div>
            </div>
            {/* Hero text */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-px bg-[#D4A373]" />
                <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#D4A373]">{hero.category}</span>
              </div>
              <h2
                style={{ fontFamily: "Newsreader, Georgia, serif", letterSpacing: "-0.02em" }}
                className="text-[28px] font-semibold text-[#1A1A1A] leading-tight mb-4 group-hover:saffron-underline cursor-pointer"
              >
                {hero.title}
              </h2>
              <p className="drop-cap text-[15px] leading-relaxed text-[#5A6B7C] mb-5">
                {hero.excerpt}
              </p>
              <div className="pull-quote">
                "The shift from device-centric to algorithm-centric oversight is the most significant regulatory realignment in diagnostics since CLIA 1988."
              </div>
              <div className="text-xs text-[#5A6B7C] mt-4">
                <span className="font-medium text-[#1A1A1A]">{hero.byline.split("·")[0].trim()}</span>
                {" · "}{hero.byline.split("·")[1]?.trim()} · {hero.date}
              </div>
            </div>
          </div>
        </article>

        {/* 3-column grid for remaining articles */}
        <div className="grid grid-cols-3 gap-6">
          {secondary.map((article) => (
            <article key={article.id} className="group cursor-pointer flex flex-col">
              {/* Card image */}
              <div className="article-image-bg rounded-sm overflow-hidden relative mb-4" style={{ height: "140px" }}>
                <MolecularBg />
                <div className="absolute bottom-3 left-3">
                  <span className="read-pill">{article.readTime}</span>
                </div>
              </div>
              {/* Category */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-3 h-px bg-[#D4A373]" />
                <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#5A6B7C]">{article.category}</span>
              </div>
              {/* Title */}
              <h3
                style={{ fontFamily: "Newsreader, Georgia, serif", letterSpacing: "-0.01em" }}
                className="text-[16px] font-semibold text-[#1A1A1A] leading-snug mb-3 group-hover:text-[#5A6B7C] transition-colors"
              >
                {article.title}
              </h3>
              {/* Byline */}
              <div className="text-[11px] text-[#5A6B7C] mt-auto">
                <span className="font-medium text-[#1A1A1A]">{article.byline.split("·")[0].trim()}</span>
                {" · "}{article.date}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Sticky sidebar */}
      <div className="pl-8">
        <div className="sticky top-6 flex flex-col gap-8">
          {/* Latest Digests */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-px bg-[#D4A373]" />
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#5A6B7C]">Latest Digests</span>
            </div>
            <div className="flex flex-col gap-1">
              {digests.map((d, i) => (
                <button
                  key={i}
                  className="flex items-center justify-between px-4 py-3 rounded-sm hover:bg-[#EDEAE2] transition-colors group text-left"
                >
                  <div>
                    <div className="text-[13px] font-medium text-[#1A1A1A] group-hover:text-[#1A1A1A]">{d.label}</div>
                    <div className="text-[11px] text-[#5A6B7C] mt-0.5">{d.date}</div>
                  </div>
                  {d.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#D4A373] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">
                      {d.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[rgba(26,26,26,0.08)]" />

          {/* Top Contributors */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-px bg-[#D4A373]" />
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#5A6B7C]">Top Contributors</span>
            </div>
            <div className="flex flex-col gap-4">
              {contributors.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-[#F8F6F0]"
                    style={{ background: "#1A1A1A" }}
                  >
                    {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium text-[#1A1A1A] truncate">{c.name}</div>
                    <div className="text-[11px] text-[#5A6B7C] truncate">{c.topic}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[rgba(26,26,26,0.08)]" />

          {/* Next drop countdown */}
          <div className="p-4 border border-[rgba(26,26,26,0.12)] rounded-sm bg-[#F8F6F0]">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#5A6B7C] mb-1">Next Match Drop</div>
            <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-2xl font-semibold text-[#1A1A1A]">
              Sep 1
            </div>
            <div className="text-xs text-[#5A6B7C] mt-1">13 days away</div>
            <div className="mt-3 h-1 bg-[rgba(26,26,26,0.08)] rounded-full overflow-hidden">
              <div className="h-full bg-[#D4A373] rounded-full" style={{ width: "57%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
