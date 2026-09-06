import { useState } from "react"
import { PROFILES, type Profile } from "../data/fixtures/profiles"

const ALL_TAGS = Array.from(new Set(PROFILES.flatMap(c => c.tags))).sort()

/* ── Contact Detail Drawer ── */
function ContactDrawer({ contact, onClose }: { contact: Profile; onClose: () => void }) {
  return (
    <>
      <div className="backdrop-overlay" onClick={onClose} />
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        <div className="h-full bg-white border-l border-[rgba(26,26,26,0.1)] shadow-[-8px_0_40px_rgba(26,26,26,0.08)] flex flex-col animate-slide-in-right overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-[rgba(26,26,26,0.08)] flex items-center justify-between flex-shrink-0">
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#5A6B7C]">Contact Profile</span>
            <button onClick={onClose} className="text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors p-1" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Profile */}
          <div className="p-6 flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-[#F8F6F0] flex-shrink-0"
                style={{ background: "#1A1A1A" }}
              >
                {contact.name.split(" ").filter((_, i) => i < 2).map(n => n[0]).join("")}
              </div>
              <div>
                <h3 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl font-semibold text-[#1A1A1A]">{contact.name}</h3>
                <p className="text-sm text-[#5A6B7C]">{contact.title}</p>
                <p className="text-xs text-[#5A6B7C]">{contact.org} · {contact.location}</p>
              </div>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              {contact.isContributor ? (
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "#D4A373", color: "#1A1A1A" }}>
                  Contributor
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full border" style={{ borderColor: "#5A6B7C", color: "#5A6B7C" }}>
                  Member
                </span>
              )}
              {contact.isContributor && contact.articles && (
                <span className="text-[10px] text-[#5A6B7C]">{contact.articles} published articles</span>
              )}
            </div>

            {/* Bio */}
            {contact.bio && (
              <div className="mb-6">
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#5A6B7C] mb-2">About</div>
                <p className="text-sm text-[#5A6B7C] leading-relaxed">{contact.bio}</p>
              </div>
            )}

            {/* Tags */}
            <div className="mb-6">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#5A6B7C] mb-2">Expertise</div>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "#D4A373", color: "#1A1A1A", background: "rgba(212,163,115,0.08)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta */}
            <div className="mb-6">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#5A6B7C] mb-2">Details</div>
              <div className="flex flex-col gap-2 text-sm text-[#5A6B7C]">
                <div className="flex items-center gap-2">
                  <span>Member since</span>
                  <span className="font-medium text-[#1A1A1A]">{contact.joined}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <span>Contact</span>
                    <span className="font-medium text-[#1A1A1A]">{contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-[rgba(26,26,26,0.08)] flex gap-3 flex-shrink-0">
            <button className="flex-1 py-3 text-sm font-medium bg-[#1A1A1A] text-[#F8F6F0] rounded-sm hover:bg-[#2a2a2a] transition-colors">
              Connect
            </button>
            <button className="py-3 px-4 text-sm font-medium border border-[rgba(26,26,26,0.2)] text-[#5A6B7C] rounded-sm hover:border-[rgba(26,26,26,0.5)] hover:text-[#1A1A1A] transition-colors">
              Message
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ContactsTab() {
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<"all" | "contributors" | "members">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Profile | null>(null)

  const filtered = PROFILES.filter(c => {
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
    <>
      <div>
        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(26,26,26,0.1)]">
          <div className="flex items-center gap-2 flex-wrap">
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
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search name, org, or title…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 text-sm px-4 py-2 border border-[rgba(26,26,26,0.12)] rounded-sm bg-white text-[#1A1A1A] placeholder-[#5A6B7C] focus:outline-none focus:border-[rgba(26,26,26,0.4)]"
            />
            <div className="text-xs text-[#5A6B7C] flex-shrink-0">
              {filtered.length} of {contacts.length}
            </div>
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
            <span className="text-xs text-[#5A6B7C]">Publishes editorial</span>
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
              className="bg-white border border-[rgba(26,26,26,0.1)] rounded-sm p-5 flex flex-col gap-3 hover:border-[rgba(26,26,26,0.25)] transition-colors group cursor-pointer"
              onClick={() => setSelectedContact(contact)}
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
                    onClick={(e) => { e.stopPropagation(); setFilterTag(tag) }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-1 pt-3 border-t border-[rgba(26,26,26,0.06)]">
                <span className="text-[11px] text-[#5A6B7C]">
                  Since {contact.joined}
                  {contact.isContributor && contact.articles && (
                    <span className="ml-2 font-medium text-[#1A1A1A]">· {contact.articles} articles</span>
                  )}
                </span>
                <button
                  className="text-[11px] font-medium text-[#5A6B7C] hover:text-[#1A1A1A] transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); setSelectedContact(contact) }}
                >
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

      {/* Contact Detail Drawer */}
      {selectedContact && <ContactDrawer contact={selectedContact} onClose={() => setSelectedContact(null)} />}
    </>
  )
}
