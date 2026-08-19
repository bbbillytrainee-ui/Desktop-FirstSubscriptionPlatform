import { useState } from "react"

interface Contact {
  id: number
  name: string
  title: string
  org: string
  location: string
  tags: string[]
  isContributor: boolean
  articles?: number
  joined: string
}

const contacts: Contact[] = [
  { id: 1, name: "Dr. Priya Nair", title: "VP Regulatory Affairs", org: "Pfizer India", location: "Mumbai", tags: ["Regulatory Affairs", "AI Diagnostics"], isContributor: true, articles: 4, joined: "Jun 2025" },
  { id: 2, name: "Marcus Osei-Bonsu", title: "Sr. Director, BD", org: "Medtronic", location: "Hyderabad", tags: ["Surgical Robotics", "IP & Strategy"], isContributor: true, articles: 2, joined: "Aug 2025" },
  { id: 3, name: "Ananya Krishnamurthy", title: "Director, Regulatory", org: "AstraZeneca", location: "Bangalore", tags: ["Regulatory Affairs", "mRNA Platforms"], isContributor: false, joined: "Sep 2025" },
  { id: 4, name: "Dr. Vikram Malhotra", title: "Chief Medical Officer", org: "Sun Pharma", location: "Mumbai", tags: ["Clinical Operations", "Oncology BD"], isContributor: true, articles: 6, joined: "Apr 2025" },
  { id: 5, name: "Tanvir Hussain", title: "Investment Manager", org: "Sofinnova Partners", location: "Delhi", tags: ["mRNA Platforms", "Gene Therapy"], isContributor: false, joined: "Jan 2026" },
  { id: 6, name: "Dr. Leila Ahmadi", title: "Head, Medical Affairs", org: "Roche Diagnostics India", location: "Pune", tags: ["Companion Diagnostics", "Health Economics"], isContributor: true, articles: 3, joined: "Nov 2025" },
  { id: 7, name: "Roshni Kapoor", title: "Head of Market Access", org: "Novo Nordisk India", location: "Gurugram", tags: ["Market Access", "Health Economics"], isContributor: false, joined: "Mar 2026" },
  { id: 8, name: "Dr. Arun Sharma", title: "Principal Scientist", org: "Biocon Biologics", location: "Bangalore", tags: ["Cell & Gene", "Rare Disease"], isContributor: true, articles: 5, joined: "Jul 2025" },
  { id: 9, name: "Neha Bajaj", title: "Director, Supply Chain", org: "Abbott India", location: "Mumbai", tags: ["Supply Chain", "Manufacturing"], isContributor: false, joined: "Feb 2026" },
  { id: 10, name: "Dr. Johan Van der Berg", title: "VP Clinical Operations", org: "IQVIA", location: "Pune", tags: ["Clinical Operations", "Digital Therapeutics"], isContributor: true, articles: 2, joined: "Oct 2025" },
  { id: 11, name: "Siddharth Rao", title: "Associate Director, Pharmacovigilance", org: "Tata Elxsi Health", location: "Bangalore", tags: ["Pharmacovigilance", "Regulatory Affairs"], isContributor: false, joined: "May 2026" },
  { id: 12, name: "Dr. Meera Krishnan", title: "VP, Neurology Pipeline", org: "Lupin Ltd.", location: "Mumbai", tags: ["Neurology Pipeline", "Clinical Operations"], isContributor: true, articles: 3, joined: "Jan 2025" },
]

const ALL_TAGS = Array.from(new Set(contacts.flatMap(c => c.tags))).sort()

