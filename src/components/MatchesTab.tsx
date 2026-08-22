import { useState, useEffect } from "react"

interface Match {
  id: number
  name: string
  title: string
  org: string
  location: string
  tags: [string, string]
  goal: string
  bio: string
  connections: number
  responseRate: number
}

const matches: Match[] = [
  {
    id: 1,
    name: "Dr. Ananya Krishnamurthy",
    title: "Director, Regulatory Affairs",
    org: "AstraZeneca India",
    location: "Bangalore",
    tags: ["Regulatory Affairs", "AI Diagnostics"],
    goal: "Find Collaborators",
    bio: "12 years navigating CDSCO and FDA submissions for biologics and SaMD. Currently driving AI-assisted clinical data review initiatives.",
    connections: 3,
    responseRate: 94,
  },
  {
    id: 2,
    name: "Marcus Osei-Bonsu",
    title: "Senior Director, Business Development",
    org: "Medtronic",
    location: "Hyderabad",
    tags: ["Surgical Robotics", "IP & Strategy"],
    goal: "Find Vendors",
    bio: "Focused on licensing strategy for next-gen surgical platforms. Seeking CRO and IP counsel partners in the APAC region.",
    connections: 2,
    responseRate: 87,
  },
  {
    id: 3,
    name: "Dr. Priya Mehta",
    title: "Principal Scientist, Oncology",
    org: "Cipla Ltd.",
    location: "Mumbai",
    tags: ["Oncology BD", "Companion Diagnostics"],
    goal: "Find Mentors",
    bio: "Transitioning from pure science to BD. Strong expertise in companion diagnostic co-development and tumor biomarker strategy.",
    connections: 5,
    responseRate: 78,
  },
  {
    id: 4,
    name: "Tanvir Hussain",
    title: "Investment Manager",
    org: "Sofinnova Partners",
    location: "Delhi",
    tags: ["mRNA Platforms", "Gene Therapy"],
    goal: "Stay Informed",
    bio: "Deploying €400M fund into pan-Indian biotech. Particularly interested in platform companies with global licensable assets.",
    connections: 7,
    responseRate: 91,
  },
  {
    id: 5,
    name: "Roshni Kapoor",
    title: "Head of Market Access",
    org: "Novo Nordisk India",
    location: "Gurugram",
    tags: ["Health Economics", "Market Access"],
    goal: "Find Collaborators",
    bio: "Designing payer engagement models for GLP-1 launches in Tier-2 cities. Open to academic collaboration on real-world evidence.",
    connections: 4,
    responseRate: 83,
  },
  {
    id: 6,
    name: "Dr. Johan Van der Berg",
    title: "VP Clinical Operations",
    org: "IQVIA",
    location: "Pune",
    tags: ["Clinical Operations", "Digital Therapeutics"],
    goal: "Find Vendors",
    bio: "Scaling decentralized trial infrastructure across South Asia. Evaluating eCOA vendors and site management organizations.",
    connections: 6,
    responseRate: 96,
  },
]

type SortKey = "relevance" | "responseRate" | "connections"

