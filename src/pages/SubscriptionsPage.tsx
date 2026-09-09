import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import { SUBSCRIPTION_TIERS } from "../data/fixtures/subscriptions"

export interface SubscriptionsPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function SubscriptionsPage({ onJoin, onNavigate }: SubscriptionsPageProps) {
  const renderIcon = (type: string) => {
    switch (type) {
      case "FlaskConical":
        return (
          <svg className="w-5 h-5 text-[var(--color-brand-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.023.547l-1.2 1.2A2 2 0 004.793 20.3h14.414a2 2 0 001.414-3.414l-1.2-1.2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 3v5.2m4-5.2v5.2M8 3h8" />
          </svg>
        )
      case "Building2":
        return (
          <svg className="w-5 h-5 text-[var(--color-brand-coral)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Annual Membership Plans
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Select the plan suited for your needs — Explorer, In-House / R&D, or Organization / Enterprise. Fully expense-ready with tax invoice.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-8 mb-16 items-stretch">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isFree = tier.yearlyPriceINR === 0
            const period = "/ year"

            return (
              <div
                key={tier.id}
                className={`bg-white border rounded-lg p-7 flex flex-col justify-between relative transition-all duration-300 ${
                  tier.popular
                    ? "border-2 border-[var(--color-brand-coral)] shadow-xl transform -translate-y-1.5"
                    : tier.departmentCode === "rnd"
                    ? "border-2 border-[var(--color-brand-teal)] shadow-md"
                    : "border-[var(--color-border-subtle)] shadow-xs"
                }`}
              >
                {/* Badge if available */}
                {tier.badge && (
                  <div className="absolute -top-3.5 right-6">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full text-white tracking-wide uppercase font-mono shadow-xs ${
                      tier.popular ? "bg-[var(--color-brand-coral)]" : "bg-[var(--color-brand-teal)]"
                    }`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Department Tag & Icon */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="p-2.5 rounded-md bg-stone-50 border border-stone-200/80">
                      {renderIcon(tier.iconName)}
                    </div>
                    <span className="text-[11px] font-bold font-mono text-[var(--color-slate-muted)] uppercase tracking-wider">
                      {tier.departmentTag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-bold text-[var(--color-ink)] mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-[var(--color-slate-muted)] mb-5 min-h-[38px] leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6 p-4 rounded-md bg-stone-50 border border-stone-200/60">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[var(--color-ink)]">
                        {isFree ? "Free" : `${tier.currency}${tier.yearlyPriceINR.toLocaleString()}`}
                      </span>
                      {!isFree && <span className="text-xs font-semibold text-[var(--color-slate-muted)]">{period}</span>}
                    </div>
                    {!isFree ? (
                      <p className="text-[10px] text-[var(--color-brand-teal)] font-semibold mt-1">
                        GST invoice ready for expense reporting
                      </p>
                    ) : (
                      <p className="text-[10px] text-stone-500 font-medium mt-1">
                        No credit card required
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="border-t border-stone-100 pt-5 mb-6">
                    <span className="text-[10px] font-bold uppercase font-mono text-stone-400 block mb-3 tracking-wider">
                      Included Features:
                    </span>
                    <ul className="space-y-2.5 text-xs text-[var(--color-ink)] font-medium">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-[var(--color-brand-teal)] font-bold text-sm shrink-0">✓</span>
                          <span className="leading-snug text-stone-700">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Button
                    variant={tier.popular ? "coral" : !isFree ? "primary" : "secondary"}
                    size="md"
                    className="w-full font-semibold"
                    onClick={onJoin}
                  >
                    {isFree ? "Start Explorer Free" : `Subscribe ${tier.name}`}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Referral Perk Callout Banner */}
        <div className="max-w-5xl mx-auto mb-12 bg-gradient-to-r from-[var(--color-brand-teal)]/10 via-amber-500/5 to-[var(--color-brand-coral)]/10 border border-[var(--color-brand-teal)]/30 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-full border border-[var(--color-brand-teal)]/20 shadow-xs hidden sm:block shrink-0">
              <svg className="w-6 h-6 text-[var(--color-brand-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)]">
                  Invite Colleagues & Colleagues
                </span>
              </div>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-bold text-[var(--color-ink)] mb-1">
                Earn Free Months with Referral Program
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] max-w-xl leading-relaxed">
                Invite fellow scientists, regulatory leaders, and pharma colleagues. For every 2 peer signups, receive 1 additional month of In-House / R&D Pro membership free.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate && onNavigate("referral")}
            className="shrink-0"
          >
            Open Referral Hub →
          </Button>
        </div>

      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