export default function ContactsTab() {
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<"all" | "contributors" | "members">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = contacts.filter(c => {
    const matchesTag = filterTag ? c.tags.includes(filterTag) : true
    const matchesType =
      filterType === "contributors" ? c.isContributor :
      filterType === "members" ? !c.isContributor : true
    const matchesSearch = searchQuery
      ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesTag && matchesType && matchesSearch
  })

  return (
    <div>
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(26,26,26,0.1)]">
        <div className="flex items-center gap-2">
          {/* Type filter */}
          <div className="flex items-center gap-1 p-1 border border-[rgba(26,26,26,0.12)] rounded-sm">
            {([
              ["all", "All"],
              ["contributors", "Contributors"],
              ["members", "Members"],
            ] as ["all" | "contributors" | "members", string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className="text-xs px-3 py-1.5 rounded-sm transition-colors"
                style={{
                  background: filterType === key ? "#1A1A1A" : "transparent",
                  color: filterType === key ? "#F8F6F0" : "#5A6B7C",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tag filter dropdown */}
          <select
            value={filterTag ?? ""}
            onChange={e => setFilterTag(e.target.value || null)}
            className="text-xs px-3 py-2 border border-[rgba(26,26,26,0.12)] rounded-sm bg-white text-[#5A6B7C] appearance-none cursor-pointer"
          >
            <option value="">All Topics</option>
            {ALL_TAGS.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, org, or title…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-64 text-sm px-4 py-2 border border-[rgba(26,26,26,0.12)] rounded-sm bg-white text-[#1A1A1A] placeholder-[#5A6B7C] focus:outline-none focus:border-[rgba(26,26,26,0.4)]"
          />
        </div>

        <div className="text-xs text-[#5A6B7C]">
          {filtered.length} of {contacts.length} members
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: "#D4A373", color: "#1A1A1A" }}
          >
            Contributor
          </span>
          <span className="text-xs text-[#5A6B7C]">Publishes editorial to Meridian</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-medium px-2.5 py-0.5 rounded-full border"
            style={{ borderColor: "#5A6B7C", color: "#5A6B7C" }}
          >
            Member
          </span>
          <span className="text-xs text-[#5A6B7C]">Network participant</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {filtered.map(contact => (
          <div
            key={contact.id}
            className="bg-white border border-[rgba(26,26,26,0.1)] rounded-sm p-5 flex flex-col gap-3 hover:border-[rgba(26,26,26,0.25)] transition-colors group"
          >
            {/* Header row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#F8F6F0]"
                  style={{ background: "#1A1A1A" }}
                >
                  {contact.name.split(" ").filter((_, i) => i < 2).map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#1A1A1A] leading-tight">{contact.name}</div>
                  <div className="text-[11px] text-[#5A6B7C]">{contact.location}</div>
                </div>
              </div>
              {/* Badge */}
              {contact.isContributor ? (
                <span
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: "#D4A373", color: "#1A1A1A" }}
                >
                  Contributor
                </span>
              ) : (
                <span
                  className="text-[10px] font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0"
                  style={{ borderColor: "#5A6B7C", color: "#5A6B7C" }}
                >
                  Member
                </span>
              )}
            </div>

            {/* Title + Org */}
            <div>
              <div className="text-[12px] font-medium text-[#1A1A1A]">{contact.title}</div>
              <div className="text-[11px] text-[#5A6B7C]">{contact.org}</div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {contact.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-[rgba(26,26,26,0.12)] text-[#5A6B7C] cursor-pointer hover:border-[rgba(26,26,26,0.3)] transition-colors"
                  onClick={() => setFilterTag(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-1 pt-3 border-t border-[rgba(26,26,26,0.06)]">
              <span className="text-[11px] text-[#5A6B7C]">
                Member since {contact.joined}
                {contact.isContributor && contact.articles && (
                  <span className="ml-2 font-medium text-[#1A1A1A]">· {contact.articles} articles</span>
                )}
              </span>
              <button className="text-[11px] font-medium text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors opacity-0 group-hover:opacity-100">
                View →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-[#5A6B7C]">
          <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-2xl font-semibold mb-2 text-[#1A1A1A]">
            No results found.
          </div>
          <button className="text-sm underline mt-1" onClick={() => { setFilterTag(null); setFilterType("all"); setSearchQuery("") }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
