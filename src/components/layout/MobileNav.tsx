import { AppTab } from "./AppHeader"

export interface MobileNavProps {
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs: { id: AppTab; label: string; icon: string }[] = [
    { id: "magazine", label: "Magazine", icon: "📰" },
    { id: "matches", label: "Matches", icon: "🤝" },
    { id: "contacts", label: "Contacts", icon: "📇" },
  ]

  return (
    <nav className="show-mobile-only fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-paper)]/95 backdrop-blur-md border-t border-[var(--color-border-subtle)] px-4 py-2">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-sm transition-colors ${
                isActive ? "text-[var(--color-brand-teal)] font-semibold" : "text-[var(--color-slate-muted)] font-normal"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="text-[10px] tracking-wide" style={{ fontFamily: "'Geist Mono', monospace" }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
