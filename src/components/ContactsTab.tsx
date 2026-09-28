import { useState } from "react"
import { PROFILES, type Profile } from "../data/fixtures/profiles"

const ALL_TAGS = Array.from(new Set(PROFILES.flatMap(c => c.tags))).sort()

/* ── Contact Detail Drawer ── */
function ContactDrawer({ contact, onClose }: { contact: Profile; onClose: () => void }) {
  return (
    <>
      <div className="backdrop-overlay" onClick={onClose} />
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        <div className="h-full bg-card border-l border-[var(--color-border-subtle)] shadow-[-8px_0_40px_rgba(26,26,26,0.08)] flex flex-col animate-slide-in-right overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-center justify-between flex-shrink-0">
            <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--color-slate-muted)]">Contact Profile</span>
            <button onClick={onClose} className="text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors p-1" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Profile */}
          <div className="p-6 flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
                style={{ background: "#0D3B4A" }}
              >
                {contact.name.split(" ").filter((_, i) => i < 2).map(n => n[0]).join("")}
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)]">{contact.name}</h3>
                <p className="text-sm text-[var(--color-slate-muted)]">{contact.title}</p>
                <p className="text-xs text-[var(--color-slate-muted)]">{contact.org} · {contact.location}</p>
              </div>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              {contact.isContributor ? (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "var(--color-brand-coral)", color: "#FFFFFF" }}>
                  Contributor
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border" style={{ borderColor: "var(--color-slate-muted)", color: "var(--color-slate-muted)" }}>
                  Member
                </span>
              )}
              {contact.isContributor && !!contact.articlesCount && (
                <span className="text-[11px] text-[var(--color-slate-muted)]">{contact.articlesCount} published articles</span>
              )}
            </div>

            {/* Bio */}
            {contact.bio && (
              <div className="mb-6">
                <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate-muted)] mb-2">About</div>
                <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed">{contact.bio}</p>
              </div>
            )}

            {/* Tags */}
            <div className="mb-6">
              <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate-muted)] mb-2">Expertise</div>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "var(--color-brand-coral)", color: "var(--color-ink)", background: "var(--color-brand-coral-glow)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta */}
            <div className="mb-6">
              <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate-muted)] mb-2">Details</div>
              <div className="flex flex-col gap-2 text-sm text-[var(--color-slate-muted)]">
                <div className="flex items-center gap-2">
                  <span>Member since</span>
                  <span className="font-medium text-[var(--color-ink)]">{contact.joined}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <span>Contact</span>
                    <span className="font-medium text-[var(--color-ink)]">{contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-[var(--color-border-subtle)] flex gap-3 flex-shrink-0">
            <button className="flex-1 py-3 text-sm font-medium bg-[var(--color-brand-teal)] text-[var(--color-paper)] rounded-sm hover:bg-[var(--color-brand-teal)]/90 transition-colors">
              Connect
            </button>
            <button className="py-3 px-4 text-sm font-medium border border-[var(--color-slate-muted)]/50 text-[var(--color-slate-muted)] rounded-sm hover:border-[var(--color-slate-muted)]/50 hover:text-[var(--color-ink)] transition-colors">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type filter */}
            <div className="flex items-center gap-1 p-1 border border-[var(--color-border-subtle)] rounded-sm">
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
                    background: filterType === key ? "var(--color-brand-teal)" : "transparent",
                    color: filterType === key ? "var(--color-paper)" : "var(--color-slate-muted)",
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
              className="text-xs px-3 py-2 border border-[var(--color-border-subtle)] rounded-sm bg-card text-[var(--color-slate-muted)] appearance-none cursor-pointer"
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
              className="w-full sm:w-56 text-sm px-4 py-2 border border-[var(--color-border-subtle)] rounded-sm bg-card text-[var(--color-ink)] placeholder-[var(--color-slate-muted)] focus:outline-none focus:border-[var(--color-slate-muted)]/50"
            />
            <div className="text-xs text-[var(--color-slate-muted)] flex-shrink-0">
              {filtered.length} of {PROFILES.length}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: "var(--color-brand-coral)", color: "#FFFFFF" }}
            >
              Contributor
            </span>
            <span className="text-xs text-[var(--color-slate-muted)]">Publishes editorial</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border"
              style={{ borderColor: "var(--color-slate-muted)", color: "var(--color-slate-muted)" }}
            >
              Member
            </span>
            <span className="text-xs text-[var(--color-slate-muted)]">Network participant</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {filtered.map(contact => (
            <div
              key={contact.id}
              className="bg-card border border-[var(--color-border-subtle)] rounded-sm p-5 flex flex-col gap-3 hover:border-[var(--color-slate-muted)]/50 transition-colors group cursor-pointer"
              onClick={() => setSelectedContact(contact)}
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "#0D3B4A" }}
                  >
                    {contact.name.split(" ").filter((_, i) => i < 2).map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--color-ink)] leading-tight">{contact.name}</div>
                    <div className="text-[11px] text-[var(--color-slate-muted)]">{contact.location}</div>
                  </div>
                </div>
                {/* Badge */}
                {contact.isContributor ? (
                  <span
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: "var(--color-brand-coral)", color: "#FFFFFF" }}
                  >
                    Contributor
                  </span>
                ) : (
                  <span
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0"
                    style={{ borderColor: "var(--color-slate-muted)", color: "var(--color-slate-muted)" }}
                  >
                    Member
                  </span>
                )}
              </div>

              {/* Title + Org */}
              <div>
                <div className="text-[12px] font-medium text-[var(--color-ink)]">{contact.title}</div>
                <div className="text-[11px] text-[var(--color-slate-muted)]">{contact.org}</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] cursor-pointer hover:border-[var(--color-slate-muted)]/50 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setFilterTag(tag) }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-1 pt-3 border-t border-[var(--color-border-subtle)]">
                <span className="text-[11px] text-[var(--color-slate-muted)]">
                  Since {contact.joined}
                  {contact.isContributor && !!contact.articlesCount && (
                    <span className="ml-2 font-medium text-[var(--color-ink)]">· {contact.articlesCount} articles</span>
                  )}
                </span>
                <button
                  className="text-[11px] font-medium text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); setSelectedContact(contact) }}
                >
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-[var(--color-slate-muted)]">
            <div className="font-serif text-2xl font-semibold mb-2 text-[var(--color-ink)]">
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
