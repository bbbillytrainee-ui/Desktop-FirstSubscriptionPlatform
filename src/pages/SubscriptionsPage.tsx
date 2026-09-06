import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "../data/fixtures/subscriptions"

export interface SubscriptionsPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function SubscriptionsPage({ onJoin, onNavigate }: SubscriptionsPageProps) {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedDept, setSelectedDept] = useState<string>("all")

  const filteredTiers = selectedDept === "all" 
    ? SUBSCRIPTION_TIERS 
    : SUBSCRIPTION_TIERS.filter(t => t.departmentCode === selectedDept || t.departmentCode === "explorer" || t.departmentCode === "enterprise")

  const renderIcon = (type: string) => {
    switch (type) {
      case "FlaskConical":
        return (
          <svg className="w-5 h-5 text-[var(--color-brand-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.023.547l-1.2 1.2A2 2 0 004.793 20.3h14.414a2 2 0 001.414-3.414l-1.2-1.2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 3v5.2m4-5.2v5.2M8 3h8" />
          </svg>
        )
      case "TrendingUp":
        return (
          <svg className="w-5 h-5 text-[var(--color-brand-coral)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case "Truck":
        return (
          <svg className="w-5 h-5 text-[var(--color-brand-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 3v5h-2m-3 0h-4" />
          </svg>
        )
      case "Building2":
        return (
          <svg className="w-5 h-5 text-[var(--color-ink)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-[var(--color-brand-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-4 sm:px-6 md:px-12 py-12 w-full">
        
        {/* Top Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Department-Segmented Memberships
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Intelligence Built for Your Specific Pharma Role
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Choose the package matched to your department — In-House R&D, Sales & Commercial, or Supply Chain & Logistics. Fully expense-ready with tax invoice.
          </p>
        </div>

        {/* Department Filter Tabs + Billing Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white border border-[var(--color-border-subtle)] p-4 rounded-sm shadow-xs">
          
          {/* Department Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-[var(--color-slate-muted)] mr-2">Filter by Department:</span>
            <button
              onClick={() => setSelectedDept("all")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                selectedDept === "all" 
                  ? "bg-[var(--color-ink)] text-white" 
                  : "bg-gray-100 text-[var(--color-ink)] hover:bg-gray-200"
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setSelectedDept("rnd")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedDept === "rnd" 
                  ? "bg-[var(--color-brand-teal)] text-white" 
                  : "bg-gray-100 text-[var(--color-ink)] hover:bg-gray-200"
              }`}
            >
              In-House / R&D
            </button>
            <button
              onClick={() => setSelectedDept("sales")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedDept === "sales" 
                  ? "bg-[var(--color-brand-coral)] text-white" 
                  : "bg-gray-100 text-[var(--color-ink)] hover:bg-gray-200"
              }`}
            >
              Sales & Commercial
            </button>
            <button
              onClick={() => setSelectedDept("logistics")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedDept === "logistics" 
                  ? "bg-[var(--color-brand-teal)] text-white" 
                  : "bg-gray-100 text-[var(--color-ink)] hover:bg-gray-200"
              }`}
            >
              Supply Chain & Logistics
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${!isAnnual ? "text-[var(--color-ink)] font-bold" : "text-[var(--color-slate-muted)]"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-[var(--color-brand-teal)] focus:outline-none"
              aria-label="Toggle annual billing"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${isAnnual ? "text-[var(--color-ink)] font-bold" : "text-[var(--color-slate-muted)]"}`}>
                Annual
              </span>
              <span className="bg-[var(--color-brand-coral)]/10 text-[var(--color-brand-coral)] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {filteredTiers.map((tier) => {
            const price = isAnnual ? tier.yearlyPriceINR : tier.monthlyPriceINR
            const period = isAnnual ? "/ year" : "/ month"

            return (
              <div
                key={tier.id}
                className={`bg-white border rounded-sm p-6 flex flex-col justify-between relative transition-all duration-200 ${
                  tier.popular
                    ? "border-2 border-[var(--color-brand-coral)] shadow-md transform -translate-y-1"
                    : tier.departmentCode === "rnd" || tier.departmentCode === "logistics"
                    ? "border-2 border-[var(--color-brand-teal)] shadow-sm"
                    : "border-[var(--color-border-subtle)]"
                }`}
              >
                {/* Badge if available */}
                {tier.badge && (
                  <div className="absolute -top-3 right-4">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full text-white ${
                      tier.popular ? "bg-[var(--color-brand-coral)]" : "bg-[var(--color-brand-teal)]"
                    }`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Department Tag & Icon */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-sm bg-gray-50 border border-gray-100">
                      {renderIcon(tier.iconName)}
                    </div>
                    <span className="text-[11px] font-medium text-[var(--color-slate-muted)] uppercase tracking-wider">
                      {tier.departmentTag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-[var(--color-slate-muted)] mb-4 min-h-[36px]">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[var(--color-ink)]">
                        {tier.currency}{price.toLocaleString()}
                      </span>
                      {price > 0 && <span className="text-xs text-[var(--color-slate-muted)]">{period}</span>}
                    </div>
                    {price > 0 && (
                      <p className="text-[10px] text-[var(--color-brand-teal)] font-medium mt-1">
                        GST invoice ready for expense reporting
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <span className="text-[10px] font-semibold uppercase text-gray-400 block mb-2 tracking-wider">Included Features:</span>
                    <ul className="space-y-2 text-xs text-[var(--color-ink)]">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[var(--color-brand-teal)] font-bold text-xs">✓</span>
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Button
                    variant={tier.popular ? "coral" : tier.monthlyPriceINR > 0 ? "primary" : "secondary"}
                    size="sm"
                    className="w-full"
                    onClick={onJoin}
                  >
                    {tier.monthlyPriceINR === 0 ? "Join Free Starter" : `Subscribe ${tier.name}`}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Referral Perk Callout Banner */}
        <div className="mb-12 bg-gradient-to-r from-[var(--color-brand-teal)]/10 to-[var(--color-brand-coral)]/10 border border-[var(--color-brand-teal)]/30 rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-full border border-[var(--color-brand-teal)]/20 shadow-xs hidden sm:block">
              <svg className="w-6 h-6 text-[var(--color-brand-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-brand-coral)] block mb-1">
                Referral Reward Program
              </span>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-1">
                Invite Colleagues & Earn Free Premium Months
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] max-w-xl">
                Every member gets a unique referral code. When a colleague joins using your code, both of you get 1 bonus month of full department access + extra peer introductions!
              </p>
            </div>
          </div>
          <Button variant="secondary" size="md" onClick={() => onNavigate && onNavigate("referral")}>
            View Referral Portal
          </Button>
        </div>

        {/* Enterprise Callout */}
        <div className="p-8 bg-white border border-[var(--color-border-subtle)] rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Badge type="enterprise" label="Corporate Multi-Seat" className="mb-2" />
            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-2">
              Enterprise Site License & Custom Team Packages
            </h3>
            <p className="text-xs text-[var(--color-slate-muted)] max-w-2xl leading-relaxed">
              Auto-verify company employees by email domain (@sunpharma.com, @drreddys.com), access consolidated annual billing, manage team seats, and sponsor technical whitepapers across the magazine.
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={() => onNavigate && onNavigate("advertise")}>
            Inquire for Enterprise
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
