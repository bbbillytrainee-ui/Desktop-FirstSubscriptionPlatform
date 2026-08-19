import { useState } from "react"
import MagazineTab from "./MagazineTab"
import MatchesTab from "./MatchesTab"
import ContactsTab from "./ContactsTab"

type Tab = "magazine" | "matches" | "contacts"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("magazine")

  const tabs: { id: Tab; label: string; sub: string }[] = [
    { id: "magazine", label: "Magazine", sub: "August 2026" },
    { id: "matches", label: "Matches", sub: "6 new" },
    { id: "contacts", label: "Contacts", sub: "Directory" },
  ]

  return (
    <div className="binding-line-rail min-h-screen flex flex-col" style={{ background: "#F8F6F0" }}>
      {/* Top nav */}
      <header
        className="flex items-center justify-between px-16 py-4 border-b border-[rgba(26,26,26,0.1)] bg-[#F8F6F0]"
        style={{ position: "sticky", top: 0, zIndex: 20 }}
      >
        <div className="flex items-center gap-4">
          {/* Binding line visual marker in nav */}
          <div className="w-px h-7 bg-[#1A1A1A] opacity-80" />
          <span style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
            Meridian
          </span>
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#5A6B7C]">
            Life Sciences
          </span>
        </div>

        {/* Tab nav */}
        <nav className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-5 py-2 rounded-sm transition-colors flex items-center gap-2"
              style={{
                background: activeTab === tab.id ? "#1A1A1A" : "transparent",
                color: activeTab === tab.id ? "#F8F6F0" : "#5A6B7C",
              }}
            >
              <span className="text-sm font-medium">{tab.label}</span>
              {activeTab !== tab.id && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: tab.id === "matches" ? "rgba(212,163,115,0.2)" : "rgba(26,26,26,0.06)",
                    color: tab.id === "matches" ? "#D4A373" : "#5A6B7C",
                  }}
                >
                  {tab.sub}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right: User + issue */}
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[11px] font-medium text-[#1A1A1A]">Siddharth Rao</div>
            <div className="text-[10px] text-[#5A6B7C]">Tata Elxsi · Regulatory</div>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#F8F6F0]"
            style={{ background: "#1A1A1A" }}
          >
            SR
          </div>
        </div>
      </header>

      {/* Content area */}
      <main className="flex-1 px-16 py-10">
        {/* Issue marker row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-6 h-px bg-[#D4A373]" />
          <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">
            {activeTab === "magazine" && "Editorial · August 2026"}
            {activeTab === "matches" && "Monthly Drop · August 1, 2026"}
            {activeTab === "contacts" && "Network Directory · 2,400+ Professionals"}
          </span>
        </div>

        {/* Tab panels */}
        {activeTab === "magazine" && <MagazineTab />}
        {activeTab === "matches" && <MatchesTab />}
        {activeTab === "contacts" && <ContactsTab />}
      </main>

      {/* Footer */}
      <footer className="px-16 py-6 border-t border-[rgba(26,26,26,0.08)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-px h-4 bg-[#1A1A1A] opacity-40" />
          <span style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-sm font-medium text-[#5A6B7C]">
            Meridian Life Sciences
          </span>
        </div>
        <div className="flex items-center gap-6 text-[11px] text-[#5A6B7C]">
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Editorial Guidelines</a>
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms</a>
          <span>Vol. 2 Issue 8 · ₹1,999/month</span>
        </div>
      </footer>
    </div>
  )
}