export default function MatchesTab() {
  const [dealt, setDealt] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>("relevance")
  const [connected, setConnected] = useState<Set<number>>(new Set())
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())

  useEffect(() => {
    const t = setTimeout(() => setDealt(true), 80)
    return () => clearTimeout(t)
  }, [])

  const sorted = [...matches]
    .filter(m => !dismissed.has(m.id))
    .sort((a, b) => {
      if (sortBy === "responseRate") return b.responseRate - a.responseRate
      if (sortBy === "connections") return b.connections - a.connections
      return 0
    })

  const handleConnect = (id: number) => {
    setConnected(prev => new Set([...prev, id]))
  }

  const handleDismiss = (id: number) => {
    setDismissed(prev => new Set([...prev, id]))
  }

  return (
    <div className="max-w-[900px]">
      {/* Drop header */}
      <div className="flex flex-col sm:flex-row items-start justify-between mb-8 pb-6 border-b border-[rgba(26,26,26,0.1)] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="w-5 h-px bg-[#D4A373]" />
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#D4A373]">Monthly Drop · August 2026</span>
            <span className="rollover-pill">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1V5L7.5 7.5" stroke="#D4A373" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="5" cy="5" r="4" stroke="#D4A373" strokeWidth="1"/>
              </svg>
              +2 rollover from July
            </span>
          </div>
          <h2 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-2xl md:text-3xl font-semibold text-[#1A1A1A]">
            Your August Matches
          </h2>
          <p className="text-sm text-[#5A6B7C] mt-1.5">
            {sorted.length} curated connections based on your tag profile. Next drop: September 1.
          </p>
          <p className="text-xs text-[#5A6B7C] mt-1">
            {connected.size} connected · {dismissed.size} dismissed · {sorted.length - connected.size} pending
          </p>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-1 p-1 border border-[rgba(26,26,26,0.12)] rounded-sm flex-shrink-0">
          {([
            ["relevance", "Relevance"],
            ["responseRate", "Response"],
            ["connections", "Network"],
          ] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className="text-xs px-3 py-1.5 rounded-sm transition-colors"
              style={{
                background: sortBy === key ? "#1A1A1A" : "transparent",
                color: sortBy === key ? "#F8F6F0" : "#5A6B7C",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-[#5A6B7C]">Engagement progress</span>
          <span className="text-[11px] font-medium text-[#1A1A1A]">{connected.size + dismissed.size}/{matches.length} reviewed</span>
        </div>
        <div className="h-1.5 bg-[rgba(26,26,26,0.08)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((connected.size + dismissed.size) / matches.length) * 100}%`,
              background: connected.size > dismissed.size ? "#D4A373" : "#5A6B7C",
            }}
          />
        </div>
      </div>

      {/* Match cards */}
      <div className="flex flex-col gap-4">
        {sorted.map((match, i) => (
          <div
            key={match.id}
            className={`match-card border rounded-sm bg-white overflow-hidden ${
              connected.has(match.id)
                ? "border-[rgba(212,163,115,0.4)]"
                : "border-[rgba(26,26,26,0.12)]"
            } ${dealt ? "match-card-deal" : "opacity-0"}`}
            style={dealt ? { animationDelay: `${i * 110}ms` } : {}}
          >
            <div className="p-5 md:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-bold text-[#F8F6F0]"
                  style={{ background: connected.has(match.id) ? "#D4A373" : "#1A1A1A" }}
                >
                  {match.name.split(" ").filter((_, i) => i < 2).map(n => n[0]).join("")}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-[#1A1A1A]">{match.name}</h3>
                      {connected.has(match.id) && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-[rgba(212,163,115,0.12)] border border-[rgba(212,163,115,0.35)] text-[#D4A373] rounded-full">
                          Connected
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#5A6B7C]">
                      {match.title} · <span className="font-medium text-[#1A1A1A]">{match.org}</span> · {match.location}
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="flex items-center gap-5 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-[11px] text-[#5A6B7C]">Response</div>
                      <div className="text-sm font-semibold text-[#1A1A1A]">{match.responseRate}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-[#5A6B7C]">Mutual</div>
                      <div className="text-sm font-semibold text-[#1A1A1A]">{match.connections}</div>
                    </div>
                  </div>
                </div>

                {/* Match logic — transparency */}
                <div className="flex items-center gap-2 mt-3 mb-3 flex-wrap">
                  <span className="text-[11px] font-medium text-[#5A6B7C] tracking-wide">Matched on:</span>
                  {match.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
                      style={{ borderColor: "#D4A373", color: "#1A1A1A", background: "rgba(212,163,115,0.08)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="text-sm text-[#5A6B7C] leading-relaxed mb-4">{match.bio}</p>

                {/* Goal badge + Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-[rgba(26,26,26,0.15)] text-[#5A6B7C]">
                    Goal: {match.goal}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDismiss(match.id)}
                      className="text-sm px-4 py-2 border border-[rgba(26,26,26,0.18)] text-[#5A6B7C] rounded-sm hover:border-[rgba(26,26,26,0.4)] hover:text-[#1A1A1A] transition-colors"
                    >
                      Not Relevant
                    </button>
                    <button
                      onClick={() => handleConnect(match.id)}
                      disabled={connected.has(match.id)}
                      className="text-sm px-5 py-2 bg-[#1A1A1A] text-[#F8F6F0] rounded-sm hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 disabled:cursor-default font-medium"
                    >
                      {connected.has(match.id) ? "Connected ✓" : "Connect"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="py-20 text-center text-[#5A6B7C]">
            <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-2xl font-semibold mb-2 text-[#1A1A1A]">
              All caught up.
            </div>
            <div className="text-sm mb-4">You have reviewed all matches for this month.</div>
            <div className="text-xs text-[#5A6B7C]">
              {connected.size} connected · {dismissed.size} dismissed. Next drop: September 1.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
