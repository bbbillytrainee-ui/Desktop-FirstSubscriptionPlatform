import Logo from "../brand/Logo"
import Badge from "../ui/Badge"

export type AppTab = "magazine" | "matches" | "contacts"

export interface AppHeaderProps {
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
  userEmail?: string
  userName?: string
  userTier?: "free" | "professional" | "enterprise"
  onSignOut?: () => void
}

export default function AppHeader({
  activeTab,
  onTabChange,
  userName = "Siddharth Rao",
  userTier = "professional",
  onSignOut,
}: AppHeaderProps) {
  const tabs: { id: AppTab; label: string; badge?: string }[] = [
    { id: "magazine", label: "Magazine", badge: "Aug '26" },
    { id: "matches", label: "Matches", badge: "4 drop" },
    { id: "contacts", label: "Contacts", badge: "Directory" },
  ]

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-paper)]/95 backdrop-blur-sm border-b border-[var(--color-border-subtle)] px-6 md:px-12 py-3">
      <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between">
        <Logo size="sm" />

        {/* Centered Desktop Tab Navigation */}
        <nav className="hide-mobile flex items-center gap-1 bg-[var(--color-surface)] p-1 rounded-sm border border-[var(--color-border-subtle)]">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-5 py-1.5 rounded-sm transition-all flex items-center gap-2 text-sm font-medium ${
                  isActive
                    ? "bg-[var(--color-brand-teal)] text-[var(--color-paper)] shadow-sm"
                    : "text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                    className={`text-[9px] px-1.5 py-0.2 rounded-sm ${
                      isActive ? "bg-white/20 text-white" : "bg-[var(--color-border-subtle)] text-[var(--color-slate-muted)]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Profile & Actions Right */}
        <div className="flex items-center gap-3">
          <Badge type={userTier === "professional" ? "pro" : userTier} />
          <div className="hide-mobile flex items-center gap-2 border-l border-[var(--color-border-subtle)] pl-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-teal)] text-[var(--color-paper)] flex items-center justify-center font-bold text-xs">
              {userName.split(" ").map(n => n[0]).join("")}
            </div>
            <span className="text-xs font-medium text-[var(--color-ink)]">{userName}</span>
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-brand-coral)] transition-colors ml-1"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
